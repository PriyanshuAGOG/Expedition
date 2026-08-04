import {
  account, teams, tablesDB, Query, DATABASE_ID, TABLES, ADMIN_TEAM_ID, isConfigured,
} from '../assets/js/appwrite-client.js';

const TABLE_CONFIG = {
  applications: {
    label: 'Applications',
    statuses: ['new', 'reviewing', 'shortlisted', 'medical_review', 'cleared', 'waitlisted', 'rejected', 'withdrawn'],
    columns: [
      { key: 'fullName', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'city', label: 'City' },
      { key: 'age', label: 'Age' },
    ],
    searchKeys: ['fullName', 'email', 'phone', 'city', 'state', 'country'],
  },
  nominations: {
    label: 'Nominations',
    statuses: ['new', 'contacted', 'invited', 'declined', 'archived'],
    columns: [
      { key: 'nomineeName', label: 'Nominee' },
      { key: 'nomineeEmail', label: 'Email' },
      { key: 'nomineePhone', label: 'Phone' },
    ],
    searchKeys: ['nomineeName', 'nomineeEmail', 'nomineePhone'],
  },
  partnerships: {
    label: 'Partnerships',
    statuses: ['new', 'in_discussion', 'confirmed', 'declined', 'archived'],
    columns: [
      { key: 'contactName', label: 'Contact' },
      { key: 'organisation', label: 'Organisation' },
      { key: 'email', label: 'Email' },
      { key: 'partnershipType', label: 'Type' },
    ],
    searchKeys: ['contactName', 'organisation', 'email', 'message'],
  },
};

const FIELD_LABELS = {
  fullName: 'Full name', email: 'Email', phone: 'Phone', age: 'Age', city: 'City', state: 'State / region', country: 'Country',
  diagnosisYear: 'Year diagnosed', treatment: 'Current treatment', hba1c: 'Latest HbA1c', conditions: 'Diagnosed conditions',
  timeCommitment: 'Can commit the daily time?', availability: 'Available for expedition dates?', motivation: 'Motivation',
  emergencyName: 'Emergency contact name', emergencyPhone: 'Emergency contact phone', emergencyRelationship: 'Emergency contact relationship',
  consentAccuracy: 'Confirmed information is accurate', consentSelection: 'Understands no guaranteed selection',
  consentExpeditionContact: 'Consented to contact about expedition', consentDpdp: 'Consented to DPDP notice', consentFutureContact: 'Opted into future updates',
  nomineeName: 'Nominee name', nomineeEmail: 'Nominee email', nomineePhone: 'Nominee phone',
  contactName: 'Contact name', organisation: 'Organisation', partnershipType: 'Partnership type', message: 'Message',
  status: 'Status', source: 'Source', $id: 'Record ID', $createdAt: 'Submitted', $updatedAt: 'Last updated',
};

const state = {
  activeTab: 'applications',
  rowsByTable: {},
  search: '',
  statusFilter: '',
};

const els = {};
['screen-loading', 'screen-login', 'screen-unauthorized', 'screen-dashboard',
  'login-form', 'unauthorized-signout', 'signout-button', 'current-user-email',
  'search-input', 'status-filter', 'result-count', 'refresh-button', 'export-button',
  'loading-state', 'error-state', 'empty-state', 'admin-table',
  'detail-dialog', 'detail-content', 'detail-close'].forEach((id) => { els[id] = document.getElementById(id); });

function showScreen(name) {
  ['screen-loading', 'screen-login', 'screen-unauthorized', 'screen-dashboard'].forEach((id) => {
    els[id].hidden = id !== name;
  });
}

// ---------- auth ----------

async function checkAuthAndRoute() {
  if (!isConfigured) {
    showScreen('screen-login');
    els['login-form'].querySelector('.form-error').textContent = 'This site is not yet connected to Appwrite. Configure assets/config/appwrite-config.js first.';
    return;
  }
  try {
    const user = await account.get();
    const membership = await teams.list();
    const isAdmin = membership.teams.some((team) => team.$id === ADMIN_TEAM_ID);
    if (!isAdmin) { showScreen('screen-unauthorized'); return; }
    els['current-user-email'].textContent = user.email;
    showScreen('screen-dashboard');
    initDashboard();
  } catch {
    showScreen('screen-login');
  }
}

