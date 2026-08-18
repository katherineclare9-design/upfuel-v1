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

    // Hide intro
    introScreen.classList.remove("active");

    // Show main app
    mainApp.classList.add("active");

});
