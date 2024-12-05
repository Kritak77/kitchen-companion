const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')


// Default grocery list data
const defaultGroceryList = [
    { name: "Milk", quantity: 50, qPerUnit: 10, unit: "l", category: "Dairy" },
    { name: "Eggs", quantity: 1, qPerUnit: 1, unit: "count", category: "Dairy" },
    { name: "Bread", quantity: 2, qPerUnit: 1, unit: "count", category: "Bakery" },
    { name: "Apple", quantity: 5, qPerUnit: 1, unit: "count", category: "Fruits" },
    { name: "Chicken Breasts", quantity: 10, qPerUnit: 2, unit: "lb", category: "Meats" }
];

// Function to check and reload default data if localStorage is empty or modified
function loadDefaultGroceryList() {
    const storedList = JSON.parse(localStorage.getItem("groceryList"));

    // Compare with default list or reload if no list is found
    if (!storedList || storedList.length !== defaultGroceryList.length || 
        !storedList.every((item, index) => item.name === defaultGroceryList[index].name)) {
        localStorage.setItem("groceryList", JSON.stringify(defaultGroceryList));
        groceryList = [...defaultGroceryList]; // Load the default data into groceryList
    } else {
        groceryList = storedList; // Load data from localStorage
    }
}

// Load default list on page load
loadDefaultGroceryList();
displayGroceryList();


var recipeList = [
    {
        "id": "1",
        "name": "Curry Chicken & Rice",
        "ingredients": ["Chicken Breasts", "Oil", "Curry powder", "Salt", "Basmati rice ", "Chicken broth", "Water", "Sugar", "Coconut milk", "Red bell pepper", "Onion", "Fresh cilantro or basil for garnish (optional)"],
        "instructions": "So, go ahead and get out the pot in which you want to cook this curry chicken and rice dish. I use a large 2-inch-deep skillet with a lid. But you can use a Dutch oven or any other large pot with a lid. \n \n In that pot, add the oil and heat over a medium-high heat. Add the chicken, bell peppers, and onions to the oil and sauté for 1 minute. \n \n Sprinkle the chicken with 1 tablespoon of curry powder and some salt. Keep stirring and cooking for about another minute or until the chicken is golden brown on the outside. Though it will not be cooked all the way through, you’ll be cooking it again in a couple steps so don’t worry. Take the chicken out of the pan and put into a dish and cover to keep warm. \n \n Next, using the same pan, add the rice, broth, water, salt, sugar, and the rest of the curry powder. Stir it all together again, and bring it to a boil. Reduce to a simmer after it starts to boil. Let the mixture boil and the rice cook for about 15 minutes with the lid on. \n \n Take the lid off for a moment while you add the chicken back into the pan on top of the rice, arranged in a single layer. Cook for another 10 minutes with the lid back on. And, last but not least, take the lid off again and stir in the coconut milk. That’s it! Garnish this diced chicken and rice recipe with fresh basil or cilantro and serve!\n \nContent from https:\/\/www.lecremedelacrumb.com\/one-pot-curry-chicken-and-rice\/ ",
        "categories": ["Pescatarian"]
    },

    {
        "id": "2",
        "name": "Quinoa",
        "ingredients":  ["Chicken Breasts", "Oil", "Curry powder", "Salt", "Basmati rice ", "Chicken broth", "Water", "Sugar", "Coconut milk", "Red bell pepper", "Onion", "Fresh cilantro or basil for garnish (optional)"],
        "instructions": "Combine the quinoa and water in a medium pot. Bring to a boil, cover, and reduce the heat. Simmer for 15 minutes. \n \n Remove the pot from the heat and let it sit, covered, for 10 minutes more. \n \n Then, remove the lid and fluff with a fork! \n \nContent from https:\/\/www.loveandlemons.com\/quinoa\/",
        "categories": ["Vegan"]
    },

    {
        "id": "3",
        "name": "Split pea soup",
        "ingredients": ["Olive oil", "Yellow onion", "Celery", "Carrots", "Garlic", "Chicken Broth", "Water", "Dried Split Peas", "Bay Leaves", "Thyme", "Parsley", "Salt and Pepper", "Ham Bone"],
        "instructions": "Heat olive oil in a large pot over medium-high heat. Add onion and celery and saute 3 minutes. Add garlic and saute 1 minute longer.\n \nPour in chicken broth and water. Add split peas, bay leaves and thyme. Season lightly with salt and with pepper to taste.\n \nNestle ham bone into soup mixture. Bring mixture to a boil, reduce to low. Cover and let simmer, stirring occasionally until peas and ham are tender, about 1 hour.\n \nRemove ham from soup, let rest 10 minutes then shred or dice meat portion into pieces, cover.\n \nMeanwhile add carrots to soup. Cover soup and continue to simmer, stirring occasionally, until peas have mostly broken down, about 30 minutes longer.\n \nStir ham into soup, season with more salt as needed. Serve warm garnished with parsley if desired.\n \nContent from https:\/\/www.cookingclassy.com\/split-pea-soup\/",
        "categories": ["Peanut-Free"]
        
    }
];

