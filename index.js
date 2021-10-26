fetch("https://themealdb.com/api/json/v1/1/search.php?f=a")
.then(function(response) {return response.json()})
.then(function(json) {renderResult(json)})

//global variables ------------------------
const recipeMenu = document.getElementById("recipe-menu");
const displayImage = document.getElementById("display-image");
const displayName = document.getElementById("recipe-name");
const displayIngredients = document.getElementById("ingredients");
const displayInstructions = document.getElementById("instructions");
// const selectIng = document.getElementById('food-i-have')
// const ingFilterBttn= document.getElementById('ingredient-filter')
const arrAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const likeButton = document.getElementById("like-bttn");
const displayLikes = document.getElementById("display-likes")
const catFilterBttn = document.getElementById('category-filter');
const selectCat = document.getElementById('food-category');
const countryFilterBttn = document.getElementById('country-filter');
const selectCountry = document.getElementById('food-country')

let featuredRecipe;

//functions ------------------------
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
        let resultLikes = document.createElement("p");

        resultLikes.className = "likes";
        recipeTitle.className = "recipe-title";
        recipeImage.className = "recipe-image";
        newResult.className = "result";

        recipe.likes = Math.floor(Math.random() * (100 - 1) + 1);

        recipeImage.title = recipe.strMeal;

        recipeImage.src = recipe.strMealThumb;
        recipeTitle.textContent = recipe.strMeal;

        newResult.append(recipeTitle, recipeImage, resultLikes);
        recipeMenu.append(newResult);

        recipeImage.addEventListener("click", () => renderDisplay(recipe))
}


// function ingredientFilter() {
//     const userInput = selectIng.value;
//     recipeMenu.replaceChildren();
//     for (const element of arrAlphabet){
//         fetch(`https://themealdb.com/api/json/v1/1/search.php?f=${element}`)
//         .then(response => response.json())
//         .then(responseObj =>{
//             let iterable = responseObj.meals
//             if (Array.isArray(iterable)){
//                 iterable.forEach((obj)=> { 
//                 //looping through ingredients here
//                 //tried interpolating the i in strIngredient${i} but kept getting errors
//                 //so manually have to changed it 1,2,3,4... etc
//                 // for(let i=0; i<21; i++) {
//                 //     console.log(obj[`strIngredient${i}`])
//                 // }
//                 for(const key in obj){
//                         if(userInput === obj[key]){
//                                 renderFilterResult(obj);
//                                 break;
//                     }
//                 }
//             })
//         }
//         })
//     }

// }


function categoryFilter(){
    const userInput = selectCat.value;
    recipeMenu.replaceChildren();
    for (const element of arrAlphabet){
        fetch(`https://themealdb.com/api/json/v1/1/search.php?f=${element}`)
        .then(response => response.json())
        .then(responseObj =>{
            let iterable = responseObj.meals
            if (Array.isArray(iterable)){
                iterable.forEach((obj)=> { 
                //looping through ingredients here
                //tried interpolating the i in strIngredient${i} but kept getting errors
                //so manually have to changed it 1,2,3,4... etc
                // for(let i=0; i<21; i++) {
                //     console.log(obj[`strIngredient${i}`])
                // }
                for(const key in obj){
                        if(userInput === obj[key]){
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
    const userInput = selectCountry.value;
    recipeMenu.replaceChildren();
    for (const element of arrAlphabet){
        fetch(`https://themealdb.com/api/json/v1/1/search.php?f=${element}`)
        .then(response => response.json())
        .then(responseObj =>{
            let iterable = responseObj.meals
            if (Array.isArray(iterable)){
                iterable.forEach((obj)=> { 
                //looping through ingredients here
                //tried interpolating the i in strIngredient${i} but kept getting errors
                //so manually have to changed it 1,2,3,4... etc
                // for(let i=0; i<21; i++) {
                //     console.log(obj[`strIngredient${i}`])
                // }
                for(const key in obj){
                        if(userInput === obj[key]){
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
// ingFilterBttn.addEventListener('click', ingredientFilter)
catFilterBttn.addEventListener('click', categoryFilter)
countryFilterBttn.addEventListener('click', countryFilter)

//test
