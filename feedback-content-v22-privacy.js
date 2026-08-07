(() => {
  'use strict';

  if (!document.body?.classList.contains('application-page')) return;

  const PRIVACY_EMAIL = 'priyanshu@nirogbhumi.com';
  const LEGAL_ENTITY = 'Nirog Bhumi Private Limited';
  const REGISTERED_OFFICE = 'Jaipur, Rajasthan, India';

  const privacyNoticeMarkup = () => `
    <div class="dpdp-dialog-shell">
      <header class="dpdp-dialog-header">
        <div>
          <p class="kicker">Privacy and Consent</p>
          <h2 id="dpdp-dialog-title">DPDP Consent Notice and Privacy Policy</h2>
          <small>Effective 7 August 2026 · Version 1.2</small>
        </div>
        <button type="button" data-close-dpdp aria-label="Close privacy notice">×</button>
      </header>

      <div class="dpdp-dialog-body">
        <section>
          <h3>1. Data Fiduciary and contact</h3>
          <p>Nirog Bhumi, operated by ${LEGAL_ENTITY}, having its registered office in ${REGISTERED_OFFICE}, is the Data Fiduciary responsible for the personal data collected through this application.</p>
          <p><strong>Grievance Officer:</strong> Priyanshu Agarwal<br><strong>Email:</strong> <a href="mailto:${PRIVACY_EMAIL}?subject=DPDP%20Privacy%20Request">${PRIVACY_EMAIL}</a></p>
          <p>Privacy requests, consent-withdrawal requests and data-protection grievances may be sent through the contact details above.</p>
        </section>

        <section>
          <h3>2. Personal data covered by your consent</h3>
          <p>Depending on the information you provide through this application, Nirog Bhumi may collect and process the following categories of personal data:</p>
          <ul>
            <li><strong>Identity and contact data:</strong> your name, age, email address, phone number, city, region and country.</li>
            <li><strong>Health and medical screening data:</strong> information such as your year of Type 2 diabetes diagnosis, current treatment, HbA1c, recent blood-pressure readings, health conditions or complications selected in the initial health screen, and other health information requested as part of the application or screening process.</li>
            <li><strong>Application and expedition-readiness data:</strong> information about your current physical activity, ability to participate in the preparation programme, availability for the expedition, motivation for participating and other responses you provide in the application.</li>
            <li><strong>Uploaded medical information:</strong> any medical reports or health documents that you voluntarily choose to upload. Please provide only information relevant to the expedition screening process and avoid including unrelated medical or identification information where possible.</li>
            <li><strong>Emergency-contact information:</strong> where requested, the name, phone number and relationship of an emergency contact. You should provide another person's contact details only where that person has agreed that you may share those details with Nirog Bhumi for expedition safety and emergency purposes.</li>
          </ul>
          <p>Some health information is required in order for Nirog Bhumi to assess whether your application can progress. Medical reports or other information identified as optional need not be provided unless you choose to do so.</p>
        </section>

        <section>
          <h3>3. Specific purposes of processing</h3>
          <p>Your personal data may be processed for the following purposes:</p>
          <ul>
            <li>Assessing your application, eligibility and potential participation in the Himalayan Expedition.</li>
            <li>Contacting you regarding your application, the screening process, application decisions and expedition-related communications.</li>
            <li>Arranging medical screening, medical review or further assessment if your application progresses.</li>
            <li>Planning and administering preparation activities, participant safety, travel arrangements and expedition operations.</li>
            <li>Managing communications and necessary administrative records connected with your application or participation.</li>
            <li>Protecting the integrity and security of the application process and preventing misuse.</li>
            <li>Handling privacy requests, grievances, complaints or disputes.</li>
            <li>Complying with applicable legal, regulatory or lawful governmental requirements.</li>
          </ul>
          <p class="dpdp-purpose-note">Your personal data will not be used for unrelated marketing or promotional communication unless you separately provide consent for future programmes, initiatives or communications.</p>
        </section>

        <section>
          <h3>4. Access and permitted sharing</h3>
          <p>Access to personal data will be limited, as reasonably necessary, to persons and organisations involved in administering the application, screening and expedition process.</p>
          <p>This may include:</p>
          <ul>
            <li>authorised Nirog Bhumi personnel;</li>
            <li>designated medical professionals, consultants or reviewers involved in participant screening and safety;</li>
            <li>service providers supporting hosting, databases, secure file storage, communications or programme administration;</li>
            <li>expedition or safety partners, but only to the extent that particular information is reasonably necessary for participant safety or expedition administration; and</li>
            <li>governmental, regulatory, judicial or law-enforcement authorities where disclosure is required by applicable law.</li>
          </ul>
          <p>Health and medical information will be shared on a need-to-know basis and should not be disclosed more widely than is reasonably necessary for the relevant purpose.</p>
          <p>Nirog Bhumi will not sell your personal data.</p>
          <p>Identifiable health information, personal stories, photographs, videos, audio recordings or other media featuring you will not be published or used for publicity without a separate and explicit consent appropriate to that use.</p>
        </section>

        <section>
          <h3>5. Retention, erasure and purpose limitation</h3>
          <p>Personal data collected through this application will be retained only for as long as reasonably necessary to complete the application, selection and initial screening process and to deal with related administrative, grievance or legal requirements.</p>
          <p>Personal and health information relating to applicants who do not progress further will thereafter be securely deleted or anonymised in accordance with Nirog Bhumi's data-retention procedures, unless continued retention is reasonably necessary for an ongoing grievance, dispute or legal obligation.</p>
          <p>If your application progresses into medical screening, the 45-day preparation programme, expedition participation or another activity governed by a separate privacy or consent notice, relevant information may continue to be retained in accordance with the notice and retention period applicable to that activity.</p>
          <p>Contact information used for future programmes or initiatives under a separate optional consent will be retained only while that separate consent remains valid or until the relevant purpose ends, subject to any retention required by applicable law.</p>
          <p>Personal data will not be retained merely because it may potentially be useful for an unrelated future purpose.</p>
        </section>

        <section>
          <h3>6. Future research participation</h3>
          <p>Nirog Bhumi may separately undertake a research or evaluation study connected with the 45-day preparation programme and/or the Himalayan Expedition.</p>
          <p>If your application progresses and you are invited to participate in such a study, you will be provided with a separate Research Participant Information Sheet and/or Research Consent Notice explaining the proposed research and any additional use of your personal or health data.</p>
          <p>Where consent is required, information collected through this application will not be used for that research merely on the basis of the consent provided through this application.</p>
          <p>The separate research notice will explain, as applicable:</p>
          <ul>
            <li>the objectives and purposes of the research;</li>
            <li>the personal and health data proposed to be used;</li>
            <li>whether information already collected from you will form part of the research dataset;</li>
            <li>who may access or receive the research data;</li>
            <li>the applicable retention period;</li>
            <li>the use of anonymised or de-identified information;</li>
            <li>how research findings may be analysed, reported or published; and</li>
            <li>your rights and any applicable arrangements for withdrawal from the research.</li>
          </ul>
        </section>

        <section>
          <h3>7. Security safeguards and breach response</h3>
          <p>Applications are submitted through an encrypted connection and stored in a hosted database.</p>
          <p>Submitted applications and uploaded medical reports are accessible only to designated authorised Nirog Bhumi personnel and other authorised persons where access is necessary for the purposes described in this notice. The public-facing application form may submit information to the system but does not provide public access to submitted application records.</p>
          <p>Nirog Bhumi will apply reasonable technical and organisational safeguards appropriate to the nature and sensitivity of the personal data being processed and will periodically review its security arrangements.</p>
          <p>Where a personal-data breach occurs, Nirog Bhumi will investigate, contain and respond to the incident and make notifications where required under applicable law.</p>
        </section>

        <section>
          <h3>8. Your rights and withdrawal of consent</h3>
          <p>Subject to applicable law, you may exercise rights relating to your personal data, including requesting:</p>
          <ul>
            <li>information regarding your personal data and its processing;</li>
            <li>correction, completion or updating of inaccurate or incomplete information;</li>
            <li>erasure of personal data where applicable;</li>
            <li>grievance redressal;</li>
            <li>withdrawal of consent; and</li>
            <li>nomination of another person to exercise applicable rights in circumstances recognised by law.</li>
          </ul>
          <p>You may withdraw your consent by contacting Nirog Bhumi at:</p>
          <p><a href="mailto:${PRIVACY_EMAIL}?subject=DPDP%20Consent%20Withdrawal">${PRIVACY_EMAIL}</a></p>
          <p>You may write “DPDP Consent Withdrawal” in the subject line to help us process the request more quickly, but use of that exact subject line is not mandatory.</p>
          <p>Nirog Bhumi should also make an accessible privacy-request or consent-withdrawal mechanism available through its website where practicable.</p>
          <p>Withdrawal of consent will not invalidate processing lawfully undertaken before withdrawal. However, where particular personal or health information is necessary to assess, screen or administer your application, withdrawal may mean that Nirog Bhumi is unable to continue processing your application or permit your participation.</p>
        </section>

        <section>
          <h3>9. Grievance redressal</h3>
          <p><strong>Grievance Officer:</strong> Priyanshu Agarwal<br><strong>Email:</strong> <a href="mailto:${PRIVACY_EMAIL}?subject=DPDP%20Grievance">${PRIVACY_EMAIL}</a></p>
          <p>Privacy and data-protection complaints may be submitted through the contact channel above.</p>
          <p>Nirog Bhumi will acknowledge and address grievances in accordance with its published grievance process and within the timelines required under applicable law.</p>
          <p>Where applicable, and after first using Nirog Bhumi's available grievance-redressal mechanism as required by law, you may approach the Data Protection Board of India or any other competent authority having jurisdiction over the matter.</p>
        </section>
      </div>

      <footer class="dpdp-dialog-footer">
        <button type="button" data-close-dpdp>Close notice</button>
      </footer>
    </div>`;

  const bindReplacementCloseControls = dialog => {
    const close = () => {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    };

    dialog.querySelectorAll('[data-close-dpdp]').forEach(button => {
      button.addEventListener('click', close);
    });
  };

  const updatePrivacyLinks = () => {
    document.querySelectorAll('a[href*="nirogbhoomi.com"]').forEach(link => {
      const href = link.getAttribute('href') || '';
      link.setAttribute('href', href.replaceAll('priyanshu@nirogbhoomi.com', PRIVACY_EMAIL));
      if ((link.textContent || '').includes('priyanshu@nirogbhoomi.com')) {
        link.textContent = (link.textContent || '').replaceAll('priyanshu@nirogbhoomi.com', PRIVACY_EMAIL);
      }
    });

    document.querySelectorAll('[data-open-dpdp]').forEach(link => {
      link.setAttribute('href', '#dpdp-consent-dialog');
      link.textContent = 'DPDP Consent Notice and Privacy Policy';
    });
  };

  const updateNotice = () => {
    const dialog = document.querySelector('#dpdp-consent-dialog');
    if (!dialog) return;

    dialog.setAttribute('aria-labelledby', 'dpdp-dialog-title');
    dialog.innerHTML = privacyNoticeMarkup();
    bindReplacementCloseControls(dialog);
    updatePrivacyLinks();

    document.documentElement.classList.add('dpdp-consent-v12-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNotice, { once: true });
  } else {
    updateNotice();
  }
})();
