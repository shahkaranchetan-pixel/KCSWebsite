// Module-level content for the Zoho Books Academy: slugs, titles and the original copy that
// makes each module page more than a slice of the hub. Lessons themselves are read from
// zoho-books-training.html by scripts/training-lib.js — do not duplicate them here.
//
// Every module page is /<slug> (flat, like the blog posts). A zoho-books-training/ directory
// would collide with zoho-books-training.html under Apache's extension stripping.
module.exports = [
  {
    n: 1, slug: 'zoho-books-training-getting-started', title: 'Getting Started &amp; Orientation',
    pageTitle: 'Zoho Books Getting Started Tutorial (India): Setup, GST, Chart of Accounts, Items | KC Shah',
    metaDescription: 'Free Zoho Books getting-started training for India: sign up, tour the interface, set up GSTIN and tax preferences, build the chart of accounts and item masters correctly.',
    intro: [
      'Most Zoho Books problems that surface in month six were created in hour one. An organisation set up with the wrong financial year, a GSTIN entered without the registration type, or item masters saved without HSN codes will produce returns that reconcile badly for years, and nobody connects the symptom to the cause. This module is the setup done properly, once.',
      'It is five lessons and just over an hour, and it is the only module we ask every new joiner to finish before they touch a live client file. The two long sessions (the guided tour and the item masters walkthrough) are the ones to watch at full attention; the three short clips are reference material you will come back to.'
    ],
    outcomes: ['Create an organisation with the right financial year, base currency and GST registration type', 'Navigate every module of the interface without hunting for menus', 'Build a chart of accounts that maps cleanly to Schedule III headings', 'Set up item masters so HSN-wise GSTR-1 reporting is accurate from the first invoice'],
    faqs: [
      ['Do I need to set up GST before creating my first invoice?', 'Yes. Zoho Books derives CGST/SGST versus IGST from the organisation GSTIN and the customer place of supply, so an invoice raised before GST settings are complete will carry the wrong tax split and will have to be voided, not edited. Finish lesson 1.3 before lesson 3.1.'],
      ['Should I import my old chart of accounts from Tally?', 'Usually not as-is. Tally groups and Zoho Books account types do not map one to one, and importing years of ledger names brings in duplicates and dormant accounts. Build the Zoho chart from the standard template, then add only the accounts you actively use. Lesson 2.4 covers the migration and cut-over in detail.'],
      ['The Items lesson is the Global edition. Does that matter for India?', 'The item workflow is identical across editions. The India-specific fields, HSN/SAC codes and tax preferences, are covered in lessons 1.3 and 6.1, and the notes on lesson 1.5 flag exactly where to look. Zoho has not re-shot the item masters session for India, so this is the current one.']
    ]
  },
  {
    n: 2, slug: 'zoho-books-training-configuration-settings', title: 'Configuration &amp; Settings',
    pageTitle: 'Zoho Books Configuration Training: Users, Roles, Opening Balances, Portals | KC Shah',
    metaDescription: 'Zoho Books settings training for India: users and roles, inviting your CA, the accountant toolkit, client and vendor portals, and a CA-written guide to opening balances and migration cut-over.',
    intro: [
      'This is the layer most teams skip because nothing visibly breaks when you do. Everyone is an admin, the accountant works inside the client login, opening balances are keyed from memory, and the vendor portal is never switched on. Each of those is a control weakness that an auditor will find later, and each takes minutes to fix now.',
      'The module pairs two official Zoho sessions on roles and collaboration with a reading lesson we wrote ourselves, because Zoho has no current video on opening balances and migration cut-over. That lesson is the one clients ask us about most; read it before you migrate anything.'
    ],
    outcomes: ['Assign roles so that staff, the CA and the client each see only what they should', 'Use the accountant toolkit for bulk corrections, locking and audit trail review', 'Switch on client and vendor portals so statements and payments stop coming by email', 'Enter opening balances from a finalised trial balance and prove the cut-over reconciles'],
    faqs: [
      ['What role should I give my CA in Zoho Books?', 'Invite them as an Accountant, not as an Admin. The accountant role gives full access to transactions, reports, journals and period locking without the ability to change organisation settings, delete the organisation or manage billing. Lesson 2.1 shows the invitation; lesson 2.2 shows what the role unlocks.'],
      ['When should the opening balance date be?', 'The day before your first live transaction in Zoho Books, and it should be a date on which you have a finalised trial balance from the old system. Mid-year cut-overs are fine if the trial balance is clean; a cut-over on a date with unreconciled bank balances is not. Lesson 2.4 walks through this decision.'],
      ['Can clients approve estimates through the portal?', 'Yes. The client portal lets customers view and accept estimates, view invoices and statements, and pay online where a payment gateway is connected. Lesson 2.3 covers both the client and the vendor portal, including what the vendor sees on the purchase order side.']
    ]
  },
  {
    n: 3, slug: 'zoho-books-training-sales-purchases-banking', title: 'Sales, Purchases &amp; Banking',
    pageTitle: 'Zoho Books Sales, Purchases & Bank Reconciliation Training (India) | KC Shah',
    metaDescription: 'Zoho Books training on the daily cycle: quote-to-cash receivables, the full accounts payable lifecycle with TDS, and bank feeds, matching and reconciliation. Three official India sessions.',
    intro: [
      'Three long official sessions, one each on receivables, payables and banking, that together cover what an accounts executive does all day. If a new joiner can only watch three hours of this course, these are the three hours. Everything in the later modules assumes you can raise an invoice, record a bill and match a bank line without help.',
      'The payables session in particular repays attention: it covers vendor creation with GSTIN auto-fetch, purchase orders, TDS on bills, vendor credits and approval workflows in one sitting, and several of the short clips in Modules 7 and 12 are drawn from the same ground.'
    ],
    outcomes: ['Run the full quote-to-cash cycle: estimate, sales order, invoice, payment, statement', 'Record bills with the right TDS section and pay them through connected banking', 'Match bank feed lines to existing transactions instead of creating duplicates', 'Complete a bank reconciliation that ties to the statement, every month'],
    faqs: [
      ['Should I categorise or match bank transactions?', 'Match first, categorise only when nothing exists to match. Categorising a line that already has an invoice or bill behind it creates a second transaction and overstates income or expense. Lesson 3.3 spends a good part of its running time on this distinction because it is the single most common reconciliation error we see.'],
      ['Does Zoho Books fetch vendor GSTINs automatically?', 'Yes. Enter the GSTIN on the vendor record and Zoho Books pulls the legal name, trade name and registration type from the GST portal. Lesson 3.2 shows the workflow. It does not validate that the vendor is filing returns; that check still belongs in your GSTR-2B reconciliation in Module 9.'],
      ['Is the banking lesson India-specific?', 'Lesson 3.3 is the current Global-edition reconciliation walkthrough, and the matching and reconciliation workflow is identical in the India edition. The India banking stack itself, ICICI and SBI connected banking, Bharat Connect and the local feed providers, is Module 12, with lesson 12.1 as the India-edition banking session.']
    ]
  },
  {
    n: 4, slug: 'zoho-books-training-expenses-journals', title: 'Expenses, Journals &amp; Adjustments',
    pageTitle: 'Zoho Books Expenses, Manual Journals, Fixed Assets & Year-End Training | KC Shah',
    metaDescription: 'Zoho Books training on everything that is not a sale or a bill: expenses, manual journals, fixed assets and depreciation, stock adjustments, and financial year-end closing.',
    intro: [
      'Sales and purchases are the transactions the software was designed around. This module is everything else: the reimbursement claim, the depreciation run, the stock write-off after a physical count, the year-end provision entry. These are the entries that separate a bookkeeping file from a set of books an auditor can sign.',
      'Two short clips cover the mechanics of expenses and journals. The three long sessions, on fixed assets, inventory and year-end, are where the accounting judgement lives, and the notes on each flag the decisions the video does not make for you.'
    ],
    outcomes: ['Record and reimburse expenses with the right GST treatment and ITC eligibility', 'Post manual journals that survive audit: narration, supporting document, reversal date', 'Run depreciation in the fixed asset register instead of a year-end spreadsheet', 'Close a financial year with provisions, accruals and a locked period'],
    faqs: [
      ['Can I claim ITC on expenses recorded in Zoho Books?', 'Only where the expense is eligible under section 16 of the CGST Act and the vendor invoice appears in your GSTR-2B. Zoho Books lets you mark an expense as ITC-eligible or blocked; lesson 4.1 shows the field, and our ITC guide linked from the lesson sets out which expenses are blocked under section 17(5).'],
      ['Does Zoho Books calculate depreciation under the Companies Act and the Income-tax Act?', 'The fixed asset module calculates book depreciation on the method and useful life you configure per asset class, which serves Companies Act Schedule II. Income-tax depreciation on the block-of-assets basis is a separate computation that most firms keep in the tax working papers. Lesson 4.3 covers what the module does and does not do.'],
      ['What should be locked at year-end?', 'The transaction period up to 31 March, after the audit adjustments are posted and before the return is filed. Lesson 4.5 covers the locking sequence, and lesson 2.2 covers the accountant tools used to make the last adjustments before the lock.']
    ]
  },
  {
    n: 5, slug: 'zoho-books-training-invoice-templates', title: 'Branding &amp; Templates',
    pageTitle: 'Zoho Books Invoice Template Customisation Training (India, GST-Compliant PDF) | KC Shah',
    metaDescription: 'Zoho Books training on customising PDF templates for invoices, estimates and purchase orders, and branding client emails, with a GST invoice field checklist.',
    extra: `<h2 id="checklist">The GST tax invoice field checklist</h2>
    <p>Before a customised template goes live, print one invoice from it and tick every row below. Rule 46 of the CGST Rules lists the particulars; Zoho Books carries all of them, but a template that hides a field hides it on every invoice you issue from then on.</p>
    <div class="table-scroll"><table class="deadline-table">
      <thead><tr><th>Particular</th><th>Where Zoho Books takes it from</th><th>Commonly dropped when</th></tr></thead>
      <tbody>
        <tr><td>Supplier name, address, GSTIN</td><td>Organisation profile</td><td>Branch GSTIN differs from head office and the template uses the wrong one</td></tr>
        <tr><td>Consecutive serial number, unique for the year</td><td>Transaction number series</td><td>Multiple series overlap after a mid-year reset</td></tr>
        <tr><td>Recipient name, address, GSTIN (if registered)</td><td>Customer record</td><td>Customer GSTIN left blank and the invoice files as B2C</td></tr>
        <tr><td>HSN or SAC per line</td><td>Item master</td><td>Item created in a hurry without HSN; template hides the column</td></tr>
        <tr><td>Description, quantity, unit, taxable value</td><td>Line items</td><td>Unit field removed to save space</td></tr>
        <tr><td>Rate and amount of CGST/SGST or IGST</td><td>Tax group applied</td><td>Template shows a single "GST" total instead of the split</td></tr>
        <tr><td>Place of supply, with state code</td><td>Customer or transaction place of supply</td><td>Removed as "clutter" &mdash; the single most common omission</td></tr>
        <tr><td>Reverse charge indicator</td><td>Transaction setting</td><td>Field not on the template at all</td></tr>
        <tr><td>Signature or digital signature</td><td>Template signature block</td><td>Emailed PDFs go out with no signature image</td></tr>
      </tbody>
    </table></div>
    <p class="table-note">Exports, SEZ supplies and supplies under bond need the relevant endorsement on the face of the invoice as well; keep a separate template for each rather than editing one by hand.</p>`,
    intro: [
      'Template work is treated as cosmetic, and then the auditor asks why the invoice does not carry the place of supply. The customisation lesson here is short, but the checklist attached to it is not: a GST tax invoice has a fixed list of mandatory fields, and a template that drops one of them produces non-compliant documents at scale.',
      'The primary lesson is the current English walkthrough; the same session is available in Hindi through the resources link for teams that prefer it. Together with the one-minute clip on email logos, that is the whole module.'
    ],
    outcomes: ['Customise PDF templates for every sales and purchase document type', 'Verify a template carries every mandatory GST invoice field before it goes live', 'Apply consistent branding across invoices, estimates, statements and emails', 'Keep separate templates for exports, SEZ supplies and bill of supply where required'],
    faqs: [
      ['Which fields must a GST tax invoice show?', 'Supplier name, address and GSTIN; a consecutive serial number; date; recipient name, address and GSTIN where registered; HSN or SAC per line; description, quantity and unit; taxable value; tax rate and amount split by CGST, SGST or IGST; place of supply; whether tax is payable on reverse charge; and a signature or digital signature. Lesson 6.2 walks through them; lesson 5.1 is where you check the template.'],
      ['Can I have different templates for different customers?', 'Yes. Zoho Books lets you set a default template per customer and choose a template per transaction, so export customers, SEZ units and domestic customers can each receive the correct document format without manual editing.'],
      ['Is there a Hindi version of the template lesson?', 'Yes. The Hindi walkthrough of the same customisation module is linked from the resources of lesson 5.1. It is an older recording, so the interface differs slightly, but the steps are the same.']
    ]
  },
  {
    n: 6, slug: 'zoho-books-training-gst-invoicing-eway-bill', title: 'GST-Compliant Sales &amp; Documents',
    pageTitle: 'Zoho Books GST Training: GST Invoice, E-Way Bill, Delivery Challan, Shipping Bill | KC Shah',
    metaDescription: 'Zoho Books GST training for India: the full GST overview session, GST invoice elements, e-way bill generation, delivery challans for job work, and shipping bill and bill of entry.',
    intro: [
      'This module is the GST layer on top of ordinary invoicing. It opens with the current official overview of GST in Zoho Books, then works through the documents that a GST-registered business issues besides the tax invoice: the e-way bill for movement of goods, the delivery challan for job work and stock transfers, and the shipping bill and bill of entry for exports and imports.',
      'The delivery challan lesson is a reading lesson we wrote, because Zoho has no video on job-work documentation and it is where manufacturing clients most often get a notice. Read it alongside the e-way bill lesson; the two documents travel together.'
    ],
    outcomes: ['Configure GST settings, tax rates and tax groups for a multi-rate business', 'Generate e-way bills from Zoho Books and handle cancellation and extension', 'Issue delivery challans for job work, stock transfers and goods sent on approval', 'Record export shipping bills and import bills of entry with the right GST treatment'],
    faqs: [
      ['When is an e-way bill required?', 'For movement of goods worth more than ₹50,000 in a single conveyance, with state-specific thresholds for intra-state movement. Zoho Books generates the bill from the invoice or delivery challan once the e-way bill portal is connected. Lesson 6.3 covers generation; the delivery challan lesson covers the job-work case where no invoice exists yet.'],
      ['Does a delivery challan replace a tax invoice for job work?', 'No. The challan accompanies goods sent to the job worker under section 143 and must be returned within one year for inputs or three years for capital goods; the invoice is raised on the job-work charges. Lesson 6.4 explains both documents and what happens when the time limit is missed.'],
      ['Are the older GST clips still accurate?', 'The e-way bill and GST invoice clips predate several rate and portal changes, so use them for the workflow and the field checklist and take current rates and thresholds from lesson 6.1, which is the October 2025 session. Every lesson note on this page flags what has moved.']
    ]
  },
  {
    n: 7, slug: 'zoho-books-training-credit-notes-tds', title: 'Returns, Credit Notes &amp; TDS',
    pageTitle: 'Zoho Books Credit Notes, Vendor Credits & TDS Training (India) | KC Shah',
    metaDescription: 'Zoho Books training on sales and purchase returns, credit notes and vendor credits with their GST consequences, TDS liabilities and challans, and a CA-written note on TDS, TCS and Form 26AS reconciliation.',
    intro: [
      'Returns and deductions are where the books and the returns start to disagree. A credit note booked after the statutory window does not reverse output tax; a vendor credit with no matching supplier credit note in GSTR-2B leaves an ITC reversal hanging; a TDS payable ledger that never moves means challans are being paid from a spreadsheet. This module is those three mechanisms, done so they reconcile.',
      'Three short official clips cover the mechanics. The reading lesson on TDS and TCS is ours, and it was corrected in September 2026 to reflect the omission of TCS on sale of goods, which most Zoho Books files still have switched on. The optional tax spotlight at the end is consolidation viewing, not a prerequisite.'
    ],
    outcomes: ['Issue credit notes for returns, rate differences and post-supply discounts within the GST time limit', 'Record vendor credits and reverse the matching input tax credit in the same period', 'Tag TDS sections on bills, track the liability and record challans so the ledger matches the quarterly return', 'Reconcile TDS receivable against Form 26AS and the AIS every quarter, not at filing time'],
    faqs: [
      ['Is TCS on sale of goods still applicable?', 'No. Section 206C(1H) was omitted with effect from 1 April 2025 and has no counterpart in the Income-tax Act, 2025. The buyer-side TDS on purchase of goods, section 393(1) [Table: Sl. No. 8(ii)], erstwhile 194Q, is unchanged. Lesson 7.4 explains what to switch off in Zoho Books and what to do if it was collected after April 2025.'],
      ['What is the time limit for a GST credit note?', 'A credit note reducing output tax must be declared in the return for the month of November following the end of the financial year in which the supply was made, or the date of filing the annual return, whichever is earlier. After that it can still be issued commercially but no longer adjusts tax. Lesson 7.1 flags the date check.'],
      ['How do I record TDS my customer deducted from my invoice?', 'Record the receipt for the net amount and post the deducted tax to a TDS Receivable asset ledger so the invoice closes fully. Do not write the shortfall off as a discount. Lesson 7.4 covers the entry and the quarterly reconciliation to Form 26AS.']
    ]
  },
  {
    n: 8, slug: 'zoho-books-training-e-invoicing', title: 'E-Invoicing',
    pageTitle: 'Zoho Books E-Invoicing Training: IRP Setup, IRN Generation & Cancellation (India) | KC Shah',
    metaDescription: 'Zoho Books e-invoicing training for India: registering on the IRP, connecting the portal, generating and cancelling IRNs, QR codes, bulk generation and handling rejections, from the current official session.',
    extra: `<h2 id="go-live">Before you switch e-invoicing on for a client</h2>
    <p>The session covers the mechanics. This is the order we go through with every client before the first live IRN, because almost every rejection traces back to master data rather than to the portal.</p>
    <ol>
      <li><strong>Confirm applicability on the portal, not from memory.</strong> The turnover threshold has been lowered several times and is tested against every financial year from 2017-18. Check the GSTIN on the e-invoice portal's enablement search; if it is enabled, e-invoicing is mandatory whether or not the client thinks they are below the threshold.</li>
      <li><strong>Register the GSTIN on the IRP and generate API credentials for Zoho as the GSP.</strong> Use the client's own portal login; do not register through a third-party account you do not control.</li>
      <li><strong>Clean the masters that the IRP validates.</strong> Every customer needs a valid GSTIN and a six-digit pin code that matches their state code; every item needs an HSN of at least six digits for goods above the turnover limit; the organisation address needs the pin code the IRP expects. These are the three fields behind the majority of rejections.</li>
      <li><strong>Run three invoices in the sandbox.</strong> One B2B intra-state, one inter-state, one export or SEZ if the client has them. Fix whatever rejects, then repeat until all three pass.</li>
      <li><strong>Agree the cancellation rule with the client.</strong> An IRN can be cancelled only within 24 hours. After that the correction is a credit note, which means the client's staff have to stop editing invoices after sending, which is a habit change, not a software setting.</li>
      <li><strong>Check the reporting window.</strong> Larger taxpayers must report invoices to the IRP within a fixed number of days of the invoice date. If the client back-dates invoices at month-end, e-invoicing will expose it.</li>
    </ol>
    <h2 id="rejections">Reading a rejection</h2>
    <p>Rejections come back with a numeric error code and a short message. The ones you will see most are a duplicate IRN (the invoice was already reported, usually after a retry), an invalid recipient GSTIN (cancelled or mistyped), a pin code that does not match the state, an HSN that is not in the master, and a tax split that does not match the place of supply. In each case the fix is in the customer or item record, not on the invoice; correct the master, then regenerate. Lesson 8.1 walks through several of these live.</p>`,
    intro: [
      'E-invoicing is mandatory above a turnover threshold that has been lowered repeatedly, and the reporting window for an IRN has been tightened for larger taxpayers. Both move by notification, so the lesson here teaches the mechanism and the notes tell you what to verify on the portal for a specific client before configuring anything.',
      'The module is a single, current official session that covers setup, generation, cancellation and troubleshooting end to end. The older sandbox clip is linked from its resources for anyone who wants to test in the sandbox first.'
    ],
    outcomes: ['Register the GSTIN on the IRP and connect Zoho Books as the GSP', 'Generate IRNs and QR codes on invoices, credit notes and debit notes', 'Cancel an IRN within the 24-hour window and handle amendments after it', 'Diagnose the common rejection codes and fix the underlying master data'],
    faqs: [
      ['Who must generate e-invoices?', 'Registered persons whose aggregate turnover in any financial year from 2017-18 onwards exceeded the notified threshold, for B2B supplies, exports and supplies to SEZ. The threshold has been reduced in stages; check the current notification for your client rather than relying on the figure in any video. The lesson notes say where to look.'],
      ['Can an e-invoice be edited after the IRN is generated?', 'No. An IRN can be cancelled within 24 hours of generation and a fresh invoice issued. After 24 hours the invoice can only be corrected through a credit or debit note. Lesson 8.1 covers cancellation and the amendment route.'],
      ['Do I need the sandbox?', 'It helps the first time a client goes live, because master data errors, a wrong pin code or a missing HSN, show up as rejections in the sandbox instead of on a live invoice. The sandbox clip is in the lesson 8.1 resources.']
    ]
  },
  {
    n: 9, slug: 'zoho-books-training-gst-return-filing', title: 'GST Return Filing',
    pageTitle: 'Zoho Books GST Return Filing Training: GSTR-1, GSTR-2B, GSTR-3B, GSTR-9, IMS | KC Shah',
    metaDescription: 'Zoho Books GST return filing training: the four-part GSTR masterclass on GSTR-1, GSTR-2B reconciliation, GSTR-3B and GSTR-9, plus the Invoice Management System and GSTR-6 for ISDs.',
    intro: [
      'Filing from Zoho Books removes the re-keying, not the judgement. The GSTR-1 still has to be reviewed for B2B versus B2C classification, the 2B reconciliation still has to decide what to do with a supplier who has not filed, and the 3B still has to be tied to the books before it is submitted. This module is the four-part official masterclass on exactly those decisions, followed by the two newer mechanisms, IMS and ISD distribution, that changed the reconciliation workflow after it was recorded.',
      'Watch the four masterclass sessions in order. Then watch IMS, because since October 2024 the accept, reject and pending actions in IMS are what determine your 2B, and the reconciliation lesson predates it.'
    ],
    outcomes: ['Push GSTR-1 from Zoho Books and review the summary before filing', 'Reconcile GSTR-2B against purchase bills and act on mismatches in IMS', 'Prepare GSTR-3B that ties to the books and to the reconciled 2B', 'Compile GSTR-9 from the year\'s returns and explain every difference to the financials'],
    faqs: [
      ['Does Zoho Books file GST returns directly?', 'Yes. Once the GSTN connection is authorised, GSTR-1 and GSTR-3B can be pushed and filed from inside Zoho Books, and GSTR-2B is pulled in for reconciliation. The annual GSTR-9 is prepared from the filed returns and submitted on the portal. Lessons 9.1 to 9.4 cover each return.'],
      ['What is the Invoice Management System and does it change the 2B lesson?', 'IMS, live since October 2024, lets you accept, reject or keep pending each supplier invoice before GSTR-2B is generated, so 2B now reflects your actions rather than only the supplier\'s filing. Lesson 9.5 covers IMS inside Zoho Books; the 2B reconciliation in lesson 9.2 is still the right method, applied to the IMS-adjusted 2B.'],
      ['Can a missed GST return be filed years later?', 'Not any more. Since 1 October 2025, a return cannot be filed once three years have passed from its due date. Our late-filing penalties guide, linked from the lessons, sets out the bar and what it means for unreconciled liabilities.']
    ]
  },
  {
    n: 10, slug: 'zoho-books-training-reports', title: 'Reports Masterclass',
    pageTitle: 'Zoho Books Reports Training: Twelve-Session Masterclass on Reporting & Analytics (India) | KC Shah',
    metaDescription: 'Zoho Books reports training: the official India-edition masterclass on business overview, receivables and payables, inventory, multi-currency, budgets, tax and GST reports, plus the 2026 reporting refresh.',
    intro: [
      'This is the longest module in the course and the one most people skip, which is why so many Zoho Books files are used as a billing system with a bank feed rather than as a set of management accounts. The eleven-part official masterclass goes report family by report family; the 2026 refresh session at the end shows the reporting interface as it is today.',
      'Start with the 2026 refresh for orientation, then go into the masterclass for depth on whichever report family you need. The notes distinguish the two sessions that overlap most, session 9 on tax reports and session 10 on the GSTR family, and point session 5 back to the inventory workflow in Module 4.'
    ],
    outcomes: ['Configure report settings, comparison periods and custom report views', 'Read receivables and payables ageing and act on it before month-end', 'Run inventory valuation and movement reports that agree to the stock adjustments', 'Use the tax and GST report families to reconcile returns to the books'],
    faqs: [
      ['Which lesson should I watch first in this module?', 'Lesson 10.12, the 2026 reports and analytics refresh. It is the current interface. The eleven masterclass sessions were recorded in 2023 and 2024 and go deeper on each report family, so use them for depth after orientation rather than for orientation itself.'],
      ['Can Zoho Books produce Schedule III financial statements?', 'It produces a profit and loss, balance sheet and cash flow on its own layout, with account grouping you control through the chart of accounts. Schedule III presentation is a mapping exercise on top of that, which is why Module 1 stresses building the chart of accounts to Schedule III headings from the start.'],
      ['Are the report sessions India-specific?', 'Yes, all twelve are India-edition recordings. Session 9 covers TDS and TCS reporting and session 10 covers every GSTR-related report; neither exists in the Global-edition series.']
    ]
  },
  {
    n: 11, slug: 'zoho-books-training-projects-time-tracking', title: 'Projects &amp; Time Tracking',
    pageTitle: 'Zoho Books Projects, Timesheets & Progress Invoicing Training | KC Shah',
    metaDescription: 'Zoho Books project accounting training: projects and timesheets, billable hours to invoice, project profitability, revenue recognition and progress invoicing, and the Zoho Projects integration.',
    intro: [
      'Any firm that bills by the hour or by milestone, consulting, architecture, software services, a CA practice, has the same accounting problem: work is done in one period and billed in another, and nobody knows whether a given engagement made money. Zoho Books\' project module exists to answer that, and this module is how to use it.',
      'The current projects-and-timesheets lesson is the primary one. The longer 2025 project accounting webinar is marked optional because it covers the same ground at greater depth; go there when you need profitability reporting or multi-project cost allocation. The revenue recognition session is a global partner webinar, and its five-step model maps directly onto Ind AS 115.'
    ],
    outcomes: ['Set up projects with tasks, budgets and per-user billing rates', 'Log timesheets and convert billable hours and expenses into invoices', 'Issue progress invoices against milestones and track unbilled revenue', 'Read project profitability reports and reallocate cost where they show a loss'],
    faqs: [
      ['Can staff log time without full Zoho Books access?', 'Yes. A timesheet-only user role lets staff log hours against projects and tasks without seeing invoices, bills or reports. Lesson 11.1 covers project setup and timesheets; lesson 2.1 covers the roles.'],
      ['How does progress invoicing handle revenue recognition?', 'Progress invoices bill a percentage or milestone of the project value as work completes, and the unbilled and deferred revenue positions fall out of the project reports. Lesson 11.3 walks through the five-step model, which is the same framework Ind AS 115 uses for percentage-of-completion.'],
      ['Do I need Zoho Projects as well?', 'Not for time tracking and billing; Zoho Books does that on its own. Zoho Projects adds task management, Gantt views and team collaboration, and lesson 11.4 shows how the two sync so that time logged in Projects flows to Books for invoicing.']
    ]
  },
  {
    n: 12, slug: 'zoho-books-training-banking-payments', title: 'Banking, Payments &amp; Approvals',
    pageTitle: 'Zoho Books Banking Training: ICICI & SBI Connected Banking, Bharat Connect, Approvals | KC Shah',
    metaDescription: 'Zoho Books India banking training: the full banking session, ICICI and SBI connected banking, Bharat Connect, payment reminders, transaction approvals and mobile banking.',
    intro: [
      'Module 3 taught bank reconciliation. This module is the India banking stack that makes reconciliation nearly automatic: live feeds and payment initiation through ICICI and SBI connected banking, vendor payments through Bharat Connect, reminders that chase receivables without a phone call, and the approval workflow that stops a payment leaving the bank before someone senior has looked at it.',
      'The opening session is the India-edition banking deep-dive. Connected banking is taught on ICICI, with the SBI walkthrough linked from the same lesson because the steps are identical. The short clips on reminders and approvals are drawn from the same ground as the long payables session in Module 3.'
    ],
    outcomes: ['Connect ICICI or SBI for live feeds and pay vendors from inside Zoho Books', 'Set up Bharat Connect for biller payments and reconciliation', 'Configure payment reminder schedules that escalate without manual chasing', 'Put multi-level approval on bills and payments above a threshold'],
    faqs: [
      ['Which banks offer connected banking with Zoho Books in India?', 'ICICI Bank and State Bank of India support direct integration for feeds and payment initiation, and a wider set of banks provide automated feeds through Zoho\'s feed partners. Lesson 12.2 covers the ICICI and SBI setup; lesson 12.1 covers feeds for other banks.'],
      ['Can payments be approved by someone other than the person who created the bill?', 'Yes. Transaction approval lets you require one or more approvers for bills, payments and other transactions, optionally only above an amount. Lesson 12.5 shows the configuration; the segregation it creates is what an auditor will look for in a small team.'],
      ['Is the mobile banking lesson relevant to India?', 'The workflow is, though the recording is the Global-edition iOS app, so some screens differ. It covers matching and reconciling from a phone, which is what an owner on the move actually does. The notes on lesson 12.6 flag the differences.']
    ]
  },
  {
    n: 13, slug: 'zoho-books-training-customisation-automation', title: 'Customisation &amp; Automation',
    pageTitle: 'Zoho Books Customisation & Automation Training: Custom Fields, Workflows, MCP & AI | KC Shah',
    metaDescription: 'Zoho Books customisation and automation training: custom fields and views, workflow rules and automation, custom dashboards, AI and MCP integration, and building a custom extension.',
    intro: [
      'The first twelve modules are Zoho Books as shipped. This one is Zoho Books bent to your firm\'s workflow: custom fields that capture what your industry needs on every invoice, workflow rules that send the reminder or block the discount automatically, dashboards built for the owner rather than the accountant, and the 2026 session on connecting AI tools to Zoho Books through the Model Context Protocol.',
      'Watch the customisation session before the automation session; a workflow rule is only as good as the fields it can read. The custom dashboard clip is a subset of the customisation session, kept as a quick reference. The MCP session is the newest recording in the course and describes where the product is going.'
    ],
    outcomes: ['Add custom fields, views and validation rules per module', 'Write workflow rules that automate reminders, approvals and field updates', 'Build a custom dashboard for the metrics the owner actually watches', 'Understand what MCP lets an AI assistant do inside Zoho Books, and what it should not'],
    faqs: [
      ['Do I need to code to automate Zoho Books?', 'No for most needs. Workflow rules, custom buttons and scheduled actions are configured in the interface. Custom functions in Deluge and custom extensions, covered in lessons 13.2 and 13.5, are for logic the rules cannot express.'],
      ['What is MCP in Zoho Books?', 'The Model Context Protocol is an open standard that lets AI assistants call Zoho Books as a tool, reading records and, with permission, creating transactions. Lesson 13.4 is Zoho\'s 2026 session on it. Treat write access the way you would treat a new staff member: scoped, approved and reviewed.'],
      ['Can workflow rules enforce controls?', 'Yes, within limits. A rule can block a transaction whose field values fail validation, route it for approval, or alert someone. It cannot replace the approval workflow in Module 12 for payments, and it runs only on the events Zoho Books exposes. Lesson 13.2 sets out what is and is not possible.']
    ]
  }
];