let users = [{name: "Me", preferences:["Vegan"]} ,{name: "Family", preferences:["Vegan","Peanut-Free"]}]


updateHomeRecipes();

let currentProductId = null; // To keep track of the currently viewed product


tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)

        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })

        tabs.forEach(tab => {
            tab.classList.remove('active')
        })
        tab.classList.add('active')
        target.classList.add('active')
    })
});

var myNodelist = document.querySelectorAll("ul.grocerylist li");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul.grocerylist');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("entry").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("entry").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}

let warningText = document.querySelector('.warning');

function showWarning() {
    warningText.classList.add('active')
}

function removeWarning() {
    let closemark = document.querySelector('.warning span');
    closemark.addEventListener('click', () => {
        warningText.classList.remove('active');
    })
}


// Utility function to generate unique IDs
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Function to navigate between tabs
function showTab(tabId) {
    const tabs = document.querySelectorAll('[data-tab-content]');
    tabs.forEach(tab => {
        if (tab.id === tabId) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });
}

function goToAddRecipe() {
    showTab('AddRecipe');
}

//User filtering functions
let userStatus = "inactive";

document.getElementById('user1').addEventListener("click", () => {
    let userdiv = document.getElementById("user1");
    let otheruserdiv = document.getElementById("user2");
    
    let category = "Vegan";
    selected = [];
    recipeList.forEach(recipe => {
        if(~recipe.categories.indexOf(category)){
            selected.push(recipe);
        }
    });
    
    if(userStatus === "inactive"){
        userdiv.style.backgroundColor = "var(--primary-color2)";
        userStatus = "active";
        displayRecipeList(selected);
    } else{
        userdiv.style.backgroundColor = "var(--primary-color1)";
        otheruserdiv.style.backgroundColor = "var(--primary-color1)";
        userStatus = "inactive";
        displayRecipeList();
    }
    
});

document.getElementById('user2').addEventListener("click", () => {
    let userdiv = document.getElementById("user2");
    let otheruserdiv = document.getElementById("user1");
    
    
    let category = "Peanut-Free";
    selected = [];
    recipeList.forEach(recipe => {
        if(~recipe.categories.indexOf(category)){
            selected.push(recipe);
        }
    });
    
    if(userStatus === "inactive"){
        userdiv.style.backgroundColor = "var(--primary-color2)";
        userStatus = "active";
        displayRecipeList(selected);
    } else{
        userdiv.style.backgroundColor = "var(--primary-color1)";
        otheruserdiv.style.backgroundColor = "var(--primary-color1)";
        userStatus = "inactive";
        displayRecipeList();
    }
});





//Filtering Function
document.getElementById("recipeFilterSubmit").addEventListener("click", () => {
    let sortType = document.querySelector(".recipe-filter-alphabet input[name='AO']:checked");
    let category = document.querySelector(".recipe-filter-category input[name='radio']:checked");

    let selected = [];
    if(category != null){
        recipeList.forEach(recipe => {
            if(~recipe.categories.indexOf(category.value)){
                selected.push(recipe)
            }
        });
    } else {
        selected = recipeList
    }
    
    let consumeContent = document.querySelector('.recipeBannerConsume-content');
    if (openStatus === "closed"){
        consumeContent.style.display = 'flex';
        openStatus = "open";
    }else {
        consumeContent.style.display = 'none';
        openStatus = 'closed';
    }

    displayRecipeList(selected);
});

