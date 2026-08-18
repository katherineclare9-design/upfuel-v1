/* =========================================
   UPFUEL — APP LOGIC
========================================= */


/* =========================================
   STORAGE
========================================= */

let upfuelData = JSON.parse(
    localStorage.getItem("upfuelData")
) || {

    favorites: [],

    foodStatus: {},

    savedMeals: [],

    fuelCheckin: {

        beforeTraining: false,

        afterTraining: false,

        energy: false

    }

};


function saveData() {

    localStorage.setItem(
        "upfuelData",
        JSON.stringify(upfuelData)
    );

}


/* =========================================
   INTRO
========================================= */

const introScreen =
    document.getElementById("introScreen");

const mainApp =
    document.getElementById("mainApp");

const introNextBtn =
    document.getElementById("introNextBtn");


introNextBtn.addEventListener("click", () => {

    introScreen.classList.remove("active");

    mainApp.classList.add("active");

    renderHome();

});


/* =========================================
   NAVIGATION
========================================= */

function showPage(pageId) {

    document.querySelectorAll(".app-page")
        .forEach(page => {

            page.classList.remove("active");

        });


    const page =
        document.getElementById(pageId);


    if (page) {

        page.classList.add("active");

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


document.querySelectorAll("[data-page]")
    .forEach(button => {

        button.addEventListener("click", () => {

            showPage(button.dataset.page);

        });

    });


/* =========================================
   HOME
========================================= */

function renderHome() {

    const totalFoods =
        Object.values(upfuelData.foodStatus)
            .filter(status => status === "comfortable")
            .length;


    const favoriteCount =
        upfuelData.favorites.length;


    document.getElementById(
        "homeFoodVariety"
    ).textContent =
        `${totalFoods} foods`;


    document.getElementById(
        "homeFavorites"
    ).textContent =
        `${favoriteCount} foods`;


    const checkin =
        upfuelData.fuelCheckin;


    const completed = [

        checkin.beforeTraining,

        checkin.afterTraining,

        checkin.energy

    ].filter(Boolean).length;


    document.getElementById(
        "homeFuelStatus"
    ).textContent =
        completed === 0
            ? "Not checked"
            : `${completed}/3`;

}


/* =========================================
   FOOD FAMILY BUTTONS
========================================= */

const foodFamilyButtons =
    document.getElementById(
        "foodFamilyButtons"
    );


function renderFamilyButtons() {

    foodFamilyButtons.innerHTML = "";


    const allButton =
        document.createElement("button");


    allButton.className =
        "family-filter-btn active";


    allButton.textContent =
        "All";


    allButton.addEventListener(
        "click",
        () => {

            setActiveFamilyButton(
                allButton
            );

            renderFoods();

        }
    );


    foodFamilyButtons.appendChild(
        allButton
    );


    Object.keys(foodFamilies)
        .forEach(family => {

            const button =
                document.createElement("button");


            button.className =
                "family-filter-btn";


            button.textContent =
                family;


            button.addEventListener(
                "click",
                () => {

                    setActiveFamilyButton(
                        button
                    );

                    renderFoods(family);

                }
            );


            foodFamilyButtons.appendChild(
                button
            );

        });

}


function setActiveFamilyButton(button) {

    document.querySelectorAll(
        ".family-filter-btn"
    ).forEach(btn => {

        btn.classList.remove("active");

    });


    button.classList.add("active");

}


/* =========================================
   FOOD EXPLORER
========================================= */

const foodSearch =
    document.getElementById("foodSearch");


foodSearch.addEventListener(
    "input",
    () => {

        renderFoods();

    }
);


function getAllFoods() {

    const foods = [];


    Object.entries(foodFamilies)
        .forEach(([family, items]) => {

            items.forEach(food => {

                foods.push({

                    name: food,

                    family: family

                });

            });

        });


    return foods;

}


function renderFoods(selectedFamily = null) {

    const foodList =
        document.getElementById(
            "foodList"
        );


    let foods =
        selectedFamily
            ? foodFamilies[selectedFamily]
                .map(food => ({

                    name: food,

                    family: selectedFamily

                }))
            : getAllFoods();


    const search =
        foodSearch.value
            .trim()
            .toLowerCase();


    if (search) {

        foods = foods.filter(food =>
            food.name
                .toLowerCase()
                .includes(search)
        );

    }


    foodList.innerHTML = "";


    if (foods.length === 0) {

        foodList.innerHTML = `

            <section class="dashboard-card">

                <h3>
                    No foods found
                </h3>

                <p>
                    Try another search.
                </p>

            </section>

        `;

        return;

    }


    foods.forEach(food => {

        const item =
            document.createElement("div");


        item.className =
            "food-item";


        const status =
            upfuelData.foodStatus[
                food.name
            ] || "unrated";


        const isFavorite =
            upfuelData.favorites
                .includes(food.name);


        item.innerHTML = `

            <div class="food-info">

                <h3>
                    ${food.name}
                </h3>

                <p>
                    ${food.family}
                </p>

                ${
                    status !== "unrated"
                    ? `

                        <span class="food-status">

                            ${status}

                        </span>

                    `
                    : ""
                }

            </div>


            <div class="food-actions">

                <button

                    class="favorite-btn ${
                        isFavorite
                            ? "favorite"
                            : ""
                    }"

                    data-food="${food.name}"

                >

                    ★

                </button>


                <button

                    class="secondary-btn"

                    data-comfort="${food.name}"

                >

                    ${
                        status === "comfortable"
                            ? "COMFORTABLE"
                            : "SET"
                    }

                </button>

            </div>

        `;


        item.querySelector(
            ".favorite-btn"
        ).addEventListener(
            "click",
            () => toggleFavorite(food.name)
        );


        item.querySelector(
            "[data-comfort]"
        ).addEventListener(
            "click",
            () => cycleFoodStatus(food.name)
        );


        foodList.appendChild(item);

    });

}


/* =========================================
   FAVORITES
========================================= */

function toggleFavorite(food) {

    const index =
        upfuelData.favorites
            .indexOf(food);


    if (index === -1) {

        upfuelData.favorites.push(food);

    }

    else {

        upfuelData.favorites.splice(
            index,
            1
        );

    }


    saveData();

    renderFoods();

    renderHome();

}


/* =========================================
   FOOD STATUS
========================================= */

function cycleFoodStatus(food) {

    const current =
        upfuelData.foodStatus[food];


    if (!current) {

        upfuelData.foodStatus[food] =
            "comfortable";

    }

    else if (
        current === "comfortable"
    ) {

        upfuelData.foodStatus[food] =
            "familiar";

    }

    else if (
        current === "familiar"
    ) {

        upfuelData.foodStatus[food] =
            "new";

    }

    else {

        delete upfuelData.foodStatus[food];

    }


    saveData();

    renderFoods();

    renderHome();

    renderFamilyProgress();

}


/* =========================================
   FOOD FAMILIES PAGE
========================================= */

function renderFamilyCards() {

    const container =
        document.getElementById(
            "familyCards"
        );


    container.innerHTML = "";


    Object.entries(foodFamilies)
        .forEach(([family, foods]) => {

            const comfortable =
                foods.filter(food =>
                    upfuelData.foodStatus[food]
                    === "comfortable"
                ).length;


            const card =
                document.createElement("div");


            card.className =
                "family-card";


            card.innerHTML = `

                <h3>
                    ${family}
                </h3>

                <p>
                    ${foods.length} options
                </p>

                <p>
                    ${comfortable} comfortable
                </p>

            `;


            card.addEventListener(
                "click",
                () => {

                    showPage("foodPage");

                    foodSearch.value = "";


                    document.querySelectorAll(
                        ".family-filter-btn"
                    ).forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );


                        if (
                            btn.textContent === family
                        ) {

                            btn.classList.add(
                                "active"
                            );

                        }

                    });


                    renderFoods(family);

                }
            );


            container.appendChild(card);

        });

}


