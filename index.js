fetch("https://themealdb.com/api/json/v1/1/search.php?f=b")
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
const selectCountry = document.getElementById('food-country');
const userInput = document.getElementById("user-input");
const searchButton = document.getElementById("search-button");

let featuredRecipe, displayArr, userRecipe;

//functions ------------------------
function userIngredients () {
    let searchText = userInput.value.toLowerCase();
    let newArray = searchText.split(", ");
    // console.log(newArray);
    let ingredientArray = [];
    newArray.forEach(element => {
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
                                for(let ingredient of wordArray) {
                                    if(element === ingredient){
                                        ingredientArray.push(recipe);
                                    }
                                }
                            }  
                        }
                    })
                }   
            })
        }
    })
    console.log(ingredientArray)
}
searchButton.addEventListener("click", userIngredients)

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
catFilterBttn.addEventListener('click', categoryFilter)
countryFilterBttn.addEventListener('click', countryFilter)