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


/* Protect against missing data from older versions */

upfuelData.favorites ||= [];
upfuelData.foodStatus ||= {};
upfuelData.savedMeals ||= [];

upfuelData.fuelCheckin ||= {

    beforeTraining: false,

    afterTraining: false,

    energy: false

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


if (introNextBtn) {

    introNextBtn.addEventListener(
        "click",
        () => {

            introScreen.classList.remove("active");

            mainApp.classList.add("active");

            renderHome();

        }
    );

}


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

        button.addEventListener(
            "click",
            () => {

                showPage(
                    button.dataset.page
                );

            }
        );

    });


/* =========================================
   HOME
========================================= */

function renderHome() {

    const totalFoods =
        Object.values(
            upfuelData.foodStatus
        )
        .filter(
            status =>
                status === "comfortable"
        )
        .length;


    const favoriteCount =
        upfuelData.favorites.length;


    const foodVariety =
        document.getElementById(
            "homeFoodVariety"
        );


    const favorites =
        document.getElementById(
            "homeFavorites"
        );


    const fuelStatus =
        document.getElementById(
            "homeFuelStatus"
        );


    if (foodVariety) {

        foodVariety.textContent =
            `${totalFoods} foods`;

    }


    if (favorites) {

        favorites.textContent =
            `${favoriteCount} foods`;

    }


    const checkin =
        upfuelData.fuelCheckin;


    const completed = [

        checkin.beforeTraining,

        checkin.afterTraining,

        checkin.energy

    ].filter(Boolean).length;


    if (fuelStatus) {

        fuelStatus.textContent =
            completed === 0
                ? "Not checked"
                : `${completed}/3`;

    }

}


/* =========================================
   FOOD FAMILY BUTTONS
========================================= */

const foodFamilyButtons =
    document.getElementById(
        "foodFamilyButtons"
    );


function renderFamilyButtons() {

    if (!foodFamilyButtons) return;


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

                    renderFoods(
                        family
                    );

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

        btn.classList.remove(
            "active"
        );

    });


    button.classList.add(
        "active"
    );

}


/* =========================================
   FOOD EXPLORER
========================================= */

const foodSearch =
    document.getElementById(
        "foodSearch"
    );


if (foodSearch) {

    foodSearch.addEventListener(
        "input",
        () => {

            renderFoods();

        }
    );

}


function getAllFoods() {

    const foods = [];

    const seenFoods =
        new Set();


    Object.entries(foodFamilies)
        .forEach(
            ([family, items]) => {

                items.forEach(food => {

                    /*
                     Prevent duplicate foods
                     from appearing multiple times.
                    */

                    if (
                        !seenFoods.has(food)
                    ) {

                        seenFoods.add(food);

                        foods.push({

                            name: food,

                            family: family

                        });

                    }

                });

            }
        );


    return foods;

}