/* =========================================
   MEAL BUILDER
========================================= */

function renderMealFoodOptions() {

    const container =
        document.getElementById(
            "mealFoodOptions"
        );


    container.innerHTML = "";


    getAllFoods().forEach(food => {

        const label =
            document.createElement("label");


        label.className =
            "meal-food-option";


        label.innerHTML = `

            <input

                type="checkbox"

                value="${food.name}"

            >

            <span>
                ${food.name}
            </span>

        `;


        container.appendChild(label);

    });

}


document.getElementById(
    "saveMealBtn"
).addEventListener(
    "click",
    saveMeal
);


function saveMeal() {

    const name =
        document.getElementById(
            "mealName"
        ).value.trim();


    const foods =
        [
            ...document.querySelectorAll(
                "#mealFoodOptions input:checked"
            )
        ].map(
            input => input.value
        );


    if (!name || foods.length === 0) {

        alert(
            "Add a meal name and at least one food."
        );

        return;

    }


    upfuelData.savedMeals.push({

        name: name,

        foods: foods

    });


    saveData();


    document.getElementById(
        "mealName"
    ).value = "";


    document.querySelectorAll(
        "#mealFoodOptions input"
    ).forEach(input => {

        input.checked = false;

    });


    renderSavedMeals();

}


function renderSavedMeals() {

    const container =
        document.getElementById(
            "savedMeals"
        );


    container.innerHTML = "";


    if (
        upfuelData.savedMeals.length === 0
    ) {

        container.innerHTML =
            "<p>No saved meals yet.</p>";

        return;

    }


    upfuelData.savedMeals
        .forEach(meal => {

            const item =
                document.createElement("div");


            item.className =
                "saved-meal";


            item.innerHTML = `

                <h3>
                    ${meal.name}
                </h3>

                <p>
                    ${meal.foods.join(", ")}
                </p>

            `;


            container.appendChild(item);

        });

}