els['login-form'].addEventListener('submit', async (event) => {
  event.preventDefault();
  const errorEl = els['login-form'].querySelector('.form-error');
  errorEl.textContent = '';
  const data = new FormData(els['login-form']);
  const submitButton = els['login-form'].querySelector('button[type="submit"]');
  submitButton.disabled = true;
  try {
    await account.createEmailPasswordSession(data.get('email'), data.get('password'));
    await checkAuthAndRoute();
  } catch (err) {
    errorEl.textContent = err?.message || 'Sign in failed. Check your email and password.';
  } finally {
    submitButton.disabled = false;
  }
});

async function signOut() {
  try { await account.deleteSession('current'); } catch { /* no active session */ }
  showScreen('screen-login');
}
els['unauthorized-signout'].addEventListener('click', signOut);
els['signout-button'].addEventListener('click', signOut);

// ---------- dashboard ----------

let dashboardInitialised = false;

function initDashboard() {
  if (dashboardInitialised) { loadTab(state.activeTab); return; }
  dashboardInitialised = true;

  document.querySelectorAll('.admin-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach((t) => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
      state.activeTab = tab.dataset.tab;
      state.search = '';
      state.statusFilter = '';
      els['search-input'].value = '';
      populateStatusFilter();
      renderTable();
      if (!state.rowsByTable[state.activeTab]) loadTab(state.activeTab);
    });
  });

  els['search-input'].addEventListener('input', () => { state.search = els['search-input'].value.trim().toLowerCase(); renderTable(); });
  els['status-filter'].addEventListener('change', () => { state.statusFilter = els['status-filter'].value; renderTable(); });
  els['refresh-button'].addEventListener('click', () => loadTab(state.activeTab, { force: true }));
  els['export-button'].addEventListener('click', exportCurrentViewToCsv);
  els['detail-close'].addEventListener('click', () => els['detail-dialog'].close());
  els['detail-dialog'].addEventListener('click', (event) => { if (event.target === els['detail-dialog']) els['detail-dialog'].close(); });

  populateStatusFilter();
  loadTab(state.activeTab);
  // Load the other tabs' counts quietly in the background.
  Object.keys(TABLE_CONFIG).filter((t) => t !== state.activeTab).forEach((t) => loadTab(t, { silent: true }));
}

function populateStatusFilter() {
  const config = TABLE_CONFIG[state.activeTab];
  els['status-filter'].innerHTML = '<option value="">All statuses</option>'
    + config.statuses.map((s) => `<option value="${s}">${humanize(s)}</option>`).join('');
}

async function loadTab(tableKey, { force = false, silent = false } = {}) {
  if (state.rowsByTable[tableKey] && !force) { if (tableKey === state.activeTab) renderTable(); return; }
  if (!silent && tableKey === state.activeTab) {
    els['loading-state'].hidden = false;
    els['error-state'].hidden = true;
    els['admin-table'].hidden = true;
    els['empty-state'].hidden = true;
  }
  try {
    const res = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLES[tableKey],
      queries: [Query.orderDesc('$createdAt'), Query.limit(500)],
    });
    state.rowsByTable[tableKey] = res.rows;
    updateTabCount(tableKey, res.total ?? res.rows.length);
  } catch (err) {
    state.rowsByTable[tableKey] = [];
    if (tableKey === state.activeTab) {
      els['error-state'].hidden = false;
      els['error-state'].textContent = err?.message || 'Could not load this list.';
    }
  } finally {
    if (tableKey === state.activeTab) {
      els['loading-state'].hidden = true;
      renderTable();
    }
  }
}

function updateTabCount(tableKey, count) {
  const badge = document.querySelector(`[data-count-for="${tableKey}"]`);
  if (badge) badge.textContent = count;
}

function getFilteredRows() {
  const config = TABLE_CONFIG[state.activeTab];
  let rows = state.rowsByTable[state.activeTab] || [];
  if (state.statusFilter) rows = rows.filter((r) => (r.status || 'new') === state.statusFilter);
  if (state.search) {
    rows = rows.filter((r) => config.searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(state.search)));
  }
  return rows;
}

