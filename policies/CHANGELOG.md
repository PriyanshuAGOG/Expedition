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

## policies/food-meal-arrangements.html

### 1.0 — 2026-08-11 (initial publication)
Built from Google Drive Doc `10KrpTpTV9cdGfzQGdrVVgmzEmg-xm8DK`, fetched 2026-08-11, authored directly in this house style rather than transcribed-then-revised (unlike the original four policy pages). No substantive content was added, removed or changed from the source. Formatting adaptations: the "Meal Coverage at a Glance" list rendered as a `.policy-doc-table-wrap` table; the emergency-glucose (honey) guidance split into a `.policy-callout` plus supporting paragraphs. No applicability meta (that pattern was retired sitewide before this page was built). Closing "This document should be read together with..." line replaced with the standard cross-policy statement, and the source's raw Google Drive cross-links replaced with the canonical 6-card related-policy nav used on every other policy page.

## policies/travel-guidelines.html

### 1.0 — 2026-08-11 (initial publication)
Built from Google Drive Doc `1R11t-hvpMDrxr526JnYHYzNnI52_Z0qr`, fetched 2026-08-11, authored directly in this house style rather than transcribed-then-revised. No substantive content was added, removed or changed from the source. Formatting adaptations: the pickup-details block (date/time/location/distance/journey time) rendered as a table; "Important notes" reorganised into `<h3>` subsections with an `.policy-callout` for the Indiahikes Shield paragraph. Terminology: "Trek Partner" normalized to "trek partner/vendor"; dates normalized from "November 13, 2026" style to this site's "13 November 2026" style throughout; "ie," corrected to "i.e.,". No applicability meta. Closing "read together with" line replaced with the standard cross-policy statement and the canonical 6-card related-policy nav.

## Canonical policy-card set — 2026-08-11 ripple update
Adding the two pages above grew the canonical related-policy card set from 5 to 7 (Participant Terms, Programme Fee & Payments, Cancellation Refunds & Changes, Accommodation Guide, Food & Meal Arrangements, Travel Guidelines, Privacy & Consent Withdrawal). Every existing page's related-policy nav and the All Policies hub grid were updated to include the two new cards (each page excludes its own card, per the existing convention); participant-terms.html §11's previously plain-text "Travel Guide"/"Food Guide" bullets are now real links to the new pages, per the standing instruction to incorporate Travel/Food policies into every location that lists the complete policy set once those pages existed. See each page's own 1.2 entry below and its in-page version comment for the specific diff.

## policies/accommodation-guide.html

### 1.2 — 2026-08-11
Added Food & Meal Arrangements and Travel Guidelines to the related-policy cards now that those pages exist.

### 1.1 — 2026-08-11
Website content revision — no longer a verbatim transcription of the source, see the in-page version comment for the full list. Removed the "Applies to all confirmed participants" applicability meta; the Gui (14 Nov) row's "What to expect" text now reads "Two trekkers per tent. Toilet tents are used at trekking campsites." to match the Chilapada/Nayata rows (previously "Campsite accommodation in the mountains."); added the standard cross-policy closing statement (this page had none before); "Read together with" heading and its 3-card related-policy nav replaced with "Read the policies in accordance with" and the full 4-card canonical set (now including Privacy & Consent Withdrawal, and matching the All Policies hub cards word-for-word); removed the public Apply footer link.

### 1.0 — 2026-08-10 (initial publication)
Transcribed verbatim from Google Doc `1TM0LkMdm66IamaX7G1rxOP2WfVNvKfxk`, fetched 2026-08-10. No content changes from source.

## policies/programme-fee-payments.html

### 1.2 — 2026-08-11
Added Food & Meal Arrangements and Travel Guidelines to the related-policy cards now that those pages exist.

### 1.1 — 2026-08-11
Website content revision — no longer a verbatim transcription of the source, see the in-page version comment for the full list. Two-line hero title ("Programme" / green-italic "Fee & Payments."); removed the applicability meta; hero subtext now opens "Payable in two installments."; "trek partner" normalized to "trek partner/vendor" throughout (heading, body, footnote); the two evacuation/early-descent cost bullets in §4 now use definite "shall" instead of "may" for participant-borne costs; closing statement normalized to the standard cross-policy statement (partner/vendor-rates sentence kept as a second sentence); "Read together with" replaced with "Read the policies in accordance with" and its cards now match the All Policies hub cards exactly, including the full 4-card canonical set; removed the public Apply footer link. Programme pricing figures (₹30,000 / ₹19,500 / ₹49,500) in the body are unchanged — the ₹49,500 removal applies only to the All Policies hub card summary, not this substantive page.

## policies/cancellation-refunds.html

### 1.2 — 2026-08-11
Added Food & Meal Arrangements and Travel Guidelines to the related-policy cards now that those pages exist.

### 1.1 — 2026-08-11
Website content revision — no longer a verbatim transcription of the source, see the in-page version comment for the full list. Removed the applicability meta; financial Stage 1/Stage 2 references throughout now say "fee"/"fees" where they mean the payment, not the programme phase (§1, §3, §4.2, §13); §2.2 no longer calls the Stage 1 fee "generally" non-refundable; §2.3 now states a proportionate refund "shall be" payable for undelivered services; §3's intro parenthetical changed to "subject to any revisions by Indiahikes"; also fixed a pre-existing grammar error ("Stage 2 fees has been paid" → "the Stage 2 fee has been paid"); the Indiahikes cancellation table's third timing row (20 days or less before Day 1, or no-show) and third column (trek-fee-component explainer) were removed, leaving a two-row, two-column table; the "Important" callout below that table was removed; §5 and §6 use definite "shall" instead of "may" for participant-borne return-logistics costs; closing statement normalized to the standard cross-policy statement; "Read together with" replaced with "Read the policies in accordance with" and its cards now match the All Policies hub cards exactly, including the full 4-card canonical set; removed the public Apply footer link.

