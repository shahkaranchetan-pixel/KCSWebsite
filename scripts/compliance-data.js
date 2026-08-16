/* Compliance calendar dataset - FY 2026-27.
   SINGLE SOURCE OF TRUTH. Edit due dates here, then run:
     node scripts/build-compliance-calendar.js
   That regenerates the table baked into tools/compliance-calendar.html and all
   13 static month pages. Do not edit the generated markup by hand. */

const MONTH_INFO = {
  apr_26: { name: 'April 2026',     short: "Apr '26", order: 1,  days: 30, y: 2026, m: 4  },
  may_26: { name: 'May 2026',       short: "May '26", order: 2,  days: 31, y: 2026, m: 5  },
  jun_26: { name: 'June 2026',      short: "Jun '26", order: 3,  days: 30, y: 2026, m: 6  },
  jul_26: { name: 'July 2026',      short: "Jul '26", order: 4,  days: 31, y: 2026, m: 7  },
  aug_26: { name: 'August 2026',    short: "Aug '26", order: 5,  days: 31, y: 2026, m: 8  },
  sep_26: { name: 'September 2026', short: "Sep '26", order: 6,  days: 30, y: 2026, m: 9  },
  oct_26: { name: 'October 2026',   short: "Oct '26", order: 7,  days: 31, y: 2026, m: 10 },
  nov_26: { name: 'November 2026',  short: "Nov '26", order: 8,  days: 30, y: 2026, m: 11 },
  dec_26: { name: 'December 2026',  short: "Dec '26", order: 9,  days: 31, y: 2026, m: 12 },
  jan_27: { name: 'January 2027',   short: "Jan '27", order: 10, days: 31, y: 2027, m: 1  },
  feb_27: { name: 'February 2027',  short: "Feb '27", order: 11, days: 28, y: 2027, m: 2  },
  mar_27: { name: 'March 2027',     short: "Mar '27", order: 12, days: 31, y: 2027, m: 3  },
  apr_27: { name: 'April 2027',     short: "Apr '27", order: 13, days: 30, y: 2027, m: 4  }
};

const PREV_MONTH_NAME = {
  apr_26: 'Mar 2026', may_26: 'Apr 2026', jun_26: 'May 2026', jul_26: 'Jun 2026',
  aug_26: 'Jul 2026', sep_26: 'Aug 2026', oct_26: 'Sep 2026', nov_26: 'Oct 2026',
  dec_26: 'Nov 2026', jan_27: 'Dec 2026', feb_27: 'Jan 2027', mar_27: 'Feb 2027',
  apr_27: 'Mar 2027'
};

