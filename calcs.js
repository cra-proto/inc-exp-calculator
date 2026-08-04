(function () {
  'use strict';

  function fmt(n) {
    return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function sumBySelector(selector) {
    var total = 0;
    var els = document.querySelectorAll(selector);
    els.forEach(function (el) {
      var val = parseFloat(el.value);
      if (!isNaN(val) && val > 0) {
        total += val;
      }
    });
    return total;
  }

  function sanitizeCurrencyInput(el) {

    var value = el.value;
    value = value.replace(/[^0-9.]/g, '');

    var parts = value.split('.');

    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    if (value.indexOf('.') !== -1) {

      var split = value.split('.');
      value = split[0] + '.' + split[1].substring(0, 2);
    }

    if (value === '.') {
      value = '0.';
    }

    el.value = value;
  }

  /* Individual calculator */
  function initIndividualCalculator() {
    function calculate() {
      // Support both explicit data attributes and id prefixes.
      var incomeSelector = 'input[data-ind-income], input[id^="ind-inc-"]';
      var expenseSelector = 'input[data-ind-expense], input[id^="ind-exp-"]';

      var income = sumBySelector(incomeSelector);
      var expenses = sumBySelector(expenseSelector);
      var net = income - expenses;

      var incEl = document.getElementById('ind-res-income');
      var expEl = document.getElementById('ind-res-expenses');
      var netEl = document.getElementById('ind-res-net');

      if (incEl) incEl.textContent = fmt(income);
      if (expEl) expEl.textContent = fmt(expenses);
      if (netEl) netEl.textContent = fmt(net);
    }

    document.addEventListener('input', function (e) {

      if (
        e.target.matches('input[data-ind-income]') ||
        e.target.matches('input[data-ind-expense]') ||
        e.target.matches('input[id^="ind-inc-"]') ||
        e.target.matches('input[id^="ind-exp-"]')
      ) {

        sanitizeCurrencyInput(e.target);

        calculate();
      }

    });

    // Run an initial calculation in case there are pre-filled values
    calculate();
  }

  /* Business calculator */
  function initBusinessCalculator() {
    function calculate() {
      var incomeSelector = 'input[data-biz-income], input[id^="biz-inc-"]';
      var expenseSelector = 'input[data-biz-expense], input[id^="biz-exp-"]';

      var income = sumBySelector(incomeSelector);
      var expenses = sumBySelector(expenseSelector);
      var net = income - expenses;

      var incEl = document.getElementById('biz-res-income');
      var expEl = document.getElementById('biz-res-expenses');
      var netEl = document.getElementById('biz-res-net');

      if (incEl) incEl.textContent = fmt(income);
      if (expEl) expEl.textContent = fmt(expenses);
      if (netEl) netEl.textContent = fmt(net);
    }

    document.addEventListener('input', function (e) {

      if (
        e.target.matches('input[data-biz-income]') ||
        e.target.matches('input[data-biz-expense]') ||
        e.target.matches('input[id^="biz-inc-"]') ||
        e.target.matches('input[id^="biz-exp-"]')
      ) {

        sanitizeCurrencyInput(e.target);

        calculate();
      }

    });

    // initial calculation
    calculate();
  }

  /* Reset button */
  function resetIndividual() {
    // Clear inputs that match either the data attributes or id prefixes
    document.querySelectorAll('input[data-ind-income], input[data-ind-expense], input[id^="ind-inc-"], input[id^="ind-exp-"]').forEach(function (el) { el.value = ''; });

    var incEl = document.getElementById('ind-res-income');
    var expEl = document.getElementById('ind-res-expenses');
    var netEl = document.getElementById('ind-res-net');

    if (incEl) incEl.textContent = '$0.00';
    if (expEl) expEl.textContent = '$0.00';
    if (netEl) netEl.textContent = '$0.00';

    var panel = document.getElementById('inc-exp-1');
    if (panel && panel.scrollIntoView) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetBusiness() {
    document.querySelectorAll('input[data-biz-income], input[data-biz-expense], input[id^="biz-inc-"], input[id^="biz-exp-"]').forEach(function (el) { el.value = ''; });

    var incEl = document.getElementById('biz-res-income');
    var expEl = document.getElementById('biz-res-expenses');
    var netEl = document.getElementById('biz-res-net');

    if (incEl) incEl.textContent = '$0.00';
    if (expEl) expEl.textContent = '$0.00';
    if (netEl) netEl.textContent = '$0.00';

    var panel = document.getElementById('inc-exp-2');
    if (panel && panel.scrollIntoView) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* Make calculators work inside tabs */
  $(document).on('wb-ready.wb', function () {
    initIndividualCalculator();
    initBusinessCalculator();

    var indReset = document.getElementById('ind-btn-reset');
    if (indReset) indReset.addEventListener('click', resetIndividual);

    var indPrint = document.getElementById('ind-btn-print');
    if (indPrint) indPrint.addEventListener('click', function () { printSection('ind-print-region'); });

    var bizReset = document.getElementById('biz-btn-reset');
    if (bizReset) bizReset.addEventListener('click', resetBusiness);

    var bizPrint = document.getElementById('biz-btn-print');
    if (bizPrint) bizPrint.addEventListener('click', function () { printSection('biz-print-region'); });
  });

  /* Print button 
     I don't know how else to make this work without rewriting all the css for print */

  function printSection(id) {
  var region = document.getElementById(id);
  if (!region) return;

  // Clone the region so we don't change live DOM
  var clone = region.cloneNode(true);

  // For every input in the clone: compute a display string and set as value attribute
  clone.querySelectorAll('input').forEach(function (input) {
    // Prefer the live value if present; fall back to existing attribute
    var raw = input.value || input.getAttribute('value') || '';
    // Clean and parse numeric part
    var cleaned = String(raw).replace(/[^0-9.\-]/g, '');
    var num = parseFloat(cleaned);
    var display = '';
    if (!isNaN(num)) {
      display = fmt(num); // uses your fmt() to format like $1,234.56
    } else if (raw && raw.trim()) {
      display = raw.trim();
    }
    // Set the attribute on the clone so innerHTML will contain it
    input.setAttribute('value', display);
  });

  // Now take innerHTML from the clone
  var content = clone.innerHTML;

  var printWindow = window.open("", "_blank");

  printWindow.document.write(`
      <html>
    <head>
      <title>Print</title>

      <link rel="stylesheet"
        href="https://wet-boew.github.io/themes-dist/GCWeb/GCWeb/css/theme.min.css">

      <style>

body {
  font-family: Arial, sans-serif;
  padding: 18px;
  color: #000;
  font-size: 13px;
  line-height: 1.2;
}


/* Normalize print typography */
body,
table,
tr,
td,
th,
div,
span,
p,
label,
summary,
details,
input,
.wb-math-grid,
.mg-row,
.mg-cell {
  font-family: Arial, sans-serif !important;
  font-size: 14px !important;
  font-weight: normal !important;
  line-height: 1.3 !important;
  color: #000 !important;
}

/* tables */

table,
tbody,
tr,
td,
th {
  border: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
}

table {
  width: 100% !important;
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  margin: 0 0 6px 0 !important;
}

tbody {
  display: block !important;
}

table tr {
  display: grid !important;
  grid-template-columns: 1fr 12px 64px !important;
  column-gap: 2px !important;
  align-items: baseline !important;

  height: 18px !important;
  min-height: 18px !important;
  max-height: 18px !important;

  margin: 0 !important;
  padding: 0 !important;
  line-height: 18px !important;
}

table td {
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 18px !important;
  vertical-align: baseline !important;
}

table td:first-child {
  grid-column: 1;
}

table td:last-child {
  grid-column: 2 / 4;
  width: auto !important;
}

/* compact labels */
table label {
  display: inline !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 18px !important;
  font-weight: normal !important;
}

/* remove striping */
tr:nth-child(even),
tr:nth-child(odd),
.table-striped tbody tr:nth-child(odd),
.table-hover tbody tr:hover {
  background: transparent !important;
}

/* remove striping */
tr:nth-child(even),
tr:nth-child(odd),
.table-striped tbody tr:nth-child(odd),
.table-hover tbody tr:hover {
  background: transparent !important;
}

/* details / sections */

details {
  display: block !important;
  margin-bottom: 10px !important;
  border: none !important;
}

summary {
  display: block;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
  border-bottom: 2px solid #000;
  padding-bottom: 2px;
}

/* input alignment */

.input-group {
  display: grid !important;
  grid-template-columns: 12px 64px !important;
  column-gap: 2px !important;
  width: 78px !important;
  margin-left: auto !important;
  align-items: baseline !important;
  line-height: 18px !important;
}

.input-group-addon {
  display: block !important;
  text-align: right !important;
  border: 0 !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 18px !important;
}

input {
  display: block !important;
  width: 64px !important;
  min-width: 64px !important;
  height: 18px !important;
  min-height: 18px !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 18px !important;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  text-align: right !important;
}

/* results panel */

.well {
  border: 1px solid #000 !important;
  padding: 10px 12px !important;
  margin-top: 12px !important;
  background: #fff !important;
  box-shadow: none !important;
}

.results-panel h5 {
  margin: 0 0 8px 0 !important;
  padding-bottom: 4px !important;
  border-bottom: 1px solid #ccc !important;
  font-size: 18px !important;
  font-weight: bold !important;
}

/* result rows */

.wb-math-grid {
  display: block !important;
  width: 100% !important;
}

.mg-row {
  display: grid !important;
  grid-template-columns: 1fr 24px 90px;
  column-gap: 8px;
  align-items: baseline;
  padding: 2px 0 !important;
  margin: 0 !important;
}

.mg-cell {
  padding: 0 !important;
  margin: 0 !important;
}

.mg-cell:nth-child(2) {
  text-align: center !important;
}

.mg-cell:last-child {
  text-align: right !important;
  white-space: nowrap !important;
  font-variant-numeric: tabular-nums;
}

.mg-row.net-total {
  border-top: 1px solid #000;
  margin-top: 6px !important;
  padding-top: 6px !important;
}

/* Operator column (- and =) */
.mg-cell:nth-child(2) {
  text-align: center;
}

/* Dollar amounts */
.mg-cell:last-child {
  text-align: right;
  white-space: nowrap;
}

/* Divider above net difference */
.mg-row.net-total {
  border-top: 1px solid #000;
  margin-top: 6px;
  padding-top: 6px;
}
/* buttons */

.btn,
button {
  display: none !important;
}

/* remove GCWeb styling noise */

.bg-primary {
  background: transparent !important;
  color: #000 !important;
}

      </style>

    </head>

    <body>
      ${content}
    </body>

    </html>
  `);

  printWindow.document.close();

  printWindow.focus();

  setTimeout(function () {
    printWindow.print();
    printWindow.close();
  }, 500);

}

  window.printSection = printSection;
})();
