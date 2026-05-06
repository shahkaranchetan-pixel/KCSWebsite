// node builder.js — generates all 24 remaining academy course pages
const fs = require('fs');
const path = require('path');

const COURSES = [
  {
    id:'zoho-books-advanced', title:'Zoho Books Advanced', cat:'zoho', catLabel:'Zoho Training',
    catBadge:'cat-badge-zoho', thumb:'thumb-zoho', thumbStyle:'background:linear-gradient(135deg,#0D47A1,#1565C0)',
    thumbIcon:'fa-chart-line', level:'Advanced', lessons:6, duration:'3.5 hours',
    relatedService:{title:'Zoho Books Outsourcing', url:'../zoho-books-outsourcing.html'},
    seoTitle:'Zoho Books Advanced — Free Online Course | KC Shah Academy',
    seoDesc:'Master advanced Zoho Books features — MIS dashboards, custom reports, automation, multi-currency & GST reconciliation. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/zoho-books-advanced.html',
    lead:'Go beyond the basics — build MIS dashboards, create custom reports, set up automation rules, handle multi-currency transactions and master advanced GST reconciliation in Zoho Books.',
    modules:[
      {t:'Custom Reports & MIS Dashboards in Zoho Books', d:'22 min'},
      {t:'Automation Rules, Recurring Transactions & Workflows', d:'18 min'},
      {t:'Multi-Currency Accounting & Exchange Rate Management', d:'16 min'},
      {t:'Advanced GST: GSTR-2A Reconciliation & ITC Tracking', d:'20 min'},
      {t:'Budgeting, Forecasting & Variance Analysis', d:'18 min'},
      {t:'Zoho Books Integrations: CRM, Payroll & Analytics', d:'16 min'},
    ],
    quiz:[
      {q:'Which Zoho Books feature allows you to set a financial target and compare it with actual performance?',opts:['Custom Reports','Budgeting','Automation Rules','Multi-Currency'],a:1},
      {q:'What does GSTR-2A reconciliation help you verify?',opts:['Your sales invoices','Input Tax Credit claims against supplier filings','Employee payroll deductions','Bank statement entries'],a:1},
      {q:'In Zoho Books, automation rules can trigger which of the following?',opts:['Automatic GST filing','Sending payment reminders to customers','Filing ITR automatically','Generating Form 16'],a:1},
      {q:'Which report in Zoho Books shows your income and expenses over a period?',opts:['Balance Sheet','Trial Balance','Profit & Loss Statement','Cash Flow Statement'],a:2},
      {q:'When recording a foreign currency invoice in Zoho Books, what rate is applied?',opts:['A fixed rate set during setup','The exchange rate on the invoice date','The RBI rate from last year','Always 1:1 regardless of currency'],a:1},
    ],
    faqs:[
      {q:'What is the difference between Zoho Books Basic and Advanced features?',a:'Basic features cover invoicing, bills, bank reconciliation and GST filing. Advanced features include custom dashboards, automation workflows, multi-currency, budget tracking and integrations with other Zoho apps.'},
      {q:'Do I need to complete Zoho Books Basics before this course?',a:'Yes, this course assumes you already know how to create invoices, manage contacts and reconcile bank accounts. Complete Zoho Books Basics first.'},
      {q:'Can I integrate Zoho Books with Zoho CRM?',a:'Yes. Zoho Books integrates natively with Zoho CRM, Zoho Payroll, Zoho Inventory and Zoho Analytics. This course covers the key integrations.'},
      {q:'How do I set up automation rules in Zoho Books?',a:'Go to Settings > Automation > Workflow Rules. You can trigger actions like sending emails, creating tasks or updating records based on conditions you define.'},
      {q:'Is multi-currency support available on the free Zoho Books plan?',a:'Multi-currency is available on paid plans (Standard and above). The free plan supports only the base currency set during organisation setup.'},
    ],
    related:['zoho-books-basics','zoho-crm-basics','financial-modeling-basics'],
  },
  {
    id:'zoho-crm-basics', title:'Zoho CRM Basics', cat:'zoho', catLabel:'Zoho Training',
    catBadge:'cat-badge-zoho', thumb:'thumb-zoho', thumbStyle:'background:linear-gradient(135deg,#1976D2,#2196F3)',
    thumbIcon:'fa-users', level:'Beginner', lessons:6, duration:'3 hours',
    relatedService:{title:'Zoho Books Outsourcing', url:'../zoho-books-outsourcing.html'},
    seoTitle:'Zoho CRM Basics — Free Online Course | KC Shah Academy',
    seoDesc:'Learn Zoho CRM for beginners. Manage leads, contacts, deals and pipelines. Automate follow-ups and track your sales. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/zoho-crm-basics.html',
    lead:'Manage your entire sales process in one place — capture leads, track deals through a visual pipeline, automate follow-ups and close more business with Zoho CRM.',
    modules:[
      {t:'Introduction to CRM & Zoho CRM Overview', d:'12 min'},
      {t:'Setting Up Leads, Contacts & Accounts', d:'16 min'},
      {t:'Managing Deals & Sales Pipeline', d:'18 min'},
      {t:'Activities: Tasks, Calls, Meetings & Follow-Ups', d:'14 min'},
      {t:'Workflows & Email Automation in Zoho CRM', d:'18 min'},
      {t:'Reports, Dashboards & Sales Analytics', d:'14 min'},
    ],
    quiz:[
      {q:'In Zoho CRM, what is a "Lead"?',opts:['A confirmed sale','A potential prospect who has shown interest','An existing paying customer','A product in your catalog'],a:1},
      {q:'What does the "Pipeline" view in Zoho CRM show?',opts:['All your invoices','Deals at different stages of the sales process','Employee task lists','Bank transactions'],a:1},
      {q:'Which Zoho CRM feature automatically sends emails or creates tasks based on triggers?',opts:['Reports','Dashboards','Workflows','Blueprints'],a:2},
      {q:'What is the difference between a Contact and an Account in Zoho CRM?',opts:['No difference — they are the same','A Contact is a person; an Account is the company they work for','An Account is a person; a Contact is their employer','A Contact is a lead; an Account is a deal'],a:1},
      {q:'Which Zoho CRM feature lets you visualise your sales performance with charts?',opts:['Pipeline','Workflow','Dashboard','Blueprint'],a:2},
    ],
    faqs:[
      {q:'Is Zoho CRM free?',a:'Zoho CRM has a free plan for up to 3 users with basic lead and contact management. Paid plans start from ₹1,300/user/month with advanced automation and analytics.'},
      {q:'Can Zoho CRM integrate with Zoho Books?',a:'Yes. When you close a deal in Zoho CRM, you can automatically create a customer and invoice in Zoho Books, eliminating double data entry.'},
      {q:'Is Zoho CRM suitable for a small CA firm or consultancy?',a:'Absolutely. Zoho CRM is ideal for service businesses — you can track enquiries, proposals sent, follow-ups and conversions. Many CA firms and consultancies use it effectively.'},
      {q:'How is Zoho CRM different from a spreadsheet for tracking leads?',a:'Zoho CRM offers automated follow-up reminders, email tracking, pipeline visualisation, team collaboration and analytics — none of which are possible with a spreadsheet.'},
      {q:'What should I learn after Zoho CRM Basics?',a:'Explore Zoho Books Basics (for invoicing once a deal closes), and then Zoho Books Advanced for integrated reporting across sales and accounting.'},
    ],
    related:['zoho-books-basics','zoho-payroll-basics','zoho-inventory-basics'],
  },
  {
    id:'zoho-payroll-basics', title:'Zoho Payroll Basics', cat:'zoho', catLabel:'Zoho Training',
    catBadge:'cat-badge-zoho', thumb:'thumb-zoho', thumbStyle:'background:linear-gradient(135deg,#1E88E5,#42A5F5)',
    thumbIcon:'fa-money-bill-wave', level:'Beginner', lessons:5, duration:'2.5 hours',
    relatedService:{title:'Zoho Books Outsourcing', url:'../zoho-books-outsourcing.html'},
    seoTitle:'Zoho Payroll Basics — Free Online Course | KC Shah Academy',
    seoDesc:'Set up Zoho Payroll from scratch. Configure salary components, PF/ESI/TDS deductions, process payslips and generate Form 16. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/zoho-payroll-basics.html',
    lead:'Set up Zoho Payroll for your organisation — configure salary structures, statutory deductions (PF, ESI, TDS), process monthly payroll and generate payslips and Form 16 automatically.',
    modules:[
      {t:'Introduction to Zoho Payroll & Organisation Setup', d:'14 min'},
      {t:'Employee Master, Salary Components & Pay Grades', d:'18 min'},
      {t:'Statutory Compliance: PF, ESI & Professional Tax Setup', d:'20 min'},
      {t:'TDS on Salary: 192 Configuration & Tax Projection', d:'18 min'},
      {t:'Running Payroll, Payslips & Form 16 Generation', d:'20 min'},
    ],
    quiz:[
      {q:'What is the current employer PF contribution rate in India?',opts:['10%','12%','15%','8%'],a:1},
      {q:'Under which section of the Income Tax Act is TDS on salary deducted?',opts:['Section 194A','Section 194C','Section 192','Section 194J'],a:2},
      {q:'ESI (ESIC) is applicable for employees earning up to which monthly salary?',opts:['₹10,000','₹15,000','₹21,000','₹25,000'],a:2},
      {q:'Form 16 is issued by an employer to an employee for which purpose?',opts:['GST compliance','TDS certificate for salary income','PF withdrawal','ESI claim'],a:1},
      {q:'In Zoho Payroll, what is a "Pay Schedule"?',opts:['The list of employees in your company','The frequency and dates on which payroll is processed','The Form 16 generation cycle','The TDS deposit schedule'],a:1},
    ],
    faqs:[
      {q:'Does Zoho Payroll handle PF and ESI filing automatically?',a:'Zoho Payroll calculates PF and ESI deductions automatically. For actual filing, you need to download the ECR file and upload it to the EPFO portal, or use Zoho Payroll\'s direct filing feature available on higher plans.'},
      {q:'Can Zoho Payroll integrate with Zoho Books?',a:'Yes. Once payroll is processed in Zoho Payroll, journal entries are automatically posted to Zoho Books, saving time and eliminating manual reconciliation.'},
      {q:'Is Zoho Payroll compliant with Indian labour laws?',a:'Zoho Payroll is built for Indian compliance — covering PF, ESI, PT, TDS (Section 192), LWF and gratuity calculations. It is updated regularly when statutory rates change.'},
      {q:'How many employees can I manage on Zoho Payroll?',a:'Zoho Payroll supports any number of employees. Pricing is per employee per month, starting from ₹40/employee/month.'},
      {q:'What is the difference between CTC, Gross Salary and Net Salary?',a:'CTC (Cost to Company) includes all employer costs including PF contribution. Gross Salary is the total before deductions. Net Salary (take-home) is after deducting PF, ESI, TDS and PT.'},
    ],
    related:['zoho-books-basics','tds-basics','basics-of-accounting'],
  },
  {
    id:'zoho-inventory-basics', title:'Zoho Inventory Basics', cat:'zoho', catLabel:'Zoho Training',
    catBadge:'cat-badge-zoho', thumb:'thumb-zoho', thumbStyle:'background:linear-gradient(135deg,#0288D1,#03A9F4)',
    thumbIcon:'fa-boxes-stacked', level:'Beginner', lessons:5, duration:'2.5 hours',
    relatedService:{title:'Zoho Books Outsourcing', url:'../zoho-books-outsourcing.html'},
    seoTitle:'Zoho Inventory Basics — Free Online Course | KC Shah Academy',
    seoDesc:'Manage items, warehouses, purchase and sales orders and shipments in Zoho Inventory. Free beginner course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/zoho-inventory-basics.html',
    lead:'Manage your products, warehouses, purchase orders and sales orders in Zoho Inventory — with real-time stock tracking, shipment management and multi-channel selling.',
    modules:[
      {t:'Introduction to Zoho Inventory & Account Setup', d:'12 min'},
      {t:'Items, Item Groups & Price Lists', d:'16 min'},
      {t:'Purchase Orders, Vendor Bills & Receiving Stock', d:'18 min'},
      {t:'Sales Orders, Packing Lists & Shipment Tracking', d:'18 min'},
      {t:'Inventory Reports, Stock Adjustments & Integration with Zoho Books', d:'16 min'},
    ],
    quiz:[
      {q:'What is a "Purchase Order" in Zoho Inventory?',opts:['An invoice sent to a customer','A formal order placed with a vendor to buy goods','A shipment confirmation sent to a courier','A stock adjustment entry'],a:1},
      {q:'Which document is created in Zoho Inventory when you deliver goods to a customer?',opts:['Purchase Order','Credit Note','Packing Slip / Shipment','Vendor Bill'],a:2},
      {q:'What does "FIFO" mean in inventory costing?',opts:['First Invoice, First Out','First In, First Out','Full Inventory Flow Overview','Fixed Item, Fixed Order'],a:1},
      {q:'Which Zoho Inventory feature lets you track products across multiple storage locations?',opts:['Price Lists','Item Groups','Multi-Warehouse Management','Sales Orders'],a:2},
      {q:'What happens in Zoho Inventory when you confirm a Sales Order?',opts:['The invoice is automatically sent to the customer','Stock is reserved and a packing slip can be created','Payment is automatically collected','A vendor bill is raised'],a:1},
    ],
    faqs:[
      {q:'How is Zoho Inventory different from Zoho Books?',a:'Zoho Books is an accounting software focused on financial transactions. Zoho Inventory focuses on stock management — tracking item quantities, warehouse locations and order fulfilment. They integrate tightly.'},
      {q:'Can Zoho Inventory sync with Amazon or Flipkart?',a:'Yes. Zoho Inventory integrates with Amazon, Flipkart, Shopify and other e-commerce platforms to centralise order and inventory management.'},
      {q:'Is Zoho Inventory suitable for a small product-based business?',a:'Yes. Zoho Inventory is well-suited for small to mid-sized product businesses. The free plan supports up to 50 orders per month.'},
      {q:'How does Zoho Inventory handle GST on purchase orders?',a:'Zoho Inventory automatically applies GST based on the item\'s HSN code and the vendor\'s GST registration. When integrated with Zoho Books, ITC is automatically tracked.'},
      {q:'What report should I check to know which items are running low?',a:'The "Inventory Summary" report shows current stock levels for all items. You can also set reorder points in Zoho Inventory to get alerts when stock falls below a threshold.'},
    ],
    related:['zoho-books-basics','zoho-crm-basics','gst-basics'],
  },
  {
    id:'excel-beginners', title:'Excel for Beginners', cat:'excel', catLabel:'Excel Training',
    catBadge:'cat-badge-excel', thumb:'thumb-excel', thumbStyle:'',
    thumbIcon:'fa-file-excel', level:'Beginner', lessons:8, duration:'4 hours',
    relatedService:{title:'Virtual CFO Services', url:'../virtual-cfo.html'},
    seoTitle:'Excel for Beginners — Free Online Course | KC Shah Academy',
    seoDesc:'Learn Microsoft Excel from scratch. Formulas, formatting, sorting, filtering, SUM/IF/COUNT functions and creating your first professional spreadsheet. Free course.',
    canonical:'https://kcshah.com/academy/excel-beginners.html',
    lead:'Start your Excel journey from zero — learn navigation, formulas, functions, formatting, sorting, filtering and how to build a clean, professional spreadsheet for business use.',
    modules:[
      {t:'Excel Interface: Ribbons, Cells, Rows & Columns', d:'12 min'},
      {t:'Entering Data, Formatting Cells & Number Formats', d:'16 min'},
      {t:'Essential Formulas: SUM, AVERAGE, MIN, MAX, COUNT', d:'18 min'},
      {t:'Logical Functions: IF, AND, OR & Nested IF', d:'20 min'},
      {t:'Sorting, Filtering & Conditional Formatting', d:'16 min'},
      {t:'Working with Multiple Sheets & Cross-Sheet Formulas', d:'14 min'},
      {t:'Creating Charts: Bar, Line, Pie & Column Charts', d:'16 min'},
      {t:'Printing, Page Layout & Saving as PDF', d:'12 min'},
    ],
    quiz:[
      {q:'Which Excel formula adds all values in the range A1:A10?',opts:['=COUNT(A1:A10)','=AVERAGE(A1:A10)','=SUM(A1:A10)','=ADD(A1:A10)'],a:2},
      {q:'What does the IF function do in Excel?',opts:['Counts cells with numbers','Returns one value if a condition is true, another if false','Adds up a range of numbers','Finds the maximum value'],a:1},
      {q:'Which keyboard shortcut saves a file in Excel?',opts:['Ctrl+P','Ctrl+Z','Ctrl+S','Ctrl+C'],a:2},
      {q:'What is "Conditional Formatting" used for?',opts:['Changing the page margins','Automatically formatting cells based on their values','Protecting cells from editing','Adding headers and footers'],a:1},
      {q:'If cell A1 contains 100 and B1 contains =A1*2, what does B1 display?',opts:['A1*2','100','200','Error'],a:2},
    ],
    faqs:[
      {q:'Do I need to buy Microsoft Office to learn Excel?',a:'You can use Microsoft Excel (paid, part of Microsoft 365) or the free web version at office.com. Google Sheets is also free and covers most beginner concepts taught in this course.'},
      {q:'Is this course useful for accountants?',a:'Absolutely. Excel is the most widely used tool in accounting and finance. This beginner course gives you the foundation for MIS reporting, GST working, TDS calculations and financial analysis.'},
      {q:'What Excel course should I take after this?',a:'Progress to our "XLOOKUP / VLOOKUP / HLOOKUP" course, then "Pivot Table Training", then "MIS Reporting in Excel" — that path covers what most finance professionals need day-to-day.'},
      {q:'Which Excel version does this course cover?',a:'This course uses Excel 2019 / Microsoft 365. All formulas and features shown are available in Excel 2016 and later. Some newer functions like XLOOKUP require Excel 2019+.'},
      {q:'Can I get a job as an accountant knowing just Excel?',a:'Excel proficiency significantly improves your employability as an accountant. Combined with knowledge of Zoho Books or Tally, it makes you a strong candidate for accounting roles at SMEs.'},
    ],
    related:['pivot-tables','xlookup-vlookup','mis-reporting-excel'],
  },
  {
    id:'advanced-excel', title:'Advanced Excel', cat:'excel', catLabel:'Excel Training',
    catBadge:'cat-badge-excel', thumb:'thumb-excel', thumbStyle:'background:linear-gradient(135deg,#1B5E20,#2E7D32)',
    thumbIcon:'fa-wand-magic-sparkles', level:'Advanced', lessons:7, duration:'4.5 hours',
    relatedService:{title:'Virtual CFO Services', url:'../virtual-cfo.html'},
    seoTitle:'Advanced Excel — Free Online Course | KC Shah Academy',
    seoDesc:'Master advanced Excel: array formulas, Power Query, data validation, macros, XLOOKUP and automation for finance professionals. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/advanced-excel.html',
    lead:'Take Excel to the next level — array formulas, dynamic arrays, Power Query for data transformation, advanced data validation, macros and automation to handle large finance datasets.',
    modules:[
      {t:'Array Formulas & Dynamic Arrays (FILTER, SORT, UNIQUE)', d:'22 min'},
      {t:'Power Query: Connecting, Transforming & Loading Data', d:'28 min'},
      {t:'Advanced Data Validation & Drop-Down Lists', d:'16 min'},
      {t:'Named Ranges, Structured Tables & Dynamic References', d:'18 min'},
      {t:'Macros & VBA: Record, Edit & Run Automation', d:'24 min'},
      {t:'Error Handling: IFERROR, ISERROR & Debugging Formulas', d:'16 min'},
      {t:'What-If Analysis: Goal Seek, Scenario Manager & Data Tables', d:'18 min'},
    ],
    quiz:[
      {q:'Which Excel function returns only rows from a range that meet a condition?',opts:['IF','FILTER','VLOOKUP','MATCH'],a:1},
      {q:'What is Power Query used for in Excel?',opts:['Creating charts','Recording macros','Importing and transforming data from external sources','Writing VBA code'],a:2},
      {q:'What does the VBA keyword "Sub" define?',opts:['A cell reference','A named range','A procedure/macro','A worksheet function'],a:2},
      {q:'Which Excel tool allows you to see how changing one input value affects a formula output?',opts:['Conditional Formatting','Goal Seek','Power Query','Data Validation'],a:1},
      {q:'What does the UNIQUE function return?',opts:['The count of unique values','A list of distinct values from a range (removing duplicates)','The largest unique value','The position of a unique item'],a:1},
    ],
    faqs:[
      {q:'Do I need to know VBA to use this course?',a:'No prior VBA knowledge is required. The macros module starts from recording basics. You will learn enough to automate repetitive tasks without being a programmer.'},
      {q:'What is the difference between Power Query and VLOOKUP?',a:'VLOOKUP finds a single matching value in a table. Power Query is for importing, cleaning and transforming large datasets from multiple sources — it is far more powerful for data preparation.'},
      {q:'Which version of Excel supports Dynamic Arrays?',a:'Dynamic Array functions (FILTER, SORT, UNIQUE, SEQUENCE) are available in Excel 365 and Excel 2021. Older versions use legacy array formulas with Ctrl+Shift+Enter.'},
      {q:'Is Advanced Excel useful for CA work?',a:'Extremely useful. CAs use advanced Excel for financial modelling, audit data analysis, reconciliations, MIS dashboards and handling large data exports from Tally or Zoho Books.'},
      {q:'What should I learn after Advanced Excel?',a:'Move to our Financial Modeling Basics and Dashboard Creation courses — they apply advanced Excel skills directly to finance and business reporting scenarios.'},
    ],
    related:['excel-beginners','pivot-tables','dashboard-creation'],
  },
  {
    id:'pivot-tables', title:'Pivot Table Training', cat:'excel', catLabel:'Excel Training',
    catBadge:'cat-badge-excel', thumb:'thumb-excel', thumbStyle:'background:linear-gradient(135deg,#388E3C,#43A047)',
    thumbIcon:'fa-table-columns', level:'Intermediate', lessons:5, duration:'2.5 hours',
    relatedService:{title:'Virtual CFO Services', url:'../virtual-cfo.html'},
    seoTitle:'Pivot Table Training — Free Excel Course | KC Shah Academy',
    seoDesc:'Create and analyse data with Excel Pivot Tables. Grouping, calculated fields, slicers and Pivot Charts explained with practical finance examples. Free course.',
    canonical:'https://kcshah.com/academy/pivot-tables.html',
    lead:'Master Excel Pivot Tables — create summaries from thousands of rows in seconds, group data, add calculated fields, insert slicers for interactive filtering and build Pivot Charts.',
    modules:[
      {t:'What is a Pivot Table & When to Use It', d:'12 min'},
      {t:'Creating Your First Pivot Table: Fields, Rows, Columns, Values', d:'20 min'},
      {t:'Grouping, Sorting, Filtering & Value Calculations', d:'18 min'},
      {t:'Calculated Fields, Slicers & Timeline Filters', d:'20 min'},
      {t:'Pivot Charts & Refreshing Data Sources', d:'16 min'},
    ],
    quiz:[
      {q:'What is the primary purpose of a Pivot Table?',opts:['To create charts','To summarise and analyse large datasets quickly','To run macros','To validate data entry'],a:1},
      {q:'In a Pivot Table, the "Values" area contains:',opts:['Category labels','Calculated aggregations like SUM, COUNT, AVERAGE','Row headings','Filter criteria'],a:1},
      {q:'What is a "Slicer" in an Excel Pivot Table?',opts:['A formula that splits text','A visual filter button for easy Pivot Table filtering','A chart type','A type of conditional format'],a:1},
      {q:'If you add new data to your source table, what must you do to update the Pivot Table?',opts:['Delete and recreate it','Refresh the Pivot Table','Change the value field','Apply a new filter'],a:1},
      {q:'Which Pivot Table feature lets you group dates by Month, Quarter or Year?',opts:['Slicer','Value Field Settings','Date Grouping','Timeline'],a:2},
    ],
    faqs:[
      {q:'Do I need to know advanced Excel before learning Pivot Tables?',a:'No. Basic Excel knowledge (data entry, formatting, simple formulas) is sufficient. This course starts from creating a simple Pivot Table and builds up progressively.'},
      {q:'Can Pivot Tables handle large datasets?',a:'Yes. Pivot Tables are ideal for analysing datasets with thousands of rows. They process data very quickly without needing complex formulas.'},
      {q:'How are Pivot Tables used in accounting?',a:'CAs and accountants use Pivot Tables to summarise ledger data, analyse GST sales by category, track vendor-wise expenses, and create monthly P&L summaries from raw transaction data.'},
      {q:'What is the difference between a Pivot Table and a regular table in Excel?',a:'A regular table displays raw data. A Pivot Table summarises that data dynamically — you can drag and drop fields to change the view instantly without writing any formulas.'},
      {q:'What should I learn after Pivot Tables?',a:'Move on to the "Dashboard Creation in Excel" course to learn how to combine Pivot Tables with slicers and charts into interactive business dashboards.'},
    ],
    related:['excel-beginners','dashboard-creation','mis-reporting-excel'],
  },
  {
    id:'xlookup-vlookup', title:'XLOOKUP / VLOOKUP / HLOOKUP', cat:'excel', catLabel:'Excel Training',
    catBadge:'cat-badge-excel', thumb:'thumb-excel', thumbStyle:'background:linear-gradient(135deg,#2E7D32,#66BB6A)',
    thumbIcon:'fa-magnifying-glass-chart', level:'Intermediate', lessons:6, duration:'3 hours',
    relatedService:{title:'Virtual CFO Services', url:'../virtual-cfo.html'},
    seoTitle:'XLOOKUP VLOOKUP HLOOKUP — Free Excel Course | KC Shah Academy',
    seoDesc:'Master Excel lookup functions — VLOOKUP, HLOOKUP, INDEX-MATCH and the modern XLOOKUP with practical Indian finance and accounting examples. Free course.',
    canonical:'https://kcshah.com/academy/xlookup-vlookup.html',
    lead:'Learn every major Excel lookup function — from the classic VLOOKUP to the powerful XLOOKUP. Includes INDEX-MATCH, HLOOKUP and real-world applications in accounting and finance.',
    modules:[
      {t:'VLOOKUP: Syntax, Exact Match & Approximate Match', d:'20 min'},
      {t:'HLOOKUP & When to Use Horizontal Lookup', d:'14 min'},
      {t:'INDEX & MATCH: The Flexible Alternative to VLOOKUP', d:'22 min'},
      {t:'XLOOKUP: Modern Lookup with Multiple Return Columns', d:'24 min'},
      {t:'Nested Lookups & Handling Errors with IFERROR', d:'18 min'},
      {t:'Practical Finance Examples: GST Rate Tables, TDS Charts & Payroll', d:'22 min'},
    ],
    quiz:[
      {q:'What is the main limitation of VLOOKUP compared to XLOOKUP?',opts:['VLOOKUP is slower','VLOOKUP can only look in the leftmost column of a range','VLOOKUP cannot handle numbers','VLOOKUP requires sorted data always'],a:1},
      {q:'In the formula =VLOOKUP(A2,B:D,2,0), what does "0" mean?',opts:['Find an approximate match','Return 0 if not found','Find an exact match','Search from bottom to top'],a:2},
      {q:'Which function combination can replace VLOOKUP and look both left and right?',opts:['IF and AND','SUM and COUNTIF','INDEX and MATCH','FILTER and SORT'],a:2},
      {q:'What does XLOOKUP return when the lookup value is not found and an optional 4th argument is provided?',opts:['#N/A error','0','The custom value specified in the 4th argument','The nearest match'],a:2},
      {q:'HLOOKUP looks up a value in which direction?',opts:['Vertically down a column','Horizontally across a row','Diagonally','In a named range only'],a:1},
    ],
    faqs:[
      {q:'Should I learn VLOOKUP or XLOOKUP first?',a:'Start with VLOOKUP since most existing spreadsheets use it and you will encounter it frequently. Then learn XLOOKUP as it is more flexible and is the modern replacement. This course covers both.'},
      {q:'Is XLOOKUP available in all versions of Excel?',a:'XLOOKUP is available in Excel 365 and Excel 2021 and later. It is not available in Excel 2016 or 2019. For older versions, use INDEX-MATCH as the equivalent.'},
      {q:'How is VLOOKUP used in GST filing work?',a:'VLOOKUP is commonly used to look up GST rates from an HSN code table, match invoices with GSTR-2A data, or pull vendor details from a master list — all covered in Module 6.'},
      {q:'What is the advantage of INDEX-MATCH over VLOOKUP?',a:'INDEX-MATCH can look up values in any column (not just the first), handles left-side lookups, works with dynamic column references and is generally faster on large datasets.'},
      {q:'Can XLOOKUP return multiple columns at once?',a:'Yes. XLOOKUP can return multiple adjacent columns simultaneously by specifying a multi-column return range — this is one of its biggest advantages over VLOOKUP.'},
    ],
    related:['excel-beginners','pivot-tables','mis-reporting-excel'],
  },
  {
    id:'mis-reporting-excel', title:'MIS Reporting in Excel', cat:'excel', catLabel:'Excel Training',
    catBadge:'cat-badge-excel', thumb:'thumb-excel', thumbStyle:'background:linear-gradient(135deg,#1B5E20,#4CAF50)',
    thumbIcon:'fa-chart-pie', level:'Intermediate', lessons:6, duration:'3.5 hours',
    relatedService:{title:'Virtual CFO Services', url:'../virtual-cfo.html'},
    seoTitle:'MIS Reporting in Excel — Free Course | KC Shah Academy',
    seoDesc:'Build P&L, cash flow and balance sheet MIS reports in Excel. Learn the data structure used by CFOs and finance teams. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/mis-reporting-excel.html',
    lead:'Build the MIS reports that management actually reads — monthly P&L, cash flow statements, balance sheet summaries and KPI dashboards — using the Excel techniques finance teams rely on.',
    modules:[
      {t:'What is MIS Reporting & What Management Needs', d:'14 min'},
      {t:'Structuring Raw Data: Chart of Accounts in Excel', d:'18 min'},
      {t:'Building a Monthly P&L Report with Formulas', d:'24 min'},
      {t:'Cash Flow Statement: Direct & Indirect Method', d:'22 min'},
      {t:'Balance Sheet Summary & Working Capital Analysis', d:'20 min'},
      {t:'Automating MIS: Dynamic Reports with Pivot Tables & SUMIF', d:'22 min'},
    ],
    quiz:[
      {q:'What does MIS stand for in a finance context?',opts:['Management Information System','Monthly Invoice Summary','Maximum Income Statement','Manual Input Sheet'],a:0},
      {q:'Which Excel function sums values based on a single condition?',opts:['SUMPRODUCT','COUNTIF','SUMIF','VLOOKUP'],a:2},
      {q:'The Indirect Method of Cash Flow starts with:',opts:['Cash received from customers','Net Profit and adjusts for non-cash items','Total assets','Sales revenue'],a:1},
      {q:'Working Capital is calculated as:',opts:['Total Assets minus Total Liabilities','Current Assets minus Current Liabilities','Fixed Assets minus Long-term Debt','Revenue minus Expenses'],a:1},
      {q:'Which financial statement shows the company\'s financial position at a specific date?',opts:['Profit & Loss Statement','Cash Flow Statement','Balance Sheet','MIS Dashboard'],a:2},
    ],
    faqs:[
      {q:'What prior knowledge do I need for this course?',a:'You should be comfortable with basic Excel (formulas, formatting, SUMIF) and have a basic understanding of accounting concepts. Complete our Excel for Beginners and Basics of Accounting courses first.'},
      {q:'Do companies still use Excel for MIS or have they moved to software?',a:'Most SMEs and even large companies still use Excel for MIS because of its flexibility. Even when using Zoho Books or Tally, the final MIS pack is often assembled and presented in Excel.'},
      {q:'What is the difference between a P&L and an MIS report?',a:'A P&L is a standard financial statement. An MIS report is a management-focused summary that may include the P&L plus KPIs, variance analysis, commentary and charts — designed for business decisions.'},
      {q:'Can I use this MIS format directly at my company?',a:'Yes. The templates built in this course are designed for real-world Indian SME use with INR formatting, GST-aware revenue lines and standard Indian financial reporting structure.'},
      {q:'What tools does a Virtual CFO use for MIS?',a:'Virtual CFOs typically use Zoho Books (or Tally) for accounting data, Excel for MIS assembly and presentation, and tools like Zoho Analytics or Power BI for dashboards. This course covers the Excel layer.'},
    ],
    related:['excel-beginners','dashboard-creation','financial-modeling-basics'],
  },
  {
    id:'dashboard-creation', title:'Dashboard Creation in Excel', cat:'excel', catLabel:'Excel Training',
    catBadge:'cat-badge-excel', thumb:'thumb-excel', thumbStyle:'background:linear-gradient(135deg,#33691E,#558B2F)',
    thumbIcon:'fa-gauge-high', level:'Advanced', lessons:6, duration:'3.5 hours',
    relatedService:{title:'Virtual CFO Services', url:'../virtual-cfo.html'},
    seoTitle:'Dashboard Creation in Excel — Free Course | KC Shah Academy',
    seoDesc:'Design interactive business dashboards in Excel with charts, KPI cards, slicers and dynamic data — no VBA required. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/dashboard-creation.html',
    lead:'Design executive-level business dashboards in Excel — KPI cards, dynamic charts, interactive slicers and professional layouts. No VBA required. Perfect for finance and operations reporting.',
    modules:[
      {t:'Dashboard Design Principles: Layout, Colour & Typography', d:'14 min'},
      {t:'KPI Cards: Sparklines, Icons & Conditional Formatting', d:'20 min'},
      {t:'Chart Types for Dashboards: Combo, Waterfall & Gauge', d:'24 min'},
      {t:'Dynamic Data with Named Ranges & OFFSET/INDEX', d:'20 min'},
      {t:'Slicers, Timeline Filters & Interactive Navigation', d:'18 min'},
      {t:'Finalising & Presenting: Print Layout, PDF Export & Sharing', d:'16 min'},
    ],
    quiz:[
      {q:'What is a "Sparkline" in Excel?',opts:['A type of chart that fits inside a single cell','A macro for creating charts automatically','A conditional formatting rule','A slicer for Pivot Tables'],a:0},
      {q:'Which chart type is best for showing actual vs budget variance as positive/negative bars?',opts:['Pie Chart','Line Chart','Waterfall Chart','Donut Chart'],a:2},
      {q:'What does OFFSET function return in Excel?',opts:['An error if the range is empty','A reference shifted by a given number of rows and columns','The sum of a range','The maximum value in a range'],a:1},
      {q:'What is the purpose of a "Slicer" on an Excel dashboard?',opts:['To format cells automatically','To allow users to filter data interactively without touching formulas','To run a macro','To sort data alphabetically'],a:1},
      {q:'Which Excel feature allows you to display a small trend chart inside a cell?',opts:['Mini Chart','Sparkline','Inline Chart','Cell Plot'],a:1},
    ],
    faqs:[
      {q:'Do I need VBA to build Excel dashboards?',a:'No. This course teaches you to build fully interactive dashboards using Pivot Tables, slicers, named ranges and chart tricks — no VBA required.'},
      {q:'What data sources can feed an Excel dashboard?',a:'Excel dashboards can pull data from Zoho Books exports, Tally reports, bank statements, CRM exports or any CSV file. Power Query (covered in our Advanced Excel course) is the best way to connect and refresh these sources.'},
      {q:'Is Excel better than Power BI for dashboards?',a:'For simple, shareable dashboards that anyone can open, Excel is often better — no software installation needed, works offline and is universally understood. Power BI is more powerful for large-scale, real-time data.'},
      {q:'Can I share an Excel dashboard with someone who does not have Excel?',a:'Yes. You can export the dashboard as a PDF for read-only sharing, or share via Microsoft 365/OneDrive so others can view it in the browser without installing Excel.'},
      {q:'What colour scheme is recommended for a professional business dashboard?',a:'Use a maximum of 3 colours: one primary (your brand colour), one accent for highlights, and neutral greys for backgrounds and borders. Avoid rainbow charts — they reduce clarity.'},
    ],
    related:['pivot-tables','mis-reporting-excel','advanced-excel'],
  },
  {
    id:'tally-prime-basics', title:'Tally Prime Basics', cat:'tally', catLabel:'Tally Training',
    catBadge:'cat-badge-tally', thumb:'thumb-tally', thumbStyle:'',
    thumbIcon:'fa-calculator', level:'Beginner', lessons:7, duration:'4 hours',
    relatedService:{title:'Zoho Books Outsourcing', url:'../zoho-books-outsourcing.html'},
    seoTitle:'Tally Prime Basics — Free Online Course | KC Shah Academy',
    seoDesc:'Learn Tally Prime from scratch. Navigate the interface, create ledgers, record vouchers, manage purchases and sales, and generate reports. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/tally-prime-basics.html',
    lead:'Get up and running with Tally Prime — create your company, set up ledgers and stock items, record purchase and sales transactions, and generate P&L and balance sheet reports.',
    modules:[
      {t:'Tally Prime Interface: Gateway, Menus & Navigation', d:'14 min'},
      {t:'Creating a Company & Configuring Financial Year', d:'12 min'},
      {t:'Ledgers: Groups, Creating & Managing Accounts', d:'20 min'},
      {t:'Vouchers: Payment, Receipt, Contra, Journal & Sales', d:'24 min'},
      {t:'Purchase & Sales Transactions with Stock Items', d:'22 min'},
      {t:'Day Book, Ledger Reports & Trial Balance', d:'16 min'},
      {t:'Profit & Loss Account & Balance Sheet in Tally', d:'18 min'},
    ],
    quiz:[
      {q:'In Tally Prime, what is a "Voucher"?',opts:['A discount coupon','A document recording a financial transaction','A type of ledger group','A report format'],a:1},
      {q:'Which voucher type is used to record a bank payment to a vendor in Tally?',opts:['Receipt Voucher','Contra Voucher','Payment Voucher','Journal Voucher'],a:2},
      {q:'In Tally Prime, "Groups" are used to:',opts:['Create stock items','Classify ledgers under the correct accounting head','Record GST entries','Generate reports'],a:1},
      {q:'What is the keyboard shortcut to create a new ledger in Tally Prime?',opts:['F3','Alt+C','F8','Ctrl+N'],a:1},
      {q:'Which report in Tally Prime shows a summary of all debit and credit balances of ledgers?',opts:['Day Book','Cash Flow','Trial Balance','Stock Summary'],a:2},
    ],
    faqs:[
      {q:'What is the difference between Tally ERP 9 and Tally Prime?',a:'Tally Prime is the successor to Tally ERP 9. It has a redesigned interface, improved navigation, a new "Go To" feature, better report viewing and enhanced GST filing capabilities. The core accounting logic is the same.'},
      {q:'Do I need to buy Tally Prime to learn from this course?',a:'Tally Prime offers a free Education Mode that disables saving and printing but lets you practice all features. Download it from the Tally website to follow along with this course.'},
      {q:'Is Tally still relevant when cloud software like Zoho Books exists?',a:'Yes. Tally has an enormous installed base in India — especially among manufacturing, trading and CA firms. Many employers still require Tally knowledge, making it a valuable skill.'},
      {q:'What is the difference between a Receipt and a Payment voucher?',a:'A Receipt voucher records money coming IN to your business (from customers). A Payment voucher records money going OUT (to vendors, employees, expenses).'},
      {q:'What should I learn after Tally Prime Basics?',a:'Take the "GST in Tally" and "TDS in Tally" courses to handle statutory compliance, and the "Payroll in Tally" course if you manage employee salaries.'},
    ],
    related:['gst-in-tally','tds-in-tally','basics-of-accounting'],
  },
  {
    id:'gst-in-tally', title:'GST in Tally Prime', cat:'tally', catLabel:'Tally Training',
    catBadge:'cat-badge-tally', thumb:'thumb-tally', thumbStyle:'background:linear-gradient(135deg,#4A148C,#7B1FA2)',
    thumbIcon:'fa-file-invoice', level:'Intermediate', lessons:5, duration:'3 hours',
    relatedService:{title:'GST Filing Services', url:'../gst-filing.html'},
    seoTitle:'GST in Tally Prime — Free Online Course | KC Shah Academy',
    seoDesc:'Configure GST in Tally Prime, create GST invoices, record purchase entries, reconcile ITC and prepare GSTR-1 and GSTR-3B returns. Free course.',
    canonical:'https://kcshah.com/academy/gst-in-tally.html',
    lead:'Configure GST in Tally Prime end-to-end — set up GSTIN, HSN codes, tax rates, create GST-compliant invoices, record purchase entries and prepare GSTR-1 and GSTR-3B returns.',
    modules:[
      {t:'Enabling GST in Tally Prime & Company GST Configuration', d:'16 min'},
      {t:'GST Ledger Setup: CGST, SGST, IGST & Cess', d:'18 min'},
      {t:'Creating GST-Compliant Sales Invoices in Tally', d:'20 min'},
      {t:'Recording GST Purchase Entries & Input Tax Credit', d:'20 min'},
      {t:'GSTR-1 & GSTR-3B: Generating & Verifying in Tally', d:'22 min'},
    ],
    quiz:[
      {q:'Which GST applies when a sale is made within the same state?',opts:['IGST only','CGST and SGST','IGST and CGST','CGST only'],a:1},
      {q:'What is "Input Tax Credit" (ITC) in GST?',opts:['A credit note given to customers','The GST paid on purchases that can be offset against GST collected on sales','A tax exemption for small businesses','A penalty waiver'],a:1},
      {q:'GSTR-1 is filed to report:',opts:['Purchase invoices and ITC claimed','Outward sales invoices','Monthly tax payment','Annual tax summary'],a:1},
      {q:'Which HSN code is used for services in GST?',opts:['HSN Code','SAC Code','ITC Code','GST Code'],a:1},
      {q:'In Tally Prime, where do you enable GST for the company?',opts:['Inventory Info','F11: Features > Statutory & Taxation','F12: Configure','Accounts Info'],a:1},
    ],
    faqs:[
      {q:'Can I file GSTR-1 directly from Tally Prime?',a:'Yes. Tally Prime supports direct GST filing integration. You can generate the GSTR-1 JSON file from Tally and upload it to the GST portal, or use Tally\'s direct filing option.'},
      {q:'What is the difference between GSTR-1 and GSTR-3B?',a:'GSTR-1 reports all outward sales invoices in detail. GSTR-3B is a summary return that reports net tax liability, ITC claimed and tax paid. GSTR-1 must be filed before GSTR-3B.'},
      {q:'How does Tally handle Reverse Charge Mechanism (RCM)?',a:'Tally has a specific Reverse Charge configuration. When you enable RCM on a ledger, Tally automatically records the GST payable by the recipient instead of the supplier.'},
      {q:'What happens if I enter the wrong GST rate on an invoice in Tally?',a:'You need to create a credit note to reverse the incorrect invoice and raise a fresh invoice with the correct rate. Tally makes this straightforward through the Credit Note voucher.'},
      {q:'Is GST applicable on all purchases I record in Tally?',a:'No. GST applies only to GST-registered goods and services. Exempt supplies, non-taxable items (like petrol) and certain agricultural goods are outside GST. This course covers which transactions are taxable.'},
    ],
    related:['tally-prime-basics','tds-in-tally','gst-basics'],
  },
  {
    id:'tds-in-tally', title:'TDS in Tally Prime', cat:'tally', catLabel:'Tally Training',
    catBadge:'cat-badge-tally', thumb:'thumb-tally', thumbStyle:'background:linear-gradient(135deg,#6A1B9A,#9C27B0)',
    thumbIcon:'fa-percent', level:'Intermediate', lessons:5, duration:'2.5 hours',
    relatedService:{title:'Income Tax Filing', url:'../income-tax.html'},
    seoTitle:'TDS in Tally Prime — Free Online Course | KC Shah Academy',
    seoDesc:'Configure TDS in Tally Prime, deduct TDS on payments, track TDS payable, generate challans and prepare 26Q returns. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/tds-in-tally.html',
    lead:'Set up TDS in Tally Prime — configure TDS rates for different sections, deduct TDS on payments, track TDS payable, generate payment challans and prepare quarterly 26Q returns.',
    modules:[
      {t:'Enabling TDS in Tally Prime & Nature of Payment Setup', d:'16 min'},
      {t:'TDS Ledger Configuration: Deductee Types & Rates', d:'18 min'},
      {t:'Recording TDS Deduction on Vendor Payments', d:'20 min'},
      {t:'TDS Challan Entry & Payment to Government', d:'18 min'},
      {t:'Form 26Q Report, 16A Generation & Quarterly Filing', d:'18 min'},
    ],
    quiz:[
      {q:'Under which section is TDS deducted on professional fees paid to a CA or lawyer?',opts:['Section 194A','Section 194C','Section 194J','Section 194D'],a:2},
      {q:'When should TDS be deducted — at the time of payment or accrual?',opts:['Only at the time of actual payment','At the time of credit in accounts OR payment — whichever is earlier','Only when the vendor submits an invoice','At the end of the financial year'],a:1},
      {q:'TDS deducted must be deposited with the government by which date?',opts:['7th of the following month (30th for March)','15th of the following month','Last day of the same month','Within 90 days'],a:0},
      {q:'Form 16A is issued to:',opts:['Salaried employees for salary TDS','Vendors/contractors as TDS certificate for non-salary payments','The GST department','The RBI'],a:1},
      {q:'Which Tally Prime report helps reconcile TDS deducted with TDS payable?',opts:['Day Book','TDS Outstandings Report','Profit & Loss','Trial Balance'],a:1},
    ],
    faqs:[
      {q:'What is the TDS rate under Section 194C for contractors?',a:'For individual/HUF contractors: 1%. For other entities (company, firm): 2%. No TDS if the single payment is below ₹30,000 or aggregate in the year is below ₹1,00,000.'},
      {q:'What is the threshold limit for TDS under Section 194J?',a:'TDS under 194J applies when payment to a professional exceeds ₹30,000 per year. The rate is 10% (2% for technical services from FY 2020-21).'},
      {q:'What if a vendor provides a lower TDS deduction certificate?',a:'If a vendor provides a certificate under Section 197 from the IT department, you must deduct TDS at the lower rate specified in the certificate instead of the standard rate.'},
      {q:'Can Tally automatically generate TDS challans?',a:'Yes. Tally Prime generates the TDS payment challan (ITNS 281) in the correct format for deposit at the bank or NSDL portal. This is covered in Module 4.'},
      {q:'What is the penalty for not deducting or depositing TDS on time?',a:'Interest at 1% per month for non-deduction and 1.5% per month for non-deposit. Additionally, the expense may be disallowed in your income tax filing under Section 40a(ia).'},
    ],
    related:['tally-prime-basics','gst-in-tally','tds-basics'],
  },
  {
    id:'payroll-in-tally', title:'Payroll in Tally Prime', cat:'tally', catLabel:'Tally Training',
    catBadge:'cat-badge-tally', thumb:'thumb-tally', thumbStyle:'background:linear-gradient(135deg,#7B1FA2,#AB47BC)',
    thumbIcon:'fa-users', level:'Intermediate', lessons:5, duration:'2.5 hours',
    relatedService:{title:'Zoho Books Outsourcing', url:'../zoho-books-outsourcing.html'},
    seoTitle:'Payroll in Tally Prime — Free Online Course | KC Shah Academy',
    seoDesc:'Set up employee masters, salary structures, PF and ESI deductions, process payroll vouchers and generate payslips in Tally Prime. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/payroll-in-tally.html',
    lead:'Process complete payroll in Tally Prime — create employee masters, configure salary components and statutory deductions, process monthly payroll vouchers and generate payslips.',
    modules:[
      {t:'Enabling Payroll in Tally Prime & Payroll Configuration', d:'14 min'},
      {t:'Employee Masters: Groups, Categories & Attendance', d:'18 min'},
      {t:'Salary Structures: Pay Heads, Earnings & Deductions', d:'22 min'},
      {t:'Statutory Components: PF, ESI & Professional Tax Setup', d:'20 min'},
      {t:'Processing Payroll Vouchers, Payslips & Reports', d:'20 min'},
    ],
    quiz:[
      {q:'In Tally Prime payroll, what is a "Pay Head"?',opts:['The name of the employee','A component of salary like Basic Pay, HRA or PF deduction','The monthly salary total','The payroll period'],a:1},
      {q:'Which attendance type is required to process payroll in Tally?',opts:['Leave Without Pay only','Any custom type','A "Present" or attendance-based type linked to the salary structure','No attendance is required'],a:2},
      {q:'Where do you create the salary structure for an employee group in Tally Prime?',opts:['F11 Features','Payroll Info > Salary Details','Accounts Info > Ledgers','Inventory Info > Units'],a:1},
      {q:'What is the purpose of the "Payroll Auto Fill" feature in Tally Prime?',opts:['To automatically calculate GST on salaries','To fill attendance and salary details for all employees at once','To generate Form 16 automatically','To file ESI returns'],a:1},
      {q:'Which Tally Prime report shows the monthly salary paid to each employee?',opts:['Trial Balance','Day Book','Payroll Statement','Profit & Loss'],a:2},
    ],
    faqs:[
      {q:'Does Tally Prime calculate PF and ESI automatically?',a:'Yes, once you configure the PF and ESI pay heads with the correct rates and link them to employees, Tally automatically calculates deductions when you process the payroll voucher.'},
      {q:'Can I generate Form 16 (Part B) from Tally Prime?',a:'Tally Prime generates the salary TDS data but Form 16 (Part A with TDS certificate) must be generated from the TRACES portal using TDS return data. Module 5 explains the complete process.'},
      {q:'How does Tally handle employees joining mid-month?',a:'You can set the joining date in the employee master and Tally will pro-rate the salary for the number of days worked in that month automatically.'},
      {q:'Can Tally Prime handle more than 100 employees?',a:'Yes, Tally Prime handles payroll for any number of employees. There is no employee limit in the software — performance depends on your hardware.'},
      {q:'After this course, should I switch to Zoho Payroll instead of Tally?',a:'For cloud-based companies using Zoho Books, Zoho Payroll is better integrated. For businesses already on Tally with on-premise data, Tally payroll is the natural fit. Our Zoho Payroll Basics course covers the alternative.'},
    ],
    related:['tally-prime-basics','gst-in-tally','zoho-payroll-basics'],
  },
  {
    id:'basics-of-accounting', title:'Basics of Accounting', cat:'finance', catLabel:'Accounting & Finance',
    catBadge:'cat-badge-finance', thumb:'thumb-finance', thumbStyle:'',
    thumbIcon:'fa-book', level:'Beginner', lessons:8, duration:'4.5 hours',
    relatedService:{title:'Zoho Books Outsourcing', url:'../zoho-books-outsourcing.html'},
    seoTitle:'Basics of Accounting — Free Online Course | KC Shah Academy',
    seoDesc:'Learn accounting fundamentals: debit/credit rules, double-entry bookkeeping, ledgers, trial balance, P&L and balance sheet. Free beginner course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/basics-of-accounting.html',
    lead:'Master the fundamentals of accounting — double-entry bookkeeping, the accounting equation, debits and credits, ledgers, trial balance, profit & loss and balance sheet — explained simply.',
    modules:[
      {t:'What is Accounting & Why Every Business Needs It', d:'12 min'},
      {t:'The Accounting Equation: Assets = Liabilities + Equity', d:'16 min'},
      {t:'Debit & Credit Rules: The Golden Rules of Accounting', d:'22 min'},
      {t:'Journal Entries: Recording Transactions Step by Step', d:'24 min'},
      {t:'Ledger Accounts & Posting Journal Entries', d:'20 min'},
      {t:'Trial Balance: What It Is & How to Prepare It', d:'18 min'},
      {t:'Profit & Loss Account: Revenue, Expenses & Net Profit', d:'20 min'},
      {t:'Balance Sheet: Assets, Liabilities & Capital', d:'18 min'},
    ],
    quiz:[
      {q:'The accounting equation is:',opts:['Revenue = Expenses + Profit','Assets = Liabilities + Equity','Debit = Credit + Balance','Income - Tax = Net Profit'],a:1},
      {q:'Which of the following is the Golden Rule for a Personal Account?',opts:['Debit what comes in, Credit what goes out','Debit the receiver, Credit the giver','Debit all expenses, Credit all incomes','Debit assets, Credit liabilities'],a:1},
      {q:'In double-entry bookkeeping, every transaction affects:',opts:['Only one account','At least two accounts with equal debits and credits','Only the bank account','Only the profit & loss account'],a:1},
      {q:'The Trial Balance is prepared to:',opts:['Calculate tax payable','Check that total debits equal total credits','Show the company\'s profits','List all customers and vendors'],a:1},
      {q:'Which financial statement shows the company\'s profitability over a period?',opts:['Balance Sheet','Cash Flow Statement','Profit & Loss Account','Trial Balance'],a:2},
    ],
    faqs:[
      {q:'Do I need any prior knowledge to take this course?',a:'No prior accounting or finance knowledge is required. This course starts from absolute basics and builds up systematically. A basic understanding of arithmetic is all you need.'},
      {q:'What is the difference between cash basis and accrual basis accounting?',a:'Cash basis records income when cash is received and expenses when cash is paid. Accrual basis records income when earned and expenses when incurred, regardless of cash movement. Accrual basis is mandatory for most businesses in India.'},
      {q:'After this course, which software should I learn?',a:'Start with Zoho Books Basics or Tally Prime Basics — both are practical applications of the accounting concepts taught in this course. Knowing the theory first makes the software much easier to understand.'},
      {q:'What is the difference between a ledger and a journal?',a:'A Journal is the book of original entry where transactions are first recorded in chronological order. A Ledger is the book of secondary entry where transactions are classified by account (e.g., all Sales entries in the Sales ledger).'},
      {q:'Are the three golden rules of accounting still relevant in modern software?',a:'Yes. Even though accounting software handles debits and credits automatically, understanding the golden rules helps you catch errors, understand reports and set up your chart of accounts correctly.'},
    ],
    related:['gst-basics','tds-basics','zoho-books-basics'],
  },
  {
    id:'gst-basics', title:'GST Basics', cat:'finance', catLabel:'Accounting & Finance',
    catBadge:'cat-badge-finance', thumb:'thumb-finance', thumbStyle:'background:linear-gradient(135deg,#A68A2E,#C9A84C)',
    thumbIcon:'fa-file-invoice', level:'Beginner', lessons:7, duration:'4 hours',
    relatedService:{title:'GST Filing Services', url:'../gst-filing.html'},
    seoTitle:'GST Basics — Free Online Course | KC Shah Academy',
    seoDesc:'Learn GST from scratch: registration, CGST/SGST/IGST, input tax credit, invoice rules, GST returns and composition scheme. Free beginner course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/gst-basics.html',
    lead:'Understand GST from the ground up — registration thresholds, CGST/SGST/IGST structure, input tax credit, invoice requirements, filing GSTR-1 and GSTR-3B, and the composition scheme.',
    modules:[
      {t:'What is GST & Why India Adopted It', d:'14 min'},
      {t:'GST Registration: Threshold, Process & GSTIN', d:'18 min'},
      {t:'CGST, SGST & IGST: Which Applies When', d:'16 min'},
      {t:'Input Tax Credit (ITC): Rules, Conditions & Restrictions', d:'22 min'},
      {t:'GST Invoice Requirements & E-Invoice Rules', d:'18 min'},
      {t:'GST Returns: GSTR-1, GSTR-3B, GSTR-9 Explained', d:'22 min'},
      {t:'Composition Scheme & Special Categories', d:'16 min'},
    ],
    quiz:[
      {q:'GST registration is mandatory when annual turnover exceeds:',opts:['₹10 lakh','₹20 lakh (₹10 lakh for special category states)','₹40 lakh for goods','Both B and C are correct depending on the business'],a:3},
      {q:'IGST applies when:',opts:['Goods are sold within the same state','Services are exported outside India','Goods or services are supplied between two different states','All of the above'],a:2},
      {q:'Input Tax Credit (ITC) allows a registered dealer to:',opts:['Claim a refund of all GST paid','Offset GST paid on purchases against GST collected on sales','Avoid paying GST altogether','File GST returns quarterly'],a:1},
      {q:'Which document is mandatory to claim ITC on purchases?',opts:['Purchase order','Tax invoice from the supplier','Bank statement','Delivery challan'],a:1},
      {q:'GSTR-3B is:',opts:['A detailed invoice-wise return','A summary monthly return showing net GST liability and ITC','An annual GST return','A return for composition dealers'],a:1},
    ],
    faqs:[
      {q:'What is the current GST rate for most services in India?',a:'Most services attract 18% GST. Some services like healthcare and education are exempt, restaurants charge 5%, and financial services have specific rates. Always check the GST rate schedule for specific items.'},
      {q:'Can a small business with turnover below ₹20 lakh voluntarily register for GST?',a:'Yes. Voluntary GST registration is allowed even below the threshold. It can be beneficial if you have B2B clients who need to claim ITC, or if you export services.'},
      {q:'What is the E-Invoice requirement?',a:'Businesses with annual turnover above ₹5 crore must generate e-invoices through the IRP (Invoice Registration Portal) for B2B and export invoices. The system generates an IRN and QR code that must appear on the invoice.'},
      {q:'What is the difference between GSTR-1 and GSTR-3B?',a:'GSTR-1 contains detailed invoice-wise data of all outward supplies. GSTR-3B is a summary return showing consolidated tax liability and ITC. You must file GSTR-1 before GSTR-3B each month.'},
      {q:'What is the composition scheme and who should opt for it?',a:'The composition scheme lets small businesses (turnover up to ₹1.5 crore for goods, ₹50 lakh for services) pay a flat GST rate (1-5%) instead of regular GST. Simpler compliance but you cannot collect GST from customers or claim ITC.'},
    ],
    related:['tds-basics','income-tax-basics','gst-in-tally'],
  },
  {
    id:'tds-basics', title:'TDS Basics', cat:'finance', catLabel:'Accounting & Finance',
    catBadge:'cat-badge-finance', thumb:'thumb-finance', thumbStyle:'background:linear-gradient(135deg,#B8860B,#DAA520)',
    thumbIcon:'fa-percent', level:'Beginner', lessons:6, duration:'3 hours',
    relatedService:{title:'Income Tax Filing', url:'../income-tax.html'},
    seoTitle:'TDS Basics — Free Online Course | KC Shah Academy',
    seoDesc:'Understand TDS: who deducts it, TDS rates under Section 194A/194C/194J, Form 16A, 26AS reconciliation and filing quarterly returns. Free beginner course.',
    canonical:'https://kcshah.com/academy/tds-basics.html',
    lead:'Understand TDS (Tax Deducted at Source) from scratch — who needs to deduct, key sections and rates, threshold limits, due dates, Form 16A and how to reconcile your 26AS statement.',
    modules:[
      {t:'What is TDS & Why the Government Collects It', d:'14 min'},
      {t:'Who Must Deduct TDS: Rules & Exemptions', d:'16 min'},
      {t:'Key TDS Sections: 192, 194A, 194C, 194J & 194H', d:'22 min'},
      {t:'TDS Thresholds, Due Dates & Challan Payment', d:'18 min'},
      {t:'Form 16 / 16A: What They Contain & How to Use Them', d:'16 min'},
      {t:'26AS & AIS: Reconciling Your TDS Credits', d:'18 min'},
    ],
    quiz:[
      {q:'TDS stands for:',opts:['Tax Deducted at Source','Tax Due on Sales','Total Deductible Sum','Tax Deposited by Seller'],a:0},
      {q:'Under Section 194C, TDS on payments to contractors is:',opts:['2% for all cases','1% for individuals/HUF, 2% for others','5% for all cases','10% for all cases'],a:1},
      {q:'TDS deducted in any month must be deposited to the government by:',opts:['End of the same month','7th of the following month (30th April for March)','15th of the following month','30th of the following month'],a:1},
      {q:'Form 26AS shows:',opts:['Your GST liability','TDS deducted by all deductors on your income and advance tax paid','Your bank balance','Your TDS challans paid'],a:1},
      {q:'If a vendor provides a Nil/Lower Deduction Certificate under Section 197, you must:',opts:['Ignore it and deduct normal TDS','Deduct TDS at the lower rate specified in the certificate','Stop making payments to that vendor','Deduct double TDS'],a:1},
    ],
    faqs:[
      {q:'Do individuals need to deduct TDS?',a:'Individuals are generally not required to deduct TDS unless they are subject to tax audit under Section 44AB, or make payments that attract TDS under Section 194IB (rent above ₹50,000/month), 194M or 194S.'},
      {q:'What is the difference between TDS and advance tax?',a:'TDS is deducted by the payer on behalf of the recipient and deposited to the government. Advance tax is paid by the taxpayer directly in four installments during the year based on estimated income.'},
      {q:'What happens if TDS is deducted but not deposited on time?',a:'Interest of 1.5% per month is levied for late deposit. Additionally, a penalty under Section 271C can be imposed equal to the TDS amount not deposited.'},
      {q:'What is Form 16 vs Form 16A?',a:'Form 16 is issued by employers to salaried employees for TDS on salary (Section 192). Form 16A is issued by companies and individuals for TDS deducted on non-salary payments like interest, professional fees and contract payments.'},
      {q:'How do I claim credit for TDS deducted on my income?',a:'When filing your ITR, enter the TDS details from your Form 16/16A and 26AS. The TDS credit is automatically adjusted against your income tax liability and any excess is refunded.'},
    ],
    related:['gst-basics','income-tax-basics','tds-in-tally'],
  },
  {
    id:'income-tax-basics', title:'Income Tax Basics', cat:'finance', catLabel:'Accounting & Finance',
    catBadge:'cat-badge-finance', thumb:'thumb-finance', thumbStyle:'background:linear-gradient(135deg,#996515,#C9A84C)',
    thumbIcon:'fa-indian-rupee-sign', level:'Beginner', lessons:7, duration:'4 hours',
    relatedService:{title:'Income Tax Filing', url:'../income-tax.html'},
    seoTitle:'Income Tax Basics India — Free Online Course | KC Shah Academy',
    seoDesc:'Learn income tax basics for individuals in India: tax slabs, Old vs New Regime, deductions under 80C/80D, ITR forms, advance tax and how to file your ITR. Free course.',
    canonical:'https://kcshah.com/academy/income-tax-basics.html',
    lead:'Understand Indian income tax from scratch — residential status, income heads, tax slabs, Old vs New Regime comparison, key deductions and how to file your ITR online on the income tax portal.',
    modules:[
      {t:'Introduction to Income Tax in India & Residential Status', d:'16 min'},
      {t:'Five Heads of Income: Salary, House Property, Business, Capital Gains, Other', d:'20 min'},
      {t:'Old vs New Tax Regime: Which Is Better for You?', d:'18 min'},
      {t:'Key Deductions: 80C, 80D, 80CCD, HRA & LTA', d:'22 min'},
      {t:'Advance Tax: Who Pays It, When & How', d:'16 min'},
      {t:'ITR Forms: Which Form Applies to You?', d:'14 min'},
      {t:'Filing Your ITR Online: Step-by-Step on the Portal', d:'22 min'},
    ],
    quiz:[
      {q:'Under the New Tax Regime FY 2025-26, income up to which amount is fully exempt (with 87A rebate)?',opts:['₹5 lakh','₹7 lakh','₹12 lakh','₹15 lakh'],a:2},
      {q:'Section 80C allows deductions up to:',opts:['₹50,000','₹1,00,000','₹1,50,000','₹2,00,000'],a:2},
      {q:'Advance tax is required to be paid when tax liability in the year exceeds:',opts:['₹5,000','₹10,000','₹25,000','₹50,000'],a:1},
      {q:'Which ITR form is used by salaried individuals with income from one house property and other sources?',opts:['ITR-1 (Sahaj)','ITR-2','ITR-3','ITR-4 (Sugam)'],a:0},
      {q:'TDS on salary is deducted under which section of the Income Tax Act?',opts:['Section 194A','Section 194J','Section 192','Section 194C'],a:2},
    ],
    faqs:[
      {q:'Is it mandatory to file an ITR even if my income is below the taxable limit?',a:'Filing is not mandatory if income is below the basic exemption limit. However, it is advisable to file a Nil return — it serves as proof of income, helps get loans and visas, and enables carry forward of losses.'},
      {q:'What is the difference between gross total income and total income?',a:'Gross Total Income is the sum of all income heads before Chapter VI-A deductions. Total Income is Gross Total Income minus allowable deductions (80C, 80D, etc.) — this is what tax is calculated on.'},
      {q:'What happens if I miss the ITR filing deadline?',a:'You can file a belated return up to 31st December of the assessment year with a late filing fee (₹1,000 if income is below ₹5 lakh, ₹5,000 otherwise). Interest under Section 234A also applies.'},
      {q:'Can I switch between Old and New Tax Regime every year?',a:'Salaried individuals and pensioners can switch between regimes every year. Self-employed individuals and those with business income can switch only once and cannot revert (except if they opt out of the new regime permanently).'},
      {q:'What is the Section 87A rebate?',a:'Under the New Regime, if taxable income is ≤ ₹12 lakh, the full income tax is rebated (up to ₹60,000). Under the Old Regime, if taxable income is ≤ ₹5 lakh, tax up to ₹12,500 is rebated.'},
    ],
    related:['tds-basics','gst-basics','company-incorporation-basics'],
  },
  {
    id:'company-incorporation-basics', title:'Company Incorporation Basics', cat:'finance', catLabel:'Accounting & Finance',
    catBadge:'cat-badge-finance', thumb:'thumb-finance', thumbStyle:'background:linear-gradient(135deg,#7A5C00,#C9A84C)',
    thumbIcon:'fa-building', level:'Beginner', lessons:6, duration:'3 hours',
    relatedService:{title:'Company Incorporation', url:'../company-incorporation.html'},
    seoTitle:'Company Incorporation Basics India — Free Course | KC Shah Academy',
    seoDesc:'Learn about Pvt Ltd vs LLP vs OPC, the incorporation process, required documents, MCA portal steps and post-incorporation compliances in India. Free course.',
    canonical:'https://kcshah.com/academy/company-incorporation-basics.html',
    lead:'Understand all business structures available in India — Pvt Ltd, LLP, OPC — and learn the complete incorporation process, required documents, MCA portal steps and mandatory post-registration compliances.',
    modules:[
      {t:'Business Structures in India: Sole Proprietor vs Partnership vs Company vs LLP', d:'16 min'},
      {t:'Private Limited Company: Features, Benefits & Limitations', d:'18 min'},
      {t:'LLP vs Pvt Ltd: Which Is Right for Your Business?', d:'16 min'},
      {t:'Incorporation Process: DSC, DIN, Name Approval, MOA & AOA', d:'24 min'},
      {t:'MCA Portal: Filing SPICe+ & Obtaining COI', d:'18 min'},
      {t:'Post-Incorporation Compliances: PAN, TAN, GST, Bank Account & ROC', d:'18 min'},
    ],
    quiz:[
      {q:'What does "Limited Liability" mean in a Private Limited Company?',opts:['The company\'s profits are limited','Shareholders are not personally liable for the company\'s debts beyond their share capital','The company cannot borrow money','The directors must be Indian residents'],a:1},
      {q:'What is a DSC (Digital Signature Certificate) used for in company incorporation?',opts:['To sign physical documents','To digitally authenticate and submit forms on the MCA portal','To open a bank account','To register for GST'],a:1},
      {q:'What does "COI" stand for in the context of company registration?',opts:['Certificate of Identification','Certificate of Incorporation','Company Official Invoice','Compliance Obligation Index'],a:1},
      {q:'What is the minimum number of directors required for a Private Limited Company?',opts:['1','2','3','5'],a:1},
      {q:'The Memorandum of Association (MOA) defines:',opts:['The internal rules and management of the company','The authorised share capital and main objects of the company','The salary structure of directors','The company\'s tax liability'],a:1},
    ],
    faqs:[
      {q:'How long does it take to incorporate a Pvt Ltd company in India?',a:'With all documents in order, a Pvt Ltd company can be incorporated in 10-15 working days through the MCA portal. Our team at KC Shah & Associates can complete the process end-to-end.'},
      {q:'What is the minimum share capital required for a Pvt Ltd company?',a:'There is no minimum paid-up capital requirement for a Pvt Ltd company in India. You can start with ₹1. The authorised capital determines your registration and stamp duty fees.'},
      {q:'What is the difference between a Director and a Shareholder?',a:'A Director manages the company\'s day-to-day affairs and is appointed by shareholders. A Shareholder (Member) owns equity in the company. In small companies, the same person is often both.'},
      {q:'Can a foreigner be a director or shareholder in an Indian Pvt Ltd company?',a:'Yes. A foreign national can be a shareholder and director in an Indian Pvt Ltd company. For FDI (Foreign Direct Investment), additional FEMA compliance and FC-GPR filing is required — our FEMA service covers this.'},
      {q:'What compliances are required after incorporating a company?',a:'After incorporation: open a current bank account, apply for PAN and TAN, register for GST (if applicable), appoint an auditor within 30 days, file AOC-4 and MGT-7 annually and hold board meetings. Our ROC compliance service covers all of these.'},
    ],
    related:['how-to-register-company','gst-basics','income-tax-basics'],
  },
  {
    id:'financial-modeling-basics', title:'Financial Modeling Basics', cat:'finance', catLabel:'Accounting & Finance',
    catBadge:'cat-badge-finance', thumb:'thumb-finance', thumbStyle:'background:linear-gradient(135deg,#C9A84C,#E0C872)',
    thumbIcon:'fa-chart-line', level:'Intermediate', lessons:8, duration:'5 hours',
    relatedService:{title:'Virtual CFO Services', url:'../virtual-cfo.html'},
    seoTitle:'Financial Modeling Basics — Free Online Course | KC Shah Academy',
    seoDesc:'Build a 3-statement financial model from scratch using Excel. P&L, Balance Sheet, Cash Flow, valuation basics and scenario analysis. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/financial-modeling-basics.html',
    lead:'Build a complete 3-statement financial model from scratch in Excel — integrated P&L, Balance Sheet and Cash Flow with assumptions, forecasts, scenario analysis and basic DCF valuation.',
    modules:[
      {t:'What is Financial Modeling & Who Uses It', d:'14 min'},
      {t:'Model Structure & Best Practices: Inputs, Calculations, Outputs', d:'18 min'},
      {t:'Building the Revenue & Cost Model', d:'28 min'},
      {t:'Profit & Loss Statement: Forecasting 5 Years', d:'24 min'},
      {t:'Balance Sheet: Linking Assets, Liabilities & Equity', d:'26 min'},
      {t:'Cash Flow Statement: Direct Link from P&L & BS', d:'22 min'},
      {t:'Scenario Analysis: Base, Bull & Bear Cases', d:'20 min'},
      {t:'Introduction to DCF Valuation Using the Model', d:'22 min'},
    ],
    quiz:[
      {q:'In a 3-statement financial model, which statement is typically built first?',opts:['Balance Sheet','Cash Flow Statement','Profit & Loss Statement','All three simultaneously'],a:2},
      {q:'What does a "circular reference" in financial modeling usually indicate?',opts:['An Excel error that must be avoided','A link between the interest expense and debt balance that requires iterative calculation','A formatting mistake','A wrong formula in the P&L'],a:1},
      {q:'The "plug" in a financial model balance sheet is typically:',opts:['Revenue','Cash (which balances the model)','Net Profit','Depreciation'],a:1},
      {q:'In DCF valuation, what does "discount rate" represent?',opts:['The GST rate applied to services','The required rate of return (cost of capital) used to discount future cash flows','The loan interest rate','The depreciation rate on assets'],a:1},
      {q:'Which Excel feature is best for running base/bull/bear scenarios in a financial model?',opts:['Conditional Formatting','Scenario Manager or Data Table','Power Query','Slicer'],a:1},
    ],
    faqs:[
      {q:'Do I need to know accounting to build financial models?',a:'Yes. A basic understanding of P&L, Balance Sheet and Cash Flow is essential. Complete our Basics of Accounting and MIS Reporting in Excel courses before starting this one.'},
      {q:'What Excel skills are needed for financial modeling?',a:'You need proficiency in formulas, named ranges, IF/SUMIF, basic charts and understanding of cell references. Complete our Excel for Beginners and Advanced Excel courses first.'},
      {q:'How is a financial model different from an MIS report?',a:'An MIS report shows historical performance. A financial model is forward-looking — it projects future P&L, cash flows and balance sheet based on business assumptions and scenarios.'},
      {q:'Who uses financial models in practice?',a:'Investment bankers, VCs, CFOs, startup founders (for fundraising), CAs (for valuation and CMA data), and management consultants. Any role involving business planning or investment decisions benefits from modeling skills.'},
      {q:'After this course, can I build a valuation model for IBBI purposes?',a:'This course gives you the foundation. For IBBI-compliant valuation reports, you need additional knowledge of valuation standards and methodologies covered in our Business Valuation Basics course.'},
    ],
    related:['mis-reporting-excel','business-valuation-basics','dashboard-creation'],
  },
  {
    id:'how-to-register-company', title:'How to Register a Company in India', cat:'startup', catLabel:'Startup & Business',
    catBadge:'cat-badge-startup', thumb:'thumb-startup', thumbStyle:'',
    thumbIcon:'fa-building-circle-check', level:'Beginner', lessons:5, duration:'2.5 hours',
    relatedService:{title:'Company Incorporation', url:'../company-incorporation.html'},
    seoTitle:'How to Register a Company in India — Free Course | KC Shah Academy',
    seoDesc:'Step-by-step guide to registering a Private Limited company in India. DSC, DIN, name approval, MOA/AOA, COI and post-registration steps. Free course by CA Karan Shah.',
    canonical:'https://kcshah.com/academy/how-to-register-company.html',
    lead:'A practical, step-by-step walkthrough of registering a Private Limited company in India — from choosing the right structure to getting your Certificate of Incorporation and opening your bank account.',
    modules:[
      {t:'Choosing the Right Business Structure for Your Startup', d:'16 min'},
      {t:'Pre-Incorporation Steps: DSC, DIN & Name Reservation (RUN)', d:'22 min'},
      {t:'Drafting MOA & AOA + Filing SPICe+ on MCA Portal', d:'26 min'},
      {t:'Post-Incorporation: PAN, TAN, Bank Account & Registered Office', d:'18 min'},
      {t:'Startup India Recognition, DPIIT Certificate & 80-IAC Tax Benefit', d:'18 min'},
    ],
    quiz:[
      {q:'RUN (Reserve Unique Name) is filed on which portal?',opts:['GST Portal','Income Tax Portal','MCA21 Portal','MSME Portal'],a:2},
      {q:'What is a DIN (Director Identification Number)?',opts:['A company registration number','A unique identifier assigned to each director in India','The company\'s TAN number','The GST registration number'],a:1},
      {q:'SPICe+ (Simplified Proforma for Incorporating Company Electronically) allows you to:',opts:['Only reserve a company name','Incorporate a company and simultaneously apply for PAN, TAN and GSTIN','File annual returns','Register for MSME'],a:1},
      {q:'What is the DPIIT recognition benefit for eligible startups?',opts:['100% GST exemption permanently','Tax holiday under Section 80-IAC for 3 out of 10 years, among other benefits','Exemption from all ROC filings','Free government office space'],a:1},
      {q:'How many witnesses are required to sign the MOA and AOA?',opts:['1','2','3','None'],a:1},
    ],
    faqs:[
      {q:'Can I register a company myself without a CA?',a:'Technically yes, but the MCA portal requires DSCs, legal documents (MOA/AOA) and compliance with company law. Mistakes can delay registration or create compliance issues. Using a CA like KC Shah & Associates saves time and ensures accuracy.'},
      {q:'What is the government fee for incorporating a Pvt Ltd company?',a:'Government fees depend on authorised share capital — approximately ₹2,000–₹15,000 for stamp duty and filing fees for typical startup share capital levels. Professional fees are additional.'},
      {q:'What is the difference between authorised capital and paid-up capital?',a:'Authorised capital is the maximum share capital the company can issue (determines filing fees). Paid-up capital is the actual capital invested by shareholders. You can start with ₹1 paid-up capital.'},
      {q:'Do I need a physical office address to register a company?',a:'Yes, you need a registered office address in India. This can be your home address initially. Proof of address (electricity bill) and a No Objection Certificate from the property owner are required.'},
      {q:'What happens if two directors are at the same address?',a:'That is perfectly fine. Multiple directors can share the same address for their personal address (as used in the DIN application). The registered office address is the company\'s address, which is separate.'},
    ],
    related:['company-incorporation-basics','fundraising-basics','gst-basics'],
  },
  {
    id:'fundraising-basics', title:'Fundraising Basics for Startups', cat:'startup', catLabel:'Startup & Business',
    catBadge:'cat-badge-startup', thumb:'thumb-startup', thumbStyle:'background:linear-gradient(135deg,#0D2137,#1A3A5C)',
    thumbIcon:'fa-hand-holding-dollar', level:'Intermediate', lessons:6, duration:'3.5 hours',
    relatedService:{title:'Business Valuation (IBBI)', url:'../business-valuation.html'},
    seoTitle:'Fundraising Basics for Startups — Free Course | KC Shah Academy',
    seoDesc:'Learn startup fundraising: angel vs VC funding, SAFE notes, cap tables, term sheets, convertible debentures and how to prepare for investor meetings. Free course.',
    canonical:'https://kcshah.com/academy/fundraising-basics.html',
    lead:'Understand startup fundraising from first principles — funding stages, angel vs VC investors, SAFE notes vs equity, cap tables, term sheet key clauses and how investors evaluate a company.',
    modules:[
      {t:'Startup Funding Stages: Pre-Seed to Series C & Beyond', d:'18 min'},
      {t:'Angel Investors vs Venture Capital: How They Think & Invest', d:'20 min'},
      {t:'SAFE Notes & Convertible Debentures: Founder-Friendly Instruments', d:'22 min'},
      {t:'Cap Table: Structure, Dilution & How to Manage It', d:'24 min'},
      {t:'Term Sheet Essentials: Valuation, Anti-Dilution, Board & Liquidation Preference', d:'26 min'},
      {t:'Investor Pitch Preparation: What VCs Actually Look For', d:'20 min'},
    ],
    quiz:[
      {q:'A "SAFE note" (Simple Agreement for Future Equity) is:',opts:['A bank loan for startups','An investment instrument that converts to equity at a future priced round','A government grant scheme','A term sheet template'],a:1},
      {q:'What does "pre-money valuation" mean?',opts:['The valuation of the company before deducting debts','The valuation of the company before the new investment round','The projected future valuation','The book value of assets'],a:1},
      {q:'In a startup cap table, "dilution" refers to:',opts:['Reduction in company profits','Decrease in existing shareholders\' ownership percentage when new shares are issued','Increase in debt','Reduction in valuation'],a:1},
      {q:'What is a "liquidation preference" clause in a term sheet?',opts:['A requirement to file for liquidation annually','A provision ensuring investors get paid before founders in a sale or liquidation event','A fee charged by liquidators','A preference for equity over debt'],a:1},
      {q:'At which funding stage does a startup typically have a proven product and paying customers, and seeks growth capital?',opts:['Pre-Seed','Seed','Series A','IPO'],a:2},
    ],
    faqs:[
      {q:'How do I value my startup for the first fundraise?',a:'Early-stage valuations are largely negotiated based on team quality, market size, traction and comparables. Common methods include Berkus Method, Scorecard Method and market comparables. Our Business Valuation Basics course and valuation service covers this.'},
      {q:'What is the difference between equity funding and debt funding?',a:'Equity funding means giving investors a share of ownership in exchange for capital — no repayment obligation. Debt funding is a loan that must be repaid with interest, regardless of business performance.'},
      {q:'What documents should a startup have ready before approaching investors?',a:'A pitch deck, financial model/projections, cap table, company incorporation documents, IP assignments, key contracts, audited financials (if available) and a data room with all company documents.'},
      {q:'What is anti-dilution protection and why do investors ask for it?',a:'Anti-dilution protection adjusts an investor\'s conversion price downward if future shares are issued at a lower valuation (a down-round). Broad-based weighted average anti-dilution is the most founder-friendly form.'},
      {q:'Is DPIIT Startup India recognition required for fundraising?',a:'It is not required for private fundraising. However, DPIIT recognition gives you Section 80-IAC tax benefits, exemption from Angel Tax (Section 56(2)(viib)), and access to government schemes — all of which make your startup more attractive to investors.'},
    ],
    related:['business-valuation-basics','company-incorporation-basics','financial-modeling-basics'],
  },
  {
    id:'cma-data-preparation', title:'CMA Data Preparation', cat:'startup', catLabel:'Startup & Business',
    catBadge:'cat-badge-startup', thumb:'thumb-startup', thumbStyle:'background:linear-gradient(135deg,#112D55,#1D4080)',
    thumbIcon:'fa-file-lines', level:'Intermediate', lessons:5, duration:'3 hours',
    relatedService:{title:'Corporate Finance', url:'../corporate-finance.html'},
    seoTitle:'CMA Data Preparation — Free Online Course | KC Shah Academy',
    seoDesc:'Learn to prepare CMA (Credit Monitoring Arrangement) data for bank loan applications. Format, financial projections, key banking ratios and what banks actually check. Free course.',
    canonical:'https://kcshah.com/academy/cma-data-preparation.html',
    lead:'Prepare a complete CMA (Credit Monitoring Arrangement) report for bank loan applications — understand the required format, prepare financial projections, calculate key banking ratios and understand what lenders evaluate.',
    modules:[
      {t:'What is CMA Data & Why Banks Require It', d:'14 min'},
      {t:'CMA Format: 6 Statements Explained', d:'22 min'},
      {t:'Preparing Financial Projections: Revenue, Costs & Working Capital', d:'28 min'},
      {t:'Key Banking Ratios: DSCR, Current Ratio, TOL/TNW & MPBF', d:'24 min'},
      {t:'Presenting CMA Data to Bankers & Common Mistakes to Avoid', d:'22 min'},
    ],
    quiz:[
      {q:'CMA data is primarily prepared for:',opts:['Filing GST returns','Supporting applications for bank loans and credit facilities','Preparing the company\'s income tax return','Valuation reports for investors'],a:1},
      {q:'DSCR stands for:',opts:['Debt Service Coverage Ratio','Direct Sales Conversion Rate','Daily Sales Cash Reconciliation','Deferred Share Capital Ratio'],a:0},
      {q:'MPBF (Maximum Permissible Bank Finance) is calculated based on:',opts:['Fixed assets and long-term loans','Working capital requirements based on Tandon Committee norms','The company\'s EBITDA','The promoter\'s net worth'],a:1},
      {q:'Which CMA statement projects the company\'s income and expenses for the next 5 years?',opts:['Funds Flow Statement','Projected Balance Sheet','Projected Profit & Loss Account','Working Capital Assessment'],a:2},
      {q:'A Current Ratio of less than 1 indicates:',opts:['Strong liquidity','The company has more current liabilities than current assets — a potential liquidity risk','High profitability','A good DSCR'],a:1},
    ],
    faqs:[
      {q:'What is the difference between CMA data and a business plan?',a:'A business plan is a narrative document explaining the business model, market and strategy. CMA data is a structured financial document in a specific RBI-prescribed format that banks use to assess creditworthiness and set loan limits.'},
      {q:'For how many years are CMA projections typically prepared?',a:'Banks typically require projections for 3-5 years for term loans and 1-2 years of projections for working capital facilities, along with 2-3 years of audited historical financials.'},
      {q:'What is the Tandon Committee Method for MPBF calculation?',a:'The Tandon Committee prescribed three methods for calculating working capital finance. Method II (most commonly used) permits bank finance up to 75% of the net working capital gap (Current Assets minus current liabilities other than bank finance).'},
      {q:'Can startups with no revenue apply for bank loans with CMA data?',a:'Most banks require some operating history. However, government-backed schemes like CGTMSE or SIDBI loans, and MUDRA loans, may be available for new businesses. Projection-based CMA data is accepted for these schemes.'},
      {q:'Who prepares CMA data — the business owner or a CA?',a:'CMA data is typically prepared by a CA or a financial consultant with banking and credit knowledge. Banks often reject self-prepared CMA data that does not meet their internal standards. Our Corporate Finance team prepares CMA data regularly.'},
    ],
    related:['financial-modeling-basics','fundraising-basics','business-valuation-basics'],
  },
  {
    id:'business-valuation-basics', title:'Business Valuation Basics', cat:'startup', catLabel:'Startup & Business',
    catBadge:'cat-badge-startup', thumb:'thumb-startup', thumbStyle:'background:linear-gradient(135deg,#0B1D3A,#1E3F6A)',
    thumbIcon:'fa-scale-balanced', level:'Intermediate', lessons:6, duration:'3.5 hours',
    relatedService:{title:'Business Valuation (IBBI)', url:'../business-valuation.html'},
    seoTitle:'Business Valuation Basics — Free Online Course | KC Shah Academy',
    seoDesc:'Learn business valuation methods used by IBBI valuers and investment bankers: DCF, comparable company analysis, asset-based valuation and Rule 11UA. Free course.',
    canonical:'https://kcshah.com/academy/business-valuation-basics.html',
    lead:'Understand how businesses are valued — DCF analysis, comparable company (CCA) method, asset-based approach, Rule 11UA for startups and the IBBI valuation framework used for M&A and regulatory purposes.',
    modules:[
      {t:'Why Business Valuation Matters: M&A, ESOP, Fundraising & Tax', d:'14 min'},
      {t:'Intrinsic Value vs Market Value & Valuation Standards', d:'16 min'},
      {t:'DCF Valuation: Free Cash Flow, WACC & Terminal Value', d:'30 min'},
      {t:'Comparable Company Analysis (CCA) & Precedent Transactions', d:'22 min'},
      {t:'Asset-Based Valuation: NAV Method & Liquidation Approach', d:'18 min'},
      {t:'Rule 11UA, IBBI Framework & Valuation Reports in Practice', d:'20 min'},
    ],
    quiz:[
      {q:'DCF stands for:',opts:['Debt and Cash Flow','Discounted Cash Flow','Direct Cost Formula','Deferred Capital Funding'],a:1},
      {q:'In DCF valuation, WACC stands for:',opts:['Weighted Average Cost of Capital','Working Assets and Current Capital','Weighted Accounting Cost Calculation','Wholesale Acquisition Cost of Capital'],a:0},
      {q:'Rule 11UA of the Income Tax Rules prescribes the method for valuing:',opts:['Listed equity shares','Unlisted equity shares for the purpose of Section 56(2)(x) and FEMA','Fixed assets','Bonds and debentures'],a:1},
      {q:'The "terminal value" in a DCF model accounts for:',opts:['The company\'s debt at maturity','The value of cash flows beyond the explicit forecast period','The liquidation value of assets','The value of tax benefits'],a:1},
      {q:'Which valuation method is most appropriate for an asset-heavy business like a real estate company?',opts:['DCF','Comparable Company Analysis','Net Asset Value (NAV) Method','Price/Earnings Multiple'],a:2},
    ],
    faqs:[
      {q:'What is Rule 11UA and when does it apply?',a:'Rule 11UA prescribes the valuation method for unquoted equity shares under the Income Tax Act. It applies when shares are issued to investors above fair market value (Angel Tax provision) or transferred. A registered valuer\'s report is required.'},
      {q:'What credentials does a business valuer need in India?',a:'For IBBI-compliant valuation reports (mandatory for insolvency, M&A and regulated transactions), the valuer must be a Registered Valuer (RV) under IBBI. Our founder CA Karan Shah holds IBBI registration as a Registered Valuer.'},
      {q:'When is a business valuation report required?',a:'Valuations are required for: fundraising (determining share issuance price), M&A (transaction pricing), ESOP grants (Rule 11UA), FEMA compliance (FDI/ODI), NCLT petitions, corporate restructuring and IBC insolvency proceedings.'},
      {q:'What is the difference between enterprise value and equity value?',a:'Enterprise Value (EV) is the total value of the business including debt and excluding cash. Equity Value = Enterprise Value − Net Debt. When valuing for an equity investor, you always need the equity value, not just EV.'},
      {q:'How accurate are DCF valuations?',a:'DCF is theoretically sound but highly sensitive to assumptions — small changes in WACC or growth rate significantly change the output. That is why valuers triangulate using multiple methods (DCF + CCA + Asset-based) and exercise professional judgment.'},
    ],
    related:['fundraising-basics','financial-modeling-basics','cma-data-preparation'],
  },
];

