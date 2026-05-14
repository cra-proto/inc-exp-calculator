/*
 * Monthly net income and expense worksheet - print behaviour
 * Canada.ca / CRA prototype
 *
 * Pairs with monthly-net-income-expense-print.css.
 *
 * What this does:
 * - Individual Print button prints only #ind-print-region.
 * - Business Print button prints only #biz-print-region.
 * - Body classes are removed after the print dialog closes/cancels.
 * - Uses beforeprint/afterprint as cleanup support where available.
 */

(function () {
  "use strict";

  var PRINT_INDIVIDUAL_CLASS = "print-individual";
  var PRINT_BUSINESS_CLASS = "print-business";
  var PRINTING_CLASS = "is-printing-calculator";
  var CLEANUP_DELAY = 750;

  var cleanupTimer = null;

  /**
   * Remove all print-specific body classes.
   */
  function clearPrintState() {
    if (cleanupTimer) {
      window.clearTimeout(cleanupTimer);
      cleanupTimer = null;
    }

    document.body.classList.remove(
      PRINT_INDIVIDUAL_CLASS,
      PRINT_BUSINESS_CLASS,
      PRINTING_CLASS
    );
  }

  /**
   * Set the active print state.
   *
   * @param {string} printClass - The body class that controls which calculator prints.
   */
  function setPrintState(printClass) {
    clearPrintState();

    document.body.classList.add(PRINTING_CLASS, printClass);
  }

  /**
   * Trigger the browser print dialog for a calculator.
   *
   * @param {string} printClass - PRINT_INDIVIDUAL_CLASS or PRINT_BUSINESS_CLASS.
   */
  function printCalculator(printClass) {
    setPrintState(printClass);

    /*
     * requestAnimationFrame gives the browser a chance to apply the print class
     * before window.print() captures the page.
     */
    window.requestAnimationFrame(function () {
      window.print();

      /*
       * Some browsers do not reliably fire afterprint, especially if the user
       * cancels quickly. This fallback prevents stale print classes.
       */
      cleanupTimer = window.setTimeout(clearPrintState, CLEANUP_DELAY);
    });
  }

  /**
   * Attach a click handler if the button exists.
   *
   * @param {string} buttonId - ID of the print button.
   * @param {string} printClass - Body class to add for the print view.
   */
  function bindPrintButton(buttonId, printClass) {
    var button = document.getElementById(buttonId);

    if (!button) {
      return;
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      printCalculator(printClass);
    });
  }

  /**
   * Initialize print behaviour.
   */
  function initCalculatorPrint() {
    bindPrintButton("ind-btn-print", PRINT_INDIVIDUAL_CLASS);
    bindPrintButton("biz-btn-print", PRINT_BUSINESS_CLASS);
  }

  /*
   * Cleanup after the print dialog closes.
   * Supported by modern Chromium, Firefox, and Safari, with the timeout fallback above.
   */
  window.addEventListener("afterprint", clearPrintState);

  /*
   * If the user opens the browser print command directly, do not add calculator-specific
   * classes. The CSS will print both calculators and page-break before the business one.
   */
  window.addEventListener("beforeprint", function () {
    if (
      !document.body.classList.contains(PRINT_INDIVIDUAL_CLASS) &&
      !document.body.classList.contains(PRINT_BUSINESS_CLASS)
    ) {
      document.body.classList.remove(PRINTING_CLASS);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCalculatorPrint);
  } else {
    initCalculatorPrint();
  }
})();