function renderTable() {
  const config = TABLE_CONFIG[state.activeTab];
  const rows = getFilteredRows();
  const allLoaded = state.rowsByTable[state.activeTab];

  els['result-count'].textContent = allLoaded ? `${rows.length} of ${allLoaded.length}` : '';

  if (!allLoaded) { els['admin-table'].hidden = true; els['empty-state'].hidden = true; return; }
  if (!rows.length) { els['admin-table'].hidden = true; els['empty-state'].hidden = false; return; }
  els['empty-state'].hidden = true;
  els['admin-table'].hidden = false;

  const thead = els['admin-table'].querySelector('thead');
  const tbody = els['admin-table'].querySelector('tbody');
  thead.innerHTML = `<tr>${config.columns.map((c) => `<th>${c.label}</th>`).join('')}<th>Status</th><th>Submitted</th></tr>`;
  tbody.innerHTML = '';

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = config.columns.map((c) => `<td class="cell-truncate">${escapeHtml(formatValue(row[c.key]))}</td>`).join('')
      + `<td></td><td>${escapeHtml(formatDate(row.$createdAt))}</td>`;

    const statusCell = tr.children[config.columns.length];
    const select = document.createElement('select');
    select.className = 'status-select';
    select.setAttribute('aria-label', 'Status');
    select.innerHTML = config.statuses.map((s) => `<option value="${s}"${s === (row.status || 'new') ? ' selected' : ''}>${humanize(s)}</option>`).join('');
    select.addEventListener('click', (e) => e.stopPropagation());
    select.addEventListener('change', async () => {
      const previous = row.status;
      row.status = select.value;
      try {
        await tablesDB.updateRow({ databaseId: DATABASE_ID, tableId: TABLES[state.activeTab], rowId: row.$id, data: { status: select.value } });
      } catch (err) {
        row.status = previous;
        select.value = previous || 'new';
        window.alert(`Could not update status: ${err?.message || err}`);
      }
    });
    statusCell.appendChild(select);

    tr.addEventListener('click', () => openDetail(row));
    tbody.appendChild(tr);
  });
}

function openDetail(row) {
  const title = row.fullName || row.nomineeName || row.contactName || 'Submission';
  const fields = Object.keys(row).filter((k) => !k.startsWith('$') && k !== 'status');
  const rowsHtml = fields.map((key) => `
    <div class="detail-row">
      <span>${escapeHtml(FIELD_LABELS[key] || humanize(key))}</span>
      <strong>${escapeHtml(formatValue(row[key])) || '—'}</strong>
    </div>`).join('');
  els['detail-content'].innerHTML = `
    <h2 class="detail-title">${escapeHtml(title)}</h2>
    <div class="detail-grid">
      <div class="detail-row"><span>Status</span><strong>${escapeHtml(humanize(row.status || 'new'))}</strong></div>
      <div class="detail-row"><span>Submitted</span><strong>${escapeHtml(formatDate(row.$createdAt))}</strong></div>
      ${rowsHtml}
      <div class="detail-row"><span>Record ID</span><strong>${escapeHtml(row.$id)}</strong></div>
    </div>`;
  els['detail-dialog'].showModal();
}

// ---------- export ----------

function exportCurrentViewToCsv() {
  const config = TABLE_CONFIG[state.activeTab];
  const rows = getFilteredRows();
  if (!rows.length) return;
  const fields = Array.from(new Set(rows.flatMap((r) => Object.keys(r)))).filter((k) => k !== '$permissions' && k !== '$databaseId' && k !== '$tableId' && k !== '$sequence' && k !== '$collectionId');
  const header = fields.map(csvCell).join(',');
  const body = rows.map((r) => fields.map((f) => csvCell(formatValue(r[f]))).join(',')).join('\r\n');
  const csv = `﻿${header}\r\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${config.label.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  const str = String(value ?? '');
  return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

// ---------- formatting ----------

function formatValue(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

function formatDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); } catch { return iso; }
}

function humanize(key) {
  return String(key).replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

checkAuthAndRoute();