### 1.0 — 2026-08-10 (initial publication)
Transcribed verbatim from Google Doc `1uxxsg-4kPcXCUHLpgKnjrs5l2HhCOMnG`, fetched 2026-08-10. No content changes from source.

## policies/participant-terms.html

### 1.2 — 2026-08-11
Added Food & Meal Arrangements and Travel Guidelines to the related-policy cards now that those pages exist, and linked §11's previously plain-text "Travel Guide"/"Food Guide" bullets to those new pages.

### 1.1 — 2026-08-11
Website content revision — no longer a verbatim transcription of the source, see the in-page version comment for the full list. Two-line hero title ("Participant" / green-italic "Terms & Conditions."); removed the applicability meta; removed legacy "participant pack" terminology throughout (hero copy, §5, §10, §11 heading, both instances of "trek partner" → "trek partner/vendor"); §5 now reads "these terms, other policies, and the Indiahikes trek terms"; §7 references "these Participant Terms & Conditions" instead of "these participant terms"; §8's cost-bearing sentence changed from "may also have to bear" to "shall also bear"; §9 splits the personal-belongings sentence into its own paragraph, separate from the emergency-cost paragraph, which now leads with "Emergency rescue, evacuation..."; §10 references "the Nirog Bhumi policies"; §11 retitled "Related Policies and Documents"; removed the Participant Acknowledgement block and its associated footnote (the acknowledgement is captured as part of the application record, not this page — that fact is now unnecessary on the page since the block itself is gone); closing statement replaced with the standard cross-policy statement; "Read together with" replaced with "Read the policies in accordance with" and its cards now match the All Policies hub cards exactly, including the full 4-card canonical set; removed the public Apply footer link; corrected the meta description to drop "participant pack" phrasing. Searched for "Before the trek, make the second payment"-type copy per the brief; none was present on this page.

### 1.0 — 2026-08-10 (initial publication)
Transcribed verbatim from Google Doc `1_xe24KYGIT_a7jCP7ndpNyUjoFLuTd_8`, fetched 2026-08-10. No content changes from source. The source document's physical signature block ("Participant name / Signature / Date / Emergency contact name & phone") is rendered as a blank reference table with a footnote explaining that the acknowledgment is captured as part of the application record, not as an interactive field on this page.

## policies/index.html

### 1.2 — 2026-08-11
Added Food & Meal Arrangements (Policy 5) and Travel Guidelines (Policy 6) cards to the hub grid — the canonical card set every other page's related-policy nav reuses.

### 1.1 — 2026-08-11
Removed the applicability meta; hero intro rewritten to drop "documents that form your participant pack" (now "Our policies and guidelines — accommodation, fees and payments, ..."); the Participant Terms card description no longer says "the documents that form the participant pack"; the Programme Fee & Payments card description no longer states the ₹49,500 figure (the fee guide itself is unaffected); removed the "Looking for the Data Privacy notice you saw while applying?" note box entirely, including its "Questions about any of these documents" paragraph and its `/apply.html` link; removed the public Apply footer link. This page's 5-card grid is now the canonical card set every other policy page's related-policy nav reuses verbatim.

### 1.0 — 2026-08-10 (initial publication)
No source document — Nirog Bhumi-authored index page linking the four policies above plus the consent-withdrawal form and a pointer to the DPDP consent notice shown in the application form.

## consent-withdrawal.html

### 1.2 — 2026-08-11
Added Food & Meal Arrangements and Travel Guidelines to the related-policy cards now that those pages exist.

### 1.1 — 2026-08-11
Hero paragraph fully replaced (not merged) with clearer withdrawal-of-consent language covering lawful prior processing and the application-processing caveat; removed the DPDP explanatory paragraph above the form (`.policy-form-wrap`'s intro `<p>`) — that notice already lives at the application form's medical-consent step and in Participant Terms & Conditions §6, and its removal leaves no blank spacing since the form itself carries the box's padding; removed the public "Application Form" related-policy card, since the application route isn't publicly surfaced for now; "Read together with" replaced with "Read the policies in accordance with" and its remaining cards now match the All Policies hub cards exactly (Participant Terms, Programme Fee & Payments, Cancellation Refunds & Changes, Accommodation Guide — Privacy excluded since this is that page); removed the public Apply footer link. Also fixed a UI bug unrelated to page copy: native `<select>` `<option>` elements for the "Request type" field had no explicit background/text color and could render unreadable (e.g. white-on-white) depending on platform — added explicit dark-background/cream-text colors in `assets/policies.css`. The "Reviewed by our team directly" / "Response by email" hero meta is untouched (it isn't the "Applies to all confirmed participants" text this pass targeted elsewhere).

### 1.0 — 2026-08-10 (initial publication)
No source document — Nirog Bhumi-authored privacy-request form (access / correction / erasure / consent withdrawal / grievance / other), submitted to the `privacyRequests` Appwrite table for internal review.

## DPDP Consent Notice and Privacy Policy (feedback-content-v22-privacy.js, shown at the medical-consent step of the application form)

Not one of the four transcribed policy pages, but tracked here since it's the site's other privacy document.

### 1.3 — 2026-08-10
Before: "Nirog Bhumi should also make an accessible privacy-request or consent-withdrawal mechanism available through its website where practicable." (Section 8, aspirational — no such mechanism existed yet.)
After: "You can also submit an access, correction, erasure or consent-withdrawal request directly through our Privacy & Consent Withdrawal form." with a live link to `/consent-withdrawal.html`, now that the form exists.

### 1.2 — 2026-08-07
Prior version, not itself documented here (predates this changelog).