function navHtml(activeSlug) {
  return `<div class="top-bar"><div class="container"><div class="top-bar-left"><a href="mailto:karan@kcshah.com"><i class="fa-solid fa-envelope"></i> karan@kcshah.com</a><a href="tel:+917666638995"><i class="fa-solid fa-phone"></i> +91 7666638995</a></div><div class="top-bar-right"><a href="https://www.linkedin.com/in/cakaranshah/" target="_blank"><i class="fa-brands fa-linkedin-in"></i> LinkedIn</a><a href="https://api.whatsapp.com/send/?phone=917666638995" target="_blank"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a></div></div></div>
<header><div class="container nav-wrapper"><a href="../index.html" class="logo"><div><div class="logo-text">KC Shah <span>& Associates</span></div><span class="logo-sub">Chartered Accountants</span></div></a><ul class="nav-links"><li><a href="../index.html">Home</a></li><li><a href="#">Services <i class="fa-solid fa-chevron-down" style="font-size:0.65rem;margin-left:4px"></i></a><div class="dropdown-menu"><a href="../zoho-books-outsourcing.html"><i class="fa-solid fa-cloud"></i> Zoho Books Outsourcing</a><a href="../zoho-books-implementation.html"><i class="fa-solid fa-gear"></i> Zoho Books Implementation</a><a href="../business-valuation.html"><i class="fa-solid fa-chart-line"></i> Business Valuation (IBBI)</a><a href="../virtual-cfo.html"><i class="fa-solid fa-user-tie"></i> Virtual CFO Services</a><a href="../company-incorporation.html"><i class="fa-solid fa-building"></i> Company Incorporation</a><a href="../gst-filing.html"><i class="fa-solid fa-file-invoice"></i> GST Filing Services</a><a href="../income-tax.html"><i class="fa-solid fa-calculator"></i> Income Tax Filing</a><a href="../audit-assurance.html"><i class="fa-solid fa-magnifying-glass-chart"></i> Audit & Assurance</a><a href="../corporate-finance.html"><i class="fa-solid fa-hand-holding-dollar"></i> Corporate Finance</a><a href="../fema-compliance.html"><i class="fa-solid fa-globe"></i> FEMA & RBI Compliance</a></div></li><li><a href="../tools/index.html">Free Tools <i class="fa-solid fa-chevron-down" style="font-size:0.65rem;margin-left:4px"></i></a><div class="dropdown-menu"><a href="../tools/income-tax-calculator.html"><i class="fa-solid fa-calculator"></i> Income Tax Calculator</a><a href="../tools/emi-calculator.html"><i class="fa-solid fa-landmark"></i> EMI Calculator</a><a href="../tools/capital-gain-calculator.html"><i class="fa-solid fa-chart-line"></i> Capital Gain Calculator</a><a href="../tools/gst-due-date-calendar.html"><i class="fa-solid fa-calendar-days"></i> GST Due Date Calendar</a><a href="../tools/index.html"><i class="fa-solid fa-grid-2"></i> View All Tools</a></div></li><li><a href="index.html" class="active">Academy <span class="nav-badge-new">Free</span> <i class="fa-solid fa-chevron-down" style="font-size:0.65rem;margin-left:4px"></i></a><div class="dropdown-menu"><a href="index.html"><i class="fa-solid fa-graduation-cap"></i> All Courses (25)</a><a href="index.html#zoho"><i class="fa-solid fa-cloud"></i> Zoho Training</a><a href="index.html#excel"><i class="fa-solid fa-table"></i> Excel Training</a><a href="index.html#tally"><i class="fa-solid fa-calculator"></i> Tally Training</a><a href="index.html#finance"><i class="fa-solid fa-coins"></i> Accounting & Finance</a><a href="index.html#startup"><i class="fa-solid fa-rocket"></i> Startup Training</a></div></li><li><a href="../about.html">About</a></li><li><a href="../blog.html">Insights</a></li><li><a href="../contact.html">Contact</a></li></ul><a href="../contact.html" class="btn btn-primary btn-sm nav-cta">Book Free Consultation</a><div class="hamburger"><span></span><span></span><span></span></div></div></header>`;
}