document.getElementById("recipeFilterReset").addEventListener("click", () => {

    let consumeContent = document.querySelector('.recipeBannerConsume-content');
    if (openStatus === "closed"){
        consumeContent.style.display = 'flex';
        openStatus = "open";
    }else {
        consumeContent.style.display = 'none';
        openStatus = 'closed';
    }

    displayRecipeList();
});


function updateHomeRecipes(){

    let list = document.querySelector('.home-recipe-list');
    for(let i = 0; i < 3; i++){
        const li = document.createElement('li');
        li.addEventListener("click", () => {viewRecipeInfo(recipeList[i].id)});
        li.setAttribute('data-id', recipeList[i].id);
        li.innerHTML = `<img src="icons/compose.png"/> 
            <h3>${recipeList[i].name}</h3> `;
        list.appendChild(li);
    }
}

//Recipe Adding functionality

function createRecipe() {
    let categoryFn = () => {
        let list = [];
        let categoryArr = document.querySelectorAll('.recipe-item-CategoryItems input[name="checkbox"]');
        for (let elem of categoryArr){
            if (elem.checked){
                list.push();
            }
        }
        return list
    };
    

    const name = document.getElementById('recipeName').value.trim();
    let category = (categoryFn() === undefined) ? "N/A" : categoryFn();
    let addedIngredients = []
    let quantities = []
    let units = []
    document.querySelectorAll('.recipe-ingredients-entry input[name="text"]').forEach(obj => {
        addedIngredients.push(obj.value.trim());
    });
    document.querySelectorAll('.recipe-ingredients-entry input[name="number"]').forEach(obj => {
        quantities.push(obj.value.trim());
    });
    document.querySelectorAll('.recipe-ingredients-entry select[name="recipeAddUnit"]').forEach(obj => {
        units.push(obj.value.trim());
    });

    let ingredients = []
    for(let i = 0; i < addedIngredients.length; i++){
        ingredients.push(addedIngredients[i]);
    }

    const instructions = document.getElementById('recipeInstructions').value.trim();

    const id = generateUniqueId();
    const recipe = { id, name, ingredients, instructions, category};
    recipeList.push(recipe);

    // Reset the fields
    document.getElementById('recipeName').value = '';
    document.getElementById('recipeInstructions').value = '';
    document.getElementsByClassName('recipe-ingredients-entry')[0].innerHTML = `
                                    <li>
                                        <div>
                                            <input type="text" name="text" id="recipeIngredient">
                                        </div>
                                    </li>`;

    // Return to the recipe list screen
    displayRecipeList();
}


function addRecipeEntryBox(){
    let ingredientEntryList = document.getElementsByClassName("recipe-ingredients-entry")[0];

    const li = document.createElement('li');
    li.innerHTML = `<div>
                        <input type="text" name="text" id="recipeIngredient">
                    </div>
                    `;
    ingredientEntryList.appendChild(li);

}
let openStatus = 'closed';
function displayRecipeList(filteredList = null) {
    showTab('Recipes')
    const list = document.getElementById('recipeList');

    list.innerHTML = `<li onclick="goToAddRecipe()">
                            <img src="icons/add.png"/>
                            <h3>New</h3>
                        </li>`;

    const itemsToDisplay = filteredList || recipeList;
    itemsToDisplay.forEach(recipe => {
        const li = document.createElement('li');
        li.addEventListener("click", () => {viewRecipeInfo(recipe.id)});
        li.setAttribute('data-id', recipe.id);
        li.innerHTML = `<img src="icons/compose.png"/> 
            <h3>${recipe.name}</h3> `;
        list.appendChild(li);
    });
    if (openStatus === "open") {
        openStatus = "closed";
        document.querySelector('.recipeBannerConsume-content').style.display = 'none';
    }
}

