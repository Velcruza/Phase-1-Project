fetch("https://themealdb.com/api/json/v1/1/search.php?f=b")
    .then(function(response) {return response.json()})
    .then(function(json) {renderResult(json)})
//global variables ------------------------
const recipeMenu = document.getElementById("recipe-menu");
const displayImage = document.getElementById("display-image");
const displayName = document.getElementById("recipe-name");
const displayIngredients = document.getElementById("ingredients");
const displayInstructions = document.getElementById("instructions");
const likeButton = document.getElementById("like-bttn");
const displayLikes = document.getElementById("display-likes")
let featuredRecipe;
//funtions ------------------------
function renderResult (obj) {
    obj.meals.forEach(recipe => {
        let newResult = document.createElement("div");
        let recipeImage = document.createElement("img");
        let recipeTitle = document.createElement("h4");
        let resultLikes = document.createElement("p");
        
        recipe.likes = Math.floor(Math.random() * (100 - 1) + 1);x

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
function addLikes () {
    featuredRecipe.likes = parseInt(featuredRecipe.likes) + 1;
    displayLikes.textContent = featuredRecipe.likes;
    likeButton.style.backgroundColor = "red";
}

//event listeners ---------------------------
likeButton.addEventListener("click", () => addLikes())