fetch("https://themealdb.com/api/json/v1/1/search.php?f=a")
    .then(function(response) {return response.json()})
    .then(function(json) {renderResult(json)})
fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(function(response) {return response.json()})
    .then(function(json) {defaultDisplay(json)})
//global variables ------------------------
const recipeMenu = document.getElementById("recipe-menu");
const displayImage = document.getElementById("display-image");
const displayName = document.getElementById("recipe-name");
const displayIngredients = document.getElementById("ingredients");
const displayInstructions = document.getElementById("instructions");
const arrAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const likeButton = document.getElementById("like-bttn");
const displayLikes = document.getElementById("display-likes")
const catFilterBttn = document.getElementById('category-filter');
const selectCat = document.getElementById('food-category');
const countryFilterBttn = document.getElementById('country-filter');
const selectCountry = document.getElementById('food-country')


let featuredRecipe, displayArr;

//functions ------------------------
function defaultDisplay (obj) {
    obj.meals.forEach(recipe => {  
        console.log(recipe)  
        recipe.likes = Math.floor(Math.random() * (100 - 1) + 1);
        featuredRecipe = recipe;
        displayImage.src = recipe.strMealThumb;
        displayName.textContent = recipe.strMeal;
        displayInstructions.textContent = recipe.strInstructions;
        displayLikes.textContent = recipe.likes;
        displayIngredients.replaceChildren();
        for(let key in recipe){ 
            for(let i=1; i<21; i++) {
                if(key === `strIngredient${i}`){
                    if(recipe[key] !== null && recipe[key] !== "") {
                        let ingredient = document.createElement("li");
                        ingredient.textContent = recipe[`strMeasure${i}`] + " " +recipe[key];
                        displayIngredients.append(ingredient);
                    } 
                }
        }
    }
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

        recipeImage.addEventListener("click", () => renderDisplay(recipe))
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

        recipe.likes = Math.floor(Math.random() * (100 - 1) + 1);

        recipeImage.title = recipe.strMeal;

        recipeImage.src = recipe.strMealThumb;
        recipeTitle.textContent = recipe.strMeal;

        newResult.append(recipeTitle, recipeImage);
        recipeMenu.append(newResult);

        recipeImage.addEventListener("click", () => renderDisplay(recipe))
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
                                if(displayArr.length < 1){
                                    displayArr.push(obj)
                                    renderDisplay(obj)
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
                            if(displayArr.length < 1){
                                displayArr.push(obj)
                                renderDisplay(obj)
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

function addLikes () {
    featuredRecipe.likes = parseInt(featuredRecipe.likes) + 1;
    displayLikes.textContent = featuredRecipe.likes;
    likeButton.style.backgroundColor = "red";
}

//event listeners ---------------------------
likeButton.addEventListener("click", () => addLikes())
catFilterBttn.addEventListener('click', categoryFilter)
countryFilterBttn.addEventListener('click', countryFilter)