function viewRecipeInfo(id) {
    const target = document.querySelector('#Recipes')
    const tab = document.querySelector('[data-tab-target="#Recipes"]')

    tabContents.forEach(tabContent => {
        tabContent.classList.remove('active')
    })

    tabs.forEach(tab => {
        tab.classList.remove('active')
    })
    target.classList.add('active')
    tab.classList.add('active')



    const recipe = recipeList.find(p => p.id === id);
    let ingredientList = document.getElementById("infoRecipeIngredients")
    ingredientList.innerHTML = '';
    if (!recipe) {
        alert("Recipe not found!");
        return;
    }

    currentProductId = id;

    // Set the product info in the info screen
    document.getElementById('infoRecipeName').textContent = recipe.name;
    document.getElementById("infoRecipeInstructions").textContent = recipe.instructions;
    var text = "";
    recipe.categories.forEach((item,value) => {
        if (value == recipe.categories.length - 1){
            text += item;
        } else {
            text += item + ", ";
        }
        
        
    })

    document.getElementById("infoRecipeCategories").textContent = text;
    recipe.ingredients.forEach(item => {
        let li = document.createElement('h3');
        li.innerText = `-> ${item}`;
        ingredientList.appendChild(li);
    })

    // Show the product info screen and hide others
    showTab('RecipeInfo');
}

document.getElementById('recipeDelete').addEventListener("click", () => {
        
    recipeList.forEach((recipeToRemove, index) => {
        if (recipeToRemove.id === currentProductId) {
            recipeList.splice(index, 1);
        }
    });
    displayRecipeList();
});

document.getElementById('recipeBatch').addEventListener("click", () => {
    let product = null;
    let fridgeList = JSON.parse(localStorage.getItem("fridgeList")) || [];
    
    let consumeContent = document.querySelector('.recipeBannerConsume-content');
    if (openStatus === "closed"){
        consumeContent.style.display = 'flex';
        openStatus = "open";
    }else {
        consumeContent.style.display = 'none';
        openStatus = 'closed';
    }
    recipeList.forEach((recipe, index) => {
        if (recipe.id === currentProductId) {
            product = recipe;
        }
    });
    let consumeFound = document.querySelector('.recipeConsumeFound');
    let insideFound = ``;
    product.ingredients.forEach(elem => {
        let found = fridgeList.find(elem2 => {
            return (elem.toLowerCase() === elem2.itemName.toLowerCase());
        });
        if (found){
            insideFound += `
            <label for="found-${elem}"><h3>${elem}</h3></label>
            <input id="found-${elem}" type="number" min="0" max="${found.quantity}">
            <h3>Unit: (${found.unit})</h3>
            <br>`;
        }
        
    })
    consumeFound.innerHTML = insideFound;
});

document.getElementById('recipeUse').addEventListener("click", (event) => {
    event.preventDefault();
    let removeAmounts = document.querySelectorAll('.recipeBannerConsume-content input[type="number"]');
    let fridgeList = JSON.parse(localStorage.getItem("fridgeList")) || [];
    let consumeContent = document.querySelector('.recipeBannerConsume-content');

    let ingredientsFound = [];
    let product = null
    recipeList.forEach((recipe, index) => {
        if (recipe.id === currentProductId) {
            product = recipe;
        }
    });

    product.ingredients.forEach(elem => {
        let found = fridgeList.find(elem2 => {
            return (elem.toLowerCase() === elem2.itemName.toLowerCase());
        });
        if (found){
            ingredientsFound.push(found);
        }
    })
    let listToRemove = []
    for(let i = 0; i<ingredientsFound.length; i++){
        listToRemove.push([ingredientsFound[i], Number(removeAmounts[i].value)])
    }
    updateFridgeList(listToRemove);
    consumeContent.style.display = 'none';
    openStatus = 'closed';
})

document.getElementById('recipeCancel').addEventListener("click", () =>{
    let consumeContent = document.querySelector('.recipeBannerConsume-content');
    if (openStatus === "closed"){
        consumeContent.style.display = 'flex';
        openStatus = "open";
    }else {
        consumeContent.style.display = 'none';
        openStatus = 'closed';
    }
})

function deleteRecipe() {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (confirmed) {
    // Remove the product from the grocery list
    recipeList = recipeList.filter(p => p.id !== currentProductId);

    // Refresh the grocery list display
    displayRecipeList();

    // Reset the currentProductId
    currentProductId = null;
    
    // Return to the grocery list screen
    showTab('Recipes');
    }
}



