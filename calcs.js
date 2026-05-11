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
    // Individual income inputs
    document.querySelectorAll('#ind-income-body input').forEach(function (el) {
      if (!el.hasAttribute('data-ind-income') && !el.closest('#ind-expense-body')) {
        el.setAttribute('data-ind-income', '');
      }
    });

    // Individual expense inputs
    document.querySelectorAll('#ind-expense-body input').forEach(function (el) {
      el.setAttribute('data-ind-expense', '');
    });

    // Business income inputs
    document.querySelectorAll('#biz-income-body input').forEach(function (el) {
      if (!el.hasAttribute('data-biz-income') && !el.closest('#biz-expense-body')) {
        el.setAttribute('data-biz-income', '');
      }
    });

    // Business expense inputs
    document.querySelectorAll('#biz-expense-body input').forEach(function (el) {
      el.setAttribute('data-biz-expense', '');
    });

    console.info('ensureDataAttributes: attributes set (if missing)');
  } catch (err) {
    console.warn('ensureDataAttributes failed', err);
  }
}

function relocateSummaryInteractive() {
  try {
    var changed = 0;
    document.querySelectorAll('summary').forEach(function (summary) {
      var interactive = summary.querySelectorAll('a,button,input,select,textarea,[role="button"],[role="link"]');
      if (!interactive || interactive.length === 0) return;

      var details = summary.parentElement;
      if (!details) return;

      // Ensure we have a .summary-actions container
      var next = summary.nextElementSibling;
      var actionDiv = null;
      if (next && next.classList && next.classList.contains('summary-actions')) {
        actionDiv = next;
      } else {
        actionDiv = document.createElement('div');
        actionDiv.className = 'summary-actions';
        if (summary.nextSibling) details.insertBefore(actionDiv, summary.nextSibling);
        else details.appendChild(actionDiv);
      }

      // Move interactive elements into the actionDiv (preserve IDs/classes)
      Array.from(interactive).forEach(function (el) {
        actionDiv.appendChild(el);
      });

      // Wrap remaining summary text in .summary-title if not already present
      if (!summary.querySelector('.summary-title')) {
        var titleSpan = document.createElement('span');
        titleSpan.className = 'summary-title';

        // Move all text nodes and non-action elements into titleSpan
        var childNodes = Array.from(summary.childNodes);
        childNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE && node.classList && node.classList.contains('summary-actions')) {
            // skip
            return;
          }
          if (node.nodeType === Node.ELEMENT_NODE && node.classList && node.classList.contains('summary-title')) return;
          titleSpan.appendChild(node);
        });

        summary.appendChild(titleSpan);
      }

      // Add class to details for styling
      details.classList.add('has-actions');
      changed++;
    });

    // Add minimal CSS for alignment if not already added
    if (!document.getElementById('summary-actions-style')) {
      var style = document.createElement('style');
      style.id = 'summary-actions-style';
      style.textContent = '\n.has-actions summary{display:flex;align-items:center;justify-content:space-between}\n.summary-actions{margin-left:1rem}\n.summary-title{flex:1}\n';
      document.head.appendChild(style);
    }

    if (changed) console.info('relocateSummaryInteractive: moved interactive elements from', changed, 'summary(ies)');
  } catch (err) {
    console.warn('relocateSummaryInteractive failed', err);
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

  // Move interactive elements out of summaries for accessibility (WET may have cloned/moved DOM)
  relocateSummaryInteractive();

  initIndividualCalculator();
  initBusinessCalculator();

  // Attach direct handlers to buttons (more reliable than global delegation in WET tabs)
  try {
    var indReset = document.getElementById('ind-btn-reset');
    if (indReset) {
      indReset.addEventListener('click', function () {
        console.info('ind-btn-reset clicked');
        resetIndividual();
      });
    }

    var indPrint = document.getElementById('ind-btn-print');
    if (indPrint) {
      indPrint.addEventListener('click', function () {
        console.info('ind-btn-print clicked');
        printSection('ind-print-region');
      });
    }

    var bizReset = document.getElementById('biz-btn-reset');
    if (bizReset) {
      bizReset.addEventListener('click', function () {
        console.info('biz-btn-reset clicked');
        resetBusiness();
      });
    }

    var bizPrint = document.getElementById('biz-btn-print');
    if (bizPrint) {
      bizPrint.addEventListener('click', function () {
        console.info('biz-btn-print clicked');
        printSection('biz-print-region');
      });
    }

    console.info('button handlers attached');
  } catch (err) {
    console.warn('attach button handlers failed', err);
  }

});

// Fallbacks in case wb-ready doesn't fire or scripts run earlier/later
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // run on next tick
  setTimeout(function () {
    ensureDataAttributes();
    relocateSummaryInteractive();

    // attach click handlers as a fallback
    try {
      document.getElementById('ind-btn-print') && document.getElementById('ind-btn-print').addEventListener('click', function () { console.info('ind-btn-print clicked (fallback)'); printSection('ind-print-region'); });
      document.getElementById('biz-btn-print') && document.getElementById('biz-btn-print').addEventListener('click', function () { console.info('biz-btn-print clicked (fallback)'); printSection('biz-print-region'); });
      document.getElementById('ind-btn-reset') && document.getElementById('ind-btn-reset').addEventListener('click', function () { console.info('ind-btn-reset clicked (fallback)'); resetIndividual(); });
      document.getElementById('biz-btn-reset') && document.getElementById('biz-btn-reset').addEventListener('click', function () { console.info('biz-btn-reset clicked (fallback)'); resetBusiness(); });
    } catch (err) { /* noop */ }
  }, 0);
} else {
  document.addEventListener('DOMContentLoaded', function () {
    ensureDataAttributes();
    relocateSummaryInteractive();
  });
}

/* =========================
   PRINT FUNCTION
========================= */

function printSection(id) {

  var el = document.getElementById(id);
  if (!el) {
    console.warn('printSection: element with id ' + id + ' not found');
    return;
  }

  var content = el.innerHTML;

  var printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.warn('printSection: window.open was blocked');
    return;
  }

  printWindow.document.write('\n    <html>\n    <head>\n      <title>Print</title>\n\n      <link rel="stylesheet"\n        href="https://wet-boew.github.io/themes-dist/GCWeb/GCWeb/css/theme.min.css">\n\n      <style>\n        body {\n          padding: 20px;\n        }\n\n        details {\n          display: block !important;\n        }\n\n        summary {\n          list-style: none;\n          font-weight: bold;\n          margin-top: 20px;\n        }\n\n        input {\n          border: none !important;\n          background: transparent !important;\n          width: 100%;\n        }\n\n        .btn,\n        button {\n          display: none !important;\n        }\n      </style>\n\n    </head>\n    <body>\n\n      ' + content + '\n\n    </body>\n    </html>\n  ');

  printWindow.document.close();
  printWindow.focus();

  setTimeout(function () {
    printWindow.print();
    printWindow.close();
  }, 500);

}
