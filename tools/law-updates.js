(function () {
  const INR = (n) => (window.formatINRFull ? window.formatINRFull(n) : "₹" + Math.round(n || 0).toLocaleString("en-IN"));
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
  const CII = { 2001: 100, 2002: 105, 2003: 109, 2004: 113, 2005: 117, 2006: 122, 2007: 129, 2008: 137, 2009: 148, 2010: 167, 2011: 184, 2012: 200, 2013: 220, 2014: 240, 2015: 254, 2016: 264, 2017: 272, 2018: 280, 2019: 289, 2020: 301, 2021: 317, 2022: 331, 2023: 348, 2024: 363, 2025: 376, 2026: 384 };
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

  // Date inputs give yyyy-mm-dd; build a local date so the day never shifts with the timezone.
  function parseLocalDate(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
  }
  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const displayDate = (d) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  function addMonths(date, n) {
    const d = new Date(date.getTime());
    d.setMonth(d.getMonth() + n);
    return d;
  }

  // Years the capital gains calculator supports, keyed by financial-year start year.
  // Sales from 1 Apr 2026 fall under the Income-tax Act, 2025 ("tax year"); earlier sales under the 1961 Act.
  const CG_YEARS = {
    2023: { fy: "2023-24", label: "Financial Year 2023-24 | Assessment Year 2024-25", act: 1961 },
    2024: { fy: "2024-25", label: "Financial Year 2024-25 | Assessment Year 2025-26", act: 1961 },
    2025: { fy: "2025-26", label: "Financial Year 2025-26 | Assessment Year 2026-27", act: 1961 },
    2026: { fy: "2026-27", label: "Tax Year 2026-27 (FY 2026-27) | Income-tax Act, 2025", act: 2025 },
  };
  const CG_SECTIONS = {
    1961: { name: "Income-tax Act, 1961", stcgEq: "111A", ltcgEq: "112A", ltcg: "112", house: "54", bonds: "54EC", other: "54F", compare: "112" },
    2025: { name: "Income-tax Act, 2025", stcgEq: "196", ltcgEq: "198", ltcg: "197", house: "82", bonds: "85", other: "86", compare: "197(3)" },
  };
  const CG_MIN_YEAR = Math.min(...Object.keys(CG_YEARS).map(Number));
  const CG_MAX_YEAR = Math.max(...Object.keys(CG_YEARS).map(Number));

  // Keep the year dropdown and the sale date pointing at the same financial year.
  function syncCapitalGainsYear(source) {
    const yearEl = document.getElementById("cg-year");
    const saleEl = document.getElementById("sdate");
    if (!yearEl || !saleEl) return;
    if (source === "year") {
      const fy = Number(yearEl.value);
      const current = parseLocalDate(saleEl.value) || new Date(fy, 3, 1);
      const month = current.getMonth();
      saleEl.value = isoDate(new Date(month >= 3 ? fy : fy + 1, month, current.getDate()));
      return;
    }
    const sale = parseLocalDate(saleEl.value);
    if (sale && CG_YEARS[finYearStart(sale)]) yearEl.value = String(finYearStart(sale));
  }

  function toggleGroup(inputId, enabled) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.disabled = !enabled;
    const group = input.closest(".tool-input-group");
    if (group) group.style.opacity = enabled ? "" : "0.45";
  }
  function showGroup(groupId, visible) {
    const group = document.getElementById(groupId);
    if (group) group.style.display = visible ? "" : "none";
  }

  function runCapitalGainsCalculator(source) {
    syncCapitalGainsYear(source);
    const asset = document.getElementById("asset")?.value;
    const pdate = parseLocalDate(document.getElementById("pdate")?.value);
    const sdate = parseLocalDate(document.getElementById("sdate")?.value);
    window.__cgReport = null;
    if (!asset || !pdate || !sdate || sdate < pdate) {
      setText("hold-period", "Invalid Dates");
      setText("cg-eligibility", "Enter a purchase date that is on or before the sale date.");
      return;
    }
    const fyStart = finYearStart(sdate);
    const year = CG_YEARS[fyStart];
    if (!year) {
      setText("hold-period", "Year not covered");
      setText("cg-eligibility", `This calculator covers sales between 1 April ${CG_MIN_YEAR} and 31 March ${CG_MAX_YEAR + 1}. Pick a sale date in that range.`);
      return;
    }
    const sec = CG_SECTIONS[year.act];

    const taxpayer = document.getElementById("taxpayer-type")?.value || "resident";
    const isIndHuf = taxpayer === "resident" || taxpayer === "nri";
    const isResidentIndHuf = taxpayer === "resident";
    const isListed = asset === "eq_listed";
    const isLandBuilding = asset === "property" || asset === "land_building";

    // Finance (No. 2) Act, 2024: rates and holding periods changed for transfers on or after 23 Jul 2024.
    const budgetCutoff = new Date(2024, 6, 23);
    const postBudget = sdate >= budgetCutoff;
    // Debt (specified) mutual fund units bought on or after 1 Apr 2023 are always short-term.
    const deemedShortTerm = asset === "debt" && pdate >= new Date(2023, 3, 1);
    const threshold = isListed ? 12 : postBudget ? 24 : (asset === "gold" || asset === "debt") ? 36 : 24;
    // "More than" 12/24/36 months: the sale date must fall after the month-anniversary of purchase.
    const isLong = !deemedShortTerm && sdate > addMonths(pdate, threshold);
    const months = holdingMonths(pdate, sdate);

    const sale = num("sprice");
    const actualCost = num("pprice");
    const expenses = num("exp");
    const netConsideration = Math.max(0, sale - expenses);

    // Listed equity bought before 1 Feb 2018: cost is the higher of actual cost and
    // the lower of (FMV on 31 Jan 2018, sale value).
    const grandfatherEligible = isListed && isLong && pdate < new Date(2018, 1, 1);
    const fmv2018 = num("fmv2018");
    const cost = grandfatherEligible && fmv2018 > 0 ? Math.max(actualCost, Math.min(fmv2018, sale)) : actualCost;
    const grandfathered = cost !== actualCost;

    const overrideIndexedCost = num("indexed-cost");
    const indexedCost = overrideIndexedCost > 0 ? overrideIndexedCost : indexedCostFrom(cost, pdate, sdate);
    const indexationOnly = isLong && !isListed && !postBudget;
    const indexationCompare = isLong && postBudget && isLandBuilding && isResidentIndHuf && pdate < budgetCutoff;

    const plainGain = netConsideration - cost;
    const indexedGain = netConsideration - indexedCost;

    const inv54 = num("sec54");
    const inv54f = num("sec54f");
    const inv54ec = num("sec54ec");
    const can54 = isLong && isIndHuf && asset === "property";
    const can54f = isLong && isIndHuf && asset !== "property";
    const can54ec = isLong && isLandBuilding;
    function exemptionsFor(gain) {
      const out = { e54: 0, e54f: 0, e54ec: 0, total: 0 };
      if (gain <= 0) return out;
      if (can54) out.e54 = Math.min(gain, cap(inv54, 100000000));
      let remaining = gain - out.e54;
      if (can54f && netConsideration > 0) out.e54f = Math.min(remaining, gain * cap(inv54f, 100000000) / netConsideration);
      remaining -= out.e54f;
      if (can54ec) out.e54ec = Math.min(remaining, cap(inv54ec, 5000000));
      out.total = out.e54 + out.e54f + out.e54ec;
      return out;
    }

    // The ₹1.25 lakh listed-equity threshold applies to the whole of FY 2024-25 onwards (₹1 lakh before).
    const equityThreshold = isListed && isLong ? (fyStart >= 2024 ? 125000 : 100000) : 0;
    function taxFor(gain, rate) {
      const ex = exemptionsFor(gain);
      const afterExemption = Math.max(0, gain - ex.total);
      const thresholdUsed = Math.min(afterExemption, equityThreshold);
      const taxable = afterExemption - thresholdUsed;
      return { gain, rate, ex, thresholdUsed, taxable, tax: taxable * rate };
    }

    const slabRate = Number(document.getElementById("cg-slab-rate")?.value) || 0.3;
    let result;
    let method;
    let basis;
    let specialRate = true;
    let methodsHtml = "";
    let compare = null;
    if (!isLong) {
      if (isListed) {
        result = taxFor(plainGain, postBudget ? 0.2 : 0.15);
        method = `STCG · ${postBudget ? "20" : "15"}% under section ${sec.stcgEq}`;
        basis = `Listed equity shares and equity-oriented funds held for 12 months or less are taxed at the special rate in section ${sec.stcgEq} (STT paid).`;
      } else {
        specialRate = false;
        result = taxFor(plainGain, slabRate);
        method = `STCG · taxed at your slab rate (${Math.round(slabRate * 100)}% selected)`;
        basis = deemedShortTerm
          ? "Debt (specified) mutual fund units acquired on or after 1 April 2023 are always treated as short-term, whatever the holding period, and taxed at your slab rate."
          : "Short-term gains on this asset are added to your income and taxed at your slab rate. Change the slab rate field to match your income.";
      }
    } else if (isListed) {
      result = taxFor(plainGain, postBudget ? 0.125 : 0.1);
      method = `LTCG · ${postBudget ? "12.5" : "10"}% under section ${sec.ltcgEq}`;
      basis = `Listed equity LTCG is taxed under section ${sec.ltcgEq} on the amount above ${INR(equityThreshold)} a year. The threshold is shared across all your listed-equity gains for the year.`;
    } else if (indexationCompare) {
      const a = taxFor(plainGain, 0.125);
      const b = taxFor(indexedGain, 0.2);
      const indexWins = b.tax < a.tax;
      result = indexWins ? b : a;
      compare = { a, b, indexWins };
      method = indexWins ? "LTCG · 20% with indexation (lower, payable)" : "LTCG · 12.5% without indexation (lower, payable)";
      basis = `Resident individual/HUF selling land or building acquired before 23 July 2024: section ${sec.compare} lets you pay the lower of 12.5% without indexation and 20% with indexation. Indexed cost uses CII ${ciiFor(Math.max(finYearStart(pdate), 2001))} (purchase year) and ${ciiFor(fyStart)} (sale year).`;
      const tag = (lower) => (lower ? '<span style="color:#0a7d33;font-weight:600"> (lower, payable)</span>' : '<span style="color:#888"> (higher, ignored)</span>');
      methodsHtml = `<div class="tool-card-title" style="font-size:0.95rem;margin-bottom:8px"><i class="fa-solid fa-scale-balanced"></i> Both methods compared · section ${sec.compare}</div>` +
        `<table class="tool-comparison"><thead><tr><th>Method</th><th>Taxable gain</th><th>Tax*</th></tr></thead><tbody>` +
        `<tr class="${indexWins ? "" : "highlight-row"}"><td>12.5% without indexation${tag(!indexWins)}</td><td>${INR(a.taxable)}</td><td>${INR(a.tax)}</td></tr>` +
        `<tr class="${indexWins ? "highlight-row" : ""}"><td>20% with indexation${tag(indexWins)}</td><td>${INR(b.taxable)}</td><td>${INR(b.tax)}</td></tr>` +
        `</tbody></table><p style="font-size:0.75rem;color:#888;margin-top:6px">*Tax before surcharge and cess. Indexed cost used: ${INR(indexedCost)}.</p>`;
    } else if (indexationOnly) {
      result = taxFor(indexedGain, 0.2);
      method = `LTCG · 20% with indexation under section ${sec.ltcg}`;
      basis = "Transfers before 23 July 2024 are taxed at 20% after indexing the cost with the Cost Inflation Index.";
    } else {
      result = taxFor(plainGain, 0.125);
      method = `LTCG · 12.5% without indexation under section ${sec.ltcg}`;
      basis = `Long-term gains on transfers on or after 23 July 2024 are taxed at 12.5% under section ${sec.ltcg} without indexation.`;
    }
    const usedIndexation = result.gain === indexedGain && (indexationOnly || (compare && compare.indexWins));
    const isLoss = result.gain < 0;

    // Surcharge on special-rate capital gains (listed-equity STCG and all LTCG) is capped at 15%.
    const surchargeChosen = Number(document.getElementById("cg-surcharge-rate")?.value) || 0;
    const surchargeRate = specialRate ? Math.min(surchargeChosen, 0.15) : surchargeChosen;
    const surchargeAmount = result.tax * surchargeRate;
    const cess = (result.tax + surchargeAmount) * 0.04;
    const totalTax = Math.round(result.tax + surchargeAmount + cess);

    const notes = [basis];
    if (grandfathered) notes.push("Cost has been stepped up using the 31 January 2018 fair market value (grandfathering for listed equity bought before 1 February 2018).");
    if (grandfatherEligible && !fmv2018) notes.push("These shares were bought before 1 February 2018. Enter the 31 January 2018 fair market value to apply grandfathering.");
    if (isLoss) notes.push("This is a capital loss. No tax is payable; a long-term loss can be set off only against long-term gains, a short-term loss against any capital gain, and the balance carried forward for 8 years if the return is filed on time.");
    if (specialRate && surchargeChosen > 0.15) notes.push("Surcharge on this gain is capped at 15%, so 15% has been applied.");
    if (result.ex.total > 0) notes.push(`Exemptions under sections ${sec.house}/${sec.other}/${sec.bonds} require reinvestment within the prescribed time, a Capital Gains Account Scheme deposit where the money is not yet used, and lock-in compliance.`);
    if (!isIndHuf && (inv54 > 0 || inv54f > 0)) notes.push(`Sections ${sec.house} and ${sec.other} are available only to individuals and HUFs, so those investments have been ignored.`);
    notes.push("The basic exemption limit, the section 87A rebate and set-off of other losses are not considered here.");

    showGroup("fmv2018-group", grandfatherEligible);
    showGroup("indexed-cost-group", indexationOnly || indexationCompare);
    toggleGroup("sec54", can54);
    toggleGroup("sec54f", can54f);
    toggleGroup("sec54ec", can54ec);
    toggleGroup("cg-slab-rate", !isLong && !isListed);

    const holdingText = `${months} months (${deemedShortTerm ? "always short-term" : `more than ${threshold} months for LTCG`})`;
    const rateText = `${(result.rate * 100).toFixed(result.rate === 0.125 ? 1 : 0)}%`;
    setText("cg-year-label", year.label);
    setText("gain-type", isLoss ? (isLong ? "Long Term Capital Loss" : "Short Term Capital Loss") : (isLong ? "Long Term Capital Gain" : "Short Term Capital Gain"));
    setText("gain-amount", (isLoss ? "-" : "") + INR(Math.abs(result.gain)));
    setText("hold-period", holdingText);
    setText("tax-rate", rateText);
    setText("tax-method", method);
    setText("cg-exemption", INR(result.ex.total));
    setText("tax-amount", INR(totalTax));
    setHtml("cg-methods", methodsHtml);
    setText("cg-eligibility", notes.join(" "));

    const signed = (value) => (value < 0 ? "-" + INR(Math.abs(value)) : INR(value));
    const rows = [
      ["Sale price / full value of consideration", INR(sale)],
      ["Less: transfer expenses", INR(expenses)],
      ["Net consideration", INR(netConsideration)],
      grandfathered ? ["Actual cost of acquisition", INR(actualCost)] : null,
      grandfathered ? ["FMV on 31 January 2018", INR(fmv2018)] : null,
      [grandfathered ? "Cost of acquisition (grandfathered)" : "Cost of acquisition", INR(cost)],
      usedIndexation ? [`Indexed cost of acquisition (CII ${ciiFor(fyStart)} / ${ciiFor(Math.max(finYearStart(pdate), 2001))})`, INR(indexedCost)] : null,
      [isLoss ? "Capital loss" : (usedIndexation ? "Capital gain after indexation" : "Capital gain"), signed(result.gain)],
      result.ex.e54 ? [`Less: section ${sec.house} exemption (new residential house)`, INR(result.ex.e54)] : null,
      result.ex.e54f ? [`Less: section ${sec.other} exemption (proportionate)`, INR(result.ex.e54f)] : null,
      result.ex.e54ec ? [`Less: section ${sec.bonds} exemption (bonds)`, INR(result.ex.e54ec)] : null,
      result.thresholdUsed ? [`Less: section ${sec.ltcgEq} threshold`, INR(result.thresholdUsed)] : null,
      ["Taxable capital gain", INR(result.taxable)],
      [`Tax at ${rateText}`, INR(result.tax)],
      [`Surcharge at ${Math.round(surchargeRate * 100)}%`, INR(surchargeAmount)],
      ["Health and education cess at 4%", INR(cess)],
      ["Total tax payable", INR(totalTax)],
    ].filter(Boolean);
    const body = document.getElementById("cg-breakdown");
    if (body) body.innerHTML = rows.map(([label, value], index) => `<tr${index === rows.length - 1 ? ' class="highlight-row"' : ""}><td>${label}</td><td>${value}</td></tr>`).join("");

    // Snapshot for the PDF report, so the report always matches what is on screen.
    const selectText = (id) => { const el = document.getElementById(id); return el && el.selectedIndex >= 0 ? el.options[el.selectedIndex].text : "-"; };
    window.__cgReport = {
      year, actName: sec.name, assetText: selectText("asset"), taxpayerText: selectText("taxpayer-type"),
      purchaseDate: displayDate(pdate), saleDate: displayDate(sdate), holdingText, rateText, method,
      gainType: document.getElementById("gain-type")?.textContent || "", totalTax: INR(totalTax), rows, notes,
      invested: [can54 && inv54 ? [`Section ${sec.house} investment`, INR(inv54)] : null, can54f && inv54f ? [`Section ${sec.other} investment`, INR(inv54f)] : null, can54ec && inv54ec ? [`Section ${sec.bonds} bonds`, INR(inv54ec)] : null].filter(Boolean),
      compare: compare ? [["12.5% without indexation", INR(compare.a.taxable), INR(compare.a.tax), !compare.indexWins], ["20% with indexation", INR(compare.b.taxable), INR(compare.b.tax), compare.indexWins]] : null,
    };
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

  const f = n => '₹' + Math.round(n).toLocaleString('en-IN');
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
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600">Amount (₹)</th>
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
            <th style="text-align:right;padding:9px 14px;color:white;font-weight:600">Amount (₹)</th>
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
            <tr style="background:#F9FAFB"><td style="padding:6px 10px;border-bottom:1px solid #eee">Up to ₹4,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">NIL</td></tr>
            <tr><td style="padding:6px 10px;border-bottom:1px solid #eee">₹4,00,001 - ₹8,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">5%</td></tr>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px;border-bottom:1px solid #eee">₹8,00,001 - ₹12,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">10%</td></tr>
            <tr><td style="padding:6px 10px;border-bottom:1px solid #eee">₹12,00,001 - ₹16,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">15%</td></tr>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px;border-bottom:1px solid #eee">₹16,00,001 - ₹20,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">20%</td></tr>
            <tr><td style="padding:6px 10px;border-bottom:1px solid #eee">₹20,00,001 - ₹24,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">25%</td></tr>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px">Above ₹24,00,000</td><td style="text-align:right;padding:6px 10px">30%</td></tr>
          </tbody>
        </table>
        <table style="width:50%;border-collapse:collapse;font-size:11.5px">
          <thead><tr style="background:#334E78"><th style="text-align:left;padding:7px 10px;color:white;font-weight:600">Old Regime Slab (Below 60)</th><th style="text-align:right;padding:7px 10px;color:white;font-weight:600">Rate</th></tr></thead>
          <tbody>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px;border-bottom:1px solid #eee">Up to ₹2,50,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">NIL</td></tr>
            <tr><td style="padding:6px 10px;border-bottom:1px solid #eee">₹2,50,001 - ₹5,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">5%</td></tr>
            <tr style="background:#F9FAFB"><td style="padding:6px 10px;border-bottom:1px solid #eee">₹5,00,001 - ₹10,00,000</td><td style="text-align:right;padding:6px 10px;border-bottom:1px solid #eee">20%</td></tr>
            <tr><td style="padding:6px 10px">Above ₹10,00,000</td><td style="text-align:right;padding:6px 10px">30%</td></tr>
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
        <div style="font-size:16px;font-weight:700;color:#c62828;margin-top:4px">₹${(parseFloat(int234c.replace(/[^0-9.]/g,'')) || 0) + (parseFloat(int234b.replace(/[^0-9.]/g,'')) || 0)}</div>
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
          <div style="margin-bottom:8px"><span style="color:#666">Estimated Tax Before Credits:</span> <strong>₹${Number(grossTax).toLocaleString('en-IN')}</strong></div>
          <div style="margin-bottom:8px"><span style="color:#666">TDS/TCS Credits:</span> <strong>₹${Number(credits).toLocaleString('en-IN')}</strong></div>
        </div>
        <div style="flex:1;min-width:45%">
          <div style="margin-bottom:8px"><span style="color:#666">Self-Assessment Tax Paid:</span> <strong>₹${Number(selfAssPaid).toLocaleString('en-IN')}</strong></div>
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
    addCommonTaxSchema("Capital Gains Calculator", "https://kcshah.com/tools/capital-gain-calculator", [
      { q: "Does the calculator include Sections 54, 54F and 54EC?", a: "Yes. It includes indicative exemption inputs for Section 54, Section 54F and Section 54EC, subject to statutory conditions." },
      { q: "Which years does the calculator cover?", a: "Sales from FY 2023-24 to FY 2026-27 (Tax Year 2026-27 under the Income-tax Act, 2025). Pick the year from the dropdown or enter the sale date and the correct rates, holding periods and section numbers are applied." },
      { q: "Does it handle post-Budget 2024 capital gains rates?", a: "Yes. It separates listed equity, land/building and other asset classes and applies post-Budget 2024 rates where relevant." },
      { q: "Can it compare indexed and non-indexed land or building tax?", a: "Yes. For eligible resident individuals or HUFs (land/building acquired before 23 July 2024), it shows both 12.5% without indexation and 20% with indexation and applies the lower. Indexed cost is auto-calculated from the Cost Inflation Index, including 384 for FY 2026-27." },
    ]);
    
    
async function generateCapitalGainsReportPDF() {
  const report = window.__cgReport;
  if (!report) { showToast('Enter valid dates and amounts first.', 'error'); return; }
  showToast('Preparing report...', 'info');
  // html-to-image, not html2canvas: html2canvas 1.4.1 draws text about half an em too low.
  try {
    await Promise.all([
      loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js'),
      loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
    ]);
  } catch (e) { showToast('Could not load PDF library.', 'error'); return; }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'});
  const reportNo = 'KCS-CG-' + today.getFullYear() + String(today.getMonth()+1).padStart(2,'0') + String(today.getDate()).padStart(2,'0');

  const navy = '#1F3A6E';
  const gold = '#d95e0b';
  const lightBlue = '#E8EDF5';
  const heading = (text) => `<div style="font-size:12px;font-weight:700;color:${navy};text-transform:uppercase;letter-spacing:0.8px;border-bottom:2px solid ${navy};padding-bottom:6px;margin-bottom:12px">${text}</div>`;
  const detail = (label, value) => `<div style="margin-bottom:8px"><span style="color:#666">${label}:</span> <strong>${value}</strong></div>`;

  const computationHtml = report.rows.map((row, i) => {
    const last = i === report.rows.length - 1;
    const bg = last ? lightBlue : (i % 2 === 0 ? '#F9FAFB' : '#fff');
    const strong = last ? 'font-weight:700;color:' + navy : '';
    return `<tr style="background:${bg}">
      <td style="padding:8px 14px;border-bottom:1px solid #eee;${strong}">${row[0]}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #eee;text-align:right;${strong}">${row[1]}</td>
    </tr>`;
  }).join('');

  const compareHtml = report.compare ? `
    <div style="margin-bottom:22px">
      ${heading('C. Both Methods Compared')}
      <table style="width:100%;border-collapse:collapse;font-size:12.5px">
        <thead><tr style="background:${navy}">
          <th style="text-align:left;padding:9px 14px;color:white;font-weight:600">Method</th>
          <th style="text-align:right;padding:9px 14px;color:white;font-weight:600">Taxable gain</th>
          <th style="text-align:right;padding:9px 14px;color:white;font-weight:600">Tax before surcharge and cess</th>
        </tr></thead>
        <tbody>${report.compare.map((row) => `<tr style="background:${row[3] ? lightBlue : '#fff'}">
          <td style="padding:8px 14px;border-bottom:1px solid #eee;${row[3] ? 'font-weight:700;color:' + navy : ''}">${row[0]}${row[3] ? ' (lower, payable)' : ''}</td>
          <td style="padding:8px 14px;border-bottom:1px solid #eee;text-align:right">${row[1]}</td>
          <td style="padding:8px 14px;border-bottom:1px solid #eee;text-align:right">${row[2]}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>` : '';

  const html = `
<div style="width:794px;background:#fff;font-family:Arial,Helvetica,sans-serif;color:#222;font-size:13px;line-height:1.5">

  <!-- LETTERHEAD -->
  <div style="background:${navy};padding:22px 32px 18px;display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="color:${gold};font-size:22px;font-weight:700;letter-spacing:0.5px">KC Shah &amp; Associates</div>
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
    <div style="font-size:11.5px;color:#555;margin-top:4px">${report.year.label}</div>
  </div>

  <!-- META ROW -->
  <div style="display:flex;justify-content:space-between;padding:12px 32px;background:#fff;border-bottom:1px solid #eee;font-size:11px;color:#555">
    <div><span style="font-weight:600;color:${navy}">Report No:</span> ${reportNo}</div>
    <div><span style="font-weight:600;color:${navy}">Generated:</span> ${dateStr}</div>
    <div><span style="font-weight:600;color:${navy}">Law applied:</span> ${report.actName}</div>
  </div>

  <div style="padding:24px 32px">

    <!-- SUMMARY CARDS -->
    <div style="display:flex;gap:16px;margin-bottom:24px">
      <div style="flex:1;background:${lightBlue};padding:16px;border-radius:8px;border-left:4px solid ${navy}">
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.5px">Classification</div>
        <div style="font-size:16px;font-weight:700;color:${navy};margin-top:4px">${report.gainType}</div>
      </div>
      <div style="flex:1;background:${lightBlue};padding:16px;border-radius:8px;border-left:4px solid ${navy}">
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.5px">Holding Period</div>
        <div style="font-size:14px;font-weight:700;color:${navy};margin-top:4px">${report.holdingText}</div>
      </div>
      <div style="flex:1;background:${lightBlue};padding:16px;border-radius:8px;border-left:4px solid ${gold}">
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.5px">Total Tax Payable</div>
        <div style="font-size:16px;font-weight:700;color:${gold};margin-top:4px">${report.totalTax}</div>
      </div>
    </div>

    <!-- TRANSACTION DETAILS -->
    <div style="margin-bottom:22px">
      ${heading('A. Transaction Details')}
      <div style="display:flex;flex-wrap:wrap;gap:20px;font-size:12px">
        <div style="flex:1;min-width:45%">
          ${detail('Asset type', report.assetText)}
          ${detail('Purchase date', report.purchaseDate)}
          ${detail('Sale date', report.saleDate)}
        </div>
        <div style="flex:1;min-width:45%">
          ${detail('Taxpayer', report.taxpayerText)}
          ${detail('Applicable tax rate', report.rateText)}
          ${report.invested.map((row) => detail(row[0], row[1])).join('')}
        </div>
      </div>
      <div style="margin-top:8px;font-size:11px;color:#666"><em>Method: ${report.method}</em></div>
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

    ${compareHtml}

    <!-- BASIS -->
    <div style="margin-bottom:22px">
      ${heading((report.compare ? 'D' : 'C') + '. Basis and Assumptions')}
      <ul style="margin:0;padding-left:18px;font-size:11.5px;color:#444;list-style:disc">
        ${report.notes.map((note) => `<li style="margin-bottom:5px">${note}</li>`).join('')}
      </ul>
    </div>

    <!-- DISCLAIMER -->
    <div style="background:#FDF2E9;border-left:3px solid ${gold};padding:12px 16px;font-size:10.5px;color:#703f16;margin-top:28px">
      <strong>Disclaimer:</strong> This computation is an estimate based on the figures entered and the law in force for the year shown above. It is not professional tax advice. Please consult your Chartered Accountant before paying advance tax or filing your income tax return.
    </div>

  </div>
</div>
  `;

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:fixed;left:-99999px;top:0;z-index:-1;pointer-events:none';
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);
  const target = wrapper.firstElementChild;

  try {
    const imgData = await htmlToImage.toJpeg(target, {
      pixelRatio: 2,
      quality: 0.97,
      backgroundColor: '#ffffff',
      width: 794,
      height: target.offsetHeight,
      skipFonts: true
    });
    const { jsPDF } = window.jspdf;
    // A4 width; a longer statement gets one taller page so no table row is cut across pages.
    const pdfW = 210;
    const imgH = (target.offsetHeight * pdfW) / 794;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfW, Math.max(297, imgH)] });
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, imgH);
    pdf.save(`KC-Shah-Capital-Gains-FY${report.year.fy}.pdf`);
    showToast('PDF downloaded.', 'success');
  } catch (err) {
    console.error(err);
    showToast('PDF generation failed. Please try again.', 'error');
  } finally {
    document.body.removeChild(wrapper);
  }
}

    window.generateCapitalGainsReportPDF = generateCapitalGainsReportPDF;
    window.calculate = runCapitalGainsCalculator;
    // Open on today's date when it falls in a supported year.
    const cgSaleInput = document.getElementById("sdate");
    if (cgSaleInput && CG_YEARS[finYearStart(new Date())]) cgSaleInput.value = isoDate(new Date());
    runCapitalGainsCalculator("date");
    document.addEventListener("DOMContentLoaded", () => runCapitalGainsCalculator("date"));
  }
})();
