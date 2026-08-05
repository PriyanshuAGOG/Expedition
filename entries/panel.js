import {
  account, teams, tablesDB, storage, Query, DATABASE_ID, TABLES, ADMIN_TEAM_ID, UPLOADS_BUCKET_ID, isConfigured,
} from '../assets/js/appwrite-client.js';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '../assets/config/appwrite-config.js';

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
  diagnosisYear: 'Year diagnosed', treatment: 'Current treatment', hba1c: 'Latest HbA1c (legacy)',
  bpSystolic: 'Blood pressure — systolic (mmHg)', bpDiastolic: 'Blood pressure — diastolic (mmHg)', conditions: 'Diagnosed conditions',
  timeCommitment: 'Can commit the daily time?', availability: 'Available for expedition dates?', motivation: 'Motivation',
  emergencyName: 'Emergency contact name', emergencyPhone: 'Emergency contact phone', emergencyRelationship: 'Emergency contact relationship',
  medicalReportFileNames: 'Medical reports',
  consentAccuracy: 'Confirmed information is accurate', consentSelection: 'Understands no guaranteed selection',
  consentExpeditionContact: 'Consented to contact about expedition', consentDpdp: 'Consented to DPDP notice', consentFutureContact: 'Opted into future updates',
  nomineeName: 'Nominee name', nomineeEmail: 'Nominee email', nomineePhone: 'Nominee phone',
  contactName: 'Contact name', organisation: 'Organisation', partnershipType: 'Partnership type', message: 'Message',
  status: 'Status', source: 'Source', internalNotes: 'Internal notes', $id: 'Record ID', $createdAt: 'Submitted', $updatedAt: 'Last updated',
};

// Fields excluded from the auto-generated detail view because they're
// rendered separately (status pill, submitted date, notes editor, record id,
// medical-report download links, history section).
const DETAIL_HIDDEN_FIELDS = new Set(['status', 'internalNotes', 'medicalReportFileIds', 'medicalReportFileNames']);
const SORTABLE_KEYS = new Set(['$createdAt', 'status']);

const state = {
  activeTab: 'applications',
  rowsByTable: {},
  lastLoadedAt: {},
  search: '',
  statusFilter: '',
  sortKey: '$createdAt',
  sortDir: 'desc',
  selected: new Set(),
};

const els = {};
['screen-loading', 'screen-login', 'screen-unauthorized', 'screen-dashboard',
  'login-form', 'unauthorized-signout', 'signout-button', 'current-user-email',
  'status-summary', 'search-input', 'status-filter', 'result-count', 'last-refreshed', 'refresh-button', 'export-button',
  'bulk-bar', 'bulk-count', 'bulk-status-select', 'bulk-apply-button', 'bulk-clear-button',
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
      if (tab.dataset.tab === state.activeTab) return;
      document.querySelectorAll('.admin-tab').forEach((t) => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
      state.activeTab = tab.dataset.tab;
      state.search = '';
      state.statusFilter = '';
      state.sortKey = '$createdAt';
      state.sortDir = 'desc';
      state.selected.clear();
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

  els['bulk-clear-button'].addEventListener('click', () => { state.selected.clear(); renderTable(); });
  els['bulk-apply-button'].addEventListener('click', applyBulkStatus);

  populateStatusFilter();
  loadTab(state.activeTab);
  // Load the other tabs' counts quietly in the background.
  Object.keys(TABLE_CONFIG).filter((t) => t !== state.activeTab).forEach((t) => loadTab(t, { silent: true }));
}

function populateStatusFilter() {
  const config = TABLE_CONFIG[state.activeTab];
  els['status-filter'].innerHTML = '<option value="">All statuses</option>'
    + config.statuses.map((s) => `<option value="${s}">${humanize(s)}</option>`).join('');
  els['bulk-status-select'].innerHTML = config.statuses.map((s) => `<option value="${s}">${humanize(s)}</option>`).join('');
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
    state.lastLoadedAt[tableKey] = new Date();
    updateTabCount(tableKey, res.total ?? res.rows.length);
  } catch (err) {
    state.rowsByTable[tableKey] = state.rowsByTable[tableKey] || [];
    if (tableKey === state.activeTab) {
      els['error-state'].hidden = false;
      els['error-state'].textContent = err?.message || 'Could not load this list.';
    }
  } finally {
    if (tableKey === state.activeTab) {
      els['loading-state'].hidden = true;
      state.selected.clear();
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
  rows = [...rows].sort((a, b) => {
    const av = a[state.sortKey] ?? '';
    const bv = b[state.sortKey] ?? '';
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return state.sortDir === 'asc' ? cmp : -cmp;
  });
  return rows;
}

function renderStatusSummary() {
  const config = TABLE_CONFIG[state.activeTab];
  const rows = state.rowsByTable[state.activeTab];
  if (!rows) { els['status-summary'].innerHTML = ''; return; }
  const counts = {};
  rows.forEach((r) => { const s = r.status || 'new'; counts[s] = (counts[s] || 0) + 1; });
  els['status-summary'].innerHTML = `<button type="button" class="status-chip${!state.statusFilter ? ' active' : ''}" data-status="">All <b>${rows.length}</b></button>`
    + config.statuses.filter((s) => counts[s]).map((s) => `<button type="button" class="status-chip${state.statusFilter === s ? ' active' : ''}" data-status="${s}">${humanize(s)} <b>${counts[s]}</b></button>`).join('');
  els['status-summary'].querySelectorAll('.status-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.statusFilter = chip.dataset.status;
      els['status-filter'].value = state.statusFilter;
      renderTable();
    });
  });
}

