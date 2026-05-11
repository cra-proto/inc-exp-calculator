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

    document.getElementById("ind-res-income").textContent = fmt(income);
    document.getElementById("ind-res-expenses").textContent = fmt(expenses);
    document.getElementById("ind-res-net").textContent = fmt(net);
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

    document.getElementById("biz-res-income").textContent = fmt(income);
    document.getElementById("biz-res-expenses").textContent = fmt(expenses);
    document.getElementById("biz-res-net").textContent = fmt(net);
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

$(document).on("wb-ready.wb", function () {

  initIndividualCalculator();
  initBusinessCalculator();

});


/* =========================
   INDIVIDUAL CALCULATOR
========================= */

document.addEventListener("click", function (e) {

  /* RESET */
  if (e.target.closest("#ind-btn-reset")) {

    document
      .querySelectorAll(
        "input[data-ind-income], input[data-ind-expense]"
      )
      .forEach(function (el) {
        el.value = "";
      });

    document.getElementById("ind-res-income").textContent = "$0.00";
    document.getElementById("ind-res-expenses").textContent = "$0.00";
    document.getElementById("ind-res-net").textContent = "$0.00";

    document.getElementById("inc-exp-1")
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  }

  /* PRINT */
  if (e.target.closest("#ind-btn-print")) {

    printSection("ind-print-region");

  }

});


/* =========================
   BUSINESS CALCULATOR
========================= */

document.addEventListener("click", function (e) {

  /* RESET */
  if (e.target.closest("#biz-btn-reset")) {

    document
      .querySelectorAll(
        "input[data-biz-income], input[data-biz-expense]"
      )
      .forEach(function (el) {
        el.value = "";
      });

    document.getElementById("biz-res-income").textContent = "$0.00";
    document.getElementById("biz-res-expenses").textContent = "$0.00";
    document.getElementById("biz-res-net").textContent = "$0.00";

    document.getElementById("inc-exp-2")
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  }

  /* PRINT */
  if (e.target.closest("#biz-btn-print")) {

    printSection("biz-print-region");

  }

});


/* =========================
   PRINT FUNCTION
========================= */

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
          padding: 20px;
        }

        details {
          display: block !important;
        }

        summary {
          list-style: none;
          font-weight: bold;
          margin-top: 20px;
        }

        input {
          border: none !important;
          background: transparent !important;
          width: 100%;
        }

        .btn,
        button {
          display: none !important;
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
