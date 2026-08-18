/* =========================================
   UPFUEL — MAIN JAVASCRIPT
   ========================================= */


/* =========================================
   INTRO
   ========================================= */

const introScreen = document.getElementById("introScreen");
const mainApp = document.getElementById("mainApp");
const introNextBtn = document.getElementById("introNextBtn");


introNextBtn.addEventListener("click", () => {

    introScreen.classList.remove("active");

    mainApp.classList.add("active");

});