function renderFoods(
    selectedFamily = null
) {

    const foodList =
        document.getElementById(
            "foodList"
        );


    if (!foodList) return;


    let foods;


    if (selectedFamily) {

        foods =
            foodFamilies[
                selectedFamily
            ].map(food => ({

                name: food,

                family: selectedFamily

            }));

    }

    else {

        foods =
            getAllFoods();

    }


    const search =
        foodSearch
            ? foodSearch.value
                .trim()
                .toLowerCase()
            : "";


    if (search) {

        foods =
            foods.filter(
                food =>
                    food.name
                        .toLowerCase()
                        .includes(search)
            );

    }


    foodList.innerHTML = "";


    if (foods.length === 0) {

        foodList.innerHTML = `

            <section class="dashboard-card">

                <p class="small-label">
                    FOOD EXPLORER
                </p>

                <h3>
                    No foods found
                </h3>

                <p>
                    Try another search or food family.
                </p>

            </section>

        `;

        return;

    }


    foods.forEach(food => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "food-item";


        const status =
            upfuelData.foodStatus[
                food.name
            ] || "unrated";


        const isFavorite =
            upfuelData.favorites
                .includes(
                    food.name
                );


        const statusLabel =
            status === "unrated"
                ? "Not rated"
                : status;


        item.innerHTML = `

            <div class="food-info">

                <h3>
                    ${food.name}
                </h3>

                <p>
                    ${food.family}
                </p>

                <span class="food-status">

                    ${statusLabel}

                </span>

            </div>


            <div class="food-actions">

                <button

                    class="favorite-btn ${
                        isFavorite
                            ? "favorite"
                            : ""
                    }"

                    data-food="${
                        food.name
                    }"

                    aria-label="Favorite ${
                        food.name
                    }"

                >

                    ★

                </button>


                <button

                    class="secondary-btn"

                    data-comfort="${
                        food.name
                    }"

                >

                    ${
                        status === "unrated"
                            ? "SET"
                            : status.toUpperCase()
                    }

                </button>

            </div>

        `;


        const favoriteButton =
            item.querySelector(
                ".favorite-btn"
            );


        const statusButton =
            item.querySelector(
                "[data-comfort]"
            );


        favoriteButton.addEventListener(
            "click",
            () => {

                toggleFavorite(
                    food.name
                );

            }
        );


        statusButton.addEventListener(
            "click",
            () => {

                cycleFoodStatus(
                    food.name
                );

            }
        );


        foodList.appendChild(
            item
        );

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

        upfuelData.favorites.push(
            food
        );

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
        upfuelData.foodStatus[
            food
        ];


    if (!current) {

        upfuelData.foodStatus[
            food
        ] = "comfortable";

    }

    else if (
        current === "comfortable"
    ) {

        upfuelData.foodStatus[
            food
        ] = "familiar";

    }

    else if (
        current === "familiar"
    ) {

        upfuelData.foodStatus[
            food
        ] = "new";

    }

    else {

        delete upfuelData.foodStatus[
            food
        ];

    }


    saveData();

    renderFoods();

    renderHome();

    renderFamilyProgress();

    renderFamilyCards();

}


/* =========================================
   FOOD FAMILIES PAGE
========================================= */

function renderFamilyCards() {

    const container =
        document.getElementById(
            "familyCards"
        );


    if (!container) return;


    container.innerHTML = "";


    Object.entries(foodFamilies)
        .forEach(
            ([family, foods]) => {

                const comfortable =
                    foods.filter(
                        food =>
                            upfuelData
                                .foodStatus[
                                    food
                                ] ===
                                "comfortable"
                    ).length;


                const familiar =
                    foods.filter(
                        food =>
                            upfuelData
                                .foodStatus[
                                    food
                                ] ===
                                "familiar"
                    ).length;


                const newFoods =
                    foods.filter(
                        food =>
                            upfuelData
                                .foodStatus[
                                    food
                                ] ===
                                "new"
                    ).length;


                const card =
                    document.createElement(
                        "div"
                    );


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

                    <p>
                        ${familiar} familiar
                        ·
                        ${newFoods} new
                    </p>

                `;


                card.addEventListener(
                    "click",
                    () => {

                        showPage(
                            "foodPage"
                        );


                        if (foodSearch) {

                            foodSearch.value =
                                "";

                        }


                        document
                            .querySelectorAll(
                                ".family-filter-btn"
                            )
                            .forEach(
                                btn => {

                                    btn.classList
                                        .remove(
                                            "active"
                                        );


                                    if (
                                        btn.textContent
                                        === family
                                    ) {

                                        btn.classList
                                            .add(
                                                "active"
                                            );

                                    }

                                }
                            );


                        renderFoods(
                            family
                        );

                    }
                );


                container.appendChild(
                    card
                );

            }
        );

}


/* =========================================
   MEAL BUILDER
========================================= */

function renderMealFoodOptions() {

    const container =
        document.getElementById(
            "mealFoodOptions"
        );


    if (!container) return;


    container.innerHTML = "";


    getAllFoods().forEach(
        food => {

            const label =
                document.createElement(
                    "label"
                );


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


            container.appendChild(
                label
            );

        }
    );

}


const saveMealButton =
    document.getElementById(
        "saveMealBtn"
    );


if (saveMealButton) {

    saveMealButton.addEventListener(
        "click",
        saveMeal
    );

}


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
        ]
        .map(
            input =>
                input.value
        );


    if (
        !name ||
        foods.length === 0
    ) {

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


    document
        .querySelectorAll(
            "#mealFoodOptions input"
        )
        .forEach(
            input => {

                input.checked =
                    false;

            }
        );


    renderSavedMeals();

}


function renderSavedMeals() {

    const container =
        document.getElementById(
            "savedMeals"
        );


    if (!container) return;


    container.innerHTML = "";


    if (
        upfuelData.savedMeals
            .length === 0
    ) {

        container.innerHTML =
            "<p>No saved meals yet.</p>";

        return;

    }


    upfuelData.savedMeals
        .forEach(
            (meal, index) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "saved-meal";


                item.innerHTML = `

                    <h3>
                        ${meal.name}
                    </h3>

                    <p>
                        ${meal.foods.join(
                            ", "
                        )}
                    </p>

                    <button
                        class="secondary-btn"
                        data-delete-meal="${index}"
                    >
                        REMOVE
                    </button>

                `;


                item.querySelector(
                    "[data-delete-meal]"
                ).addEventListener(
                    "click",
                    () => {

                        deleteMeal(
                            index
                        );

                    }
                );


                container.appendChild(
                    item
                );

            }
        );

}


function deleteMeal(index) {

    upfuelData.savedMeals.splice(
        index,
        1
    );


    saveData();

    renderSavedMeals();

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

        "Granola Bar"

    ],

    later: [

        "Greek Yogurt + Fruit",

        "Peanut Butter Toast",

        "Cereal + Milk",

        "Turkey Sandwich",

        "Smoothie"

    ],

    meal: [

        "Rice + Chicken + Fruit",

        "Pasta + Protein + Fruit",

        "Bagel + Eggs + Fruit",

        "Potato + Chicken + Vegetable",

        "Rice Bowl + Protein"

    ]

};


document.querySelectorAll(
    ".fuel-time-btn"
).forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                renderPreCheer(
                    button.dataset.time
                );

            }
        );

    }
);


function renderPreCheer(time) {

    const container =
        document.getElementById(
            "preCheerResults"
        );


    if (!container) return;


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
        .forEach(
            idea => {

                const item =
                    document.createElement(
                        "div"
                    );


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


                container.appendChild(
                    item
                );

            }
        );

}


/* =========================================
   RECOVERY
========================================= */

function renderRecoveryOptions() {

    const container =
        document.getElementById(
            "recoveryOptions"
        );


    if (!container) return;


    const options = [

        {

            title:
                "Protein + Carbohydrate",

            text:
                "Try pairing a protein food with a carbohydrate food you enjoy."

        },

        {

            title:
                "Easy Snack",

            text:
                "Choose a familiar snack such as yogurt and fruit, cereal and milk, or a sandwich."

        },

        {

            title:
                "Full Meal",

            text:
                "If you're ready for a meal, combine foods from different families."

        }

    ];


    container.innerHTML = "";


    options.forEach(
        option => {

            const item =
                document.createElement(
                    "div"
                );


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


            container.appendChild(
                item
            );

        }
    );

}


/* =========================================
   FUEL CHECK-IN
========================================= */

const saveCheckinButton =
    document.getElementById(
        "saveCheckinBtn"
    );


if (saveCheckinButton) {

    saveCheckinButton.addEventListener(
        "click",
        saveCheckin
    );

}


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


    if (!container) return;


    container.innerHTML = "";


    Object.entries(foodFamilies)
        .forEach(
            ([family, foods]) => {

                const comfortable =
                    foods.filter(
                        food =>
                            upfuelData
                                .foodStatus[
                                    food
                                ] ===
                                "comfortable"
                    ).length;


                const percentage =
                    Math.round(
                        (
                            comfortable /
                            foods.length
                        ) * 100
                    );


                const item =
                    document.createElement(
                        "div"
                    );


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

                            style="
                                width:${percentage}%
                            "

                        ></div>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

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


    const progressCheckin =
        document.getElementById(
            "progressCheckin"
        );


    if (progressCheckin) {

        progressCheckin.textContent =
            `${completed}/3 fuel check-in habits completed.`;

    }

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
