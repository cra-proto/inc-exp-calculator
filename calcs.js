/* calcs.js - cleaned up version
   - Consolidated shared utilities
   - Removed runtime diagnostics and fallbacks
   - Kept core calculator, reset and print functionality
   - Updated print CSS to remove table lines and tighten results spacing
*/

(function () {
  'use strict';

  // Shared utilities
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

  // Individual calculator
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
        calculate();
      }
    });
  }

  // Business calculator
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
        calculate();
      }
    });
  }

  // Reset helpers
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

  // Attach handlers and initialize on WET ready
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

  /* PRINT FUNCTION (updated CSS to remove table lines + tighten results spacing) */
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
          padding: 24px;
          color: #000;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }

        table,
        tr,
        td,
        th {
          border: none !important;
          box-shadow: none !important;
        }

        td,
        th {
          padding: 6px 8px;
          vertical-align: middle;
        }

        tr:nth-child(even) {
          background: transparent !important;
        }

        .table-striped tbody tr:nth-child(odd),
        .table-hover tbody tr:hover {
          background: transparent !important;
        }

        details {
          display: block !important;
          margin-bottom: 24px;
        }

        summary {
          display: block;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 12px;
          border-bottom: 2px solid #000;
          padding-bottom: 4px;
        }

        .input-group {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .input-group-addon {
          border: none !important;
          background: transparent !important;
          padding-right: 4px;
          min-width: auto;
        }

        input {
          border: none !important;
          background: transparent !important;
          text-align: right !important;
          width: 120px !important;
          padding: 0 !important;
          box-shadow: none !important;
        }

        .well {
          border: 1px solid #000 !important;
          padding: 16px;
          margin-top: 24px;
          background: #fff !important;
          box-shadow: none !important;
        }

        .btn,
        button {
          display: none !important;
        }

        .bg-primary {
          background: transparent !important;
          color: #000 !important;
        }

        .wb-math-grid {
          width: 100%;
        }

        .mg-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
        }

        .mg-cell:last-child {
          text-align: right;
          min-width: 140px;
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

  // Expose printSection to global scope (used by handlers)
  window.printSection = printSection;
})();
