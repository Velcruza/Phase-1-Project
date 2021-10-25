fetch("https://themealdb.com/api/json/v1/1/search.php?f=a")
.then(function(response) {return response.json()})
.then(function(json) {renderResult(json)})

const recipeMenu = document.getElementById("recipe-menu");
// const displayDiv = document.getElementById("display");
const displayImage = document.getElementById("display-image");
const displayName = document.getElementById("recipe-name");
const displayIngredients = document.getElementById("ingredients");
const displayInstructions = document.getElementById("instructions");
const select = document.getElementById('food-i-have')
const filterBttn= document.getElementById('filter')
const arrAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let featuredRecipe;


function renderResult (obj) {
    obj.meals.forEach(recipe => {
        let newResult = document.createElement("div");
        let recipeImage = document.createElement("img");
        let recipeTitle = document.createElement("h4");
        let resultLikes = document.createElement("p");

        resultLikes.className = "likes";
        recipeTitle.className = "recipe-title";
        recipeImage.className = "recipe-image";
        newResult.className = "result";

        recipeImage.title = recipe.strMeal;

        resultLikes.textContent = "Likes: ";
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
        let resultLikes = document.createElement("p");

        resultLikes.className = "likes";
        recipeTitle.className = "recipe-title";
        recipeImage.className = "recipe-image";
        newResult.className = "result";

        recipeImage.title = recipe.strMeal;

        resultLikes.textContent = "Likes: ";
        recipeImage.src = recipe.strMealThumb;
        recipeTitle.textContent = recipe.strMeal;

        newResult.append(recipeTitle, recipeImage, resultLikes);
        recipeMenu.append(newResult);

        recipeImage.addEventListener("click", () => renderDisplay(recipe))
}


function ingredientFilter() {
    const userInput = select.value;
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
                                renderFilterResult(obj);
                    }
                }
            })
        }
        })
    }

}


filterBttn.addEventListener('click', ingredientFilter)


