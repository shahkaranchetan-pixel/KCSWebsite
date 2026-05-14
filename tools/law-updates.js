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
    if (trustCount && trustCount.textContent.includes("8 Free Tools")) trustCount.textContent = "11 Free Tools";
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

  function buildIncomeTaxUI() {
    const firstCard = document.querySelector(".tool-card-title .fa-user")?.closest(".tool-card");
    const incomeCard = document.querySelector(".tool-card-title .fa-indian-rupee-sign")?.closest(".tool-card");
    const deductionCard = document.querySelector(".tool-card-title .fa-receipt")?.closest(".tool-card");
    const breakdown = document.getElementById("breakdown-table");
    if (!firstCard || !incomeCard || !deductionCard || !breakdown) return;

    firstCard.innerHTML = `
      <div class="tool-card-title"><i class="fa-solid fa-user"></i> Taxpayer Profile</div>
      <div class="tool-input-group">
        <label>Residential Status</label>
        <select id="residential-status" class="tool-select" onchange="calculate()">
          <option value="resident">Resident Individual / HUF</option>
          <option value="nonresident">Non-resident / Not ordinarily resident</option>
        </select>
      </div>
      <div class="tool-input-group">
        <label>Primary Income Type</label>
        <div class="tool-radio-group">
          <div class="tool-radio-btn"><input type="radio" id="profile-salaried" name="profile" value="salaried" checked onchange="calculate()"><label for="profile-salaried">Salaried / Pension</label></div>
          <div class="tool-radio-btn"><input type="radio" id="profile-business" name="profile" value="business" onchange="calculate()"><label for="profile-business">Business / Profession</label></div>
        </div>
      </div>
      <div class="tool-input-group">
        <label>Age Category</label>
        <div class="tool-radio-group">
          <div class="tool-radio-btn"><input type="radio" id="age0" name="age" value="0" checked onchange="calculate()"><label for="age0">Below 60</label></div>
          <div class="tool-radio-btn"><input type="radio" id="age1" name="age" value="1" onchange="calculate()"><label for="age1">60 - 80</label></div>
          <div class="tool-radio-btn"><input type="radio" id="age2" name="age" value="2" onchange="calculate()"><label for="age2">Above 80</label></div>
        </div>
      </div>`;

    incomeCard.innerHTML = `
      <div class="tool-card-title"><i class="fa-solid fa-indian-rupee-sign"></i> Income Details</div>
      <div class="tool-input-group"><label>Salary / Pension Income <span>Standard deduction applies only here</span></label><div class="tool-input-prefix"><input type="number" id="salary-income" class="tool-input" value="1200000" min="0" oninput="calculate()"></div></div>
      <div class="tool-input-group"><label>Business / Professional Income</label><div class="tool-input-prefix"><input type="number" id="business-income" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
      <div class="tool-input-group"><label>House Property Income / Loss <span>Enter positive amount after set-off limits</span></label><div class="tool-input-prefix"><input type="number" id="house-income" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
      <div class="tool-input-group"><label>Income from Other Sources</label><div class="tool-input-prefix"><input type="number" id="other-income" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
      <details style="margin-top:10px">
        <summary style="cursor:pointer;font-weight:700;color:var(--navy)">Special-rate capital gains</summary>
        <div class="tool-input-group" style="margin-top:12px"><label>STCG u/s 111A <span>Listed equity / equity MF</span></label><div class="tool-input-prefix"><input type="number" id="stcg-111a" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
        <div class="tool-input-group"><label>LTCG u/s 112A <span>Listed equity / equity MF</span></label><div class="tool-input-prefix"><input type="number" id="ltcg-112a" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
        <div class="tool-input-group"><label>Other Special-rate LTCG u/s 112</label><div class="tool-input-prefix"><input type="number" id="ltcg-112" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
        <div class="tool-input-group"><label>Normal-rate Capital Gains</label><div class="tool-input-prefix"><input type="number" id="normal-cg" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
      </details>`;

    deductionCard.innerHTML = `
      <div class="tool-card-title"><i class="fa-solid fa-receipt"></i> Deductions & Exemptions</div>
      <div class="tool-info-box"><i class="fa-solid fa-circle-info"></i><p>Most Chapter VI-A deductions apply only to the old regime. Employer NPS and eligible salary/family pension deductions are considered separately where allowed.</p></div>
      <div class="tool-input-group"><label>Section 80C <span>Max ₹1,50,000</span></label><div class="tool-input-prefix"><input type="number" id="c80c" class="tool-input" value="150000" min="0" oninput="calculate()"></div></div>
      <div class="tool-input-group"><label>Section 80D - Medical Insurance <span>Auto-capped by age</span></label><div class="tool-input-prefix"><input type="number" id="c80d" class="tool-input" value="25000" min="0" oninput="calculate()"></div></div>
      <div class="tool-input-group"><label>Section 80CCD(1B) - Personal NPS <span>Max ₹50,000</span></label><div class="tool-input-prefix"><input type="number" id="nps" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
      <div class="tool-input-group"><label>Employer NPS u/s 80CCD(2) <span>Allowed in both regimes, capped on salary</span></label><div class="tool-input-prefix"><input type="number" id="nps-employer" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
      <details style="margin-top:10px">
        <summary style="cursor:pointer;font-weight:700;color:var(--navy)">Advanced old-regime deductions</summary>
        <div class="tool-input-group" style="margin-top:12px"><label>HRA Exemption</label><div class="tool-input-prefix"><input type="number" id="hra" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
        <div class="tool-input-group"><label>Housing Loan Interest <span>Old regime, self-occupied cap ₹2,00,000</span></label><div class="tool-input-prefix"><input type="number" id="home-loan-interest" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
        <div class="tool-input-group"><label>Section 80E - Education Loan Interest</label><div class="tool-input-prefix"><input type="number" id="c80e" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
        <div class="tool-input-group"><label>Section 80G - Donations</label><div class="tool-input-prefix"><input type="number" id="c80g" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
        <div class="tool-input-group"><label>Section 80TTA / 80TTB <span>Auto-capped by age</span></label><div class="tool-input-prefix"><input type="number" id="c80tta" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
        <div class="tool-input-group"><label>Family Pension Deduction</label><div class="tool-input-prefix"><input type="number" id="family-pension-deduction" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
        <div class="tool-input-group"><label>Other Chapter VI-A Deductions</label><div class="tool-input-prefix"><input type="number" id="other80" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
      </details>`;

    const grid = document.querySelector("#result-card .tool-result-grid");
    if (grid) {
      grid.innerHTML = `
        <div class="tool-result-item"><div class="label">Old Regime Tax</div><div class="value" id="old-total">₹0</div></div>
        <div class="tool-result-item highlight"><div class="label">New Regime Tax</div><div class="value" id="new-total">₹0</div></div>
        <div class="tool-result-item"><div class="label">Old Taxable Income</div><div class="value" id="old-taxable">₹0</div></div>
        <div class="tool-result-item"><div class="label">New Taxable Income</div><div class="value" id="new-taxable">₹0</div></div>`;
    }
    const resultCard = document.getElementById("result-card");
    if (resultCard && !document.getElementById("tax-assumptions")) {
      resultCard.insertAdjacentHTML("beforeend", `<div class="tool-info-box" id="tax-assumptions" style="margin-top:14px"><i class="fa-solid fa-triangle-exclamation"></i><p>Resident individual/HUF computation. Special-rate capital gains are taxed separately and are not reduced by the new-regime Section 87A rebate.</p></div>`);
    }
    breakdown.querySelector("tbody").innerHTML = `
      <tr><td>Gross Income</td><td id="b-gross-o">₹0</td><td id="b-gross-n">₹0</td></tr>
      <tr><td>Standard / Salary Deduction</td><td id="b-sd-o">₹0</td><td id="b-sd-n">₹0</td></tr>
      <tr><td>Deductions & Exemptions</td><td id="b-ded-o">₹0</td><td id="b-ded-n">₹0</td></tr>
      <tr><td>Taxable Normal Income</td><td id="b-ti-o">₹0</td><td id="b-ti-n">₹0</td></tr>
      <tr><td>Normal Income Tax</td><td id="b-normal-tax-o">₹0</td><td id="b-normal-tax-n">₹0</td></tr>
      <tr><td>Special Rate Tax</td><td id="b-special-tax-o">₹0</td><td id="b-special-tax-n">₹0</td></tr>
      <tr><td>Rebate u/s 87A</td><td id="b-87a-o">₹0</td><td id="b-87a-n">₹0</td></tr>
      <tr><td>Surcharge</td><td id="b-sur-o">₹0</td><td id="b-sur-n">₹0</td></tr>
      <tr><td>Marginal Relief</td><td id="b-mr-o">₹0</td><td id="b-mr-n">₹0</td></tr>
      <tr><td>Health & Education Cess (4%)</td><td id="b-cess-o">₹0</td><td id="b-cess-n">₹0</td></tr>
      <tr class="highlight-row"><td><strong>Total Tax Payable</strong></td><td id="b-total-o"><strong>₹0</strong></td><td id="b-total-n"><strong>₹0</strong></td></tr>
      <tr><td>Effective Tax Rate</td><td id="b-etr-o">0%</td><td id="b-etr-n">0%</td></tr>`;
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
    setText("b-ded-o", INR(oldCalc.deductions));
    setText("b-ded-n", INR(newCalc.deductions));
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
    if (window.drawDonut) drawDonut("donut-chart", [oldCalc.total, newCalc.total], ["Old", "New"], ["#0B1D3A", "#C9A84C"]);
  }

  function buildAdvanceTaxUI() {
    const layout = document.querySelector(".tool-container .tool-layout");
    if (!layout || !document.getElementById("totaltax")) return;
    document.querySelector("h1").textContent = "Advance Tax Calculator FY 2025-26";
    const subtitle = document.querySelector(".tool-page-header p");
    if (subtitle) subtitle.textContent = "Calculate instalments, TDS/TCS credit, 234B interest and 234C shortfall interest for AY 2026-27.";
    layout.innerHTML = `
      <div>
        <div class="tool-card" style="margin-bottom:20px">
          <div class="tool-card-title"><i class="fa-solid fa-user-check"></i> Taxpayer Details</div>
          <div class="tool-input-group">
            <label>Taxpayer Type</label>
            <select id="advance-taxpayer-type" class="tool-select" onchange="calculate()">
              <option value="regular">Regular taxpayer</option>
              <option value="presumptive">Presumptive income u/s 44AD / 44ADA</option>
            </select>
          </div>
          <div class="tool-input-group"><label>Estimated Tax Before Credits <span>Final annual tax including surcharge and cess</span></label><div class="tool-input-prefix"><input type="number" id="advance-gross-tax" class="tool-input" value="500000" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>TDS / TCS / Relief Already Available</label><div class="tool-input-prefix"><input type="number" id="advance-credits" class="tool-input" value="100000" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Self-assessment Tax Already Paid</label><div class="tool-input-prefix"><input type="number" id="self-assessment-paid" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Months after 1 April for 234B <span>Use months/part-months of delay</span></label><input type="number" id="months-234b" class="tool-input" value="1" min="0" oninput="calculate()"></div>
        </div>
        <div class="tool-card" style="margin-bottom:20px">
          <div class="tool-card-title"><i class="fa-solid fa-money-bill"></i> Advance Tax Paid</div>
          <div class="tool-input-group"><label>Paid on/before 15 June</label><div class="tool-input-prefix"><input type="number" id="p_jun" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Paid on/before 15 September</label><div class="tool-input-prefix"><input type="number" id="p_sep" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Paid on/before 15 December</label><div class="tool-input-prefix"><input type="number" id="p_dec" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Paid on/before 15 March</label><div class="tool-input-prefix"><input type="number" id="p_mar" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
          <div class="tool-info-box"><i class="fa-solid fa-circle-info"></i><p>For unexpected capital gains or similar income, 234C relief may apply if tax is paid in remaining instalments. Review final facts before filing.</p></div>
        </div>
      </div>
      <div>
        <div id="result-card" class="tool-card" style="margin-bottom:20px">
          <div class="tool-card-title"><i class="fa-solid fa-chart-pie"></i> Payment Schedule</div>
          <div class="tool-result" style="text-align:center;margin-bottom:16px">
            <div class="tool-result-label">Net Advance Tax Payable</div>
            <div class="tool-result-value" id="net-tax">₹0</div>
            <div class="tool-result-sub" id="advance-advice">Enter your estimated tax and payments</div>
          </div>
          <table class="tool-comparison" id="adv-table">
            <thead><tr><th>Due Date</th><th>Required</th><th>Paid Cumulative</th><th>Shortfall</th><th>234C</th></tr></thead>
            <tbody id="advance-breakdown"></tbody>
          </table>
          <div class="tool-result-grid" style="margin-top:16px">
            <div class="tool-result-item"><div class="label">Estimated 234C</div><div class="value" id="int234c">₹0</div></div>
            <div class="tool-result-item"><div class="label">Estimated 234B</div><div class="value" id="int234b">₹0</div></div>
            <div class="tool-result-item highlight" style="grid-column:span 2"><div class="label">Balance / Shortfall After Credits & Payments</div><div class="value" id="advance-balance">₹0</div></div>
          </div>
          <div class="tool-info-box" style="margin-top:16px"><i class="fa-solid fa-triangle-exclamation"></i><p id="advance-assumption">Interest estimate uses Section 211 instalment percentages and 1% monthly interest assumptions. Presumptive taxpayers generally pay 100% by 15 March.</p></div>
          <div class="tool-actions"><button class="tool-btn tool-btn-outline" onclick="downloadPDF('result-card','Advance-Tax-KCShah')">Download PDF</button></div>
        </div>
      </div>`;
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

  function buildCapitalGainsUI() {
    const toolLayout = document.querySelector(".tool-container .tool-layout");
    if (!toolLayout || !document.getElementById("asset")) return;
    document.querySelector("h1").textContent = "Capital Gains Calculator";
    const subtitle = document.querySelector(".tool-page-header p");
    if (subtitle) subtitle.textContent = "Calculate STCG, LTCG, exemptions, cess and post-Budget 2024 tax treatment.";
    toolLayout.innerHTML = `
      <div id="capital-pdf-area">
        <div class="tool-card" style="margin-bottom:20px">
          <div class="tool-card-title"><i class="fa-solid fa-house"></i> Asset Details</div>
          <div class="tool-input-group"><label>Asset Type</label><select id="asset" class="tool-select" onchange="calculate()"><option value="eq_listed">Listed Equity / Equity MF</option><option value="property">Residential House Property</option><option value="land_building">Land / Building</option><option value="gold">Gold / Jewelry</option><option value="eq_unlisted">Unlisted Equity</option><option value="debt">Debt Mutual Fund</option></select></div>
          <div class="grid grid-2" style="margin-bottom:12px"><div class="tool-input-group"><label>Purchase Date</label><input type="date" id="pdate" class="tool-input" value="2020-04-01" onchange="calculate()"></div><div class="tool-input-group"><label>Sale Date</label><input type="date" id="sdate" class="tool-input" value="2025-04-01" onchange="calculate()"></div></div>
          <div class="tool-input-group"><label>Purchase Price</label><div class="tool-input-prefix"><input type="number" id="pprice" class="tool-input" value="100000" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Indexed Cost <span>Optional, for eligible land/building comparison</span></label><div class="tool-input-prefix"><input type="number" id="indexed-cost" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Sale Price / Full Value of Consideration</label><div class="tool-input-prefix"><input type="number" id="sprice" class="tool-input" value="250000" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Transfer Expenses</label><div class="tool-input-prefix"><input type="number" id="exp" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Taxpayer Type</label><select id="taxpayer-type" class="tool-select" onchange="calculate()"><option value="resident">Resident individual / HUF</option><option value="other">Other taxpayer</option></select></div>
          <div class="tool-input-group"><label>Surcharge Rate</label><select id="cg-surcharge-rate" class="tool-select" onchange="calculate()"><option value="0">No surcharge</option><option value="0.1">10%</option><option value="0.15">15%</option><option value="0.25">25%</option><option value="0.37">37%</option></select></div>
        </div>
        <div class="tool-card" style="margin-bottom:20px">
          <div class="tool-card-title"><i class="fa-solid fa-key"></i> Exemptions</div>
          <div class="tool-input-group"><label>Section 54 Investment <span>Residential house sold, max eligible investment ₹10 crore</span></label><div class="tool-input-prefix"><input type="number" id="sec54" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Section 54F Investment <span>Other long-term asset into residential house</span></label><div class="tool-input-prefix"><input type="number" id="sec54f" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
          <div class="tool-input-group"><label>Section 54EC Bonds <span>Land/building LTCG, cap ₹50 lakh</span></label><div class="tool-input-prefix"><input type="number" id="sec54ec" class="tool-input" value="0" min="0" oninput="calculate()"></div></div>
        </div>
      </div>
      <div>
        <div id="result-card" class="tool-card" style="margin-bottom:20px">
          <div class="tool-card-title"><i class="fa-solid fa-chart-pie"></i> Capital Gains Result</div>
          <div class="tool-result" style="text-align:center;margin-bottom:16px"><div class="tool-result-label" id="gain-type">Long Term Capital Gain</div><div class="tool-result-value" id="gain-amount">₹0</div><div class="tool-result-sub" id="tax-method">Post Budget 2024 method</div></div>
          <div class="tool-result-grid"><div class="tool-result-item"><div class="label">Holding Period</div><div class="value" id="hold-period">0 Months</div></div><div class="tool-result-item"><div class="label">Tax Rate</div><div class="value" id="tax-rate">12.5%</div></div><div class="tool-result-item"><div class="label">Exemption Claimed</div><div class="value" id="cg-exemption">₹0</div></div><div class="tool-result-item highlight"><div class="label">Total Tax incl. Cess</div><div class="value" id="tax-amount">₹0</div></div></div>
          <div class="tool-info-box" style="margin-top:16px"><i class="fa-solid fa-info-circle"></i><p id="cg-eligibility">Exemptions are indicative and subject to investment timing, ownership, lock-in and CGAS conditions.</p></div>
          <div class="tool-actions"><button class="tool-btn tool-btn-outline" onclick="downloadPDF('capital-pdf-area','Capital-Gains-KCShah')">Download PDF</button></div>
        </div>
        <div class="tool-card" style="margin-bottom:20px"><div class="tool-card-title"><i class="fa-solid fa-table"></i> Computation</div><table class="tool-comparison"><tbody id="cg-breakdown"></tbody></table></div>
      </div>`;
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
    const postBudget = sdate >= new Date("2024-07-23");
    let rate = 0.3;
    let method = isLong ? "Long-term capital gain" : "Short-term capital gain";
    let taxableBeforeExemption = grossGain;
    let eligibility = "STCG is generally taxed at applicable slab rates except listed equity/equity MF under Section 111A.";

    if (asset === "eq_listed") {
      rate = isLong ? (postBudget ? 0.125 : 0.1) : (postBudget ? 0.2 : 0.15);
      taxableBeforeExemption = isLong ? Math.max(0, grossGain - (postBudget ? 125000 : 100000)) : grossGain;
      eligibility = isLong ? "Listed equity/equity MF LTCG exemption threshold applied before tax." : "Listed equity/equity MF STCG uses the special Section 111A rate.";
    } else if (isLong) {
      rate = postBudget ? 0.125 : 0.2;
      eligibility = "LTCG exemption depends on asset type, investment timing, ownership and lock-in conditions.";
      if ((asset === "property" || asset === "land_building") && postBudget && document.getElementById("taxpayer-type")?.value === "resident") {
        const indexedCost = num("indexed-cost");
        const oldTaxable = Math.max(0, netConsideration - (indexedCost || cost));
        const oldTax = oldTaxable * 0.2;
        const newTax = grossGain * 0.125;
        if (indexedCost && oldTax < newTax) {
          rate = 0.2;
          taxableBeforeExemption = oldTaxable;
          method = "LTCG - 20% with indexation comparison";
          eligibility = "Resident individual/HUF land or building comparison selected the lower indexed-tax result.";
        } else {
          method = "LTCG - 12.5% without indexation";
        }
      }
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
    const baseTax = taxableGain * rate;
    const surchargeAmount = baseTax * (Number(document.getElementById("cg-surcharge-rate")?.value) || 0);
    const cess = (baseTax + surchargeAmount) * 0.04;
    const totalTax = Math.round(baseTax + surchargeAmount + cess);

    setText("gain-type", isLong ? "Long Term Capital Gain" : "Short Term Capital Gain");
    setText("gain-amount", INR(grossGain));
    setText("hold-period", `${months} Months (${threshold}+ months for LTCG)`);
    setText("tax-rate", `${(rate * 100).toFixed(rate === 0.125 ? 1 : 0)}%`);
    setText("tax-method", method);
    setText("cg-exemption", INR(exemption));
    setText("tax-amount", INR(totalTax));
    setText("cg-eligibility", `${eligibility} Section 54/54F/54EC benefits require prescribed reinvestment timelines, CGAS deposit where applicable, and lock-in compliance.`);
    const rows = [
      ["Sale consideration", sale],
      ["Less: transfer expenses", expenses],
      ["Net consideration", netConsideration],
      ["Cost of acquisition", cost],
      ["Indexed cost used", rate === 0.2 ? (num("indexed-cost") || cost) : 0],
      ["Gross capital gain", grossGain],
      ["Section 54 exemption", exemption54],
      ["Section 54F exemption", exemption54f],
      ["Section 54EC exemption", exemption54ec],
      ["Taxable capital gain", taxableGain],
      ["Tax before surcharge/cess", baseTax],
      ["Surcharge", surchargeAmount],
      ["Health & Education Cess", cess],
      ["Total tax", totalTax],
    ];
    const body = document.getElementById("cg-breakdown");
    if (body) body.innerHTML = rows.map(([label, value], index) => `<tr${index === rows.length - 1 ? ' class="highlight-row"' : ""}><td>${label}</td><td>${INR(value)}</td></tr>`).join("");
  }

  const path = location.pathname;
  if (path.endsWith("/tools/") || path.endsWith("/tools/index.html")) enhanceToolsHub();
  if (path.endsWith("/tools/income-tax-calculator.html")) {
    addCommonTaxSchema("Income Tax Calculator", "https://kcshah.com/tools/income-tax-calculator.html", [
      { q: "Does the calculator compare old and new tax regimes?", a: "Yes. It compares the old and new regimes for FY 2025-26 / AY 2026-27 using slab tax, eligible deductions, rebate, surcharge, marginal relief and cess." },
      { q: "Are special-rate capital gains covered?", a: "Yes. It separates STCG under section 111A and LTCG under sections 112A and 112 so they are not incorrectly reduced by the new-regime Section 87A rebate." },
      { q: "Is this a substitute for tax filing advice?", a: "No. It is an indicative calculator based on user inputs and should be reviewed before filing a return." },
    ]);
    buildIncomeTaxUI();
    window.calculate = runIncomeTaxCalculator;
    window.generateTaxReportPDF = function () { downloadPDF("pdf-export-area", "Income-Tax-KCShah"); };
    document.addEventListener("DOMContentLoaded", runIncomeTaxCalculator);
    runIncomeTaxCalculator();
  }
  if (path.endsWith("/tools/advance-tax-calculator.html")) {
    addCommonTaxSchema("Advance Tax Calculator", "https://kcshah.com/tools/advance-tax-calculator.html", [
      { q: "Who needs to pay advance tax?", a: "A taxpayer generally needs to pay advance tax when net tax liability after TDS/TCS is Rs. 10,000 or more." },
      { q: "What instalments are used for regular taxpayers?", a: "Regular taxpayers generally use cumulative instalments of 15%, 45%, 75% and 100% by 15 June, 15 September, 15 December and 15 March." },
      { q: "Does the calculator estimate 234B and 234C interest?", a: "Yes. It estimates 234C for instalment shortfalls and 234B where advance tax paid is below the required threshold." },
    ]);
    buildAdvanceTaxUI();
    window.calculate = runAdvanceTaxCalculator;
    document.addEventListener("DOMContentLoaded", runAdvanceTaxCalculator);
    runAdvanceTaxCalculator();
  }
  if (path.endsWith("/tools/capital-gain-calculator.html")) {
    addCommonTaxSchema("Capital Gains Calculator", "https://kcshah.com/tools/capital-gain-calculator.html", [
      { q: "Does the calculator include Sections 54, 54F and 54EC?", a: "Yes. It includes indicative exemption inputs for Section 54, Section 54F and Section 54EC, subject to statutory conditions." },
      { q: "Does it handle post-Budget 2024 capital gains rates?", a: "Yes. It separates listed equity, land/building and other asset classes and applies post-Budget 2024 rates where relevant." },
      { q: "Can it compare indexed and non-indexed land or building tax?", a: "Yes. For eligible resident individuals or HUFs, it can compare 12.5% without indexation against 20% with indexation when indexed cost is entered." },
    ]);
    buildCapitalGainsUI();
    window.calculate = runCapitalGainsCalculator;
    document.addEventListener("DOMContentLoaded", runCapitalGainsCalculator);
    runCapitalGainsCalculator();
  }
})();