function footerHtml() {
  return `<footer><div class="container"><div class="footer-grid"><div class="footer-widget"><div class="logo-text" style="color:white;margin-bottom:12px">KC Shah <span style="color:var(--gold)">& Associates</span></div><p>Free CA-taught courses on Zoho Books, Excel, Tally & finance.</p><div class="footer-social"><a href="https://www.linkedin.com/in/cakaranshah/" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a><a href="https://api.whatsapp.com/send/?phone=917666638995" target="_blank"><i class="fa-brands fa-whatsapp"></i></a><a href="mailto:karan@kcshah.com"><i class="fa-solid fa-envelope"></i></a></div></div><div class="footer-widget"><h4>Zoho Courses</h4><ul><li><a href="zoho-books-basics.html">Zoho Books Basics</a></li><li><a href="zoho-books-advanced.html">Zoho Books Advanced</a></li><li><a href="zoho-crm-basics.html">Zoho CRM Basics</a></li><li><a href="zoho-payroll-basics.html">Zoho Payroll Basics</a></li></ul></div><div class="footer-widget"><h4>More Courses</h4><ul><li><a href="excel-beginners.html">Excel for Beginners</a></li><li><a href="gst-basics.html">GST Basics</a></li><li><a href="income-tax-basics.html">Income Tax Basics</a></li><li><a href="index.html">All 25 Courses</a></li></ul></div><div class="footer-widget"><h4>Services</h4><ul><li><a href="../zoho-books-outsourcing.html">Zoho Books Outsourcing</a></li><li><a href="../gst-filing.html">GST Filing</a></li><li><a href="../virtual-cfo.html">Virtual CFO</a></li><li><a href="../contact.html">Contact Us</a></li></ul></div></div><div class="footer-bottom">&copy; 2026 KC Shah & Associates. All rights reserved.</div></div></footer>`;
}

