const arrAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't','v', 'w', 'y'];
function initialLoad () {
    arrAlphabet.forEach(element => {
        fetch(`https://themealdb.com/api/json/v1/1/search.php?f=${element}`)
        .then(function(response) {return response.json()})
        .then(function(json) { console.log(json) 
        renderResult(json)})
    })  
}
initialLoad();
fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(function(response) {return response.json()})
    .then(function(json) {defaultDisplay(json)})
//global variables ------------------------
const recipeMenu = document.getElementById("recipe-menu");
const displayImage = document.getElementById("display-image");
const displayName = document.getElementById("recipe-name");
const displayIngredients = document.getElementById("ingredients");
const displayInstructions = document.getElementById("instructions");
const likeButton = document.getElementById("like-bttn");
const displayLikes = document.getElementById("display-likes")
const catFilterBttn = document.getElementById('category-filter');
const selectCat = document.getElementById('food-category');
const countryFilterBttn = document.getElementById('country-filter');
const selectCountry = document.getElementById('food-country');
const userInput = document.getElementById("user-input");
const searchButton = document.getElementById("search-button");
const filterButton = document.getElementById("filter");

let featuredRecipe, displayArr, userRecipe;

//functions ------------------------
function userIngredients () {
    let searchText = userInput.value.toLowerCase();
    let newArray = searchText.split(", ");
    let spaceArray = searchText.split(" ");
    let ingredientArray = [];
    for (const letter of arrAlphabet){
        fetch(`https://themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        .then(response => response.json())
        .then(mealObj => {
            let iterable = mealObj.meals;
            if(Array.isArray(iterable)) {
                iterable.forEach(recipe => {
                    for(let i=1; i<21; i++) {
                        if(recipe[`strIngredient${i}`] !== null) {
                            let wordText = recipe[`strIngredient${i}`].toLowerCase();
                            let wordArray = [];
                            wordArray = wordText.split(" ");
                            for(let word of wordArray) {
                                if(newArray[0] === word || spaceArray[0] === word){
                                    ingredientArray.push(recipe);   
                                }
                            }
                            if (ingredientArray.length > 0){
                                if (ingredientArray[ingredientArray.length - 1].idMeal === recipe.idMeal){
                                    break;
                                }
                                
                            }
                        }  
                    }
                })
            }
        })
    }
    if(newArray.length > 1 || spaceArray.length > 1) {
        setTimeout(() => multiIngredient(newArray, ingredientArray, spaceArray), 1500);
    } else {
        setTimeout(() => singleIngredient(ingredientArray), 1500);
    }
    userInput.value = "";
}

function singleIngredient (ingredientArray) {
    recipeMenu.replaceChildren();
    ingredientArray.forEach(element => {
        element.likes = Math.floor(Math.random() * (100 - 1) + 1);
        renderFilterResult(element);
    })
    checkDatabase(ingredientArray[0]);
}


function multiIngredient (newArray, ingredientArray, spaceArray) {
    let tempArray = [];
    
    ingredientArray.forEach(recipe => {
        for(let i=1; i<21; i++) {
            if(recipe[`strIngredient${i}`] !== null) {
                let wordText = recipe[`strIngredient${i}`].toLowerCase();
                let wordArray = [];
                wordArray = wordText.split(" ");
                for(let ingredient of wordArray) {
                    if(newArray[1] === ingredient || spaceArray[1] === ingredient){
                        tempArray.push(recipe);
                    }
                }
                if (tempArray.length > 0 && tempArray[tempArray.length -1].idMeal === recipe.idMeal){
                    break;
                }
            }  
        }
    })
   
    recipeMenu.replaceChildren();
    tempArray.forEach(element => {
        element.likes = Math.floor(Math.random() * (100 - 1) + 1);
        renderFilterResult(element);
    })
    checkDatabase(tempArray[0]);
}

function defaultDisplay (obj) {
    obj.meals.forEach(recipe => {  
        recipe.likes = Math.floor(Math.random() * (100 - 1) + 1);
        checkDatabase(recipe);
    })
}

function renderResult (obj) {
    obj.meals.forEach(recipe => {
        let newResult = document.createElement("div");
        let recipeImage = document.createElement("img");
        let recipeTitle = document.createElement("h4");
        let resultLikes = document.createElement("p");
        
        recipe.likes = Math.floor(Math.random() * (100 - 1) + 1);

        recipeTitle.className = "recipe-title";
        recipeImage.className = "recipe-image";
        newResult.className = "result";

        recipeImage.title = recipe.strMeal;
        recipeImage.src = recipe.strMealThumb;
        recipeTitle.textContent = recipe.strMeal;

        newResult.append(recipeTitle, recipeImage, resultLikes);
        recipeMenu.append(newResult);

        recipeImage.addEventListener("click", () => checkDatabase(recipe))
    })
}

function renderDisplay (obj) {
    featuredRecipe = obj;
    displayImage.src = obj.strMealThumb;
    displayName.textContent = obj.strMeal;
    displayInstructions.textContent = obj.strInstructions;
    displayLikes.textContent = obj.likes;
    likeButton.style.backgroundColor = "white";
    displayIngredients.replaceChildren();
    for(let key in obj){ 
        for(let i=1; i<21; i++) {
            if(key === `strIngredient${i}`){
                if(obj[key] !== null && obj[key] !== "") {
                    let ingredient = document.createElement("li");
                    ingredient.textContent = obj[`strMeasure${i}`] + " " +obj[key];
                    displayIngredients.append(ingredient);
                } 
            }
        }
    }

}

function renderFilterResult(recipe){
        let newResult = document.createElement("div");
        let recipeImage = document.createElement("img");
        let recipeTitle = document.createElement("h4");

        recipeTitle.className = "recipe-title";
        recipeImage.className = "recipe-image";
        newResult.className = "result";

        recipeImage.title = recipe.strMeal;

        recipeImage.src = recipe.strMealThumb;
        recipeTitle.textContent = recipe.strMeal;

        newResult.append(recipeTitle, recipeImage);
        recipeMenu.append(newResult);

        recipeImage.addEventListener("click", () => checkDatabase(recipe))
}

function filter () {
    const categoryInput = selectCat.value;
    const countryInput = selectCountry.value;
    if(categoryInput === "Default" && countryInput !== "Default") {
        countryFilter();
    } else if(categoryInput !== "Default" && countryInput === "Default") {
        categoryFilter();
    } else if(categoryInput !== "Default" && countryInput !== "Default") {
        filterBoth();
    } else {
        recipeMenu.replaceChildren();
        initialLoad();
    }
}

function filterBoth () {
    let countryArray = [];
    let categoryArray = [];
    const categoryInput = selectCat.value;
    const countryInput = selectCountry.value;
    recipeMenu.replaceChildren();
    for (const element of arrAlphabet){
        fetch(`https://themealdb.com/api/json/v1/1/search.php?f=${element}`)
        .then(response => response.json())
        .then(responseObj =>{
            let iterable = responseObj.meals
            if (Array.isArray(iterable)){
                iterable.forEach((obj)=> { 
                    for(const key in obj){
                            if(countryInput === obj[key]){
                                obj.likes = Math.floor(Math.random() * (100 - 1) + 1)
                                countryArray.push(obj)
                            }
                    }   
                })
            }
        })
    } 
    setTimeout(() => {
        countryArray.forEach(recipe => {
            if(recipe.strCategory === categoryInput) {
                categoryArray.push(recipe);
            }
        })
        categoryArray.forEach(element => {
            renderFilterResult(element);
        })
        checkDatabase(categoryArray[0]);
    }, 1000)
}

function categoryFilter(){
    displayArr = [];
    const userInput = selectCat.value;
    recipeMenu.replaceChildren();
    for (const element of arrAlphabet){
        fetch(`https://themealdb.com/api/json/v1/1/search.php?f=${element}`)
        .then(response => response.json())
        .then(responseObj =>{
            let iterable = responseObj.meals
            if (Array.isArray(iterable)){
                iterable.forEach((obj)=> { 
                    for(const key in obj){
                            if(userInput === obj[key]){
                                obj.likes = Math.floor(Math.random() * (100 - 1) + 1)
                                    if(displayArr.length < 1){
                                        displayArr.push(obj)
                                        checkDatabase(obj)
                                    }
                                    renderFilterResult(obj);
                                    break;
                            }
                    }   
                })
            }
        })
    }
}

function countryFilter(){
    displayArr = [];
    const userInput = selectCountry.value;
    recipeMenu.replaceChildren();
    for (const element of arrAlphabet){
        fetch(`https://themealdb.com/api/json/v1/1/search.php?f=${element}`)
        .then(response => response.json())
        .then(responseObj =>{
            let iterable = responseObj.meals
            if (Array.isArray(iterable)){
                iterable.forEach((obj)=> { 
                for(const key in obj){
                        if(userInput === obj[key]){
                            obj.likes = Math.floor(Math.random() * (100 - 1) + 1)
                            if(displayArr.length < 1){
                                displayArr.push(obj)
                                checkDatabase(obj)
                            }
                            renderFilterResult(obj);
                            break;
                    }
                }
            })
        }
        })
    }
}

function patchLikes(){
    configObj ={
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(featuredRecipe)
    }

    fetch(`http://localhost:3000/meals/${featuredRecipe.id}`, configObj)
    .then(response => response.json())
    .catch(error => console.error("Error: ", error))
    .then(console.log("successful likes patch"))

}

function addLikes () {
    featuredRecipe.likes = parseInt(featuredRecipe.likes) + 1;
    displayLikes.textContent = featuredRecipe.likes;
    likeButton.style.backgroundColor = "red";
    patchLikes();
}

//get requests (patch/post)
function checkDatabase(recipe){
    fetch('http://localhost:3000/meals')
    .then(response =>  response.json())
    .catch(error => console.log(error))
    .then(data => {
        for (const element of data ){
            if (recipe.idMeal === element.idMeal){
                console.log('retrieving recipe');
                getRecipe(recipe);
                return "Recipe retrieved from database";
            }
        }
        console.log('Recipe added to database')
        postRecipe(recipe);
        })

}

function postRecipe(recipe){
    configurationObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipe)
    }
    fetch('http://localhost:3000/meals', configurationObj)
    .then(response => response.json())
    .then(data => renderDisplay(data))
    .catch(error => console.log(error))
}

function getRecipe(recipe){
    fetch('http://localhost:3000/meals')
    .then(response => response.json())
    .then(data => {
        data.forEach(element =>{
            if (element.idMeal === recipe.idMeal){
                renderDisplay(element)
            }
        })
    })
    .catch(error=> console.log(error))
}

function patchLikes () {
    configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(featuredRecipe)
    }
    fetch(`http://localhost:3000/meals/${featuredRecipe.id}`, configObj)
    .then(response => response.json())
    .then(console.log("success"))
}

//event listeners ---------------------------
likeButton.addEventListener("click", () => addLikes())
filterButton.addEventListener("click", filter)
searchButton.addEventListener("click", userIngredients)