function goToAddGrocery() {
    document.querySelector('.grocery-content').style.display = 'none';
    document.querySelector('.grocery-buttons').style.display = 'none';
    document.querySelector('#AddGrocery').style.display = 'block';
    document.querySelector('.grocery-banner-button').style.visibility = "visible";
    document.querySelector('.grocery-banner-header').innerHTML = "<h1>Add New</h1>";
    document.querySelector('#extra').style.display = 'none';
    let addButton3 = document.querySelector('#back');
    addButton3.setAttribute("onclick", "backToGrocery()");
}

function backToGrocery() {
    document.querySelector('.grocery-content').style.display = 'block';
    document.querySelector('.grocery-buttons').style.display = 'block';
    document.querySelector('#AddGrocery').style.display = 'none';
    document.querySelector('.grocery-banner-button').style.visibility = "hidden";
    document.querySelector('.grocery-banner-header').innerHTML = "<h1>Grocery List</h1>";
    document.querySelector('#extra').style.display = 'flex';
    document.querySelector('#groceryfilterCheckBox').checked = false;
}

function backToGroceryFromEdit() {
    // Reset the form
    resetProductForm();

    // Revert to original state
    document.getElementById('productsName').dataset.originalName = ""; 
    document.querySelector('#AddGrocery h2').innerText = "Add Product"; 
    let addButton = document.querySelector('#AddGrocery button[onclick="saveProduct()"]');
    addButton.innerText = "Add to Grocery List"; 
    addButton.setAttribute("onclick", "createProduct()");
    let addButton2 = document.querySelector('#AddGrocery button[onclick="backToGroceryFromEdit()"]'); 
    addButton2.setAttribute("onclick", "backToGrocery()")
    let addButton3 = document.querySelector('#Groceries button#back'); 
    addButton3.setAttribute("onclick", "backToGrocery()")

    // Show the grocery content and hide the add/edit UI
    document.querySelector('.grocery-content').style.display = 'block';
    document.querySelector('.grocery-buttons').style.display = 'block';
    document.querySelector('#AddGrocery').style.display = 'none';
    document.querySelector('.grocery-banner-button').style.visibility = "hidden";
    document.querySelector('.grocery-banner-header').innerHTML = "<h1>Grocery List</h1>";
    document.querySelector('#extra').style.display = 'flex';
    document.querySelector('#groceryfilterCheckBox').checked = false;

    displayGroceryList();
}

document.querySelectorAll('.groceryCategoryItems input[type="radio"]').forEach(radio => {
    radio.addEventListener('click', function() {
        this.wasChecked = !this.wasChecked;
        this.checked = this.wasChecked;
    });
});

function createProduct() {
    let name = document.getElementById('productsName').value.trim();
    let quantity = parseInt(document.getElementById('groceryAddQuantity').value) || 0;
    let qPerUnit = parseInt(document.getElementById('groceryqPerUnit').value) || 1;
    let unit = document.getElementById('groceryAddUnit').value;
    let category = [...document.querySelectorAll('.groceryCategoryItems input[name="radio"]')]
                    .find(radio => radio.checked)?.value || "N/A";

    if (!name || quantity === 0) {
        alert("Please enter a product name and valid quantity");
        return;
    }

    let existingItem = groceryList.find(item => item.name.toLowerCase() === name.toLowerCase());

    if (existingItem) {
        alert("Same product already exists. Quantity will be updated.");
        existingItem.quantity = quantity;
        existingItem.qPerUnit = qPerUnit;
        existingItem.unit = unit;
        existingItem.category = category;
    } else {
        let newItem = {
            name: name,
            quantity: quantity,
            qPerUnit: qPerUnit,
            unit: unit,
            category: category
        };
        groceryList.push(newItem);
    }

    localStorage.setItem("groceryList", JSON.stringify(groceryList));
    resetProductForm();
    displayGroceryList();
}

// Function to reset the form fields after adding a product
function resetProductForm() {
    const productsNameInput = document.getElementById('productsName');
    productsNameInput.value = '';
    document.getElementById('groceryAddQuantity').value = '';
    document.getElementById('groceryqPerUnit').value = '1';
    document.getElementById('groceryAddUnit').selectedIndex = 1;
    document.querySelectorAll('.groceryCategoryItems input[name="radio"]').forEach(radio => radio.checked = false);

    // Clear the original name data attribute after reset
    productsNameInput.removeAttribute('data-original-name');
}

