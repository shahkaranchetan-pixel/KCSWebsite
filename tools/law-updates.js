(function () {
  const INR = (n) => (window.formatINRFull ? window.formatINRFull(n) : "â‚¹" + Math.round(n || 0).toLocaleString("en-IN"));
  const num = (id) => {
    const el = document.getElementById(id);
    return el ? Math.max(0, Number(el.value) || 0) : 0;
  };
  const checked = (name, fallback = "") => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : fallback;
  };
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  const setHtml = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
  };
  const cap = (value, limit) => Math.min(Math.max(0, value || 0), limit);

  // Cost Inflation Index (base FY 2001-02 = 100), keyed by financial-year start year.
  // Government-notified values through the current year; used to auto-compute indexed cost
  // for the section 197(3) LTCG comparison on land/building.
  const CII = { 2001: 100, 2002: 105, 2003: 109, 2004: 113, 2005: 117, 2006: 122, 2007: 129, 2008: 137, 2009: 148, 2010: 167, 2011: 184, 2012: 200, 2013: 220, 2014: 240, 2015: 254, 2016: 264, 2017: 272, 2018: 280, 2019: 289, 2020: 301, 2021: 317, 2022: 331, 2023: 348, 2024: 363, 2025: 376 };
  const finYearStart = (date) => (date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1);
  const ciiFor = (fyStart) => {
    const years = Object.keys(CII).map(Number);
    const clamped = Math.min(Math.max(fyStart, Math.min(...years)), Math.max(...years));
    return CII[clamped];
  };
  function indexedCostFrom(cost, pdate, sdate) {
    // Base year: FY 2001-02 or year of acquisition, whichever later (section 72(8)(b)).
    const base = ciiFor(Math.max(finYearStart(pdate), 2001));
    const target = ciiFor(finYearStart(sdate));
    if (!base || !target) return cost;
    return Math.round((cost * target) / base);
  }

  function addJsonLd(id, data) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function addCommonTaxSchema(pageName, pageUrl, faqs) {
    addJsonLd("kcs-breadcrumb-schema", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kcshah.com/" },
        { "@type": "ListItem", "position": 2, "name": "Free Tools", "item": "https://kcshah.com/tools/" },
        { "@type": "ListItem", "position": 3, "name": pageName, "item": pageUrl },
      ],
    });
    addJsonLd("kcs-faq-schema", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": { "@type": "Answer", "text": faq.a },
      })),
    });
  }

  function enhanceToolsHub() {
    const headings = [...document.querySelectorAll(".tools-category-header h2")];
    const business = headings.find((h) => h.textContent.trim() === "Business & CA Utility Tools")?.closest(".tools-hub-section");
    const tax = headings.find((h) => h.textContent.trim() === "Tax & Compliance Tools")?.closest(".tools-hub-section");
    const loan = headings.find((h) => h.textContent.trim() === "Loan & Finance Tools")?.closest(".tools-hub-section");
    const loanGrid = loan?.querySelector(".grid-4");
    if (loanGrid) {
      loanGrid.classList.remove("grid-4");
      loanGrid.classList.add("grid-3");
    }
    if (business && tax && loan) {
      const container = tax.parentElement;
      container.insertBefore(business, tax);
      container.insertBefore(tax, loan);
      const askCard = [...container.querySelectorAll(".tool-hub-card")].find((card) => card.textContent.includes("Can't Find a Tool?"));
      if (askCard && !document.getElementById("ask-ca-tool-section")) {
        const askSection = document.createElement("div");
        askSection.id = "ask-ca-tool-section";
        askSection.className = "tools-hub-section";
        askSection.innerHTML = `<div class="grid grid-3"></div>`;
        askSection.querySelector(".grid").appendChild(askCard);
        container.appendChild(askSection);
      }
    }
    const trustCount = document.querySelector(".trust-item .trust-text strong");
    document.querySelectorAll("h3").forEach((h) => {
      if (h.textContent.trim() === "Capital Gain Calculator") h.textContent = "Capital Gains Calculator";
    });
  }

  function taxFromSlabs(income, slabs) {
    let tax = 0;
    let prev = 0;
    for (const slab of slabs) {
      if (income <= prev) break;
      tax += (Math.min(income, slab.limit) - prev) * slab.rate;
      prev = slab.limit;
    }
    return Math.max(0, tax);
  }

  function surcharge(totalIncome, tax, isNew) {
    if (totalIncome <= 5000000 || tax <= 0) return 0;
    const rate = totalIncome <= 10000000 ? 0.1 : totalIncome <= 20000000 ? 0.15 : totalIncome <= 50000000 ? 0.25 : isNew ? 0.25 : 0.37;
    return tax * rate;
  }

  

  function computeIncomeTax(isNew) {
    const age = Number(checked("age", "0"));
    const resident = document.getElementById("residential-status")?.value === "resident";
    const salary = num("salary-income");
    const business = num("business-income");
    const house = num("house-income");
    const other = num("other-income");
    const normalCg = num("normal-cg");
    const stcg111a = num("stcg-111a");
    const ltcg112a = num("ltcg-112a");
    const ltcg112 = num("ltcg-112");
    const gross = salary + business + house + other + normalCg + stcg111a + ltcg112a + ltcg112;
    const salaryDed = salary > 0 ? Math.min(salary, isNew ? 75000 : 50000) : 0;
    const employerCapRate = isNew ? 0.14 : 0.1;
    const employerNps = cap(num("nps-employer"), salary * employerCapRate);
    const familyPension = cap(num("family-pension-deduction"), isNew ? 25000 : 15000);
    const oldDeductions = cap(num("c80c"), 150000) + cap(num("c80d"), age > 0 ? 50000 : 25000) + cap(num("nps"), 50000) + employerNps + num("hra") + cap(num("home-loan-interest"), 200000) + num("c80e") + num("c80g") + cap(num("c80tta"), age > 0 ? 50000 : 10000) + familyPension + num("other80");
    const newDeductions = salaryDed + employerNps + familyPension;
    const deductions = isNew ? newDeductions : oldDeductions + salaryDed;
    const normalIncomeBeforeDeduction = salary + business + house + other + normalCg;
    const normalTaxable = Math.max(0, normalIncomeBeforeDeduction - deductions);
    const totalIncome = normalTaxable + stcg111a + ltcg112a + ltcg112;
    const oldSlabs = age === 2 ? [{ limit: 500000, rate: 0 }, { limit: 1000000, rate: 0.2 }, { limit: Infinity, rate: 0.3 }] : age === 1 ? [{ limit: 300000, rate: 0 }, { limit: 500000, rate: 0.05 }, { limit: 1000000, rate: 0.2 }, { limit: Infinity, rate: 0.3 }] : [{ limit: 250000, rate: 0 }, { limit: 500000, rate: 0.05 }, { limit: 1000000, rate: 0.2 }, { limit: Infinity, rate: 0.3 }];
    const newSlabs = [{ limit: 400000, rate: 0 }, { limit: 800000, rate: 0.05 }, { limit: 1200000, rate: 0.1 }, { limit: 1600000, rate: 0.15 }, { limit: 2000000, rate: 0.2 }, { limit: 2400000, rate: 0.25 }, { limit: Infinity, rate: 0.3 }];
    const normalTax = taxFromSlabs(normalTaxable, isNew ? newSlabs : oldSlabs);
    const ltcg112aTaxable = Math.max(0, ltcg112a - 125000);
    const specialTax = stcg111a * 0.2 + ltcg112aTaxable * 0.125 + ltcg112 * 0.125;
    const rebateBase = isNew ? normalTax : normalTax + specialTax;
    const rebate = resident && (isNew ? normalTaxable <= 1200000 : totalIncome <= 500000) ? Math.min(rebateBase, isNew ? 60000 : 12500) : 0;
    const taxAfterRebate = Math.max(0, normalTax + specialTax - rebate);
    const rawSurcharge = surcharge(totalIncome, taxAfterRebate, isNew);
    const marginalRelief = isNew && resident && normalTaxable > 1200000 && normalTaxable <= 1275000 && specialTax === 0
      ? Math.max(0, taxAfterRebate + rawSurcharge - (normalTaxable - 1200000))
      : 0;
    const taxAfterMarginalRelief = Math.max(0, taxAfterRebate + rawSurcharge - marginalRelief);
    const cess = taxAfterMarginalRelief * 0.04;
    const total = Math.round(taxAfterMarginalRelief + cess);
    return { gross, deductions, salaryDed, normalTaxable, totalIncome, normalTax, specialTax, rebate, surcharge: rawSurcharge, marginalRelief, cess, total };
  }

  function runIncomeTaxCalculator() {
    const oldCalc = computeIncomeTax(false);
    const newCalc = computeIncomeTax(true);
    const winner = newCalc.total <= oldCalc.total ? "New" : "Old";
    const saving = Math.abs(oldCalc.total - newCalc.total);
    setText("winner-text", `${winner} Regime`);
    setText("winner-savings", `You save ${INR(saving)} vs ${winner === "New" ? "Old" : "New"} Regime`);
    setText("old-total", INR(oldCalc.total));
    setText("new-total", INR(newCalc.total));
    setText("old-taxable", INR(oldCalc.totalIncome));
    setText("new-taxable", INR(newCalc.totalIncome));
    setText("b-gross-o", INR(oldCalc.gross));
    setText("b-gross-n", INR(newCalc.gross));
    setText("b-sd-o", INR(oldCalc.salaryDed));
    setText("b-sd-n", INR(newCalc.salaryDed));
    setText("b-ded-o", INR(Math.max(0, oldCalc.deductions - oldCalc.salaryDed)));
    setText("b-ded-n", INR(Math.max(0, newCalc.deductions - newCalc.salaryDed)));
    setText("b-ti-o", INR(oldCalc.normalTaxable));
    setText("b-ti-n", INR(newCalc.normalTaxable));
    setText("b-normal-tax-o", INR(oldCalc.normalTax));
    setText("b-normal-tax-n", INR(newCalc.normalTax));
    setText("b-special-tax-o", INR(oldCalc.specialTax));
    setText("b-special-tax-n", INR(newCalc.specialTax));
    setText("b-87a-o", INR(oldCalc.rebate));
    setText("b-87a-n", INR(newCalc.rebate));
    setText("b-sur-o", INR(oldCalc.surcharge));
    setText("b-sur-n", INR(newCalc.surcharge));
    setText("b-mr-o", INR(oldCalc.marginalRelief));
    setText("b-mr-n", INR(newCalc.marginalRelief));
    setText("b-cess-o", INR(oldCalc.cess));
    setText("b-cess-n", INR(newCalc.cess));
    setHtml("b-total-o", `<strong>${INR(oldCalc.total)}</strong>`);
    setHtml("b-total-n", `<strong>${INR(newCalc.total)}</strong>`);
    setText("b-etr-o", oldCalc.gross ? `${(oldCalc.total / oldCalc.gross * 100).toFixed(2)}%` : "0%");
    setText("b-etr-n", newCalc.gross ? `${(newCalc.total / newCalc.gross * 100).toFixed(2)}%` : "0%");
    // Donut chart removed from PDF logic as it causes layout/rendering issues in headless contexts and overlaps content
  }

  

  function runAdvanceTaxCalculator() {
    const grossTax = num("advance-gross-tax");
    const credits = num("advance-credits");
    const selfAssessment = num("self-assessment-paid");
    const net = Math.max(0, grossTax - credits);
    const pJun = num("p_jun");
    const pSep = pJun + num("p_sep");
    const pDec = pSep + num("p_dec");
    const pMar = pDec + num("p_mar");
    const type = document.getElementById("advance-taxpayer-type")?.value || "regular";
    const rows = type === "presumptive"
      ? [{ label: "15 Mar", pct: 1, paid: pMar, months: 1, tolerance: 1 }]
      : [
        { label: "15 Jun", pct: 0.15, paid: pJun, months: 3, tolerance: 0.12 },
        { label: "15 Sep", pct: 0.45, paid: pSep, months: 3, tolerance: 0.36 },
        { label: "15 Dec", pct: 0.75, paid: pDec, months: 3, tolerance: 0.75 },
        { label: "15 Mar", pct: 1, paid: pMar, months: 1, tolerance: 1 },
      ];
    const interestRows = rows.map((row) => {
      const required = net * row.pct;
      const shortfall = Math.max(0, required - row.paid);
      const tolerancePassed = net < 10000 || row.paid >= net * row.tolerance;
      const interest = tolerancePassed ? 0 : shortfall * 0.01 * row.months;
      return { ...row, required, shortfall, interest };
    });
    const total234c = interestRows.reduce((sum, row) => sum + row.interest, 0);
    const totalAdvancePaid = pMar;
    const balance = Math.max(0, net - totalAdvancePaid - selfAssessment);
    const paidBeforeYearEnd = totalAdvancePaid + selfAssessment;
    const interest234bBase = net >= 10000 && paidBeforeYearEnd < net * 0.9 ? Math.max(0, net - paidBeforeYearEnd) : 0;
    const interest234b = interest234bBase * 0.01 * Math.max(0, Number(document.getElementById("months-234b")?.value) || 0);
    setText("net-tax", INR(net));
    setText("int234c", INR(total234c));
    setText("int234b", INR(interest234b));
    setText("advance-balance", INR(balance));
    setText("advance-advice", balance > 0 ? `Pay balance ${INR(balance)} and review interest before filing` : "No balance advance tax based on entered payments");
    setText("advance-assumption", type === "presumptive"
      ? "Presumptive taxpayers under sections 44AD / 44ADA generally discharge 100% advance tax by 15 March. Interest estimate is indicative."
      : "Regular taxpayer instalments use 15%, 45%, 75% and 100% cumulative due dates. June and September 234C tolerance is considered at 12% and 36%.");
    const body = document.getElementById("advance-breakdown");
    if (body) body.innerHTML = interestRows.map((row) => `<tr><td>${row.label}</td><td>${INR(row.required)}</td><td>${INR(row.paid)}</td><td>${INR(row.shortfall)}</td><td>${INR(row.interest)}</td></tr>`).join("");
  }

  function holdingMonths(start, end) {
    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (end.getDate() < start.getDate()) months -= 1;
    return Math.max(0, months);
  }

  

  function runCapitalGainsCalculator() {
    const asset = document.getElementById("asset")?.value;
    const pdate = new Date(document.getElementById("pdate")?.value);
    const sdate = new Date(document.getElementById("sdate")?.value);
    if (!asset || Number.isNaN(pdate.getTime()) || Number.isNaN(sdate.getTime()) || sdate < pdate) {
      setText("hold-period", "Invalid Dates");
      return;
    }
    const months = holdingMonths(pdate, sdate);
    const thresholds = { eq_listed: 12, property: 24, land_building: 24, gold: 24, eq_unlisted: 24, debt: 36 };
    const threshold = thresholds[asset] || 24;
    const isLong = months >= threshold;
    const sale = num("sprice");
    const cost = num("pprice");
    const expenses = num("exp");
    const netConsideration = Math.max(0, sale - expenses);
    const grossGain = Math.max(0, netConsideration - cost);
    const budgetCutoff = new Date("2024-07-23");
    const postBudget = sdate >= budgetCutoff;
    let rate = 0.3;
    let method = isLong ? "Long-term capital gain" : "Short-term capital gain";
    let taxableBeforeExemption = grossGain;
    let eligibility = "STCG is generally taxed at applicable slab rates except listed equity/equity MF under Section 111A.";

    // Section 197(3), ITA 2025: a resident individual/HUF transferring land or building acquired
    // before 23 Jul 2024 pays the LOWER of 12.5% without indexation vs 20% with indexation.
    const isResidentIndHuf = document.getElementById("taxpayer-type")?.value === "resident";
    const acquiredBeforeCutoff = pdate < budgetCutoff;
    const indexationEligible = isLong && postBudget && isResidentIndHuf && acquiredBeforeCutoff && (asset === "property" || asset === "land_building");
    const overrideIndexedCost = num("indexed-cost");
    const autoIndexedCost = indexedCostFrom(cost, pdate, sdate);
    const indexedCost = overrideIndexedCost > 0 ? overrideIndexedCost : autoIndexedCost;

    if (asset === "eq_listed") {
      rate = isLong ? (postBudget ? 0.125 : 0.1) : (postBudget ? 0.2 : 0.15);
      taxableBeforeExemption = isLong ? Math.max(0, grossGain - (postBudget ? 125000 : 100000)) : grossGain;
      eligibility = isLong ? "Listed equity/equity MF LTCG exemption threshold applied before tax." : "Listed equity/equity MF STCG uses the special Section 111A rate.";
    } else if (isLong) {
      rate = postBudget ? 0.125 : 0.2;
      eligibility = "LTCG exemption depends on asset type, investment timing, ownership and lock-in conditions.";
      if (asset === "debt") {
        eligibility = "Debt mutual fund taxation depends on acquisition date, holding mix and statutory classification. Treat this as an estimate and review before filing.";
      }
    }

    let exemption54 = 0;
    let exemption54f = 0;
    let exemption54ec = 0;
    if (isLong) {
      if (asset === "property") exemption54 = Math.min(taxableBeforeExemption, cap(num("sec54"), 100000000));
      if (asset !== "property" && asset !== "eq_listed") exemption54f = Math.min(taxableBeforeExemption, netConsideration ? cap(num("sec54f"), 100000000) * taxableBeforeExemption / netConsideration : 0);
      if (asset === "property" || asset === "land_building") exemption54ec = Math.min(taxableBeforeExemption - exemption54 - exemption54f, cap(num("sec54ec"), 5000000));
    }
    const exemption = Math.max(0, exemption54 + exemption54f + exemption54ec);
    const taxableGain = Math.max(0, taxableBeforeExemption - exemption);

    // Default single-method result; overridden below for the section 197(3) comparison.
    let displayTaxableGain = taxableGain;
    let baseTax = taxableGain * rate;
    let methodsHtml = "";

    if (indexationEligible) {
      const taxableNoIndex = taxableGain;                                       // 12.5% base (non-indexed)
      const taxableIndexed = Math.max(0, Math.max(0, netConsideration - indexedCost) - exemption); // 20% base
      const taxNoIndex = taxableNoIndex * 0.125;                                // A: s.197(1)(b)
      const taxIndexed = taxableIndexed * 0.2;                                  // B: 20% on indexed gain
      const indexWins = taxIndexed < taxNoIndex;                               // pay the lower (s.197(3))
      if (indexWins) {
        rate = 0.2;
        displayTaxableGain = taxableIndexed;
        baseTax = taxIndexed;
        method = "LTCG Â· 20% with indexation (payable)";
      } else {
        rate = 0.125;
        displayTaxableGain = taxableNoIndex;
        baseTax = taxNoIndex;
        method = "LTCG Â· 12.5% without indexation (payable)";
      }
      eligibility = "Resident individual/HUF, land/building acquired before 23 Jul 2024: under section 197(3) you pay the lower of the two methods below. Indexed cost is auto-calculated from the Cost Inflation Index (override optional).";
      const tag = (lower) => (lower ? '<span style="color:#0a7d33;font-weight:600"> (lower â€” payable)</span>' : '<span style="color:#888"> (higher â€” ignored)</span>');
      methodsHtml = `<div class="tool-card-title" style="font-size:0.95rem;margin-bottom:8px"><i class="fa-solid fa-scale-balanced"></i> Both methods compared â€” s.197(3)</div>` +
        `<table class="tool-comparison"><thead><tr><th>Method</th><th>Taxable gain</th><th>Tax*</th></tr></thead><tbody>` +
        `<tr class="${indexWins ? "" : "highlight-row"}"><td>12.5% without indexation${tag(!indexWins)}</td><td>${INR(taxableNoIndex)}</td><td>${INR(taxNoIndex)}</td></tr>` +
        `<tr class="${indexWins ? "highlight-row" : ""}"><td>20% with indexation${tag(indexWins)}</td><td>${INR(taxableIndexed)}</td><td>${INR(taxIndexed)}</td></tr>` +
        `</tbody></table><p style="font-size:0.75rem;color:#888;margin-top:6px">*Tax before surcharge & cess. Indexed cost used: ${INR(indexedCost)}.</p>`;
    }

    // Surcharge on capital gains is capped at 15% (section 197 / Finance Act rate schedule).
    const surchargeRate = Math.min(Number(document.getElementById("cg-surcharge-rate")?.value) || 0, 0.15);
    const surchargeAmount = baseTax * surchargeRate;
    const cess = (baseTax + surchargeAmount) * 0.04;
    const totalTax = Math.round(baseTax + surchargeAmount + cess);

    setText("gain-type", isLong ? "Long Term Capital Gain" : "Short Term Capital Gain");
    setText("gain-amount", INR(grossGain));
    setText("hold-period", `${months} Months (${threshold}+ months for LTCG)`);
    setText("tax-rate", `${(rate * 100).toFixed(rate === 0.125 ? 1 : 0)}%`);
    setText("tax-method", method);
    setText("cg-exemption", INR(exemption));
    setText("tax-amount", INR(totalTax));
    setHtml("cg-methods", methodsHtml);
    setText("cg-eligibility", `${eligibility} Section 54/54F/54EC benefits require prescribed reinvestment timelines, CGAS deposit where applicable, and lock-in compliance.`);
    const rows = [
      ["Sale consideration", sale],
      ["Less: transfer expenses", expenses],
      ["Net consideration", netConsideration],
      ["Cost of acquisition", cost],
      ["Indexed cost used", indexationEligible && rate === 0.2 ? indexedCost : 0],
      ["Gross capital gain", grossGain],
      ["Section 54 exemption", exemption54],
      ["Section 54F exemption", exemption54f],
      ["Section 54EC exemption", exemption54ec],
      ["Taxable capital gain", displayTaxableGain],
      ["Tax before surcharge/cess", baseTax],
      ["Surcharge", surchargeAmount],
      ["Health & Education Cess", cess],
      ["Total tax", totalTax],
    ];
    const body = document.getElementById("cg-breakdown");
    if (body) body.innerHTML = rows.map(([label, value], index) => `<tr${index === rows.length - 1 ? ' class="highlight-row"' : ""}><td>${label}</td><td>${INR(value)}</td></tr>`).join("");
  }

  const path = location.pathname.replace(/\.html$/, "");
  const isHub = path === "/tools" || path === "/tools/" || path.endsWith("/tools/index");
  if (isHub) enhanceToolsHub();
  if (path.endsWith("/tools/income-tax-calculator")) {
    addCommonTaxSchema("Income Tax Calculator", "https://kcshah.com/tools/income-tax-calculator.html", [
      { q: "Does the calculator compare old and new tax regimes?", a: "Yes. It compares the old and new regimes for FY 2025-26 / AY 2026-27 using slab tax, eligible deductions, rebate, surcharge, marginal relief and cess." },
      { q: "Are special-rate capital gains covered?", a: "Yes. It separates STCG under section 111A and LTCG under sections 112A and 112 so they are not incorrectly reduced by the new-regime Section 87A rebate." },
      { q: "Is this a substitute for tax filing advice?", a: "No. It is an indicative calculator based on user inputs and should be reviewed before filing a return." },
    ]);
    
    // -- Professional Tax Report PDF Generator --
async function generateTaxReportPDF() {
  showToast('Preparing professional report-', 'info');
  try { await ensurePdfLibs(); } catch (e) { showToast('Could not load PDF library.', 'error'); return; }

  // Read all inputs
  const sal   = parseFloat(document.getElementById('salary-income').value) || 0;
  const other = parseFloat((parseFloat(document.getElementById('other-income').value)||0) + (parseFloat(document.getElementById('house-income').value)||0) + (parseFloat(document.getElementById('business-income').value)||0) + (parseFloat(document.getElementById('normal-cg').value)||0))  || 0;
  const stcg  = parseFloat(document.getElementById('stcg-111a').value)   || 0;
  const ltcg  = parseFloat((parseFloat(document.getElementById('ltcg-112a').value)||0) + (parseFloat(document.getElementById('ltcg-112').value)||0))   || 0;
  const c80c  = Math.min(parseFloat(document.getElementById('c80c').value)  || 0, 150000);
  const c80d  = parseFloat(document.getElementById('c80d').value)   || 0;
  const nps   = Math.min(parseFloat(document.getElementById('nps').value)   || 0, 50000);
  const hra   = parseFloat(document.getElementById('hra').value)    || 0;
  const o80   = parseFloat(document.getElementById('other80').value)|| 0;
  const age   = parseInt(document.querySelector('input[name="age"]:checked').value);
  const ageLabel = age===2?'Above 80 (Super Senior Citizen)':age===1?'60 - 80 (Senior Citizen)':'Below 60';

  // Read computed results from DOM
  const oldTotalStr   = document.getElementById('b-total-o').textContent.replace(/[^0-9,.]/g,'').replace(/,/g,'');
  const newTotalStr   = document.getElementById('b-total-n').textContent.replace(/[^0-9,.]/g,'').replace(/,/g,'');
  const oldTotal      = parseInt(oldTotalStr) || 0;
  const newTotal      = parseInt(newTotalStr) || 0;
  const winner        = document.getElementById('winner-text').textContent;
  const savings       = Math.abs(oldTotal - newTotal);

  const f = n => 'â‚¹' + Math.round(n).toLocaleString('en-IN');
  const pct = n => (n*100).toFixed(2)+'%';
  const gross = sal + other + stcg + ltcg;

  // Individual tax components from DOM
  const get = id => document.getElementById(id)?.textContent?.trim() || '-';
  const oldSD = parseInt((get('b-sd-o')||'0').replace(/[^0-9]/g,'')) || 0;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});
  const reportNo = 'KCS-ITR-' + today.getFullYear() + String(today.getMonth()+1).padStart(2,'0') + String(today.getDate()).padStart(2,'0');

  const navy = '#1F3A6E';
  const gold = '#d95e0b';
  const lightBlue = '#E8EDF5';
  const green = '#1a7a4a';
  const greenBg = '#E8F5EF';

  const winnerIsNew = winner.toLowerCase().includes('new');
  const recColor = winnerIsNew ? green : '#1a4a7a';
  const recBg    = winnerIsNew ? greenBg : '#E8EDF5';

  const oldTaxable = parseInt((get('b-ti-o')||'0').replace(/[^0-9]/g,'')) || 0;
  const newTaxable = parseInt((get('b-ti-n')||'0').replace(/[^0-9]/g,'')) || 0;
  const oldETR = gross > 0 ? pct(oldTotal/gross) : '0.00%';
  const newETR = gross > 0 ? pct(newTotal/gross) : '0.00%';

  const html = `
<div style="width:794px;background:#fff;font-family:Arial,Helvetica,sans-serif;color:#222;font-size:13px;line-height:1.5">

  <!-- LETTERHEAD -->
  <div style="background:${navy};padding:22px 32px 18px;display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="color:${gold};font-size:22px;font-weight:700;letter-spacing:0.5px">KC Shah & Associates</div>
      <div style="color:rgba(255,255,255,0.8);font-size:11px;margin-top:3px">Chartered Accountants | Mumbai</div>
    </div>
    <div style="text-align:right;color:rgba(255,255,255,0.75);font-size:10.5px;line-height:1.8">
      <div>karan@kcshah.com</div>
      <div>+91 76666 38995</div>
      <div>kcshah.com</div>
    </div>
  </div>

  <!-- GOLD RULE -->
  <div style="height:4px;background:linear-gradient(90deg,${gold},#f0a05a,${gold})"></div>

  <!-- DOCUMENT TITLE -->
  <div style="background:#F4F6FA;padding:18px 32px;border-bottom:1px solid #dde3ef">
    <div style="font-size:17px;font-weight:700;color:${navy};letter-spacing:0.3px">INCOME TAX COMPUTATION STATEMENT</div>
    <div style="font-size:11.5px;color:#555;margin-top:4px">Financial Year 2026-27 &nbsp;|&nbsp; Assessment Year 2027-28</div>
  </div>

  <!-- META ROW -->
  <div style="display:flex;justify-content:space-between;padding:12px 32px;background:#fff;border-bottom:1px solid #eee;font-size:11px;color:#555">
    <div><span style="font-weight:600;color:${navy}">Report No:</span> ${reportNo}</div>
    <div><span style="font-weight:600;color:${navy}">Generated:</span> ${dateStr}</div>
    <div><span style="font-weight:600;color:${navy}">Status:</span> Resident Individual</div>
    <div><span style="font-weight:600;color:${navy}">Age Category:</span> ${ageLabel}</div>
  </div>

  <div style="padding:24px 32px">

    <!-- INCOME PARTICULARS -->
    <div style="margin-bottom:22px">
      <div style="font-size:12px;font-weight:700;color:${navy};text-transform:uppercase;letter-spacing:0.8px;border-bottom:2px solid ${navy};padding-bottom:6px;margin-bottom:0">A. Income Particulars</div>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px">
        <thead>
          <tr style="background:${navy}">
            <th style="text-align:left;padding:9px 14px;color:white;font-weight:600;width:60%">Particulars</th>
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600">Amount (â‚¹)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#F9FAFB"><td style="padding:6px 14px;border-bottom:1px solid #eee">Gross Salary / Business Income</td><td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${f(sal)}</td></tr>
          <tr><td style="padding:6px 14px;border-bottom:1px solid #eee">Income from Other Sources (Interest, Dividends)</td><td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${f(other)}</td></tr>
          <tr style="background:#F9FAFB"><td style="padding:6px 14px;border-bottom:1px solid #eee">Short-Term Capital Gains (Sec. 111A @ 20%)</td><td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${f(stcg)}</td></tr>
          <tr><td style="padding:6px 14px;border-bottom:1px solid #eee">Long-Term Capital Gains (Sec. 112A @ 12.5%)</td><td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${f(ltcg)}</td></tr>
          <tr style="background:${lightBlue}">
            <td style="padding:7px 14px;font-weight:700;color:${navy}">Gross Total Income</td>
            <td style="padding:7px 14px;font-weight:700;color:${navy};text-align:right">${f(gross)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- DEDUCTIONS (OLD REGIME) -->
    <div style="margin-bottom:22px">
      <div style="font-size:12px;font-weight:700;color:${navy};text-transform:uppercase;letter-spacing:0.8px;border-bottom:2px solid ${navy};padding-bottom:6px;margin-bottom:0">B. Deductions Claimed (Old Regime)</div>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px">
        <thead>
          <tr style="background:${navy}">
            <th style="text-align:left;padding:9px 14px;color:white;font-weight:600;width:60%">Deduction</th>
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600">Amount (â‚¹)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#F9FAFB"><td style="padding:6px 14px;border-bottom:1px solid #eee">Standard Deduction (Old Regime)</td><td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${f(oldSD)}</td></tr>
          <tr><td style="padding:6px 14px;border-bottom:1px solid #eee">Section 80C - PPF, ELSS, LIC, EPF, etc.</td><td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${f(c80c)}</td></tr>
          <tr style="background:#F9FAFB"><td style="padding:6px 14px;border-bottom:1px solid #eee">Section 80D - Medical Insurance Premium</td><td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${f(c80d)}</td></tr>
          <tr><td style="padding:6px 14px;border-bottom:1px solid #eee">Section 80CCD(1B) - NPS Contribution</td><td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${f(nps)}</td></tr>
          <tr style="background:#F9FAFB"><td style="padding:6px 14px;border-bottom:1px solid #eee">HRA Exemption</td><td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${f(hra)}</td></tr>
          <tr><td style="padding:6px 14px;border-bottom:1px solid #eee">Other Chapter VI-A Deductions</td><td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${f(o80)}</td></tr>
          <tr style="background:${lightBlue}">
            <td style="padding:7px 14px;font-weight:700;color:${navy}">Total Deductions (Old Regime)</td>
            <td style="padding:7px 14px;font-weight:700;color:${navy};text-align:right">${get('b-ded-o')} (Ch. VI-A) + ${f(oldSD)} (SD)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TAX COMPUTATION -->
    <div style="margin-bottom:22px">
      <div style="font-size:12px;font-weight:700;color:${navy};text-transform:uppercase;letter-spacing:0.8px;border-bottom:2px solid ${navy};padding-bottom:6px;margin-bottom:0">C. Tax Computation - Old Regime vs New Regime</div>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px">
        <thead>
          <tr style="background:${navy}">
            <th style="text-align:left;padding:9px 14px;color:white;font-weight:600;width:50%">Particulars</th>
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600;width:25%">Old Regime</th>
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600;width:25%">New Regime</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#F9FAFB">
            <td style="padding:6px 14px;border-bottom:1px solid #eee">Gross Total Income</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${get('b-gross-o')}</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${get('b-gross-n')}</td>
          </tr>
          <tr>
            <td style="padding:6px 14px;border-bottom:1px solid #eee">Less: Standard Deduction</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right;color:#c62828">(${get('b-sd-o')})</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right;color:#c62828">(${get('b-sd-n')})</td>
          </tr>
          <tr style="background:#F9FAFB">
            <td style="padding:6px 14px;border-bottom:1px solid #eee">Less: Chapter VI-A Deductions</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right;color:#c62828">(${get('b-ded-o')})</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right;color:#888">Not Applicable</td>
          </tr>
          <tr style="background:${lightBlue}">
            <td style="padding:7px 14px;font-weight:700;color:${navy}">Taxable Income</td>
            <td style="padding:7px 14px;font-weight:700;color:${navy};text-align:right">${get('b-ti-o')}</td>
            <td style="padding:7px 14px;font-weight:700;color:${navy};text-align:right">${get('b-ti-n')}</td>
          </tr>
          <tr>
            <td style="padding:6px 14px;border-bottom:1px solid #eee">Income Tax (as per applicable slabs)</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${get('b-normal-tax-o')}</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${get('b-normal-tax-n')}</td>
          </tr>
          <tr style="background:#F9FAFB">
            <td style="padding:6px 14px;border-bottom:1px solid #eee">Less: Rebate u/s 87A</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right;color:#c62828">(${get('b-87a-o')})</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right;color:#c62828">(${get('b-87a-n')})</td>
          </tr>
          <tr style="background:#F9FAFB">
            <td style="padding:6px 14px;border-bottom:1px solid #eee">Add: Capital Gains Tax (Sec. 111A / 112A - Special Rate)</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${get('b-special-tax-o')}</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${get('b-special-tax-n')}</td>
          </tr>
          <tr>
            <td style="padding:6px 14px;border-bottom:1px solid #eee">Add: Surcharge</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${get('b-sur-o')}</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${get('b-sur-n')}</td>
          </tr>
          <tr style="background:#F9FAFB">
            <td style="padding:6px 14px;border-bottom:1px solid #eee">Add: Health & Education Cess @ 4%</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${get('b-cess-o')}</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right">${get('b-cess-n')}</td>
          </tr>
          <tr style="background:${navy}">
            <td style="padding:9px 14px;font-weight:700;color:white;font-size:13px">TOTAL TAX PAYABLE</td>
            <td style="padding:9px 14px;font-weight:700;color:${gold};text-align:right;font-size:13px">${f(oldTotal)}</td>
            <td style="padding:9px 14px;font-weight:700;color:${gold};text-align:right;font-size:13px">${f(newTotal)}</td>
          </tr>
          <tr>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;color:#555">Effective Tax Rate (on Gross Income)</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right;color:#555">${oldETR}</td>
            <td style="padding:6px 14px;border-bottom:1px solid #eee;text-align:right;color:#555">${newETR}</td>
          </tr>
          <tr style="background:#F9FAFB">
            <td style="padding:6px 14px;color:#555">Monthly Tax Outflow</td>
            <td style="padding:6px 14px;text-align:right;color:#555">${f(Math.round(oldTotal/12))}</td>
            <td style="padding:6px 14px;text-align:right;color:#555">${f(Math.round(newTotal/12))}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- RECOMMENDATION -->
    <div style="background:${recBg};border:2px solid ${recColor};border-radius:8px;padding:18px 24px;margin-bottom:22px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;color:${recColor};margin-bottom:4px">ðŸ’¡ Recommended Tax Regime</div>
        <div style="font-size:22px;font-weight:700;color:${recColor}">${winner}</div>
        <div style="font-size:12px;color:${recColor};margin-top:4px;opacity:0.85">Based on your income profile and deductions for FY 2026-27</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:${recColor};opacity:0.8;margin-bottom:4px">Annual Tax Savings</div>
        <div style="font-size:28px;font-weight:700;color:${recColor}">${f(savings)}</div>
        <div style="font-size:11px;color:${recColor};opacity:0.8">vs ${winnerIsNew?'Old':'New'} Regime</div>
      </div>
    </div>

    <!-- SLAB REFERENCE -->
    <div style="margin-bottom:18px">
      <div style="font-size:12px;font-weight:700;color:${navy};text-transform:uppercase;letter-spacing:0.8px;border-bottom:2px solid ${navy};padding-bottom:6px;margin-bottom:10px">D. Tax Slab Reference - FY 2026-27</div>
      <div style="display:flex;gap:16px">
        <table style="width:50%;border-collapse:collapse;font-size:11.5px">
          <thead><tr style="background:#334E78"><th style="text-align:left;padding:7px 10px;color:white;font-weight:600">New Regime Slab</th><th style="text-align:right;padding:7px 10px;color:white;font-weight:600">Rate</th></tr></thead>
          <tbody>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px;border-bottom:1px solid #eee">Up to â‚¹4,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">NIL</td></tr>
            <tr><td style="padding:6px 10px;border-bottom:1px solid #eee">â‚¹4,00,001 - â‚¹8,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">5%</td></tr>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px;border-bottom:1px solid #eee">â‚¹8,00,001 - â‚¹12,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">10%</td></tr>
            <tr><td style="padding:6px 10px;border-bottom:1px solid #eee">â‚¹12,00,001 - â‚¹16,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">15%</td></tr>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px;border-bottom:1px solid #eee">â‚¹16,00,001 - â‚¹20,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">20%</td></tr>
            <tr><td style="padding:6px 10px;border-bottom:1px solid #eee">â‚¹20,00,001 - â‚¹24,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">25%</td></tr>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px">Above â‚¹24,00,000</td><td style="text-align:right;padding:6px 10px">30%</td></tr>
          </tbody>
        </table>
        <table style="width:50%;border-collapse:collapse;font-size:11.5px">
          <thead><tr style="background:#334E78"><th style="text-align:left;padding:7px 10px;color:white;font-weight:600">Old Regime Slab (Below 60)</th><th style="text-align:right;padding:7px 10px;color:white;font-weight:600">Rate</th></tr></thead>
          <tbody>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px;border-bottom:1px solid #eee">Up to â‚¹2,50,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">NIL</td></tr>
            <tr><td style="padding:6px 10px;border-bottom:1px solid #eee">â‚¹2,50,001 - â‚¹5,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">5%</td></tr>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px;border-bottom:1px solid #eee">â‚¹5,00,001 - â‚¹10,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">20%</td></tr>
            <tr><td style="padding:6px 10px">Above â‚¹10,00,000</td><td style="text-align:right;padding:6px 10px">30%</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- DISCLAIMER -->
    <div style="background:#FFF8E7;border-left:3px solid ${gold};padding:12px 16px;border-radius:0 6px 6px 0;font-size:10.5px;color:#7a6000;margin-bottom:0">
      <strong>Disclaimer:</strong> This computation is generated for informational purposes only based on inputs provided by the user. It does not constitute professional tax advice. Tax liability may vary based on actual income, exemptions, surcharge applicability, and CBDT notifications. Please consult a Chartered Accountant before filing your Income Tax Return.
    </div>

  </div><!-- end padding div -->

  <!-- FOOTER -->
  <div style="background:${navy};padding:14px 32px;display:flex;justify-content:space-between;align-items:center;margin-top:0">
    <div style="color:rgba(255,255,255,0.6);font-size:10px">KC Shah & Associates | Chartered Accountants, Mumbai | kcshah.com</div>
    <div style="color:${gold};font-size:10px;font-weight:600">CA-Verified Computation | FY 2026-27</div>
    <div style="color:rgba(255,255,255,0.6);font-size:10px">Page 1 of 1</div>
  </div>

</div>`;

  // Inject hidden render container
  const wrapper = document.createElement('div');
  wrapper.id = '__tax-pdf-render__';
  wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;background:#fff';
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  const reportEl = wrapper.firstElementChild;

  html2canvas(reportEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    width: 794,
    windowWidth: 794
  }).then(canvas => {
    document.body.removeChild(wrapper);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();   // 210mm
    const pdfH = pdf.internal.pageSize.getHeight();  // 297mm
    const imgData = canvas.toDataURL('image/jpeg', 0.97);
    const imgH = (canvas.height * pdfW) / canvas.width;

    if (imgH <= pdfH) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, imgH);
    } else {
      // multi-page if needed
      let yOffset = 0;
      let remaining = imgH;
      let page = 0;
      while (remaining > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -yOffset, pdfW, imgH);
        yOffset += pdfH;
        remaining -= pdfH;
        page++;
      }
    }
    pdf.save('KC-Shah-Tax-Report-FY2627.pdf');
    showToast('Professional PDF downloaded!', 'success');
  }).catch(err => {
    document.body.removeChild(wrapper);
    console.error(err);
    showToast('PDF generation failed. Please try again.', 'error');
  });
}

    window.generateTaxReportPDF = generateTaxReportPDF;
    window.calculate = runIncomeTaxCalculator;
    document.addEventListener("DOMContentLoaded", runIncomeTaxCalculator);
    runIncomeTaxCalculator();
  }
  if (path.endsWith("/tools/advance-tax-calculator")) {
    addCommonTaxSchema("Advance Tax Calculator", "https://kcshah.com/tools/advance-tax-calculator.html", [
      { q: "Who needs to pay advance tax?", a: "A taxpayer generally needs to pay advance tax when net tax liability after TDS/TCS is Rs. 10,000 or more." },
      { q: "What instalments are used for regular taxpayers?", a: "Regular taxpayers generally use cumulative instalments of 15%, 45%, 75% and 100% by 15 June, 15 September, 15 December and 15 March." },
      { q: "Does the calculator estimate 234B and 234C interest?", a: "Yes. It estimates 234C for instalment shortfalls and 234B where advance tax paid is below the required threshold." },
    ]);
    
    
async function generateAdvanceTaxReportPDF() {
  showToast('Preparing professional report-', 'info');
  try { await ensurePdfLibs(); } catch (e) { showToast('Could not load PDF library.', 'error'); return; }

  // Read inputs
  const taxpayerType = document.getElementById('advance-taxpayer-type').options[document.getElementById('advance-taxpayer-type').selectedIndex].text;
  const grossTax = document.getElementById('advance-gross-tax').value || "0";
  const credits = document.getElementById('advance-credits').value || "0";
  const selfAssPaid = document.getElementById('self-assessment-paid').value || "0";
  
  // Read outputs
  const netTax = document.getElementById('net-tax')?.textContent || '0';
  const int234c = document.getElementById('int234c')?.textContent || '0';
  const int234b = document.getElementById('int234b')?.textContent || '0';
  const balance = document.getElementById('advance-balance')?.textContent || '0';
  const advice = document.getElementById('advance-advice')?.textContent || '';

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});
  const reportNo = 'KCS-ADV-' + today.getFullYear() + String(today.getMonth()+1).padStart(2,'0') + String(today.getDate()).padStart(2,'0');

  const navy = '#1F3A6E';
  const gold = '#d95e0b';
  const lightBlue = '#E8EDF5';
  
  // Create table rows for the computation section from the advance-breakdown table
  const breakdownRows = Array.from(document.querySelectorAll('#advance-breakdown tr')).map(tr => {
    const tds = tr.querySelectorAll('td');
    if (tds.length === 5) return [tds[0].textContent, tds[1].textContent, tds[2].textContent, tds[3].textContent, tds[4].textContent];
    return null;
  }).filter(Boolean);
  
  let computationHtml = '';
  breakdownRows.forEach((row, i) => {
    let bg = i % 2 === 0 ? '#F9FAFB' : '#fff';
    computationHtml += `<tr style="background:${bg}">
      <td style="padding:8px 14px;border-bottom:1px solid #eee;">${row[0]}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #eee;text-align:right;">${row[1]}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #eee;text-align:right;">${row[2]}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #eee;text-align:right;">${row[3]}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #eee;text-align:right;color:#c62828">${row[4]}</td>
    </tr>`;
  });

  const html = `
<div style="width:794px;background:#fff;font-family:Arial,Helvetica,sans-serif;color:#222;font-size:13px;line-height:1.5">

  <!-- LETTERHEAD -->
  <div style="background:${navy};padding:22px 32px 18px;display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="color:${gold};font-size:22px;font-weight:700;letter-spacing:0.5px">KC Shah & Associates</div>
      <div style="color:rgba(255,255,255,0.8);font-size:11px;margin-top:3px">Chartered Accountants | Mumbai</div>
    </div>
    <div style="text-align:right;color:rgba(255,255,255,0.75);font-size:10.5px;line-height:1.8">
      <div>karan@kcshah.com</div>
      <div>+91 76666 38995</div>
      <div>kcshah.com</div>
    </div>
  </div>

  <!-- GOLD RULE -->
  <div style="height:4px;background:linear-gradient(90deg,${gold},#f0a05a,${gold})"></div>

  <!-- DOCUMENT TITLE -->
  <div style="background:#F4F6FA;padding:18px 32px;border-bottom:1px solid #dde3ef">
    <div style="font-size:17px;font-weight:700;color:${navy};letter-spacing:0.3px">ADVANCE TAX COMPUTATION STATEMENT</div>
    <div style="font-size:11.5px;color:#555;margin-top:4px">Financial Year 2026-27 &nbsp;|&nbsp; Assessment Year 2027-28</div>
  </div>

  <!-- META ROW -->
  <div style="display:flex;justify-content:space-between;padding:12px 32px;background:#fff;border-bottom:1px solid #eee;font-size:11px;color:#555">
    <div><span style="font-weight:600;color:${navy}">Report No:</span> ${reportNo}</div>
    <div><span style="font-weight:600;color:${navy}">Generated:</span> ${dateStr}</div>
    <div><span style="font-weight:600;color:${navy}">Taxpayer:</span> ${taxpayerType}</div>
  </div>

  <div style="padding:24px 32px">
  
    <!-- SUMMARY CARDS -->
    <div style="display:flex;gap:16px;margin-bottom:24px">
      <div style="flex:1;background:${lightBlue};padding:16px;border-radius:8px;border-left:4px solid ${navy}">
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.5px">Net Advance Tax Payable</div>
        <div style="font-size:16px;font-weight:700;color:${navy};margin-top:4px">${netTax}</div>
      </div>
      <div style="flex:1;background:${lightBlue};padding:16px;border-radius:8px;border-left:4px solid #c62828">
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.5px">Estimated Interest (234B & 234C)</div>
        <div style="font-size:16px;font-weight:700;color:#c62828;margin-top:4px">â‚¹${(parseFloat(int234c.replace(/[^0-9.]/g,'')) || 0) + (parseFloat(int234b.replace(/[^0-9.]/g,'')) || 0)}</div>
      </div>
      <div style="flex:1;background:${lightBlue};padding:16px;border-radius:8px;border-left:4px solid ${gold}">
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.5px">Balance Tax / Shortfall</div>
        <div style="font-size:16px;font-weight:700;color:${gold};margin-top:4px">${balance}</div>
      </div>
    </div>

    <!-- TRANSACTION DETAILS -->
    <div style="margin-bottom:22px">
      <div style="font-size:12px;font-weight:700;color:${navy};text-transform:uppercase;letter-spacing:0.8px;border-bottom:2px solid ${navy};padding-bottom:6px;margin-bottom:12px">A. Tax Assessment Details</div>
      <div style="display:flex;flex-wrap:wrap;gap:20px;font-size:12px">
        <div style="flex:1;min-width:45%">
          <div style="margin-bottom:8px"><span style="color:#666">Estimated Tax Before Credits:</span> <strong>â‚¹${Number(grossTax).toLocaleString('en-IN')}</strong></div>
          <div style="margin-bottom:8px"><span style="color:#666">TDS/TCS Credits:</span> <strong>â‚¹${Number(credits).toLocaleString('en-IN')}</strong></div>
        </div>
        <div style="flex:1;min-width:45%">
          <div style="margin-bottom:8px"><span style="color:#666">Self-Assessment Tax Paid:</span> <strong>â‚¹${Number(selfAssPaid).toLocaleString('en-IN')}</strong></div>
          <div style="margin-bottom:8px"><span style="color:#666">Result:</span> <strong>${advice}</strong></div>
        </div>
      </div>
    </div>

    <!-- COMPUTATION TABLE -->
    <div style="margin-bottom:22px">
      <div style="font-size:12px;font-weight:700;color:${navy};text-transform:uppercase;letter-spacing:0.8px;border-bottom:2px solid ${navy};padding-bottom:6px;margin-bottom:0">B. Instalment Schedule & Interest Estimation</div>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px">
        <thead>
          <tr style="background:${navy}">
            <th style="text-align:left;padding:9px 14px;color:white;font-weight:600;width:20%">Due Date</th>
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600;width:20%">Required</th>
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600;width:20%">Paid Cumulative</th>
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600;width:20%">Shortfall</th>
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600;width:20%">234C Int.</th>
          </tr>
        </thead>
        <tbody>
          ${computationHtml}
        </tbody>
      </table>
      <div style="margin-top:12px;font-size:11.5px;color:#555">
         <strong>Total Estimated 234C Interest:</strong> ${int234c} <br>
         <strong>Total Estimated 234B Interest:</strong> ${int234b}
      </div>
    </div>

    <!-- DISCLAIMER -->
    <div style="background:#FDF2E9;border-left:3px solid ${gold};padding:12px 16px;font-size:10.5px;color:#703f16;margin-top:40px">
      <strong>Disclaimer:</strong> This computation is an estimate generated based on user inputs and current tax laws. It should not be construed as professional tax advice. The 234B and 234C interest calculations are estimations using standard instalment percentages. Please consult your Chartered Accountant before filing your income tax return or paying advance tax.
    </div>

  </div>
</div>
  `;

  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.top = '-9999px';
  wrapper.style.left = '-9999px';
  wrapper.style.zIndex = '-1';
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  html2canvas(wrapper.firstElementChild, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    width: 794,
    windowWidth: 794
  }).then(canvas => {
    document.body.removeChild(wrapper);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgData = canvas.toDataURL('image/jpeg', 0.97);
    const imgH = (canvas.height * pdfW) / canvas.width;

    if (imgH <= pdfH) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, imgH);
    } else {
      let yOffset = 0;
      let remaining = imgH;
      let page = 0;
      while (remaining > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -yOffset, pdfW, imgH);
        yOffset += pdfH;
        remaining -= pdfH;
        page++;
      }
    }
    pdf.save('KC-Shah-Advance-Tax-FY2627.pdf');
    showToast('Professional PDF downloaded!', 'success');
  }).catch(err => {
    document.body.removeChild(wrapper);
    console.error(err);
    showToast('PDF generation failed. Please try again.', 'error');
  });
}

    window.generateAdvanceTaxReportPDF = generateAdvanceTaxReportPDF;
    window.calculate = runAdvanceTaxCalculator;
    document.addEventListener("DOMContentLoaded", runAdvanceTaxCalculator);
    runAdvanceTaxCalculator();
  }
  if (path.endsWith("/tools/capital-gain-calculator")) {
    addCommonTaxSchema("Capital Gains Calculator", "https://kcshah.com/tools/capital-gain-calculator.html", [
      { q: "Does the calculator include Sections 54, 54F and 54EC?", a: "Yes. It includes indicative exemption inputs for Section 54, Section 54F and Section 54EC, subject to statutory conditions." },
      { q: "Does it handle post-Budget 2024 capital gains rates?", a: "Yes. It separates listed equity, land/building and other asset classes and applies post-Budget 2024 rates where relevant." },
      { q: "Can it compare indexed and non-indexed land or building tax?", a: "Yes. For eligible resident individuals or HUFs (land/building acquired before 23 July 2024), it shows both 12.5% without indexation and 20% with indexation and applies the lower under Section 197(3). Indexed cost is auto-calculated from the Cost Inflation Index." },
    ]);
    
    
async function generateCapitalGainsReportPDF() {
  showToast('Preparing professional report-', 'info');
  try { await ensurePdfLibs(); } catch (e) { showToast('Could not load PDF library.', 'error'); return; }

  // Read inputs
  const assetType = document.getElementById('asset').options[document.getElementById('asset').selectedIndex].text;
  const pdate = document.getElementById('pdate').value;
  const sdate = document.getElementById('sdate').value;
  const pprice = document.getElementById('pprice').value || "0";
  const sprice = document.getElementById('sprice').value || "0";
  const indexedCost = document.getElementById('indexed-cost').value || "0";
  const exp = document.getElementById('exp').value || "0";
  
  // Read outputs
  const gainType = document.getElementById('gain-type')?.textContent || '-';
  const gainAmount = document.getElementById('gain-amount')?.textContent || '0';
  const holdPeriod = document.getElementById('hold-period')?.textContent || '-';
  const taxRate = document.getElementById('tax-rate')?.textContent || '-';
  const taxMethod = document.getElementById('tax-method')?.textContent || '-';
  const cgExemption = document.getElementById('cg-exemption')?.textContent || '0';
  const taxAmount = document.getElementById('tax-amount')?.textContent || '0';

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});
  const reportNo = 'KCS-CG-' + today.getFullYear() + String(today.getMonth()+1).padStart(2,'0') + String(today.getDate()).padStart(2,'0');

  const navy = '#1F3A6E';
  const gold = '#d95e0b';
  const lightBlue = '#E8EDF5';
  
  // Create table rows for the computation section from the cg-breakdown table
  const breakdownRows = Array.from(document.querySelectorAll('#cg-breakdown tr')).map(tr => {
    const tds = tr.querySelectorAll('td');
    if (tds.length === 2) return [tds[0].textContent, tds[1].textContent, tr.classList.contains('highlight-row')];
    return null;
  }).filter(Boolean);
  
  let computationHtml = '';
  breakdownRows.forEach((row, i) => {
    let bg = i % 2 === 0 ? '#F9FAFB' : '#fff';
    if (row[2]) bg = lightBlue;
    computationHtml += `<tr style="background:${bg}">
      <td style="padding:8px 14px;border-bottom:1px solid #eee;${row[2]?'font-weight:700;color:'+navy:''} ">${row[0]}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #eee;text-align:right;${row[2]?'font-weight:700;color:'+navy:''} ">${row[1]}</td>
    </tr>`;
  });

  const html = `
<div style="width:794px;background:#fff;font-family:Arial,Helvetica,sans-serif;color:#222;font-size:13px;line-height:1.5">

  <!-- LETTERHEAD -->
  <div style="background:${navy};padding:22px 32px 18px;display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="color:${gold};font-size:22px;font-weight:700;letter-spacing:0.5px">KC Shah & Associates</div>
      <div style="color:rgba(255,255,255,0.8);font-size:11px;margin-top:3px">Chartered Accountants | Mumbai</div>
    </div>
    <div style="text-align:right;color:rgba(255,255,255,0.75);font-size:10.5px;line-height:1.8">
      <div>karan@kcshah.com</div>
      <div>+91 76666 38995</div>
      <div>kcshah.com</div>
    </div>
  </div>

  <!-- GOLD RULE -->
  <div style="height:4px;background:linear-gradient(90deg,${gold},#f0a05a,${gold})"></div>

  <!-- DOCUMENT TITLE -->
  <div style="background:#F4F6FA;padding:18px 32px;border-bottom:1px solid #dde3ef">
    <div style="font-size:17px;font-weight:700;color:${navy};letter-spacing:0.3px">CAPITAL GAINS COMPUTATION STATEMENT</div>
    <div style="font-size:11.5px;color:#555;margin-top:4px">Financial Year 2026-27 &nbsp;|&nbsp; Assessment Year 2027-28</div>
  </div>

  <!-- META ROW -->
  <div style="display:flex;justify-content:space-between;padding:12px 32px;background:#fff;border-bottom:1px solid #eee;font-size:11px;color:#555">
    <div><span style="font-weight:600;color:${navy}">Report No:</span> ${reportNo}</div>
    <div><span style="font-weight:600;color:${navy}">Generated:</span> ${dateStr}</div>
    <div><span style="font-weight:600;color:${navy}">Asset Type:</span> ${assetType}</div>
  </div>

  <div style="padding:24px 32px">
  
    <!-- SUMMARY CARDS -->
    <div style="display:flex;gap:16px;margin-bottom:24px">
      <div style="flex:1;background:${lightBlue};padding:16px;border-radius:8px;border-left:4px solid ${navy}">
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.5px">Gain Classification</div>
        <div style="font-size:16px;font-weight:700;color:${navy};margin-top:4px">${gainType}</div>
      </div>
      <div style="flex:1;background:${lightBlue};padding:16px;border-radius:8px;border-left:4px solid ${navy}">
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.5px">Holding Period</div>
        <div style="font-size:16px;font-weight:700;color:${navy};margin-top:4px">${holdPeriod}</div>
      </div>
      <div style="flex:1;background:${lightBlue};padding:16px;border-radius:8px;border-left:4px solid ${gold}">
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.5px">Total Tax Payable</div>
        <div style="font-size:16px;font-weight:700;color:${gold};margin-top:4px">${taxAmount}</div>
      </div>
    </div>

    <!-- TRANSACTION DETAILS -->
    <div style="margin-bottom:22px">
      <div style="font-size:12px;font-weight:700;color:${navy};text-transform:uppercase;letter-spacing:0.8px;border-bottom:2px solid ${navy};padding-bottom:6px;margin-bottom:12px">A. Transaction Details</div>
      <div style="display:flex;flex-wrap:wrap;gap:20px;font-size:12px">
        <div style="flex:1;min-width:45%">
          <div style="margin-bottom:8px"><span style="color:#666">Purchase Date:</span> <strong>${pdate}</strong></div>
          <div style="margin-bottom:8px"><span style="color:#666">Purchase Price:</span> <strong>â‚¹${Number(pprice).toLocaleString('en-IN')}</strong></div>
          <div style="margin-bottom:8px"><span style="color:#666">Transfer Expenses:</span> <strong>â‚¹${Number(exp).toLocaleString('en-IN')}</strong></div>
        </div>
        <div style="flex:1;min-width:45%">
          <div style="margin-bottom:8px"><span style="color:#666">Sale Date:</span> <strong>${sdate}</strong></div>
          <div style="margin-bottom:8px"><span style="color:#666">Sale Price:</span> <strong>â‚¹${Number(sprice).toLocaleString('en-IN')}</strong></div>
          <div style="margin-bottom:8px"><span style="color:#666">Applicable Tax Rate:</span> <strong>${taxRate}</strong></div>
        </div>
      </div>
      <div style="margin-top:8px;font-size:11px;color:#666"><em>Note: ${taxMethod}</em></div>
    </div>

    <!-- COMPUTATION TABLE -->
    <div style="margin-bottom:22px">
      <div style="font-size:12px;font-weight:700;color:${navy};text-transform:uppercase;letter-spacing:0.8px;border-bottom:2px solid ${navy};padding-bottom:6px;margin-bottom:0">B. Detailed Computation</div>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px">
        <thead>
          <tr style="background:${navy}">
            <th style="text-align:left;padding:9px 14px;color:white;font-weight:600;width:70%">Particulars</th>
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600;width:30%">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${computationHtml}
        </tbody>
      </table>
    </div>

    <!-- DISCLAIMER -->
    <div style="background:#FDF2E9;border-left:3px solid ${gold};padding:12px 16px;font-size:10.5px;color:#703f16;margin-top:40px">
      <strong>Disclaimer:</strong> This computation is an estimate generated based on user inputs and current tax laws (including Budget 2024 changes). It should not be construed as professional tax advice. Exemptions (Sec 54/54F/54EC) are subject to statutory conditions. Please consult your Chartered Accountant before filing your income tax return.
    </div>

  </div>
</div>
  `;

  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.top = '-9999px';
  wrapper.style.left = '-9999px';
  wrapper.style.zIndex = '-1';
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  html2canvas(wrapper.firstElementChild, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    width: 794,
    windowWidth: 794
  }).then(canvas => {
    document.body.removeChild(wrapper);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgData = canvas.toDataURL('image/jpeg', 0.97);
    const imgH = (canvas.height * pdfW) / canvas.width;

    if (imgH <= pdfH) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, imgH);
    } else {
      let yOffset = 0;
      let remaining = imgH;
      let page = 0;
      while (remaining > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -yOffset, pdfW, imgH);
        yOffset += pdfH;
        remaining -= pdfH;
        page++;
      }
    }
    pdf.save('KC-Shah-Capital-Gains-FY2627.pdf');
    showToast('Professional PDF downloaded!', 'success');
  }).catch(err => {
    document.body.removeChild(wrapper);
    console.error(err);
    showToast('PDF generation failed. Please try again.', 'error');
  });
}

    window.generateCapitalGainsReportPDF = generateCapitalGainsReportPDF;
    window.calculate = runCapitalGainsCalculator;
    document.addEventListener("DOMContentLoaded", runCapitalGainsCalculator);
    runCapitalGainsCalculator();
  }
})();