const RAW_COMPLIANCES = [
  // -------- APRIL 2025 --------
  { month:'apr_26', day:7,  cat:'tds', period:'Mar 2026', title:'TCS Payment', tag:'TCS Collectors' },
  { month:'apr_26', day:13, cat:'gst', sub:'qrmp', period:'Q4 FY 25-26', title:'GSTR-1 / IFF (QRMP)', tag:'QRMP Taxpayers' },
  { month:'apr_26', day:18, cat:'gst', sub:'comp', period:'Q4 FY 25-26', title:'CMP-08 (Composition)', tag:'Composition Dealers' },
  { month:'apr_26', day:22, cat:'gst', sub:'qrmp', period:'Q4 FY 25-26', title:'GSTR-3B QRMP - Group A', tag:'MH, Guj, Kar, TN, AP &c.' },
  { month:'apr_26', day:24, cat:'gst', sub:'qrmp', period:'Q4 FY 25-26', title:'GSTR-3B QRMP - Group B', tag:'Delhi, UP, WB, Pun &c.' },
  { month:'apr_26', day:30, cat:'tds', period:'Mar 2026', title:'TDS Payment for March (extended)', tag:'All Deductors' },
  { month:'apr_26', day:30, cat:'roc', period:'Oct \'24 - Mar \'26', title:'Form MSME-1 (Half-Yearly)', tag:'Companies' },
  { month:'apr_26', day:30, cat:'gst', sub:'comp', period:'FY 2025-26', title:'GSTR-4 (Composition Annual)', tag:'Composition Dealers' },

  // -------- MAY 2025 --------
  { month:'may_26', day:11, cat:'pay', period:'Oct \'24 - Mar \'26', title:'ESIC Half-Yearly Return', tag:'Employers (>=10)' },
  { month:'may_26', day:15, cat:'tds', period:'Q4 FY 25-26', title:'Form 16A (TDS Certificate)', tag:'All Deductors' },
  { month:'may_26', day:15, cat:'tds', period:'Q4 FY 25-26', title:'TCS Return - Form 27EQ', tag:'TCS Collectors' },
  { month:'may_26', day:25, cat:'gst', sub:'qrmp', period:'Apr 2026', title:'PMT-06 (QRMP Tax Payment)', tag:'QRMP Taxpayers' },
  { month:'may_26', day:30, cat:'roc', period:'FY 2025-26', title:'Form 11 - LLP Annual Return', tag:'LLP' },
  { month:'may_26', day:30, cat:'roc', period:'Oct \'24 - Mar \'26', title:'PAS-6 (Half-Yearly)', tag:'Unlisted Public Cos' },
  { month:'may_26', day:31, cat:'tds', period:'Q4 FY 25-26', title:'TDS Return (24Q / 26Q / 27Q)', tag:'All Deductors' },

  // -------- JUNE 2025 --------
  { month:'jun_26', day:15, cat:'it',  period:'FY 2026-27', title:'Advance Tax - Q1 (15%)', tag:'All Assessees' },
  { month:'jun_26', day:15, cat:'tds', period:'FY 2025-26', title:'Form 16 (Salary TDS Certificate)', tag:'Employers' },
  { month:'jun_26', day:25, cat:'gst', sub:'qrmp', period:'May 2026', title:'PMT-06 (QRMP Tax Payment)', tag:'QRMP Taxpayers' },
  { month:'jun_26', day:30, cat:'roc', period:'FY 2025-26', title:'DPT-3 (Return of Deposits)', tag:'Companies' },
  { month:'jun_26', day:30, cat:'pay', act:'Profession Tax', period:'FY 2025-26', title:'Maharashtra PT Annual Return (Form III-B)', tag:'MH Employers' },

  // -------- JULY 2025 --------
  { month:'jul_26', day:13, cat:'gst', sub:'qrmp', period:'Q1 FY 26-27 (Apr-Jun)', title:'GSTR-1 / IFF (QRMP)', tag:'QRMP Taxpayers' },
  { month:'jul_26', day:15, cat:'pay', act:'Labour Welfare Fund', period:'Jan - Jun 2026', title:'Maharashtra LWF (Half-Yearly)', tag:'MH Employers (>=5)' },
  { month:'jul_26', day:15, cat:'tds', period:'Q1 FY 26-27', title:'Form 16A (TDS Certificate)', tag:'All Deductors' },
  { month:'jul_26', day:15, cat:'tds', period:'Q1 FY 26-27', title:'TCS Return - Form 27EQ', tag:'TCS Collectors' },
  { month:'jul_26', day:18, cat:'gst', sub:'comp', period:'Q1 FY 26-27', title:'CMP-08 (Composition)', tag:'Composition Dealers' },
  { month:'jul_26', day:22, cat:'gst', sub:'qrmp', period:'Q1 FY 26-27', title:'GSTR-3B QRMP - Group A', tag:'MH, Guj, Kar, TN &c.' },
  { month:'jul_26', day:24, cat:'gst', sub:'qrmp', period:'Q1 FY 26-27', title:'GSTR-3B QRMP - Group B', tag:'Delhi, UP, WB, Pun &c.' },
  { month:'jul_26', day:31, cat:'it',  period:'AY 2026-27', title:'ITR Filing - Non-Audit', tag:'Individual / HUF / Firm' },
  { month:'jul_26', day:31, cat:'tds', period:'Q1 FY 26-27', title:'TDS Return (24Q / 26Q / 27Q)', tag:'All Deductors' },

  // -------- AUGUST 2025 --------
  { month:'aug_26', day:25, cat:'gst', sub:'qrmp', period:'Jul 2026', title:'PMT-06 (QRMP Tax Payment)', tag:'QRMP Taxpayers' },

  // -------- SEPTEMBER 2025 --------
  { month:'sep_26', day:15, cat:'it',  period:'FY 2026-27', title:'Advance Tax - Q2 (45% cumulative)', tag:'All Assessees' },
  { month:'sep_26', day:25, cat:'gst', sub:'qrmp', period:'Aug 2026', title:'PMT-06 (QRMP Tax Payment)', tag:'QRMP Taxpayers' },
  { month:'sep_26', day:30, cat:'roc', period:'FY 2025-26', title:'DIR-3 KYC', tag:'All Directors' },
  { month:'sep_26', day:30, cat:'it',  period:'AY 2026-27', title:'Tax Audit Report (Sec 44AB)', tag:'Audit Cases' },

  // -------- OCTOBER 2025 --------
  { month:'oct_26', day:13, cat:'gst', sub:'qrmp', period:'Q2 FY 26-27 (Jul-Sep)', title:'GSTR-1 / IFF (QRMP)', tag:'QRMP Taxpayers' },
  { month:'oct_26', day:15, cat:'roc', period:'FY 2026-27', title:'ADT-1 (Auditor Appointment)', tag:'Companies' },
  { month:'oct_26', day:15, cat:'tds', period:'Q2 FY 26-27', title:'Form 16A (TDS Certificate)', tag:'All Deductors' },
  { month:'oct_26', day:15, cat:'tds', period:'Q2 FY 26-27', title:'TCS Return - Form 27EQ', tag:'TCS Collectors' },
  { month:'oct_26', day:18, cat:'gst', sub:'comp', period:'Q2 FY 26-27', title:'CMP-08 (Composition)', tag:'Composition Dealers' },
  { month:'oct_26', day:22, cat:'gst', sub:'qrmp', period:'Q2 FY 26-27', title:'GSTR-3B QRMP - Group A', tag:'MH, Guj, Kar, TN &c.' },
  { month:'oct_26', day:24, cat:'gst', sub:'qrmp', period:'Q2 FY 26-27', title:'GSTR-3B QRMP - Group B', tag:'Delhi, UP, WB, Pun &c.' },
  { month:'oct_26', day:30, cat:'roc', period:'FY 2025-26', title:'AOC-4 (Financial Statements)', tag:'Companies' },
  { month:'oct_26', day:30, cat:'roc', period:'FY 2025-26', title:'Form 8 - LLP Statement of Accounts', tag:'LLP' },
  { month:'oct_26', day:31, cat:'it',  period:'AY 2026-27', title:'ITR Filing - Audit Cases', tag:'Companies / 44AB' },
  { month:'oct_26', day:31, cat:'roc', period:'Apr - Sep 2026', title:'Form MSME-1 (Half-Yearly)', tag:'Companies' },
  { month:'oct_26', day:31, cat:'tds', period:'Q2 FY 26-27', title:'TDS Return (24Q / 26Q / 27Q)', tag:'All Deductors' },

  // -------- NOVEMBER 2025 --------
  { month:'nov_26', day:11, cat:'pay', period:'Apr - Sep 2026', title:'ESIC Half-Yearly Return', tag:'Employers (>=10)' },
  { month:'nov_26', day:25, cat:'gst', sub:'qrmp', period:'Oct 2026', title:'PMT-06 (QRMP Tax Payment)', tag:'QRMP Taxpayers' },
  { month:'nov_26', day:29, cat:'roc', period:'FY 2025-26', title:'MGT-7 / MGT-7A (Annual Return)', tag:'Companies' },
  { month:'nov_26', day:29, cat:'roc', period:'Apr - Sep 2026', title:'PAS-6 (Half-Yearly)', tag:'Unlisted Public Cos' },
  { month:'nov_26', day:30, cat:'it',  period:'AY 2026-27', title:'ITR Filing - Transfer Pricing (Sec 92E)', tag:'TP Cases' },

  // -------- DECEMBER 2025 --------
  { month:'dec_26', day:15, cat:'it',  period:'FY 2026-27', title:'Advance Tax - Q3 (75% cumulative)', tag:'All Assessees' },
  { month:'dec_26', day:25, cat:'gst', sub:'qrmp', period:'Nov 2026', title:'PMT-06 (QRMP Tax Payment)', tag:'QRMP Taxpayers' },
  { month:'dec_26', day:31, cat:'it',  period:'AY 2026-27', title:'Belated / Revised ITR', tag:'All Assessees' },
  { month:'dec_26', day:31, cat:'gst', sub:'regular qrmp', period:'FY 2025-26', title:'GSTR-9 / GSTR-9C (Annual)', tag:'Regular & QRMP Taxpayers' },

  // -------- JANUARY 2026 --------
  { month:'jan_27', day:13, cat:'gst', sub:'qrmp', period:'Q3 FY 26-27 (Oct-Dec)', title:'GSTR-1 / IFF (QRMP)', tag:'QRMP Taxpayers' },
  { month:'jan_27', day:15, cat:'pay', act:'Labour Welfare Fund', period:'Jul - Dec 2026', title:'Maharashtra LWF (Half-Yearly)', tag:'MH Employers (>=5)' },
  { month:'jan_27', day:15, cat:'tds', period:'Q3 FY 26-27', title:'Form 16A (TDS Certificate)', tag:'All Deductors' },
  { month:'jan_27', day:15, cat:'tds', period:'Q3 FY 26-27', title:'TCS Return - Form 27EQ', tag:'TCS Collectors' },
  { month:'jan_27', day:18, cat:'gst', sub:'comp', period:'Q3 FY 26-27', title:'CMP-08 (Composition)', tag:'Composition Dealers' },
  { month:'jan_27', day:22, cat:'gst', sub:'qrmp', period:'Q3 FY 26-27', title:'GSTR-3B QRMP - Group A', tag:'MH, Guj, Kar, TN &c.' },
  { month:'jan_27', day:24, cat:'gst', sub:'qrmp', period:'Q3 FY 26-27', title:'GSTR-3B QRMP - Group B', tag:'Delhi, UP, WB, Pun &c.' },
  { month:'jan_27', day:31, cat:'tds', period:'Q3 FY 26-27', title:'TDS Return (24Q / 26Q / 27Q)', tag:'All Deductors' },

  // -------- FEBRUARY 2026 --------
  { month:'feb_27', day:25, cat:'gst', sub:'qrmp', period:'Jan 2027', title:'PMT-06 (QRMP Tax Payment)', tag:'QRMP Taxpayers' },

  // -------- MARCH 2026 --------
  { month:'mar_27', day:15, cat:'it',  period:'FY 2026-27', title:'Advance Tax - Q4 (100% cumulative)', tag:'All Assessees' },
  { month:'mar_27', day:25, cat:'gst', sub:'qrmp', period:'Feb 2027', title:'PMT-06 (QRMP Tax Payment)', tag:'QRMP Taxpayers' },
  { month:'mar_27', day:31, cat:'it',  period:'Multiple AYs', title:'Updated Return (ITR-U) / Form 67', tag:'All Assessees' },
  { month:'mar_27', day:31, cat:'pay', act:'Profession Tax', period:'FY 2026-27', title:'Maharashtra PTEC (Annual)', tag:'MH Self-Employed' },

  // -------- APRIL 2026 (FY 26-27 trailing) --------
  { month:'apr_27', day:7,  cat:'tds', period:'Mar 2027', title:'TCS Payment', tag:'TCS Collectors' },
  { month:'apr_27', day:13, cat:'gst', sub:'qrmp', period:'Q4 FY 26-27 (Jan-Mar)', title:'GSTR-1 / IFF (QRMP)', tag:'QRMP Taxpayers' },
  { month:'apr_27', day:18, cat:'gst', sub:'comp', period:'Q4 FY 26-27', title:'CMP-08 (Composition)', tag:'Composition Dealers' },
  { month:'apr_27', day:22, cat:'gst', sub:'qrmp', period:'Q4 FY 26-27', title:'GSTR-3B QRMP - Group A', tag:'MH, Guj, Kar, TN &c.' },
  { month:'apr_27', day:24, cat:'gst', sub:'qrmp', period:'Q4 FY 26-27', title:'GSTR-3B QRMP - Group B', tag:'Delhi, UP, WB, Pun &c.' },
  { month:'apr_27', day:30, cat:'tds', period:'Mar 2027', title:'TDS Payment for March (extended)', tag:'All Deductors' },
  { month:'apr_27', day:30, cat:'roc', period:'Oct \'26 - Mar \'27', title:'Form MSME-1 (Half-Yearly)', tag:'Companies' },
  { month:'apr_27', day:30, cat:'gst', sub:'comp', period:'FY 2026-27', title:'GSTR-4 (Composition Annual)', tag:'Composition Dealers' }
];