function renderTable() {
  const config = TABLE_CONFIG[state.activeTab];
  const rows = getFilteredRows();
  const allLoaded = state.rowsByTable[state.activeTab];

  renderStatusSummary();
  els['result-count'].textContent = allLoaded ? `${rows.length} of ${allLoaded.length}` : '';
  const loadedAt = state.lastLoadedAt[state.activeTab];
  els['last-refreshed'].textContent = loadedAt ? `Updated ${loadedAt.toLocaleTimeString()}` : '';

  renderBulkBar();

  if (!allLoaded) { els['admin-table'].hidden = true; els['empty-state'].hidden = true; return; }
  if (!rows.length) { els['admin-table'].hidden = true; els['empty-state'].hidden = false; return; }
  els['empty-state'].hidden = true;
  els['admin-table'].hidden = false;

  const thead = els['admin-table'].querySelector('thead');
  const tbody = els['admin-table'].querySelector('tbody');

  const sortIndicator = (key) => (state.sortKey === key ? (state.sortDir === 'asc' ? ' ↑' : ' ↓') : '');
  const sortableHeader = (key, label) => `<th class="${SORTABLE_KEYS.has(key) ? 'th-sortable' : ''}" data-sort-key="${key}">${label}${sortIndicator(key)}</th>`;

  const allSelected = rows.length > 0 && rows.every((r) => state.selected.has(r.$id));
  thead.innerHTML = `<tr><th class="th-check"><input type="checkbox" id="select-all-checkbox" aria-label="Select all"${allSelected ? ' checked' : ''}></th>`
    + config.columns.map((c) => sortableHeader(c.key, c.label)).join('')
    + `${sortableHeader('status', 'Status')}${sortableHeader('$createdAt', 'Submitted')}</tr>`;

  thead.querySelectorAll('.th-sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sortKey;
      state.sortDir = state.sortKey === key && state.sortDir === 'desc' ? 'asc' : 'desc';
      state.sortKey = key;
      renderTable();
    });
  });
  thead.querySelector('#select-all-checkbox').addEventListener('change', (e) => {
    if (e.target.checked) rows.forEach((r) => state.selected.add(r.$id));
    else rows.forEach((r) => state.selected.delete(r.$id));
    renderTable();
  });

  tbody.innerHTML = '';
  rows.forEach((row) => {
    const tr = document.createElement('tr');

    const checkCell = document.createElement('td');
    checkCell.className = 'th-check';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('aria-label', 'Select row');
    checkbox.checked = state.selected.has(row.$id);
    checkbox.addEventListener('click', (e) => e.stopPropagation());
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) state.selected.add(row.$id); else state.selected.delete(row.$id);
      renderBulkBar();
      thead.querySelector('#select-all-checkbox').checked = rows.every((r) => state.selected.has(r.$id));
    });
    checkCell.appendChild(checkbox);
    tr.appendChild(checkCell);

    config.columns.forEach((c) => {
      const td = document.createElement('td');
      td.className = 'cell-truncate';
      td.textContent = formatValue(row[c.key]);
      tr.appendChild(td);
    });

    const statusCell = document.createElement('td');
    const select = document.createElement('select');
    select.className = 'status-select';
    select.setAttribute('aria-label', 'Status');
    select.innerHTML = config.statuses.map((s) => `<option value="${s}"${s === (row.status || 'new') ? ' selected' : ''}>${humanize(s)}</option>`).join('');
    select.addEventListener('click', (e) => e.stopPropagation());
    select.addEventListener('change', () => updateRowStatus(row, select.value, select));
    statusCell.appendChild(select);
    tr.appendChild(statusCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = formatDate(row.$createdAt);
    tr.appendChild(dateCell);

    tr.addEventListener('click', () => openDetail(row));
    tbody.appendChild(tr);
  });
}