function generatePage(c) {
  const modules = c.modules.map((m, i) => `
        <div class="module-item" data-youtube="" data-idx="${i}">
          <div class="module-num"><span class="module-num-text">${i+1}</span></div>
          <div class="module-info">
            <div class="module-title">${m.t}</div>
            <div class="module-duration"><i class="fa-solid fa-clock" style="font-size:0.65rem;margin-right:4px"></i>${m.d}</div>
          </div>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:0.75rem;color:var(--text-grey)" onclick="event.stopPropagation()">
            <input type="checkbox" class="module-checkbox"> Done
          </label>
          <i class="fa-solid fa-circle-play module-status-icon"></i>
        </div>`).join('');

  const quizHtml = c.quiz.map((q, qi) => `
          <div class="quiz-question" data-answer="${q.a}">
            <div class="quiz-question-text"><span class="quiz-question-num">Q${qi+1}.</span> ${q.q}</div>
            <div class="quiz-options">
              ${q.opts.map((o, oi) => `<label class="quiz-option"><input type="radio" name="q${qi+1}" value="${oi}"> ${o}</label>`).join('')}
            </div>
          </div>`).join('');

  const faqHtml = c.faqs.map(f => `
        <div class="faq-item"><div class="faq-question">${f.q} <i class="fa-solid fa-chevron-down"></i></div><div class="faq-answer"><p>${f.a}</p></div></div>`).join('');

  const relatedHtml = c.related.slice(0,3).map(slug => {
    const rel = COURSES.find(x => x.id === slug) || {title: slug, lessons: 5, level: 'Beginner', thumb:'thumb-finance', thumbStyle:'', thumbIcon:'fa-book'};
    return `<div class="related-course-item"><a href="${slug}.html" style="display:flex;gap:12px;align-items:center;text-decoration:none;width:100%"><div class="related-thumb ${rel.thumb}" ${rel.thumbStyle ? `style="${rel.thumbStyle}"` : ''}><i class="fa-solid ${rel.thumbIcon}" style="color:white;font-size:0.9rem"></i></div><div><div class="related-title">${rel.title}</div><div class="related-meta">${rel.lessons} lessons · ${rel.level}</div></div></a></div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${c.seoTitle}</title>
<meta name="description" content="${c.seoDesc}">
<meta property="og:title" content="${c.title} — Free Course | KC Shah Academy">
<meta property="og:description" content="${c.seoDesc}">
<link rel="canonical" href="${c.canonical}">
<link rel="icon" type="image/png" href="../favicon.png">
<link rel="stylesheet" href="../style.css">
<link rel="stylesheet" href="academy.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Course","name":"${c.title}","description":"${c.seoDesc}","url":"${c.canonical}","provider":{"@type":"Organization","name":"KC Shah & Associates","url":"https://kcshah.com"},"hasCourseInstance":{"@type":"CourseInstance","courseMode":"online","price":"0","priceCurrency":"INR"},"educationalLevel":"${c.level}","inLanguage":"en-IN","isAccessibleForFree":true}</script>
</head>
<body data-course="${c.id}">
${navHtml(c.id)}

<div class="course-page-header">
  <div class="container">
    <div class="breadcrumb"><a href="../index.html">Home</a> <span>/</span> <a href="index.html">Academy</a> <span>/</span> <span>${c.title}</span></div>
    <div class="course-header-badges">
      <span class="${c.catBadge}" style="padding:5px 14px;font-size:0.78rem">${c.catLabel}</span>
      <span class="level-badge" style="padding:5px 14px;font-size:0.78rem;background:rgba(255,255,255,0.15);color:white">${c.level}</span>
      <span class="level-badge" style="padding:5px 14px;font-size:0.78rem;background:rgba(34,197,94,0.2);color:#86efac">Free Course</span>
    </div>
    <h1>${c.title}</h1>
    <p class="lead">${c.lead}</p>
    <div class="course-header-meta">
      <span class="course-header-meta-item"><i class="fa-solid fa-play-circle"></i> ${c.lessons} modules</span>
      <span class="course-header-meta-item"><i class="fa-regular fa-clock"></i> ${c.duration} total</span>
      <span class="course-header-meta-item"><i class="fa-solid fa-user-tie"></i> Taught by CA Karan Shah</span>
      <span class="course-header-meta-item"><i class="fa-solid fa-certificate"></i> Free certificate</span>
      <span class="course-header-meta-item"><i class="fa-solid fa-file-pdf"></i> PDF notes included</span>
    </div>
  </div>
</div>

<div class="container">
  <div class="course-layout">
    <div class="course-main">
      <div class="video-player-wrap">
        <div class="coming-soon-player">
          <div class="play-icon"><i class="fa-solid fa-play"></i></div>
          <h3>Module 1: ${c.modules[0].t}</h3>
          <p>Video lessons are uploaded weekly. Click a module below to load it.</p>
        </div>
      </div>

      <div class="module-list-header">
        <h3><i class="fa-solid fa-list-check" style="color:var(--gold);margin-right:8px"></i> Course Modules</h3>
        <span>${c.lessons} lessons · ${c.duration}</span>
      </div>
      <div class="module-list">${modules}
      </div>

      <div class="course-resources">
        <h3><i class="fa-solid fa-paperclip" style="color:var(--gold);margin-right:8px"></i> Course Resources</h3>
        <div class="resource-item">
          <div class="resource-icon"><i class="fa-solid fa-file-pdf"></i></div>
          <div class="resource-info">
            <div class="resource-title">${c.title} — Course Notes</div>
            <div class="resource-meta">PDF · Covers all ${c.lessons} modules</div>
          </div>
          <a href="downloads/${c.id}-notes.pdf" class="resource-dl-btn" download><i class="fa-solid fa-download"></i> Download</a>
        </div>
      </div>

      <div class="quiz-section">
        <div class="quiz-header">
          <i class="fa-solid fa-circle-question"></i>
          <div><h3>Module Quiz</h3><p>Score 4/5 or higher to unlock your free certificate</p></div>
        </div>
        <form class="quiz-form">${quizHtml}
        </form>
        <button class="quiz-submit-btn"><i class="fa-solid fa-paper-plane"></i> Submit Answers</button>
        <div class="quiz-result"></div>
      </div>

      <section style="margin-bottom:40px">
        <h3 style="margin-bottom:20px"><i class="fa-solid fa-circle-question" style="color:var(--gold);margin-right:8px"></i> Frequently Asked Questions</h3>
        ${faqHtml}
      </section>
    </div>

    <aside class="course-sidebar">
      <div class="course-sidebar-card">
        <h4><i class="fa-solid fa-chart-line" style="color:var(--gold);margin-right:8px"></i> Your Progress</h4>
        <div class="progress-ring-wrap">
          <svg class="progress-ring-svg" width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="var(--light-grey)" stroke-width="8"/>
            <circle class="progress-ring-circle" cx="45" cy="45" r="36" fill="none" stroke="var(--gold)" stroke-width="8" stroke-linecap="round" style="stroke-dasharray:226.2;stroke-dashoffset:226.2"/>
          </svg>
          <div class="progress-text"><div class="pct progress-pct-val">0%</div><div class="pct-label">complete</div></div>
        </div>
        <div class="progress-info">
          <div class="prog-stat"><span>Lessons completed</span><span class="val"><span class="prog-completed-count">0</span> / <span class="prog-total-count">${c.lessons}</span></span></div>
          <div class="prog-stat"><span>Duration</span><span class="val">${c.duration}</span></div>
          <div class="prog-stat"><span>Certificate</span><span class="val">Free</span></div>
        </div>
        <button class="cert-unlock-btn" disabled><i class="fa-solid fa-certificate"></i> Get Certificate</button>
        <div class="cert-unlock-hint">Complete all ${c.lessons} modules + quiz to unlock.</div>
      </div>

      <div class="course-sidebar-card">
        <h4><i class="fa-solid fa-paperclip" style="color:var(--gold);margin-right:8px"></i> Downloads</h4>
        <div class="resource-item">
          <div class="resource-icon"><i class="fa-solid fa-file-pdf"></i></div>
          <div class="resource-info"><div class="resource-title">Course Notes PDF</div><div class="resource-meta">${c.lessons} modules</div></div>
          <a href="downloads/${c.id}-notes.pdf" class="resource-dl-btn" download><i class="fa-solid fa-download"></i></a>
        </div>
      </div>

      <div class="course-sidebar-card">
        <h4>Your Instructor</h4>
        <div class="instructor-card">
          <div class="instructor-avatar"><i class="fa-solid fa-user-tie"></i></div>
          <div class="instructor-info">
            <div class="instructor-name">CA Karan Shah</div>
            <div class="instructor-title">Chartered Accountant & IBBI Registered Valuer</div>
            <div class="instructor-credentials"><span class="cred-tag">CA</span><span class="cred-tag">CFA L3</span><span class="cred-tag">IBBI Valuer</span></div>
          </div>
        </div>
      </div>

      <div class="course-sidebar-card">
        <h4>Share This Course</h4>
        <div class="share-row">
          <button class="share-btn share-btn-wa" data-share="wa"><i class="fa-brands fa-whatsapp"></i> Share</button>
          <button class="share-btn share-btn-li" data-share="li"><i class="fa-brands fa-linkedin-in"></i> Share</button>
          <button class="share-btn share-btn-copy" data-share="copy"><i class="fa-solid fa-link"></i> Copy</button>
        </div>
      </div>

      <div class="course-sidebar-card">
        <h4>Up Next</h4>${relatedHtml}
      </div>

      <div class="course-sidebar-card" style="background:var(--navy);border-color:var(--navy)">
        <h4 style="color:var(--gold)">Need Expert Help?</h4>
        <p style="color:rgba(255,255,255,0.7);font-size:0.83rem;margin-bottom:16px">Our team can handle this for your business professionally.</p>
        <a href="${c.relatedService.url}" class="btn btn-primary btn-sm" style="width:100%;justify-content:center;margin-bottom:8px">${c.relatedService.title}</a>
        <a href="https://api.whatsapp.com/send/?phone=917666638995" target="_blank" class="btn btn-secondary btn-sm" style="width:100%;justify-content:center"><i class="fa-brands fa-whatsapp"></i> WhatsApp Us</a>
      </div>
    </aside>
  </div>
</div>

<div class="cert-modal-overlay">
  <div class="cert-modal">
    <button class="cert-modal-close" aria-label="Close">&times;</button>
    <h3 style="margin-bottom:6px">Get Your Certificate</h3>
    <p style="color:var(--text-grey);font-size:0.85rem;margin-bottom:20px">Enter your full name as you'd like it to appear on the certificate.</p>
    <input type="text" class="cert-name-input" placeholder="Enter your full name" maxlength="60">
    <button class="cert-generate-btn"><i class="fa-solid fa-certificate"></i> Generate Certificate</button>
    <div class="certificate">
      <div class="cert-logo">KC Shah <span>& Associates</span></div>
      <div class="cert-subtitle">Free Training Academy</div>
      <div class="cert-seal"><i class="fa-solid fa-award"></i></div>
      <div class="cert-presents">This certificate is proudly presented to</div>
      <div class="cert-recipient">Your Name</div>
      <div class="cert-course-label">for successfully completing</div>
      <div class="cert-course-name">${c.title}</div>
      <div style="font-size:0.78rem;color:var(--text-grey);margin-top:6px">${c.lessons} Modules · ${c.level} Level · ${c.duration}</div>
      <div class="cert-date">Issued on —</div>
      <div class="cert-id">Certificate ID: —</div>
      <button class="cert-print-btn"><i class="fa-solid fa-print"></i> Print / Download PDF</button>
    </div>
  </div>
</div>

<section class="cta-banner"><div class="container"><h2>Want Expert Help?</h2><p>Our CA team can handle your ${c.catLabel.toLowerCase()} needs professionally — so you can focus on growing your business.</p><div class="btn-group"><a href="../contact.html" class="btn btn-primary">Book Free Consultation</a><a href="https://api.whatsapp.com/send/?phone=917666638995" target="_blank" class="btn btn-secondary"><i class="fa-brands fa-whatsapp"></i> WhatsApp Us</a></div></div></section>

${footerHtml()}

<a href="https://api.whatsapp.com/send/?phone=917666638995" target="_blank" class="whatsapp-float" aria-label="Chat on WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
<div class="mobile-sticky-cta"><a href="tel:+917666638995" class="btn btn-primary btn-sm" style="flex:1;justify-content:center"><i class="fa-solid fa-phone"></i> Call Now</a><a href="https://api.whatsapp.com/send/?phone=917666638995" class="btn btn-sm" style="flex:1;justify-content:center;background:#25D366;color:white;border-color:#25D366"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a></div>

<script src="../scripts.js"></script>
<script src="academy.js"></script>
</body>
</html>`;
}

// Generate all pages
let count = 0;
COURSES.forEach(c => {
  const html = generatePage(c);
  const outPath = path.join(__dirname, `${c.id}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`✓ ${c.id}.html`);
  count++;
});
console.log(`\nDone — ${count} course pages generated.`);
