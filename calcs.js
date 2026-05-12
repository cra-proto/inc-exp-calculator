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
    var el = document.getElementById(id);
    if (!el) return;

    var content = el.innerHTML;
    var printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write('\n    <html>\n    <head>\n      <title>Print</title>\n      <link rel="stylesheet" href="https://wet-boew.github.io/themes-dist/GCWeb/GCWeb/css/theme.min.css">\n      <style>\n        body { padding: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 9pt; color: #000; }\n        details { display: block !important; }\n        summary { list-style: none; font-weight: bold; margin-top: 12px; }\n        input { border: none !important; background: transparent !important; width: auto; }\n        .btn, button { display: none !important; }\n\n        /* Remove table borders and stripes for clean print output */\n        table, th, td, .table, .table th, .table td {\n          border: none !important;\n          background-color: transparent !important;\n          border-collapse: collapse !important;\n        }\n        table { width: 100%; }\n        th, td { padding: 2px 6px !important; line-height: 1.1 !important; vertical-align: middle !important; }\n\n        /* Prevent wrapping of currency symbols, operators and values */\n        .wb-math-grid .mg-cell, .input-group-addon, td, th, .mg-cell * { white-space: nowrap !important; }\n\n        /* Narrow operator column and right-align numeric values */\n        .wb-math-grid .mg-row .mg-cell:nth-child(2) { width: 1%; text-align: center; white-space: nowrap !important; }\n        .wb-math-grid .mg-row .mg-cell:nth-child(3), td.amount, th.amount { text-align: right; white-space: nowrap !important; }\n\n        /* Tighten results panel spacing */\n        .calc-results, #ind-res-panel, #biz-res-panel, .results-panel { margin: 0 !important; padding: 4px 0 !important; }\n        .calc-results h4, .results-panel h4, .calc-results .h4 { margin: 0 0 4px 0 !important; font-size: 10pt !important; }\n\n      </style>\n    </head>\n    <body>\n      ' + content + '\n    </body>\n    </html>\n  ');

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
