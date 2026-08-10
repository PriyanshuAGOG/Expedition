# Policy pages — internal revision ledger

This file is **not linked from, or rendered on, the live site**. It exists
only so anyone editing `/policies/*.html` or `/consent-withdrawal.html` has
a single place to record what changed in a document's `.policy-doc` content
and why, separate from the git history (which mixes markup/CSS changes with
substantive text changes).

Every page also carries an HTML comment between `</head>` and `<body>`
stating its current version number and source. Bump that comment's version
line in the same commit that adds an entry here.

Version format: `MAJOR.MINOR` — bump MAJOR for a substantive change to
obligations, pricing, deadlines or rights; bump MINOR for wording,
formatting or clarity fixes that don't change meaning.

---

## policies/accommodation-guide.html

### 1.0 — 2026-08-10 (initial publication)
Transcribed verbatim from Google Doc `1TM0LkMdm66IamaX7G1rxOP2WfVNvKfxk`, fetched 2026-08-10. No content changes from source.

## policies/programme-fee-payments.html

### 1.0 — 2026-08-10 (initial publication)
Transcribed verbatim from Google Doc `1uxxsg-4kPcXCUHLpgKnjrs5l2HhCOMnG`, fetched 2026-08-10. No content changes from source.

## policies/cancellation-refunds.html

### 1.0 — 2026-08-10 (initial publication)
Transcribed verbatim from Google Doc `1v5p1iGZgL8GJlNbmQa6OGIOfp6wBA6pl`, fetched 2026-08-10. No content changes from source.

## policies/participant-terms.html

### 1.0 — 2026-08-10 (initial publication)
Transcribed verbatim from Google Doc `1_xe24KYGIT_a7jCP7ndpNyUjoFLuTd_8`, fetched 2026-08-10. No content changes from source. The source document's physical signature block ("Participant name / Signature / Date / Emergency contact name & phone") is rendered as a blank reference table with a footnote explaining that the acknowledgment is captured as part of the application record, not as an interactive field on this page.

## policies/index.html

### 1.0 — 2026-08-10 (initial publication)
No source document — Nirog Bhumi-authored index page linking the four policies above plus the consent-withdrawal form and a pointer to the DPDP consent notice shown in the application form.

## consent-withdrawal.html

### 1.0 — 2026-08-10 (initial publication)
No source document — Nirog Bhumi-authored privacy-request form (access / correction / erasure / consent withdrawal / grievance / other), submitted to the `privacyRequests` Appwrite table for internal review.

## DPDP Consent Notice and Privacy Policy (feedback-content-v22-privacy.js, shown at the medical-consent step of the application form)

Not one of the four transcribed policy pages, but tracked here since it's the site's other privacy document.

### 1.3 — 2026-08-10
Before: "Nirog Bhumi should also make an accessible privacy-request or consent-withdrawal mechanism available through its website where practicable." (Section 8, aspirational — no such mechanism existed yet.)
After: "You can also submit an access, correction, erasure or consent-withdrawal request directly through our Privacy & Consent Withdrawal form." with a live link to `/consent-withdrawal.html`, now that the form exists.

### 1.2 — 2026-08-07
Prior version, not itself documented here (predates this changelog).
