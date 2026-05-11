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