async function updateRowStatus(row, newStatus, selectEl) {
  const previous = row.status;
  row.status = newStatus;
  try {
    await tablesDB.updateRow({ databaseId: DATABASE_ID, tableId: TABLES[state.activeTab], rowId: row.$id, data: { status: newStatus } });
    renderStatusSummary();
  } catch (err) {
    row.status = previous;
    if (selectEl) selectEl.value = previous || 'new';
    window.alert(`Could not update status: ${err?.message || err}`);
  }
}

function renderBulkBar() {
  const count = state.selected.size;
  els['bulk-bar'].hidden = count === 0;
  els['bulk-count'].textContent = `${count} selected`;
}

async function applyBulkStatus() {
  const newStatus = els['bulk-status-select'].value;
  const rows = (state.rowsByTable[state.activeTab] || []).filter((r) => state.selected.has(r.$id));
  els['bulk-apply-button'].disabled = true;
  const failures = [];
  await Promise.all(rows.map(async (row) => {
    const previous = row.status;
    row.status = newStatus;
    try {
      await tablesDB.updateRow({ databaseId: DATABASE_ID, tableId: TABLES[state.activeTab], rowId: row.$id, data: { status: newStatus } });
    } catch (err) {
      row.status = previous;
      failures.push(row.$id);
    }
  }));
  els['bulk-apply-button'].disabled = false;
  state.selected.clear();
  renderTable();
  if (failures.length) window.alert(`Could not update ${failures.length} of ${rows.length} record(s). Try again.`);
}

// ---------- detail dialog ----------