// Function to display the grocery list items
function displayGroceryList(filteredList = null) {
    groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
    const list = document.getElementById('groceryList');
    list.innerHTML = '';
    const itemsToDisplay = filteredList || groceryList;

    itemsToDisplay.forEach(product => {
        const li = document.createElement('li');
        li.classList.add('grocery-item');
        li.setAttribute('data-id', product.name); // Set a unique identifier

        // Attach the toggleSelectItem function to the li element itself
        li.addEventListener('click', () => {
            li.classList.toggle('checked'); 
        });
        li.innerHTML = `
            <span class="item-name"> 
                <div id="name"><h3>${product.name} - ${product.category}</h3></div>
                <div id="quantity-container"> 
                    <span class="quantity-label"><h3>Quantity:</h3></span>
                    <button class="quantity-btn" onclick="decreaseQuantity('${product.name}')">-</button>
                    <span class="quantity-value">${product.quantity} (${product.unit})</span>
                    <button class="quantity-btn" id="second" onclick="increaseQuantity('${product.name}')">+</button>
                    <button class="info-btn" id="edit" onclick="goToEditGrocery('${product.name}')">Edit</button>
                </div>
            </span>
        `;

        list.appendChild(li);
    });
    backToGrocery();
}


function updateItemDisplay(name) {
    const item = groceryList.find(product => product.name === name);
    const itemElement = document.querySelector(`[data-id="${name}"]`);

    if (item && itemElement) {
        // Update quantity display inside the item container
        const quantityValue = itemElement.querySelector(".quantity-value");
        quantityValue.textContent = `${item.quantity} (${item.unit})`;
    } else {
        // If item is not found (e.g., if quantity is 0), remove it from the DOM
        if (itemElement) {
            itemElement.remove();
        }
    }
}

function increaseQuantity(name) {
    const item = groceryList.find(product => product.name === name);
    if (item) {
        item.quantity += item.qPerUnit || 1;
        localStorage.setItem("groceryList", JSON.stringify(groceryList));
        updateItemDisplay(name);
    }
}

function decreaseQuantity(name) {
    const item = groceryList.find(product => product.name === name);
    if (item) {
        if (item.quantity <= item.qPerUnit) {
            const confirmation = confirm("Going to 0 will remove this item. Do you want to proceed?");
            if (confirmation) {
                groceryList = groceryList.filter(product => product.name !== name);
                localStorage.setItem("groceryList", JSON.stringify(groceryList));
                updateItemDisplay(name);
            }
        } else {
            item.quantity = Math.max(0, item.quantity - (item.qPerUnit || 1));
            localStorage.setItem("groceryList", JSON.stringify(groceryList));
            updateItemDisplay(name);
        }
    }
}


function toggleSelectItem(itemElement) {
    itemElement.classList.toggle('checked');
}

function removeSelectedProducts() {
    const selectedItems = document.querySelectorAll('.grocery-item.checked');

    if (selectedItems.length === 0) {
        alert("No items selected for removal!");
        return;
    }

    if (confirm("Are you sure you want to remove the selected items?")) {
        selectedItems.forEach(item => {
            const name = item.getAttribute('data-id'); 
            groceryList = groceryList.filter(product => product.name !== name); 
        });
        localStorage.setItem("groceryList", JSON.stringify(groceryList));
        displayGroceryList();
    }
}


function goToEditGrocery(name) {
    const product = groceryList.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (!product) {
        alert("Product not found!");
        return;
    }

    document.getElementById('productsName').value = product.name;
    document.getElementById('groceryAddQuantity').value = product.quantity;
    document.getElementById('groceryqPerUnit').value = product.qPerUnit || 1; 
    document.getElementById('groceryAddUnit').value = product.unit || ""; 
    [...document.querySelectorAll('.groceryCategoryItems input[name="radio"]')].forEach(radio => {
        radio.checked = (radio.value === product.category);
    });
    
    document.getElementById('productsName').dataset.originalName = product.name;

    document.querySelector('#AddGrocery h2').innerText = "Edit Product"; 
    document.querySelector('#AddGrocery button[onclick="createProduct()"]').innerText = "Save Grocery List";
    document.querySelector('#AddGrocery button[onclick="createProduct()"]').setAttribute("onclick", "saveProduct()"); 
    document.querySelector('#AddGrocery button[onclick="backToGrocery()"]').setAttribute("onclick", "backToGroceryFromEdit()");
    document.querySelector('#Groceries button#back').setAttribute("onclick", "backToGroceryFromEdit()"); 

    document.querySelector('.grocery-content').style.display = 'none';
    document.querySelector('.grocery-buttons').style.display = 'none';
    document.querySelector('#AddGrocery').style.display = 'block';
    document.querySelector('.grocery-banner-button').style.visibility = "visible";
    document.querySelector('.grocery-banner-header').innerHTML = "<h1>Edit</h1>";
    document.querySelector('#extra').style.display = 'none';
}

