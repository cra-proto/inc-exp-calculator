(function () {
  'use strict';

  function fmt(n) {
    return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function sumByAttr(attr) {
    var total = 0;
    var els = document.querySelectorAll('input[' + attr + ']');
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
      var income = sumByAttr('data-ind-income');
      var expenses = sumByAttr('data-ind-expense');
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
        e.target.matches('input[data-ind-expense]')
      ) {

        sanitizeCurrencyInput(e.target);

        calculate();
      }

    });
  }

  /* Business calculator */
  function initBusinessCalculator() {
    function calculate() {
      var income = sumByAttr('data-biz-income');
      var expenses = sumByAttr('data-biz-expense');
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
        e.target.matches('input[data-biz-expense]')
      ) {

        sanitizeCurrencyInput(e.target);

        calculate();
      }

    });
  }

  /* Reset button */
  function resetIndividual() {
    document.querySelectorAll('input[data-ind-income], input[data-ind-expense]').forEach(function (el) { el.value = ''; });

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
    document.querySelectorAll('input[data-biz-income], input[data-biz-expense]').forEach(function (el) { el.value = ''; });

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

  var content = document.getElementById(id).innerHTML;

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

/* Tables */

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

/* Compact labels */
table label {
  display: inline !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 18px !important;
  font-weight: normal !important;
}

/* Remove striping */
tr:nth-child(even),
tr:nth-child(odd),
.table-striped tbody tr:nth-child(odd),
.table-hover tbody tr:hover {
  background: transparent !important;
}

/* Compact labels */
table label {
  display: inline !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 18px !important;
  font-weight: normal !important;
}

/* Remove striping */
tr:nth-child(even),
tr:nth-child(odd),
.table-striped tbody tr:nth-child(odd),
.table-hover tbody tr:hover {
  background: transparent !important;
}

/* Details / sections */

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

/* Input alignment */

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

/* Results panel */

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

/* Result rows */

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

/* Results area */
.wb-math-grid {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.mg-row {
  display: grid;
  grid-template-columns: 1fr 40px 140px;
  align-items: center;
  padding: 2px 0;
}

.mg-cell {
  padding: 0;
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