function fileViewUrl(fileId) {
  if (typeof storage.getFileView === 'function') {
    try { return storage.getFileView({ bucketId: UPLOADS_BUCKET_ID, fileId }).toString(); } catch { /* fall through */ }
  }
  return `${APPWRITE_ENDPOINT}/storage/buckets/${UPLOADS_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
}

function openDetail(row) {
  const title = row.fullName || row.nomineeName || row.contactName || 'Submission';
  const fields = Object.keys(row).filter((k) => !k.startsWith('$') && !DETAIL_HIDDEN_FIELDS.has(k));
  const rowsHtml = fields.map((key) => `
    <div class="detail-row">
      <span>${escapeHtml(FIELD_LABELS[key] || humanize(key))}</span>
      <strong>${escapeHtml(formatValue(row[key])) || '—'}</strong>
    </div>`).join('');

  const fileIds = Array.isArray(row.medicalReportFileIds) ? row.medicalReportFileIds : [];
  const fileNames = Array.isArray(row.medicalReportFileNames) ? row.medicalReportFileNames : [];
  const filesHtml = fileIds.length
    ? `<div class="detail-row"><span>Medical reports</span><strong>${fileIds.map((id, i) => `<a href="${fileViewUrl(id)}" target="_blank" rel="noopener">${escapeHtml(fileNames[i] || `File ${i + 1}`)}</a>`).join(', ')}</strong></div>`
    : (state.activeTab === 'applications' ? '<div class="detail-row"><span>Medical reports</span><strong>None uploaded</strong></div>' : '');

  const historyHtml = state.activeTab === 'applications'
    ? `<div class="detail-history">
        <button type="button" id="detail-history-toggle" class="btn-ghost">Show application history</button>
        <div id="detail-history-body" hidden></div>
      </div>`
    : '';

  els['detail-content'].innerHTML = `
    <h2 class="detail-title">${escapeHtml(title)}</h2>
    <div class="detail-grid">
      <div class="detail-row"><span>Status</span><strong>${escapeHtml(humanize(row.status || 'new'))}</strong></div>
      <div class="detail-row"><span>Submitted</span><strong>${escapeHtml(formatDate(row.$createdAt))}</strong></div>
      <div class="detail-row"><span>Last updated</span><strong>${escapeHtml(formatDate(row.$updatedAt))}</strong></div>
      ${filesHtml}
      ${rowsHtml}
      <div class="detail-row"><span>Record ID</span><strong>${escapeHtml(row.$id)}</strong></div>
    </div>
    <div class="detail-notes">
      <span>Internal notes <small>(only visible to admins)</small></span>
      <textarea id="detail-notes-input" rows="4" maxlength="2000" placeholder="Add a note for the team…">${escapeHtml(row.internalNotes || '')}</textarea>
      <div class="detail-notes-actions">
        <output id="detail-notes-status" aria-live="polite"></output>
        <button type="button" id="detail-notes-save" class="btn-primary">Save note</button>
      </div>
    </div>
    ${historyHtml}`;

  const notesInput = els['detail-content'].querySelector('#detail-notes-input');
  const notesStatus = els['detail-content'].querySelector('#detail-notes-status');
  els['detail-content'].querySelector('#detail-notes-save').addEventListener('click', async () => {
    const value = notesInput.value;
    notesStatus.textContent = 'Saving…';
    try {
      await tablesDB.updateRow({ databaseId: DATABASE_ID, tableId: TABLES[state.activeTab], rowId: row.$id, data: { internalNotes: value } });
      row.internalNotes = value;
      notesStatus.textContent = 'Saved.';
      setTimeout(() => { notesStatus.textContent = ''; }, 1800);
    } catch (err) {
      notesStatus.textContent = `Could not save: ${err?.message || err}`;
    }
  });

  const historyToggle = els['detail-content'].querySelector('#detail-history-toggle');
  historyToggle?.addEventListener('click', async () => {
    const body = els['detail-content'].querySelector('#detail-history-body');
    if (!body) return;
    body.hidden = !body.hidden;
    if (body.hidden || body.dataset.loaded) return;
    body.dataset.loaded = 'true';
    body.textContent = 'Loading history…';
    try {
      const res = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLES.applicationHistory,
        queries: [Query.equal('applicationId', row.$id), Query.orderDesc('changedAt'), Query.limit(50)],
      });
      if (!res.rows.length) { body.textContent = 'No edits recorded — this application has not been resubmitted since it was first created.'; return; }
      body.innerHTML = res.rows.map((entry) => {
        const changed = Array.isArray(entry.changedFields) ? entry.changedFields : [];
        return `<div class="history-entry">
          <div class="history-entry-head"><strong>${escapeHtml(formatDate(entry.changedAt))}</strong><span>${escapeHtml(humanize(entry.changeSource || 'edit'))}</span></div>
          <div class="history-entry-fields">${changed.length ? changed.map((f) => `<span class="history-field-chip">${escapeHtml(FIELD_LABELS[f] || humanize(f))}</span>`).join('') : '<span class="history-field-chip">Files only</span>'}</div>
        </div>`;
      }).join('');
    } catch (err) {
      body.textContent = `Could not load history: ${err?.message || err}`;
    }
  });

  els['detail-dialog'].showModal();
}

// ---------- export ----------

function exportCurrentViewToCsv() {
  const config = TABLE_CONFIG[state.activeTab];
  const rows = getFilteredRows();
  if (!rows.length) return;
  const systemFields = new Set(['$permissions', '$databaseId', '$tableId', '$sequence', '$collectionId']);
  const fields = Array.from(new Set(rows.flatMap((r) => Object.keys(r)))).filter((k) => !systemFields.has(k));
  const header = fields.map((f) => csvCell(FIELD_LABELS[f] || humanize(f))).join(',');
  const body = rows.map((r) => fields.map((f) => csvCell(formatValue(r[f]))).join(',')).join('\r\n');
  const csv = `﻿${header}\r\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const suffix = state.statusFilter || state.search ? '-filtered' : '';
  a.download = `${config.label.toLowerCase()}${suffix}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// CSV formula-injection guard: every field here can contain arbitrary
// public input (form submissions aren't authenticated), so a value like
// `=HYPERLINK("http://evil","click")` or `=cmd|'/c calc'!A1` would run as
// a live formula the moment an admin opens the export in Excel/Sheets.
// Prefixing a leading apostrophe forces spreadsheet apps to treat the
// cell as literal text.
function csvCell(value) {
  let str = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
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
