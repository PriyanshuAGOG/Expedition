from __future__ import annotations

from pathlib import Path

ROOT = Path(".")
INDEX = ROOT / "index.html"
APPLY = ROOT / "apply.html"
SCRIPT = ROOT / "script.js"
STYLES = ROOT / "styles.css"

def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")

def write(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8")

def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 occurrence, found {count}")
    return text.replace(old, new, 1)

# Landing page
index = read(INDEX)
index = replace_once(
    index,
    '<meta name="build-version" content="2026.08.01-content-feedback-v21">',
    '<meta name="build-version" content="2026.08.01-pricing-dpdp-v22">',
    "build version",
)
index = replace_once(
    index,
    '<p><strong>60 days of preparation</strong> · one six-day Himalayan expedition · World Diabetes Day 2026</p>',
    '<p><strong>60 days of preparation</strong> · 6 day Himalayan expedition · World Diabetes Day 2026</p>',
    "hero duration",
)
index = replace_once(
    index,
    '<h2 id="briefing-title">Why we are doing <em>this.</em></h2>',
    '<h2 id="briefing-title">Why we are doing <em>this?</em></h2>',
    "purpose question mark",
)
index = replace_once(
    index,
    '<div class="glance-fee"><small>Programme Fee</small><strong>₹ XX,XXX</strong><span>placeholder, to be confirmed</span></div>',
    '<div class="glance-fee"><small>Programme pricing</small><strong data-programme-fee>To be announced</strong><span data-pricing-status>Pricing under final review</span></div>',
    "glance pricing",
)
index = replace_once(
    index,
    '<div class="registration-intro registration-cta-card reveal"><p class="kicker">Applications nationwide</p><h2 id="register-title">Ready to<br><em>apply?</em></h2><p>The application takes about 8–10 minutes. Applying does not guarantee selection, and clinical documents will only be requested later through an approved secure process.</p><div class="registration-meta"><div><span>Time</span><strong>8–10 min</strong></div><div><span>Selection</span><strong>Multi-stage</strong></div><div><span>Dates</span><strong>12–19 Nov</strong></div><div class="fee-placeholder"><span>Programme Fee</span><strong>₹ XX,XXX</strong><small>Placeholder</small></div></div><a class="primary-apply-button" href="apply.html" target="_top">Apply Now <span>↗</span></a></div>',
    '<div class="registration-intro registration-cta-card reveal"><p class="kicker">Applications nationwide</p><h2 id="register-title">Ready to<br><em>apply?</em></h2><p>The application takes about 8–10 minutes. Applying does not guarantee selection, and clinical documents will only be requested later through an approved secure process.</p><div class="registration-meta"><div><span>Time</span><strong>8–10 min</strong></div><div><span>Selection</span><strong>Multi-stage</strong></div><div><span>Dates</span><strong>12–19 Nov</strong></div><div class="fee-placeholder"><span>Pricing</span><strong data-programme-fee>To be announced</strong><small data-pricing-status>Pricing under final review</small></div></div><a class="primary-apply-button" href="apply.html" target="_top">Apply Now <span>↗</span></a></div>',
    "registration pricing",
)
index = replace_once(
    index,
    '<details class="reveal"><summary>What is the Programme Fee?<span>+</span></summary><p>The final Programme Fee is still being confirmed. The current placeholder is ₹ XX,XXX and will be replaced before applications formally open.</p></details>',
    '<details class="reveal"><summary>Where will programme pricing be published?<span>+</span></summary><p>The approved price, inclusions, exclusions, payment schedule and cancellation terms will be published in the pricing section on this page. Until then, no amount is being presented as final and no payment is collected with the application.</p></details>',
    "pricing FAQ",
)
index = index.replace(
    '<li>Current activity level and relevant diagnosed conditions</li>',
    '<li>Relevant diagnosed conditions and health history</li>',
)
pricing_section = '''
    <section class="pricing-section" id="pricing" aria-labelledby="pricing-title">
      <div class="pricing-inner">
        <header class="pricing-heading reveal">
          <p class="kicker">Programme pricing</p>
          <h2 id="pricing-title">A clear fee,<br><em>published here.</em></h2>
          <p>The approved price will update automatically everywhere it appears on this page. Until it is formally published, no amount is being presented as final.</p>
        </header>
        <div class="pricing-panel reveal" aria-live="polite">
          <div class="pricing-current">
            <span class="pricing-state" data-pricing-status>Pricing under final review</span>
            <strong data-programme-fee>To be announced</strong>
            <p data-pricing-note>No payment is collected with the application.</p>
            <small>Last updated <time data-pricing-updated>1 August 2026</time></small>
          </div>
          <div class="pricing-details">
            <h3>Before any payment is requested</h3>
            <p>The final pricing disclosure will clearly state:</p>
            <ul>
              <li>The approved fee and applicable taxes</li>
              <li>Included preparation and expedition services</li>
              <li>Travel, equipment and other exclusions</li>
              <li>Payment schedule, cancellation and refund terms</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
'''
if 'id="pricing"' not in index:
    index = replace_once(
        index,
        '\n    <section class="xp-trail" id="trail"',
        pricing_section + '\n    <section class="xp-trail" id="trail"',
        "pricing section insertion",
    )

# Application page
apply = read(APPLY)
apply = replace_once(
    apply,
    '<title>Apply for the Expedition · NirogBhumi</title>',
    '<title>Apply · World Diabetes Day Himalayan Expedition 2026 · NirogBhumi</title>',
    "application title",
)
apply = replace_once(
    apply,
    '        <div><span>Programme Fee</span><strong>₹ XX,XXX</strong></div>\n',
    '',
    "remove application fee",
)
apply = replace_once(
    apply,
    '<label class="field"><span>Current treatment *</span><select name="treatment" required><option value="">Select</option><option>Lifestyle guidance only</option><option>Oral medication</option><option>Insulin</option><option>Insulin and oral medication</option><option>Other / unsure</option></select></label>',
    '<label class="field"><span>Current treatment *</span><select name="treatment" required><option value="">Select</option><option>On medication</option><option>On insulin</option><option>Both medication and insulin</option><option>None of the above</option></select></label>',
    "treatment options",
)
apply = replace_once(
    apply,
    '              <label class="field"><span>Current weekly activity *</span><select name="activity" required><option value="">Select</option><option>Mostly sedentary</option><option>1–2 active days</option><option>3–4 active days</option><option>5+ active days</option></select></label>\n',
    '',
    "remove weekly activity",
)
old_consents = '''            <div class="consent-group">
              <label><input type="checkbox" name="accuracy" required><span>I confirm the information is accurate to the best of my knowledge. *</span></label>
              <label><input type="checkbox" name="selection" required><span>I understand that applying does not guarantee selection. *</span></label>
              <label><input type="checkbox" name="medicine" required><span>I will not change medication without my treating doctor's guidance. *</span></label>
              <label><input type="checkbox" name="privacy" required><span>I consent to this information being used only to assess and contact me about this expedition, subject to the privacy policy. *</span></label>
            </div>'''
new_consents = '''            <div class="consent-group" aria-label="Application consents">
              <label class="consent-row"><input type="checkbox" name="accuracy" required><span>I confirm the information is accurate to the best of my knowledge. *</span></label>
              <label class="consent-row"><input type="checkbox" name="selection" required><span>I understand that applying does not guarantee selection. *</span></label>
              <label class="consent-row"><input type="checkbox" name="expeditionContact" required><span>I consent to this information being used to assess my participation and contacting me about this expedition. *</span></label>
              <label class="consent-row consent-row-dpdp"><input type="checkbox" name="dpdpConsent" required><span>I have read the <a href="#dpdp-consent-dialog" data-open-dpdp>DPDP consent notice and privacy policy</a> and consent to the processing of my personal data for the purposes stated in that notice. *</span></label>
              <label class="consent-row consent-row-optional"><input type="checkbox" name="futureContact"><span>Optional: I agree that NirogBhumi may contact me about future programmes and initiatives. I can withdraw this consent at any time.</span></label>
            </div>'''
apply = replace_once(apply, old_consents, new_consents, "consent group")
apply = replace_once(
    apply,
    '    <p class="application-footer-note">NirogBhumi does not replace medical advice, diagnosis or treatment. Never stop or change medication without your treating doctor\'s guidance.</p>',
    '''    <aside class="medical-safety-note" role="note" aria-label="Important medical guidance">
      <span class="medical-safety-icon" aria-hidden="true">✚</span>
      <div><strong>Medical guidance remains essential</strong><p>NirogBhumi does not replace medical advice, diagnosis or treatment. Never stop or change medication without guidance from your treating doctor.</p></div>
    </aside>''',
    "visual medical note",
)
dpdp_dialog = '''

  <dialog class="dpdp-dialog" id="dpdp-consent-dialog" aria-labelledby="dpdp-dialog-title">
    <div class="dpdp-dialog-shell">
      <header class="dpdp-dialog-header">
        <div><p class="kicker">Privacy and consent</p><h2 id="dpdp-dialog-title">DPDP Consent Notice and Privacy Policy</h2><small>Effective 1 August 2026 · Version 1.0</small></div>
        <button type="button" data-close-dpdp aria-label="Close privacy notice">×</button>
      </header>
      <div class="dpdp-dialog-body">
        <section>
          <h3>1. Who is collecting your data</h3>
          <p>NirogBhumi is the Data Fiduciary for this application. Contact: <a href="mailto:nirogbhumi@gmail.com">nirogbhumi@gmail.com</a>, <a href="tel:+917357542882">+91 73575 42882</a>, Jaipur, Rajasthan, India.</p>
        </section>
        <section>
          <h3>2. Personal data covered by this consent</h3>
          <ul>
            <li>Identity and contact data, including name, age, email, phone number and location.</li>
            <li>Health-related data, including diagnosis year, current treatment, HbA1c if voluntarily supplied and the conditions selected in the health screen.</li>
            <li>Readiness data, including availability, time commitment, motivation and emergency-contact information.</li>
            <li>Consent records, submission timestamps and security or access logs when the production intake system is activated.</li>
          </ul>
        </section>
        <section>
          <h3>3. Why NirogBhumi will process it</h3>
          <ul>
            <li>To assess your application, eligibility and potential participation.</li>
            <li>To contact you about this expedition and communicate application decisions.</li>
            <li>To arrange medical screening or review if your application progresses.</li>
            <li>To plan and administer preparation, safety and expedition operations.</li>
            <li>To maintain necessary records, prevent misuse, handle grievances and meet legal obligations.</li>
          </ul>
          <p>NirogBhumi will not use this data for unrelated marketing unless you separately select the optional future-programmes consent.</p>
        </section>
        <section>
          <h3>4. Current form status</h3>
          <p>This prototype currently validates entries in your browser and does not transmit or store the submitted form. Before formal applications open, it must be connected to an approved secure intake system. This notice will apply to that production collection, and any material change will be shown before consent is taken.</p>
        </section>
        <section>
          <h3>5. Who may receive the data</h3>
          <p>Access may be provided only to authorised NirogBhumi personnel, designated medical consultants or reviewers, and approved service providers that support secure intake and programme administration. Information may also be disclosed where required by law. Personal data will not be sold. Identifiable medical information will not be published without separate, explicit consent.</p>
        </section>
        <section>
          <h3>6. Retention and erasure</h3>
          <p>Application data will be retained only for as long as necessary to assess and administer this expedition, resolve grievances and meet legal obligations. A documented retention schedule must be approved before production launch. Data that is no longer required will be securely erased or anonymised. Contact data used for future initiatives will be retained only until that optional consent is withdrawn or the purpose ends.</p>
        </section>
        <section>
          <h3>7. Security safeguards</h3>
          <p>The production intake must use appropriate access controls, encryption in transit and at rest where applicable, confidentiality controls, logging, secure backups and an incident-response process. Access should be limited to people who need the data for the stated purposes.</p>
        </section>
        <section>
          <h3>8. Your rights</h3>
          <p>Subject to applicable law, you may request a summary of your personal data and processing, correction, completion or updating, erasure, grievance redressal, withdrawal of consent and nomination of another person to exercise rights in specified circumstances.</p>
          <p>You may withdraw consent as easily as you gave it by emailing <a href="mailto:nirogbhumi@gmail.com?subject=DPDP%20Rights%20Request">nirogbhumi@gmail.com</a> with the subject “DPDP Rights Request” or calling <a href="tel:+917357542882">+91 73575 42882</a>. Withdrawal does not affect processing already carried out on the basis of valid consent, but it may prevent NirogBhumi from continuing to assess or administer your application.</p>
        </section>
        <section>
          <h3>9. Grievance redressal</h3>
          <p>Send privacy or data-protection complaints to the contact above. NirogBhumi should acknowledge and address the grievance within its published grievance process. Where applicable, you may approach the Data Protection Board of India after using the available grievance channel.</p>
        </section>
        <section>
          <h3>10. Adults only and consent record</h3>
          <p>This expedition application is for adults aged 18 or above. When the production system is activated, NirogBhumi should record the notice version, consent choice and timestamp so consent can be demonstrated and managed.</p>
        </section>
      </div>
      <footer class="dpdp-dialog-footer"><p>Review this notice before selecting the required DPDP consent checkbox.</p><button type="button" data-close-dpdp>Close notice</button></footer>
    </div>
  </dialog>'''
if 'id="dpdp-consent-dialog"' not in apply:
    apply = replace_once(apply, '\n\n  <script src="script.js"></script>', dpdp_dialog + '\n\n  <script src="script.js"></script>', "DPDP dialog insertion")

def harmonise_name(text: str) -> str:
    text = text.replace("World Diabetes Day Expedition 2026", "World Diabetes Day Himalayan Expedition 2026")
    text = text.replace("World Diabetes Day Expedition", "World Diabetes Day Himalayan Expedition")
    text = text.replace(
        "World%20Diabetes%20Day%20Expedition",
        "World%20Diabetes%20Day%20Himalayan%20Expedition",
    )
    return text

index = harmonise_name(index)
apply = harmonise_name(apply)
write(INDEX, index)
write(APPLY, apply)

# JavaScript
js = read(SCRIPT)
js = js.replace("field.closest('.field')?.classList.toggle('invalid', !valid)", "field.closest('.field, .consent-row')?.classList.toggle('invalid', !valid)")
js = js.replace("event.target.closest('.field')?.classList.remove('invalid')", "event.target.closest('.field, .consent-row')?.classList.remove('invalid')")
pricing_js = '''
  const pricingConfig = Object.freeze({
    fee: null,
    currency: 'INR',
    unpublishedLabel: 'To be announced',
    unpublishedStatus: 'Pricing under final review',
    publishedStatus: 'Current approved programme price',
    note: 'No payment is collected with the application.',
    lastUpdated: '2026-08-01T00:00:00+05:30'
  });
  const publishedFee = typeof pricingConfig.fee === 'number' && Number.isFinite(pricingConfig.fee);
  const pricingAmount = publishedFee
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: pricingConfig.currency, maximumFractionDigits: 0 }).format(pricingConfig.fee)
    : pricingConfig.unpublishedLabel;
  const pricingStatus = publishedFee ? pricingConfig.publishedStatus : pricingConfig.unpublishedStatus;
  const pricingUpdated = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(pricingConfig.lastUpdated));
  document.querySelectorAll('[data-programme-fee]').forEach(element => { element.textContent = pricingAmount; });
  document.querySelectorAll('[data-pricing-status]').forEach(element => { element.textContent = pricingStatus; });
  document.querySelectorAll('[data-pricing-note]').forEach(element => { element.textContent = pricingConfig.note; });
  document.querySelectorAll('[data-pricing-updated]').forEach(element => { element.textContent = pricingUpdated; element.setAttribute('datetime', pricingConfig.lastUpdated); });
  document.querySelectorAll('.pricing-section').forEach(section => section.classList.toggle('pricing-published', publishedFee));

'''
if "const pricingConfig = Object.freeze" not in js:
    js = replace_once(js, "  const countdowns = [...document.querySelectorAll('[data-countdown-days]')];", pricing_js + "  const countdowns = [...document.querySelectorAll('[data-countdown-days]')];", "pricing JS")

dpdp_js = '''
  const dpdpDialog = document.querySelector('#dpdp-consent-dialog');
  const openDpdpDialog = () => {
    if (!dpdpDialog) return;
    if (typeof dpdpDialog.showModal === 'function') dpdpDialog.showModal();
    else dpdpDialog.setAttribute('open', '');
  };
  const closeDpdpDialog = () => {
    if (!dpdpDialog) return;
    if (typeof dpdpDialog.close === 'function') dpdpDialog.close();
    else dpdpDialog.removeAttribute('open');
  };
  document.querySelectorAll('[data-open-dpdp]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    openDpdpDialog();
  }));
  dpdpDialog?.querySelectorAll('[data-close-dpdp]').forEach(button => button.addEventListener('click', closeDpdpDialog));
  dpdpDialog?.addEventListener('click', event => { if (event.target === dpdpDialog) closeDpdpDialog(); });

'''
if "const dpdpDialog = document.querySelector" not in js:
    js = replace_once(js, "  document.querySelectorAll('.faq-list details')", dpdp_js + "  document.querySelectorAll('.faq-list details')", "DPDP JS")
write(SCRIPT, js)

# CSS additions
css = read(STYLES)
css_marker = "/* 2026-08-01 dynamic pricing and DPDP consent pass */"
css_addition = r'''

/* 2026-08-01 dynamic pricing and DPDP consent pass */
.pricing-section{
  position:relative;
  z-index:3;
  isolation:isolate;
  overflow:hidden;
  padding:clamp(96px,14svh,150px) clamp(22px,7vw,110px);
  background:
    radial-gradient(circle at 78% 18%,rgba(93,142,70,.18),transparent 34%),
    linear-gradient(180deg,#06110b,#0a1d13 58%,#06110b);
}
.pricing-inner{width:min(1080px,100%);margin:0 auto}
.pricing-heading{max-width:760px;margin:0 auto;text-align:center}
.pricing-heading h2{margin:0;font-size:clamp(3.2rem,6.4vw,6.5rem);font-weight:520;line-height:.88;letter-spacing:-.065em}
.pricing-heading>p:last-child{max-width:650px;margin:26px auto 0;color:var(--muted);font-size:.9rem;line-height:1.68}
.pricing-panel{
  display:grid;
  grid-template-columns:minmax(280px,.82fr) minmax(0,1.18fr);
  gap:1px;
  margin-top:clamp(42px,7svh,72px);
  padding:1px;
  border:1px solid rgba(215,246,168,.22);
  border-radius:8px 34px 8px 34px;
  overflow:hidden;
  background:rgba(215,246,168,.15);
  box-shadow:0 34px 90px rgba(0,0,0,.34);
}
.pricing-current,.pricing-details{padding:clamp(28px,4vw,48px);background:linear-gradient(145deg,rgba(10,31,19,.94),rgba(4,16,9,.9))}
.pricing-current{display:flex;flex-direction:column;justify-content:center}
.pricing-state{width:max-content;max-width:100%;padding:8px 12px;border:1px solid rgba(215,246,168,.28);border-radius:999px;color:var(--leaf);font-size:.52rem;font-weight:750;letter-spacing:.13em;text-transform:uppercase}
.pricing-current>strong{margin:32px 0 14px;color:var(--leaf);font-family:Georgia,"Times New Roman",serif;font-size:clamp(2.25rem,5vw,4.8rem);font-weight:400;line-height:.95;letter-spacing:-.045em}
.pricing-current>p{margin:0;color:rgba(243,240,231,.75);font-size:.82rem;line-height:1.55}
.pricing-current>small{margin-top:28px;padding-top:16px;border-top:1px solid var(--hairline);color:rgba(243,240,231,.46);font-size:.52rem;letter-spacing:.08em;text-transform:uppercase}
.pricing-details h3{margin:0 0 12px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(1.6rem,2.7vw,2.7rem);font-weight:400}
.pricing-details>p{margin:0 0 22px;color:var(--muted);font-size:.8rem;line-height:1.55}
.pricing-details ul{display:grid;gap:0;margin:0;padding:0;list-style:none;border-top:1px solid var(--hairline)}
.pricing-details li{position:relative;padding:16px 0 16px 24px;border-bottom:1px solid var(--hairline);color:rgba(243,240,231,.78);font-size:.8rem;line-height:1.45}
.pricing-details li::before{content:"";position:absolute;left:2px;top:1.35em;width:6px;height:6px;border-radius:50%;background:var(--leaf);box-shadow:0 0 0 5px rgba(215,246,168,.08)}
.pricing-published .pricing-state{color:var(--ink);background:var(--leaf)}
.glance-fee [data-pricing-status]{display:block}

.application-page .consent-group{gap:12px}
.application-page .consent-row{
  position:relative;
  padding:15px 16px;
  border:1px solid rgba(215,246,168,.14);
  border-radius:5px 16px 5px 16px;
  background:rgba(215,246,168,.035);
  transition:border-color .2s,background .2s;
}
.application-page .consent-row:hover{border-color:rgba(215,246,168,.3);background:rgba(215,246,168,.055)}
.application-page .consent-row input{flex:0 0 auto;margin-top:3px}
.application-page .consent-row span{font-size:.72rem;line-height:1.55}
.application-page .consent-row a{color:var(--leaf);font-weight:700;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
.application-page .consent-row.invalid{border-color:#ff9b88;background:rgba(255,155,136,.06)}
.application-page .consent-row-optional{border-style:dashed;background:rgba(217,188,120,.035)}
.application-page .consent-row-optional::after{content:"Optional";position:absolute;right:12px;top:9px;color:#d9bc78;font-size:.43rem;font-weight:750;letter-spacing:.13em;text-transform:uppercase}

.dpdp-dialog{
  width:min(920px,calc(100% - 28px));
  max-height:min(90svh,920px);
  padding:0;
  border:1px solid rgba(215,246,168,.28);
  border-radius:8px 30px 8px 30px;
  color:var(--cream);
  background:#07140e;
  box-shadow:0 50px 160px rgba(0,0,0,.72);
}
.dpdp-dialog::backdrop{background:rgba(1,7,4,.8);backdrop-filter:blur(8px)}
.dpdp-dialog-shell{display:grid;grid-template-rows:auto minmax(0,1fr) auto;max-height:min(90svh,920px)}
.dpdp-dialog-header{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:24px;
  padding:24px clamp(20px,4vw,38px);
  border-bottom:1px solid var(--hairline);
  background:linear-gradient(145deg,rgba(18,50,30,.82),rgba(5,17,10,.88));
}
.dpdp-dialog-header .kicker{margin-bottom:8px}
.dpdp-dialog-header h2{margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(1.65rem,3.5vw,2.8rem);font-weight:400;line-height:1.08;letter-spacing:-.025em}
.dpdp-dialog-header small{display:block;margin-top:9px;color:var(--muted);font-size:.52rem;letter-spacing:.08em;text-transform:uppercase}
.dpdp-dialog-header>button{
  flex:0 0 40px;
  width:40px;
  height:40px;
  border:1px solid rgba(215,246,168,.28);
  border-radius:50%;
  color:var(--leaf);
  background:transparent;
  cursor:pointer;
  font-size:1.35rem;
}
.dpdp-dialog-body{overflow:auto;padding:12px clamp(20px,4vw,38px) 30px;scrollbar-width:thin;scrollbar-color:#627b62 #07140e}
.dpdp-dialog-body section{padding:22px 0;border-bottom:1px solid var(--hairline)}
.dpdp-dialog-body section:last-child{border-bottom:0}
.dpdp-dialog-body h3{margin:0 0 11px;color:var(--leaf);font-family:Georgia,"Times New Roman",serif;font-size:1.25rem;font-weight:400}
.dpdp-dialog-body p,.dpdp-dialog-body li{color:rgba(243,240,231,.75);font-size:.78rem;line-height:1.68}
.dpdp-dialog-body p{margin:0 0 10px}.dpdp-dialog-body p:last-child{margin-bottom:0}
.dpdp-dialog-body ul{display:grid;gap:8px;margin:0;padding-left:20px}
.dpdp-dialog-body a{color:var(--leaf);text-decoration:underline;text-underline-offset:3px}
.dpdp-dialog-footer{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
  padding:17px clamp(20px,4vw,38px);
  border-top:1px solid var(--hairline);
  background:#050f0a;
}
.dpdp-dialog-footer p{margin:0;color:var(--muted);font-size:.66rem;line-height:1.45}
.dpdp-dialog-footer button{
  flex:0 0 auto;
  min-height:42px;
  padding:0 18px;
  border:0;
  border-radius:999px;
  color:var(--ink);
  background:var(--leaf);
  cursor:pointer;
  font-size:.58rem;
  font-weight:750;
  letter-spacing:.1em;
  text-transform:uppercase;
}
.application-page .medical-safety-note{
  grid-column:2;
  display:flex;
  align-items:flex-start;
  gap:16px;
  margin:0;
  padding:20px 22px;
  border:1px solid rgba(215,246,168,.22);
  border-radius:6px 22px 6px 22px;
  background:linear-gradient(145deg,rgba(15,43,26,.72),rgba(5,17,10,.62));
  box-shadow:0 18px 46px rgba(0,0,0,.22);
}
.medical-safety-icon{flex:0 0 42px;display:grid;width:42px;height:42px;place-items:center;border:1px solid rgba(215,246,168,.4);border-radius:50%;color:var(--leaf);font-size:1rem}
.medical-safety-note strong{display:block;margin:1px 0 7px;color:var(--cream);font-family:Georgia,"Times New Roman",serif;font-size:1.12rem;font-weight:400}
.medical-safety-note p{margin:0;color:var(--muted);font-size:.72rem;line-height:1.58}

@media(max-width:680px){
  .pricing-section{padding:92px 16px}
  .pricing-heading h2{font-size:clamp(2.9rem,13vw,4.6rem)}
  .pricing-heading>p:last-child{font-size:.82rem}
  .pricing-panel{grid-template-columns:1fr;margin-top:38px;border-radius:6px 24px 6px 24px}
  .pricing-current,.pricing-details{padding:26px 20px}
  .pricing-current>strong{font-size:2.65rem}
  .application-page .application-quick-facts{grid-template-columns:1fr 1fr}
  .application-page .application-quick-facts div{display:block!important}
  .application-page .application-quick-facts div:last-child{grid-column:1/-1}
  .application-page .consent-row{padding:14px 13px}
  .application-page .consent-row-optional::after{position:static;display:block;width:max-content;margin-left:auto;margin-top:8px}
  .dpdp-dialog{width:calc(100% - 16px);max-height:94svh;border-radius:6px 22px 6px 22px}
  .dpdp-dialog-shell{max-height:94svh}
  .dpdp-dialog-header{padding:19px 16px}
  .dpdp-dialog-header h2{font-size:1.55rem}
  .dpdp-dialog-header>button{flex-basis:36px;width:36px;height:36px}
  .dpdp-dialog-body{padding:8px 17px 24px}
  .dpdp-dialog-body section{padding:18px 0}
  .dpdp-dialog-body p,.dpdp-dialog-body li{font-size:.72rem}
  .dpdp-dialog-footer{display:grid;padding:14px 16px}
  .dpdp-dialog-footer button{width:100%}
  .application-page .medical-safety-note{grid-column:auto;margin-top:24px;padding:18px;text-align:left}
}
'''
if css_marker not in css:
    css += css_addition
write(STYLES, css)

# Update the expedition name across relevant text files.
text_extensions = {".html", ".md", ".txt", ".js", ".mjs", ".py", ".json"}
for path in ROOT.rglob("*"):
    if not path.is_file() or path.suffix.lower() not in text_extensions:
        continue
    if any(part in {".git", "node_modules"} for part in path.parts):
        continue
    try:
        current = read(path)
    except UnicodeDecodeError:
        continue
    updated = harmonise_name(current)
    if updated != current:
        write(path, updated)

# Validation.
index = read(INDEX)
apply = read(APPLY)
js = read(SCRIPT)
assert "one six-day Himalayan expedition" not in index
assert "6 day Himalayan expedition" in index
assert "Why we are doing <em>this?</em>" in index
assert "World Diabetes Day Expedition 2026" not in index
assert 'id="pricing"' in index and "data-programme-fee" in index
assert "Programme Fee" not in apply
assert "Current weekly activity" not in apply
for option in ("On medication", "On insulin", "Both medication and insulin", "None of the above"):
    assert f"<option>{option}</option>" in apply
assert 'name="medicine"' not in apply
assert 'name="futureContact"' in apply
assert 'name="dpdpConsent"' in apply
assert 'id="dpdp-consent-dialog"' in apply
assert "I consent to this information being used to assess my participation and contacting me about this expedition." in apply
assert "field.closest('.field, .consent-row')" in js
print("Source updates and validations completed.")
