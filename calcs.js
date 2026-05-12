/* ind */
function initIndividualCalculator() {

  function fmt(n) {
    return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function sumByAttr(attr) {
    var total = 0;

    document.querySelectorAll("input[" + attr + "]").forEach(function (el) {
      var val = parseFloat(el.value);

      if (!isNaN(val) && val > 0) {
        total += val;
      }
    });

    return total;
  }

  function calculate() {
    var income = sumByAttr("data-ind-income");
    var expenses = sumByAttr("data-ind-expense");
    var net = income - expenses;

    var incEl = document.getElementById("ind-res-income");
    var expEl = document.getElementById("ind-res-expenses");
    var netEl = document.getElementById("ind-res-net");

    if (incEl) incEl.textContent = fmt(income);
    if (expEl) expEl.textContent = fmt(expenses);
    if (netEl) netEl.textContent = fmt(net);
  }

  document.addEventListener("input", function (e) {
    if (
      e.target.matches("input[data-ind-income]") ||
      e.target.matches("input[data-ind-expense]")
    ) {
      calculate();
    }
  });

}

/* bus */
function initBusinessCalculator() {

  function fmt(n) {
    return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function sumByAttr(attr) {
    var total = 0;

    document.querySelectorAll("input[" + attr + "]").forEach(function (el) {
      var val = parseFloat(el.value);

      if (!isNaN(val) && val > 0) {
        total += val;
      }
    });

    return total;
  }

  function calculate() {
    var income = sumByAttr("data-biz-income");
    var expenses = sumByAttr("data-biz-expense");
    var net = income - expenses;

    var incEl = document.getElementById("biz-res-income");
    var expEl = document.getElementById("biz-res-expenses");
    var netEl = document.getElementById("biz-res-net");

    if (incEl) incEl.textContent = fmt(income);
    if (expEl) expEl.textContent = fmt(expenses);
    if (netEl) netEl.textContent = fmt(net);
  }

  document.addEventListener("input", function (e) {
    if (
      e.target.matches("input[data-biz-income]") ||
      e.target.matches("input[data-biz-expense]")
    ) {
      calculate();
    }
  });

}

// Ensure inputs have data-* attributes so sumByAttr finds them even if HTML is missing attributes
function ensureDataAttributes() {
  try {
    document.querySelectorAll('#ind-income-body input').forEach(function (el) {
      if (!el.hasAttribute('data-ind-income') && !el.closest('#ind-expense-body')) {
        el.setAttribute('data-ind-income', '');
      }
    });

    document.querySelectorAll('#ind-expense-body input').forEach(function (el) {
      el.setAttribute('data-ind-expense', '');
    });

    document.querySelectorAll('#biz-income-body input').forEach(function (el) {
      if (!el.hasAttribute('data-biz-income') && !el.closest('#biz-expense-body')) {
        el.setAttribute('data-biz-income', '');
      }
    });

    document.querySelectorAll('#biz-expense-body input').forEach(function (el) {
      el.setAttribute('data-biz-expense', '');
    });
  } catch (err) {
    // silent
  }
}

function resetIndividual() {
  document.querySelectorAll("input[data-ind-income], input[data-ind-expense]")
    .forEach(function (el) { el.value = ''; });

  var incEl = document.getElementById("ind-res-income");
  var expEl = document.getElementById("ind-res-expenses");
  var netEl = document.getElementById("ind-res-net");

  if (incEl) incEl.textContent = "$0.00";
  if (expEl) expEl.textContent = "$0.00";
  if (netEl) netEl.textContent = "$0.00";

  var panel = document.getElementById('inc-exp-1');
  if (panel && panel.scrollIntoView) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function resetBusiness() {
  document.querySelectorAll("input[data-biz-income], input[data-biz-expense]")
    .forEach(function (el) { el.value = ''; });

  var incEl = document.getElementById("biz-res-income");
  var expEl = document.getElementById("biz-res-expenses");
  var netEl = document.getElementById("biz-res-net");

  if (incEl) incEl.textContent = "$0.00";
  if (expEl) expEl.textContent = "$0.00";
  if (netEl) netEl.textContent = "$0.00";

  var panel = document.getElementById('inc-exp-2');
  if (panel && panel.scrollIntoView) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

$(document).on("wb-ready.wb", function () {
  // Ensure attributes first, then init calculators so input listeners work
  ensureDataAttributes();

  initIndividualCalculator();
  initBusinessCalculator();

  // Attach direct handlers to buttons
  try {
    var indReset = document.getElementById('ind-btn-reset');
    if (indReset) {
      indReset.addEventListener('click', function () { resetIndividual(); });
    }

    var indPrint = document.getElementById('ind-btn-print');
    if (indPrint) {
      indPrint.addEventListener('click', function () { printSection('ind-print-region'); });
    }

    var bizReset = document.getElementById('biz-btn-reset');
    if (bizReset) {
      bizReset.addEventListener('click', function () { resetBusiness(); });
    }

    var bizPrint = document.getElementById('biz-btn-print');
    if (bizPrint) {
      bizPrint.addEventListener('click', function () { printSection('biz-print-region'); });
    }
  } catch (err) {
    // silent
  }

});

/* =========================
   PRINT FUNCTION
========================= */

function printSection(id) {
  var el = document.getElementById(id);
  if (!el) return;

  var content = el.innerHTML;

  var printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write('\n    <html>\n    <head>\n      <title>Print</title>\n\n      <link rel="stylesheet"\n        href="https://wet-boew.github.io/themes-dist/GCWeb/GCWeb/css/theme.min.css">\n\n      <style>\n        body {\n          padding: 20px;\n        }\n\n        details {\n          display: block !important;\n        }\n\n        summary {\n          list-style: none;\n          font-weight: bold;\n          margin-top: 20px;\n        }\n\n        input {\n          border: none !important;\n          background: transparent !important;\n          width: 100%;\n        }\n\n        .btn,\n        button {\n          display: none !important;\n        }\n      </style>\n\n    </head>\n    <body>\n\n      ' + content + '\n\n    </body>\n    </html>\n  ');

  printWindow.document.close();
  printWindow.focus();

  setTimeout(function () {
    printWindow.print();
    printWindow.close();
  }, 500);
}