/* =========================================
   PRE-CHEER FUEL
========================================= */

const preCheerIdeas = {

    soon: [

        "Banana",

        "Applesauce",

        "Crackers",

        "Toast",

        "Granola bar"

    ],

    later: [

        "Greek yogurt + fruit",

        "Peanut butter toast",

        "Cereal + milk",

        "Turkey sandwich",

        "Smoothie"

    ],

    meal: [

        "Rice + chicken + fruit",

        "Pasta + protein + fruit",

        "Bagel + eggs + fruit",

        "Potato + chicken + vegetable",

        "Rice bowl + protein"

    ]

};


document.querySelectorAll(
    ".fuel-time-btn"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            renderPreCheer(
                button.dataset.time
            );

        }
    );

});


function renderPreCheer(time) {

    const container =
        document.getElementById(
            "preCheerResults"
        );


    container.innerHTML = `

        <section class="dashboard-card">

            <p class="small-label">
                OPTIONS
            </p>

            <h3>
                Choose what feels right for you.
            </h3>

        </section>

    `;


    preCheerIdeas[time]
        .forEach(idea => {

            const item =
                document.createElement("div");


            item.className =
                "fuel-result";


            item.innerHTML = `

                <h3>
                    ${idea}
                </h3>

                <p>
                    A simple option to consider before training.
                </p>

            `;


            container.appendChild(item);

        });

}


/* =========================================
   RECOVERY
========================================= */

function renderRecoveryOptions() {

    const container =
        document.getElementById(
            "recoveryOptions"
        );


    const options = [

        {

            title: "Protein + Carbohydrate",

            text:
                "Try pairing a protein food with a carbohydrate food you enjoy."

        },

        {

            title: "Easy Snack",

            text:
                "Choose a familiar snack such as yogurt and fruit, cereal and milk, or a sandwich."

        },

        {

            title: "Full Meal",

            text:
                "If you're ready for a meal, combine foods from different families."

        }

    ];


    container.innerHTML = "";


    options.forEach(option => {

        const item =
            document.createElement("div");


        item.className =
            "recovery-option";


        item.innerHTML = `

            <h3>
                ${option.title}
            </h3>

            <p>
                ${option.text}
            </p>

        `;


        container.appendChild(item);

    });

}


/* =========================================
   FUEL CHECK-IN
========================================= */

document.getElementById(
    "saveCheckinBtn"
).addEventListener(
    "click",
    saveCheckin
);


function saveCheckin() {

    upfuelData.fuelCheckin = {

        beforeTraining:
            document.getElementById(
                "beforeTrainingCheck"
            ).checked,

        afterTraining:
            document.getElementById(
                "afterTrainingCheck"
            ).checked,

        energy:
            document.getElementById(
                "energyCheck"
            ).checked

    };


    saveData();

    renderHome();

    renderProgress();

}


/* =========================================
   PROGRESS
========================================= */

function renderFamilyProgress() {

    const container =
        document.getElementById(
            "familyProgress"
        );


    container.innerHTML = "";


    Object.entries(foodFamilies)
        .forEach(([family, foods]) => {

            const comfortable =
                foods.filter(food =>
                    upfuelData.foodStatus[food]
                    === "comfortable"
                ).length;


            const percentage =
                Math.round(
                    (comfortable / foods.length) * 100
                );


            const item =
                document.createElement("div");


            item.className =
                "family-progress-item";


            item.innerHTML = `

                <div class="family-progress-label">

                    <span>
                        ${family}
                    </span>

                    <span>
                        ${comfortable}/${foods.length}
                    </span>

                </div>


                <div class="progress-bar">

                    <div

                        class="progress-fill"

                        style="width:${percentage}%"

                    ></div>

                </div>

            `;


            container.appendChild(item);

        });

}


function renderProgress() {

    renderFamilyProgress();


    const checkin =
        upfuelData.fuelCheckin;


    const completed = [

        checkin.beforeTraining,

        checkin.afterTraining,

        checkin.energy

    ].filter(Boolean).length;


    document.getElementById(
        "progressCheckin"
    ).textContent =
        `${completed}/3 fuel check-in habits completed.`;

}


/* =========================================
   INITIALIZE
========================================= */

renderFamilyButtons();

renderFoods();

renderFamilyCards();

renderMealFoodOptions();

renderSavedMeals();

renderRecoveryOptions();

renderProgress();

renderHome();