const MONTHLY_RECURRING = [
  { day:7,      cat:'tds', title:'TDS / TCS Deposit',                 tag:'All Deductors',         excludeMonths:['apr_26','apr_27'] },
  { day:10,     cat:'gst', sub:'regular', title:'GSTR-7 / GSTR-8 (TDS/TCS)', tag:'GST TDS / ECO Operators' },
  { day:11,     cat:'gst', sub:'regular', title:'GSTR-1 (Monthly)',          tag:'Regular Taxpayers' },
  { day:13,     cat:'gst', sub:'regular', title:'GSTR-5 / GSTR-6 (NRTP / ISD)', tag:'NRTP / ISD' },
  { day:15,     cat:'pay', title:'EPF / ECR Payment',                  tag:'Employers (>=20)' },
  { day:15,     cat:'pay', title:'ESIC Contribution',                  tag:'Employers (>=10)' },
  { day:20,     cat:'gst', sub:'regular', title:'GSTR-3B (Monthly) / GSTR-5A', tag:'Regular / OIDAR' },
  { day:'last', cat:'pay', act:'Profession Tax', title:'Maharashtra Profession Tax (PTRC)', tag:'MH Employers' }
];

const ACT_DISPLAY = {
  it:  'Income Tax',
  tds: 'TDS / TCS',
  gst: 'GST',
  roc: 'MCA',
  pay: 'PF / ESIC'
};

// Expand the monthly recurring templates into concrete dates per month.
function expandMonthly() {
  const out = [];
  Object.keys(MONTH_INFO).forEach(m => {
    MONTHLY_RECURRING.forEach(r => {
      if (r.excludeMonths && r.excludeMonths.includes(m)) return;
      const day = (r.day === 'last') ? MONTH_INFO[m].days : r.day;
      out.push({
        month: m,
        day,
        cat: r.cat,
        act: r.act,
        sub: r.sub,
        period: PREV_MONTH_NAME[m],
        title: r.title,
        tag: r.tag
      });
    });
  });
  return out;
}

const COMPLIANCES = [...RAW_COMPLIANCES, ...expandMonthly()];

/* A row may override the label for its category - Profession Tax and Labour
   Welfare Fund share the payroll colour but are not PF/ESIC compliances. */
function actLabel(c) { return c.act || ACT_DISPLAY[c.cat]; }

module.exports = { MONTH_INFO, PREV_MONTH_NAME, RAW_COMPLIANCES, MONTHLY_RECURRING, ACT_DISPLAY, COMPLIANCES, actLabel };
