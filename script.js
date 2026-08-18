/* =========================================
   UPFUEL — INTRO SYSTEM
   ========================================= */


/* =========================================
   INTRO ELEMENTS
   ========================================= */

const introScreen = document.getElementById("introScreen");
const mainApp = document.getElementById("mainApp");
const introNextBtn = document.getElementById("introNextBtn");

const introSteps = document.querySelectorAll(".intro-step");
const introDots = document.querySelectorAll(".intro-dot");


/* =========================================
   INTRO STATE
   ========================================= */

let currentIntroStep = 0;


/* =========================================
   SHOW INTRO STEP
   ========================================= */

function showIntroStep(step) {

    introSteps.forEach((introStep, index) => {

        introStep.classList.toggle(
            "active",
            index === step
        );

    });


    introDots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === step
        );

    });


    /* Change button on final screen */

    if (step === introSteps.length - 1) {

        introNextBtn.textContent = "ENTER UPFUEL";

    } else {

        introNextBtn.textContent = "NEXT";

    }

}


/* =========================================
   NEXT BUTTON
   ========================================= */

introNextBtn.addEventListener("click", () => {

    /* Move to next intro screen */

    if (currentIntroStep < introSteps.length - 1) {

        currentIntroStep++;

        showIntroStep(currentIntroStep);

        return;

    }


    /* Final intro screen → enter app */

    introScreen.classList.remove("active");

    mainApp.classList.add("active");

});


/* =========================================
   START INTRO
   ========================================= */

showIntroStep(currentIntroStep);