function saveProduct() {
    let newName = document.getElementById('productsName').value.trim();
    let newQuantity = parseInt(document.getElementById('groceryAddQuantity').value) || 0;
    let newQPerUnit = parseInt(document.getElementById('groceryqPerUnit').value) || 1;
    let newUnit = document.getElementById('groceryAddUnit').value;
    let newCategory = [...document.querySelectorAll('.groceryCategoryItems input[name="radio"]')]
                    .find(radio => radio.checked)?.value || "N/A";

    if (!newName || newQuantity === 0) {
        alert("Please enter a product name and valid quantity");
        return;
    }

    groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];

    let originalName = document.querySelector('#productsName').dataset.originalName;

    if (originalName) {
        groceryList = groceryList.filter(item => item.name.toLowerCase() !== originalName.toLowerCase());
    }

    let newItem = {
        name: newName,
        quantity: newQuantity,
        qPerUnit: newQPerUnit,
        unit: newUnit,
        category: newCategory
    };
    
    groceryList.push(newItem);

    localStorage.setItem("groceryList", JSON.stringify(groceryList));

    resetProductForm();
    document.getElementById('productsName').dataset.originalName = ""; 
    document.querySelector('#AddGrocery h2').innerText = "Add Product"; 
    let addButton = document.querySelector('#AddGrocery button[onclick="saveProduct()"]');
    addButton.innerText = "Add to Grocery List"; 
    addButton.setAttribute("onclick", "createProduct()"); 
    let addButton2 = document.querySelector('#AddGrocery button[onclick="backToGroceryFromEdit()"]');
    addButton2.setAttribute("onclick", "backToGrocery()");
    displayGroceryList();
}
// Function to search products based on input
function searchProduct() {
    const searchInput = document.getElementById('productSearch').value.toLowerCase();
    const groceryItems = document.querySelectorAll('.grocery-item'); // Adjust this selector based on your grocery item class

    groceryItems.forEach(item => {
        const itemName = item.querySelector('.item-name').innerText.toLowerCase(); // Adjust based on your item structure
        if (itemName.includes(searchInput)) {
            item.style.display = 'block'; // Show item if it matches
        } else {
            item.style.display = 'none'; // Hide item if it doesn't match
        }
    });

    // Show/hide the "X" button based on input value
    const searchX = document.getElementById('search-x');
    searchX.style.display = searchInput ? 'block' : 'none'; // Show "X" if there's input
}

function addGroceryListToHome() {
    let groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
    let groceryItemList = document.querySelector('.home-grocery-item-list');
    let groceryContainer = document.querySelector('.home-grocery');

    // Clear existing items in the grocery list display
    while (groceryItemList.firstChild) {
        groceryItemList.removeChild(groceryItemList.firstChild);
    }

    // Function to display two random items from the grocery list
    function displayRandomItems() {
        if (groceryList.length > 0) {
            let randomItems = groceryList.sort(() => 0.5 - Math.random()).slice(0, 2);
            randomItems.forEach(item => {
                const groceryItem = document.createElement('div');
                groceryItem.className = 'home-grocery-item';
                groceryItem.innerHTML = `
                    <h2>${item.name}</h2> 
                    <h3>Quantity: ${item.quantity} ${item.unit}</h3>
                    <h3>Category: ${item.category}</h3>
                `;
                groceryItemList.appendChild(groceryItem);
            });
        } else {
            let emptyMessage = document.createElement('div');
            emptyMessage.className = 'home-grocery-item';
            emptyMessage.innerHTML = '<h1>Your Grocery List is Empty!</h1>';
            groceryItemList.appendChild(emptyMessage);
        }
    }

    // Function to display the grocery list image on the right side
    function displayGroceryImage() {
        const groceryImageContainer = document.querySelector('.home-grocery-content');
        groceryImageContainer.style.backgroundImage = 'url(./images/grocerylist.jpeg)';
        groceryImageContainer.style.backgroundPosition = 'right';
        groceryImageContainer.style.backgroundSize = 'contain';
        groceryImageContainer.style.backgroundRepeat = 'no-repeat';
    }

    // Add click event to the grocery container to switch tabs
    groceryContainer.addEventListener('click', () => {
        const groceryTab = document.querySelector('[data-tab-target="#Groceries"]');
        if (groceryTab) {
            groceryTab.click(); // Simulate a click on the tab to switch
        }
    });

    // Execute display functions
    displayRandomItems();
    displayGroceryImage();
}

