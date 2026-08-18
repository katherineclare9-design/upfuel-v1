/* =========================================
   UPFUEL — FOOD DATABASE
========================================= */


const foodFamilies = {


    /* =========================================
       PROTEINS
    ========================================= */

    "Proteins": [

        "Chicken",
        "Turkey",
        "Eggs",
        "Greek Yogurt",
        "Yogurt",
        "Cottage Cheese",
        "Cheese",
        "Tofu",
        "Beans",
        "Lentils",
        "Chickpeas",
        "Peanut Butter",
        "Almond Butter",
        "Hummus",
        "Turkey Meatballs",
        "Chicken Nuggets",
        "Chicken Tenders",
        "Fish",
        "Tuna",
        "Salmon"

    ],


    /* =========================================
       FRUITS
    ========================================= */

    "Fruits": [

        "Banana",
        "Apple",
        "Applesauce",
        "Strawberries",
        "Blueberries",
        "Raspberries",
        "Blackberries",
        "Cherries",
        "Grapes",
        "Mango",
        "Orange",
        "Clementine",
        "Peach",
        "Pear",
        "Pineapple",
        "Watermelon",
        "Cantaloupe",
        "Kiwi",
        "Fruit Cup",
        "Dried Fruit",
        "Fruit Snacks"

    ],


    /* =========================================
       VEGETABLES
    ========================================= */

    "Vegetables": [

        "Carrots",
        "Baby Carrots",
        "Cucumber",
        "Broccoli",
        "Cauliflower",
        "Corn",
        "Peas",
        "Green Beans",
        "Sweet Potato",
        "Potato",
        "Bell Pepper",
        "Spinach",
        "Tomato",
        "Avocado",
        "Zucchini",
        "Edamame"

    ],


    /* =========================================
       GRAINS & CARBS
    ========================================= */

    "Grains & Carbs": [

        "Rice",
        "White Rice",
        "Brown Rice",
        "Pasta",
        "Macaroni",
        "Bread",
        "White Bread",
        "Whole Wheat Bread",
        "Toast",
        "Bagel",
        "English Muffin",
        "Oatmeal",
        "Cereal",
        "Granola",
        "Crackers",
        "Pretzels",
        "Tortilla",
        "Wrap",
        "Pita",
        "Pancakes",
        "Waffles",
        "French Toast",
        "Potatoes",
        "Sweet Potato",
        "Rice Cakes",
        "Popcorn"

    ],


    /* =========================================
       DAIRY & ALTERNATIVES
    ========================================= */

    "Dairy & Alternatives": [

        "Milk",
        "Chocolate Milk",
        "Strawberry Milk",
        "Greek Yogurt",
        "Yogurt",
        "Drinkable Yogurt",
        "Cheese",
        "String Cheese",
        "Cottage Cheese",
        "Cream Cheese",
        "Soy Milk",
        "Almond Milk",
        "Oat Milk"

    ],


    /* =========================================
       FATS
    ========================================= */

    "Fats": [

        "Avocado",
        "Peanut Butter",
        "Almond Butter",
        "Cashew Butter",
        "Olive Oil",
        "Butter",
        "Cheese",
        "Nuts",
        "Almonds",
        "Cashews",
        "Walnuts",
        "Sunflower Seeds",
        "Pumpkin Seeds",
        "Tahini"

    ],


    /* =========================================
       SNACK FOODS
    ========================================= */

    "Snack Foods": [

        "Granola Bar",
        "Protein Bar",
        "Pretzels",
        "Crackers",
        "Popcorn",
        "Trail Mix",
        "Fruit Snacks",
        "Rice Cakes",
        "Cheese Crackers",
        "Graham Crackers",
        "Goldfish Crackers",
        "Cookies",
        "Muffin",
        "Energy Bites",
        "Applesauce Pouch",
        "Yogurt Pouch",
        "Pudding",
        "Smoothie Bowl"

    ],


    /* =========================================
       DRINKS
    ========================================= */

    "Drinks": [

        "Water",
        "Milk",
        "Chocolate Milk",
        "Smoothie",
        "Fruit Smoothie",
        "Juice",
        "Orange Juice",
        "Apple Juice",
        "Sports Drink",
        "Electrolyte Drink",
        "Drinkable Yogurt",
        "Protein Shake"

    ]

};


/* =========================================
   FOOD FAMILY DESCRIPTIONS
========================================= */

const foodFamilyDescriptions = {

    "Proteins":
        "Foods that can help support muscles and recovery.",

    "Fruits":
        "Fruits with different flavors, textures, and forms to explore.",

    "Vegetables":
        "A variety of colorful foods with different textures and flavors.",

    "Grains & Carbs":
        "Foods that can provide energy for everyday activities and training.",

    "Dairy & Alternatives":
        "Milk, yogurt, cheese, and alternative options.",

    "Fats":
        "Foods that add flavor, texture, and energy to meals and snacks.",

    "Snack Foods":
        "Easy-to-grab foods that can work as snacks or additions to meals.",

    "Drinks":
        "Different drinks to explore throughout the day."

};


/* =========================================
   FOOD SEARCH HELPERS
========================================= */

function getFoodFamily(foodName) {

    for (
        const [family, foods]
        of Object.entries(foodFamilies)
    ) {

        if (foods.includes(foodName)) {

            return family;

        }

    }

    return null;

}


function foodExists(foodName) {

    return getFoodFamily(foodName) !== null;

}