// Call the function to initialize the grocery list on the home screen
addGroceryListToHome();




// Function to clear the search input
function clearSearch() {
    document.getElementById('productSearch').value = ''; // Clear the input
    searchProduct(); // Call searchProduct to reset the displayed items
}

// Attach the clearSearch function to the "X" button click event
document.getElementById('search-x').addEventListener('click', clearSearch);



// Function to apply sorting and filtering to the grocery list
document.getElementById('groceryFilterForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.querySelector('#groceryfilterCheckBox').checked = false;

    const groceryItems = Array.from(document.querySelectorAll('.grocery-item'));
    const sortByAlphabet = document.querySelector('#groceryFilterForm input[name="AO"]:checked');
    const sortByCategory = document.querySelector('#groceryFilterForm input[name="radio"]:checked');

    if (sortByAlphabet) {
        if (sortByAlphabet.id === 'groceryAO1') {
            groceryItems.sort((a, b) => {
                const nameA = a.querySelector('.item-name h3').textContent.split(' - ')[0].toLowerCase();
                const nameB = b.querySelector('.item-name h3').textContent.split(' - ')[0].toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } else if (sortByAlphabet.id === 'groceryAO2') {
            groceryItems.sort((a, b) => {
                const nameA = a.querySelector('.item-name h3').textContent.split(' - ')[0].toLowerCase();
                const nameB = b.querySelector('.item-name h3').textContent.split(' - ')[0].toLowerCase();
                return nameB.localeCompare(nameA);
            });
        }
    }

    if (sortByCategory) {
        const categoryFilter = sortByCategory.value.toLowerCase();
        groceryItems.forEach(item => {
            const itemCategory = item.querySelector('.item-name h3').textContent.split(' - ')[1].toLowerCase();
            item.style.display = itemCategory.includes(categoryFilter) ? 'grid' : 'none';
        });
    } else {
        groceryItems.forEach(item => {
            item.style.display = 'grid';
        });
    }

    const groceryList = document.querySelector('.grocerylist');
    groceryList.innerHTML = '';
    groceryItems.forEach(item => groceryList.appendChild(item));

});

document.querySelector('.groceryFilterFormSubmit button[type="reset"]').addEventListener('click', function() {
    document.querySelector('#groceryfilterCheckBox').checked = false;

    const groceryListContainer = document.getElementById('groceryList');
    groceryListContainer.innerHTML = '';

    loadDefaultGroceryList();  
    
    displayGroceryList(); 

    let searchbar = document.getElementById('productSearch');
    if (searchbar.value !== '') {
        searchbar.value = '';
    }
    document.querySelectorAll('#groceryFilterForm input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const grocerySortCheckbox = document.getElementById("grocery-sort");
    const groceryFilterDiv = document.querySelector(".grocery-filter");

    // Function to toggle grocery filter display based on checkbox state
    function toggleGroceryFilter() {
        if (grocerySortCheckbox.checked) {
            groceryFilterDiv.style.display = "block"; // Show if sorting is enabled
        } else {
            groceryFilterDiv.style.display = "none"; // Hide if sorting is disabled
        }
    }

    // Add event listener to the checkbox
    grocerySortCheckbox.addEventListener("change", toggleGroceryFilter);

    // Initialize the state on page load
    toggleGroceryFilter();
});
