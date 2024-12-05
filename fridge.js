/* Fridge Functions */

/* PREPOPULATED ITEMS FOR LIST */
let preList = [
    {
        "itemName": "Apple",
        "category": "Fruits",
        "quantity": 10,
        "qPerUnit": 1,
        "unit": "count",
        "expDate": "2024-11-08"
    },
    {
        "itemName": "Milk",
        "category": "Dairy",
        "quantity": 2000,
        "qPerUnit": 200,
        "unit": "ml",
        "expDate": "2024-11-04"
    },
    {
        "itemName": "Cheese Cake",
        "category": "Bakery",
        "quantity": 270,
        "qPerUnit": 30,
        "unit": "g",
        "expDate": "2024-11-15"
    },
    {
        "itemName": "Beef Tenderloin",
        "category": "Meats",
        "quantity": 200,
        "qPerUnit": 20,
        "unit": "g",
        "expDate": "2024-11-13"
    },
    {
        "itemName": "Carrots",
        "category": "Vegetables",
        "quantity": 6,
        "qPerUnit": 1,
        "unit": "count",
        "expDate": "2024-11-20"
    }
];

localStorage.setItem("fridgeList", JSON.stringify(preList));
loadIngredientList();


/* BackArrow function */
let fridgeCurrent = 'start';
document.querySelector('.fridge-banner-button .backArrow').addEventListener('click', () => {
    if (fridgeCurrent === 'add'){
        resetFridgeScreen()
    }else if (fridgeCurrent === 'info'){
        document.querySelector('.fridge-item-screen').style.display = "none";
        document.querySelector('.fridge-content').style.display = "block";
        document.querySelector('.fridge-banner-button').style.visibility = "hidden";
        document.querySelector('.fridge-banner-header').innerHTML = "<h1>Fridge</h1>"
        document.querySelector('.searchbar-container').style.display = 'flex';
        document.querySelector('.banner-filter').style.display = 'block';
        document.querySelector('.fridge-item-edit').style.display = 'none';
        const editButton = document.querySelector('.fridge-item-edit button');
        if (editButton.classList.contains('active')) {
            toggleEditMode();
        }
    }
})


document.querySelector('#addButton2').addEventListener('click', () => {
    fridgeAddScreen();
})

document.querySelector('.fridgeAddbutton #fridgeAdd1').addEventListener('click', () => {
    fridgeAddScreen();
})



function fridgeAddScreen() {
    document.querySelector('.fridge-content').style.display = 'none';
    document.querySelector('.fridge-add-screen').style.display = 'block';
    document.querySelector('.fridge-banner-button').style.visibility = "visible";
    document.querySelector('.fridge-banner-header').innerHTML = "<h1>Add New</h1>"
    document.querySelector('.extra-content').style.display = 'none';
    fridgeCurrent = 'add';
}


document.querySelectorAll('.fridgeCategoryItems input[type="radio"]').forEach(radio => {
    radio.addEventListener('click', function() {
        if (this.checked) {
            this.wasChecked = !this.wasChecked;
            this.checked = this.wasChecked;
        } else {
            this.wasChecked = true;
        }
    });
});

document.querySelectorAll('.fridge-item-CategoryItems input[type="radio"]').forEach(radio => {
    radio.addEventListener('click', function() {
        if (this.checked) {
            this.wasChecked = !this.wasChecked;
            this.checked = this.wasChecked;
        } else {
            this.wasChecked = true;
        }
    });
});


function resetFridgeScreen() {
    document.querySelector('.fridge-content').style.display = 'block';
    document.querySelector('.fridge-add-screen').style.display = 'none';
    document.querySelector('.fridge-item-screen').style.display = 'none';
    document.querySelector('.fridge-banner-button').style.visibility = "hidden";
    document.querySelector('.fridge-banner-header').innerHTML = "<h1>Fridge</h1>"
    document.querySelector('.extra-content').style.display = 'flex';
    document.querySelector('#filterCheckBox').checked = false;
}

/* Fridge Add Cancel */
document.getElementById('fridgeAddForm').addEventListener('reset', () => {
    resetFridgeScreen();
})

/* Fridge Adding Item */
document.querySelector('#fridgeAddForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let itemName = document.getElementById('productName').value;
    let categoryArr = document.querySelectorAll('.fridgeCategoryItems input[name="radio"]'); // When there are multiple elements with same name use All to get an iterable object
    let categoryFn = () => {
        for (let elem of categoryArr){
            if (elem.checked){
                return elem.value;
            }
        }
    };
    let category = (categoryFn() === undefined) ? "N/A" : categoryFn();
    let quantity = Number(document.getElementById('fridgeAddQuantity').value);
    let unitArr = document.getElementById('fridgeAddUnit');
    let qPU = Number(document.querySelector('#qPerUnit').value);
    let unit = unitArr[unitArr.selectedIndex].value;
    let expDate = document.getElementById('fridgeAddExp').value || "N/A"

    let fridgeItem = {
        "itemName": itemName,
        "category": category,
        "quantity": quantity,
        "qPerUnit": qPU,
        "unit": unit,
        "expDate": expDate
    };
    let list = JSON.parse(localStorage.getItem("fridgeList")) || [];
    let existingItem = list.find(item => item.itemName === itemName);

    if (existingItem) {
        // Update existing item
        alert("Same product already exists and is updated");
        existingItem.category = category;
        existingItem.quantity += quantity;
        existingItem.qPerUnit = qPU;
        existingItem.unit = unit;
        existingItem.expDate = expDate;

        const fridgeItems = document.querySelectorAll('.fridge-item'); 
        fridgeItems.forEach(item => {
            item.remove();
        });
        localStorage.setItem("fridgeList", JSON.stringify(list));
        document.getElementById('fridgeAddForm').reset();
        resetFridgeScreen();
        fridgeListWithItem();
        loadIngredientList();
    } else {
        // Add new item
        list.push(fridgeItem);
        createFridgeItem(fridgeItem);
        localStorage.setItem("fridgeList", JSON.stringify(list));
        document.getElementById('fridgeAddForm').reset();
        let fridgeList = document.querySelector('.fridge-list');
        while (fridgeList.firstChild) {
            fridgeList.removeChild(fridgeList.firstChild);
        }
        loadIngredientList();
        resetFridgeScreen();
        fridgeListWithItem();
        document.querySelector('#fridgeFilterForm').reset();
    }

    addItemsToExpiry();
});


function fridgeListWithItem() {
    document.querySelector('.content-list-starter').style.display = 'none';
    document.querySelector('.fridge-list').style.display = 'flex';
    document.querySelector('#frirdgeSearch').removeAttribute('disabled');
    document.querySelector('#fridgeSearchBtn').removeAttribute('disabled');
    document.querySelector('#filterCheckBox').removeAttribute('disabled');
    document.querySelector('#fridgeSearchBtn').style.pointerEvents = 'auto';
    document.querySelector('.filter-area').style.visibility = 'visible';
}

function createFridgeItem(fridgeItemJson) {
    const listItem = document.createElement('div');
    listItem.className = 'fridge-item';

    const itemImage = document.createElement('div');
    itemImage.className = 'fridge-item-image';

    const itemName = document.createElement('div');
    itemName.className = 'fridge-item-name';
    itemName.innerHTML = `<h2>${fridgeItemJson.itemName}</h2>`;

    const itemInfo = document.createElement('div');
    itemInfo.className = 'fridge-item-info';
    let chosenDate;
    if (fridgeItemJson.expDate !== "N/A"){
        chosenDate = new Date(fridgeItemJson.expDate);
        setInterval(updateDayDifference, 86400000); // Update every 24 hours
        updateDayDifference();
    }else {
        itemInfo.innerHTML = `
            <h3 class="fridge-item-exp">Exp: &nbsp;<span>${fridgeItemJson.expDate}</span> days</h3>
            <br><h3 class="fridge-item-category">Category</h3>
            <h3><span>(${fridgeItemJson.category})</span></h3>
        `;
    }

    function calculateDayDifference(chosenDate) {
        const today = new Date();
        const timeDifference = chosenDate - today;
        return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    }

    function updateDayDifference() {
        const dayDifference = calculateDayDifference(chosenDate);
        itemInfo.innerHTML = `
            <h3 class="fridge-item-exp">Exp: &nbsp;<span>${dayDifference}</span> days</h3>
            <br><h3 class="fridge-item-category">Category</h3>
            <h3><span>(${fridgeItemJson.category})</span></h3>
        `;
    }

    

    const itemEtc = document.createElement('div');
    itemEtc.className = 'fridge-item-etc';
    itemEtc.innerHTML = `
        <h3>Quantity</h3>
        <div class="fridge-item-q-wrapper">
            <button class="fridge-item-q-up">&#129095;</button>
            <div class="fridge-item-unit-wrapper">
                <span class="fridge-item-q">${fridgeItemJson.quantity}</span>
                <span class="fridge-item-unit">(${fridgeItemJson.unit})</span>
            </div>
            <button class="fridge-item-q-down">&#129093;</button>
        </div>
        <label for="cbx" class="cbx">
            <div class="checkmark">
                <input type="checkbox" id="cbx">
                <div class="flip">
                    <div class="front"></div>
                    <div class="back">
                        <svg viewBox="0 0 16 14" height="14" width="16">
                            <path d="M2 8.5L6 12.5L14 1.5"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </label>
    `;

    itemEtc.querySelector('.fridge-item-q-down').addEventListener('click', () => {
        let temp = Number(fridgeItemJson.quantity) + Number(fridgeItemJson.qPerUnit);
        temp = temp;
        fridgeItemJson.quantity = String(temp);
        itemEtc.querySelector('.fridge-item-q').textContent = fridgeItemJson.quantity;
        updateLocalStorage(fridgeItemJson, false);
    });

    itemEtc.querySelector('.fridge-item-q-up').addEventListener('click', () => {
        if (fridgeItemJson.quantity > 0) {
            let temp = fridgeItemJson.quantity - fridgeItemJson.qPerUnit;
            let confirm;
            if (temp <= 0){
                fridgeItemJson.quantity = 0;
            }else {
                fridgeItemJson.quantity = temp;
            }
            if (temp <= 0){
                confirm = window.confirm("Congratz! You used up the item. \nDo you want to remove it?")
            }
            itemEtc.querySelector('.fridge-item-q').textContent = fridgeItemJson.quantity;
            if (confirm){
                updateLocalStorage(fridgeItemJson, true);
                document.querySelector('.fridge-list').removeChild(listItem);
                removedToScreen();
            } else {
                updateLocalStorage(fridgeItemJson, false);
            }
        }else {
            let confirm = window.confirm("Congratz! You used up the item. \nDo you want to remove it?")
            if (confirm){
                updateLocalStorage(fridgeItemJson, true);
                document.querySelector('.fridge-list').removeChild(listItem);
                removedToScreen();
            }
        }
    });

    function updateLocalStorage(updatedItem, remove) {
        let list = JSON.parse(localStorage.getItem("fridgeList")) || [];
        const index = list.findIndex(item => item.productName === updatedItem.productName);
        if (index !== -1) {
            if (remove) {
                list.splice(index, 1);
            }else {
                list[index] = updatedItem;
            }
        } else {
            list.push(updatedItem);
        }
        localStorage.setItem("fridgeList", JSON.stringify(list));
    }

    listItem.addEventListener('click', (event) => {
        const checkbox = event.target.closest('.cbx');
        const quantityButton = event.target.closest('.fridge-item-q-wrapper button');
        if (checkbox) {
            const checkbox2 = itemEtc.querySelector('#cbx');
            checkbox2.checked = !checkbox2.checked;
        } else if (!quantityButton) {
            /* TO ITEM INFO SCREEN */
            fridgeCurrent = 'info';
            toItemScreen();
            /* load original data */
            document.getElementById('product-Item-Name').value = fridgeItemJson.itemName;
            document.getElementById('fridge-item-Exp').value = fridgeItemJson.expDate || "N/A";
            document.getElementById('fridge-item-Quantity').value = fridgeItemJson.quantity;
            document.getElementById('fridge-item-qPerUnit').value = fridgeItemJson.qPerUnit;
            const radioButtons = document.querySelectorAll('.fridge-item-CategoryItems input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.checked = false;
            });
            radioButtons.forEach(radio => {
                if (radio.value === fridgeItemJson.category) {
                    radio.checked = true;
                }
            });
            let checkbox2 = document.querySelector('#fridge-item-CategoryCheckBox');
            if (checkbox2.checked) {
                checkbox2.checked = false;
            }
            
            if (document.querySelector('.fridge-item-edit button').classList.contains('active')) {
                document.querySelector('.fridge-item-edit button').classList.toggle('active');
            }
            let editMode = true;
            const editButton = document.querySelector('.fridge-item-edit button');
            editButton.removeEventListener('click', toggleEditMode); // Remove any existing event listener
            editButton.addEventListener('click', toggleEditMode);
            
            function findRecipesWithIngredient(ingredient) { 
                return recipeList.filter(recipe => recipe.ingredients.some(ing => ing.toLowerCase().includes(ingredient.toLowerCase())) );
            }
            let checkbox3 = document.querySelector('#fridge-item-RecipeCheckBox');
            if (checkbox3.checked) {
                checkbox3.checked = false;
            }
            let recipeListFound = findRecipesWithIngredient(fridgeItemJson.itemName);
            let fridgeRecipe = document.querySelector('.fridge-item-RecipeItems');
            let string = ``;
            recipeListFound.forEach(elem => string += `<h2 class="fridge-item-recipe-info" recipe-id="${elem.id}">->${elem.name}</h2>`);
            fridgeRecipe.innerHTML = string;
            document.querySelectorAll('.fridge-item-recipe-info').forEach(item => { 
                item.addEventListener('click', () => { 
                    handleTabs('Recipes');
                    let recipeId = item.getAttribute('recipe-id');
                    viewRecipeInfo(recipeId); 
                }); 
            });
        }
    });
    

    function toItemScreen() {
        document.querySelector('.fridge-item-screen').style.display = "block";
        document.querySelector('.fridge-content').style.display = "none";
        document.querySelector('.fridge-banner-button').style.visibility = "visible";
        document.querySelector('.fridge-banner-header').innerHTML = "<h1>Item Info</h1>"
        document.querySelector('.searchbar-container').style.display = 'none';
        document.querySelector('.banner-filter').style.display = 'none';
        document.querySelector('.fridge-item-edit').style.display = 'flex';
    }

    listItem.appendChild(itemImage);
    listItem.appendChild(itemName);
    listItem.appendChild(itemInfo);
    listItem.appendChild(itemEtc);

    document.querySelector('.fridge-list').appendChild(listItem);
}
function toggleEditMode() {
    const editButton = document.querySelector('.fridge-item-edit button');
    editButton.classList.toggle('active');
    let editMode =document.querySelector('.fridge-item-edit button').classList.contains('active');

    if (editMode) {
        document.getElementById('product-Item-Name').removeAttribute('disabled');
        document.getElementById('fridge-item-Exp').removeAttribute('disabled');
        document.getElementById('fridge-item-Quantity').removeAttribute('disabled');
        document.getElementById('fridge-item-qPerUnit').removeAttribute('disabled');
        document.getElementById('fridge-item-Unit').removeAttribute('disabled');
        editMode = false;
    } else {
        document.getElementById('product-Item-Name').setAttribute('disabled', 'true');
        document.getElementById('fridge-item-Exp').setAttribute('disabled', 'true');
        document.getElementById('fridge-item-Quantity').setAttribute('disabled', 'true');
        document.getElementById('fridge-item-qPerUnit').setAttribute('disabled', 'true');
        document.getElementById('fridge-item-Unit').setAttribute('disabled', 'true');
        editMode = true;
    }
}

            /* update to new data */
document.querySelector('#fridgeItemForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let list = JSON.parse(localStorage.getItem("fridgeList")) || [];
    const index = list.findIndex(item => item.itemName === document.getElementById('product-Item-Name').value);
    list.splice(index, 1);
    let categoryArr = document.querySelectorAll('.fridge-item-CategoryItems input[name="radio"]'); 
    let categoryFn = () => {
        for (let elem of categoryArr){
            if (elem.checked){
                return elem.value;
            }
        }
    };
    let category = (categoryFn() === undefined) ? "N/A" : categoryFn();
    let unitArr = document.getElementById('fridge-item-Unit');
    let unit = unitArr[unitArr.selectedIndex].value;
    let expDate = document.getElementById('fridge-item-Exp').value || "N/A"

    list.splice(0, 0, {
        "itemName": document.getElementById('product-Item-Name').value,
        "category": category,
        "quantity": Number(document.getElementById('fridge-item-Quantity').value),
        "qPerUnit": Number(document.getElementById('fridge-item-qPerUnit').value),
        "unit": unit,
        "expDate": expDate
    })
    localStorage.setItem("fridgeList", JSON.stringify(list));
    
    resetFridgeScreen();
    fridgeListWithItem();
    document.querySelector('.searchbar-container').style.display = 'flex';
    document.querySelector('.banner-filter').style.display = 'block';
    document.querySelector('.fridge-item-edit').style.display = 'none';
    const fridgeList = document.querySelector('.fridge-list');
    while (fridgeList.firstChild) {
        fridgeList.removeChild(fridgeList.firstChild);
    }
    loadIngredientList();
    document.getElementById('product-Item-Name').setAttribute('disabled', 'true');
    document.getElementById('fridge-item-Exp').setAttribute('disabled', 'true');
    document.getElementById('fridge-item-Quantity').setAttribute('disabled', 'true');
    document.getElementById('fridge-item-qPerUnit').setAttribute('disabled', 'true');
    document.getElementById('fridge-item-Unit').setAttribute('disabled', 'true');

    document.querySelector('.fridge-item-edit button').classList.toggle('active');
    
    document.getElementById('product-Item-Name').setAttribute('disabled', 'true');
    document.getElementById('fridge-item-Exp').setAttribute('disabled', 'true');
    document.getElementById('fridge-item-Quantity').setAttribute('disabled', 'true');
    document.getElementById('fridge-item-qPerUnit').setAttribute('disabled', 'true');
    document.getElementById('fridge-item-Unit').setAttribute('disabled', 'true');
    const editButton = document.querySelector('.fridge-item-edit button');
    editButton.removeEventListener('click', toggleEditMode); // Remove any existing event listener
    editButton.addEventListener('click', toggleEditMode);
    document.querySelector('#fridgeFilterForm').reset();
    addItemsToExpiry();
})

function resetList() {
    document.querySelector('.fridge-list').removec
}

const fridgeListStarter = document.querySelector('.content-list-starter');
function loadIngredientList() {
    let list = JSON.parse(localStorage.getItem("fridgeList"));
    if (list !== null && list !== ""){
        if (list.length === 0) {
            fridgeListStarter.style.display = "flex";
        }else {
            let fridgeList = document.querySelector('.fridge-list');
            while (fridgeList.firstChild) {
                fridgeList.removeChild(fridgeList.firstChild);
            }
            list.forEach(elem => {
                createFridgeItem(elem);
            })
            fridgeListWithItem();
        }
    }
}

/* Remove button function */
const fridgeRemoveBtn = document.querySelector('#fridgeRemove');
fridgeRemoveBtn.addEventListener('click', () => {
    const checkedItems = document.querySelectorAll('.fridge-item input[type="checkbox"]:checked');
    if (checkedItems.length){
        let confirmV = confirm("Do you really want to remove item(s)?")
        if (confirmV){
            checkedItems.forEach(item => {
                const fridgeItem = item.closest('.fridge-item');
                const itemName = fridgeItem.querySelector('.fridge-item-name h2').textContent;

                fridgeItem.remove();

                let fridgeList = JSON.parse(localStorage.getItem('fridgeList')) || [];
                fridgeList = fridgeList.filter(fridgeItem => fridgeItem.itemName !== itemName);
                localStorage.setItem('fridgeList', JSON.stringify(fridgeList));
            });
            removedToScreen();
        }   
    }
    addItemsToExpiry();    
});

/* After removing, if length is 0 */
function removedToScreen() {
    if (document.querySelectorAll('.fridge-item').length === 0) {
        document.querySelector('.content-list-starter').style.display = 'flex';
        document.querySelector('.fridge-list').style.display = 'none';
        document.querySelector('#frirdgeSearch').setAttribute('disabled', 'true');
        document.querySelector('#fridgeSearchBtn').setAttribute('disabled', 'true');
        document.querySelector('#filterCheckBox').setAttribute('disabled', 'true');
        document.querySelector('#fridgeSearchBtn').style.pointerEvents = 'none';
        document.querySelector('.filter-area').style.visibility = 'hidden';
    }
}

/* Filter Functions */
const filterItems = () => {
    const searchValue = document.getElementById('frirdgeSearch').value.toLowerCase();
    const fridgeItems = document.querySelectorAll('.fridge-item');
    fridgeItems.forEach(item => {
        const itemName = item.querySelector('.fridge-item-name h2').textContent.toLowerCase();
        if (itemName.includes(searchValue)) {
            item.style.display = 'grid';
        } else {
            item.style.display = 'none';
        }
    });
};

const resetSearch = () => {
    document.getElementById('frirdgeSearch').value = '';
    const fridgeItems = document.querySelectorAll('.fridge-item');
    fridgeItems.forEach(item => {
        item.style.display = 'grid';
    });
};

document.querySelector('.search__btn').addEventListener('click', filterItems);
document.querySelector('.search-x').addEventListener('click', resetSearch);

document.getElementById('fridgeFilterForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let fridgeItems = Array.from(document.querySelectorAll('.fridge-item'));
    let sortByAlphabet = document.querySelector('#fridgeFilterForm input[name="AO"]:checked');
    let sortByCategory = document.querySelector('#fridgeFilterForm input[name="radio"]:checked');
    let sortByExpiry = document.querySelector('#fridgeFilterForm input[name="AO"]:checked');

    if (sortByAlphabet) {
        if (sortByAlphabet.id === 'fridgeAO1') {
            fridgeItems.sort((a, b) => {
                const nameA = a.querySelector('.fridge-item-name h2').textContent.toLowerCase();
                const nameB = b.querySelector('.fridge-item-name h2').textContent.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } else if (sortByAlphabet.id === 'fridgeAO2') {
            fridgeItems.sort((a, b) => {
                const nameA = a.querySelector('.fridge-item-name h2').textContent.toLowerCase();
                const nameB = b.querySelector('.fridge-item-name h2').textContent.toLowerCase();
                return nameB.localeCompare(nameA);
            });
        }
    }

    if (sortByCategory) {
        const category = sortByCategory.value;
        fridgeItems.forEach(item => { 
            const itemCategory = item.querySelector('.fridge-item-info h3:nth-of-type(3) span').textContent.toLowerCase(); 
            if (itemCategory.includes(`(${category.toLowerCase()})`)) {
                item.style.display = 'grid'; 
            } else { 
                item.style.display = 'none'; 
            }
        })
    }

    if (sortByExpiry) {
        if (sortByExpiry.id === 'fridgeAO11') { 
            fridgeItems.sort((a, b) => { 
                const expA = a.querySelector('.fridge-item-exp span').textContent; 
                const expB = b.querySelector('.fridge-item-exp span').textContent; 
                if (expA === "N/A") return 1; 
                if (expB === "N/A") return -1; 
                return parseInt(expA) - parseInt(expB); 
            }); 
        } else if (sortByExpiry.id === 'fridgeAO22') { 
            fridgeItems.sort((a, b) => { 
                const expA = a.querySelector('.fridge-item-exp span').textContent; 
                const expB = b.querySelector('.fridge-item-exp span').textContent; 
                if (expA === "N/A") return 1; 
                if (expB === "N/A") return -1; 
                return parseInt(expB) - parseInt(expA); 
            });
        }
    }

    const fridgeList = document.querySelector('.fridge-list');
    fridgeList.innerHTML = '';
    fridgeItems.forEach(item => fridgeList.appendChild(item));
    document.querySelector('#filterCheckBox').checked = false;
});

document.querySelector('.fridgeFilterFormSubmit button[type="reset"]').addEventListener('click', function() {
    /* const fridgeItems = Array.from(document.querySelectorAll('.fridge-item'));
    fridgeList = document.querySelector('.fridge-list');
    fridgeList.innerHTML = '';
    fridgeItems.forEach(item => fridgeList.appendChild(item)); */
    let fridgeList = document.querySelector('.fridge-list');
    while (fridgeList.firstChild) {
        fridgeList.removeChild(fridgeList.firstChild);
    }
    loadIngredientList();    
    document.querySelector('#filterCheckBox').checked = false;
    let searchbar = document.getElementById('frirdgeSearch');
    if (searchbar.value !== '') {
        searchbar.value = '';
    }
});


function addItemsToExpiry() {
    let fridgeList = JSON.parse(localStorage.getItem("fridgeList")) || [];
    let expiryItemList = document.querySelector('.home-expiry-item-list');
    while (expiryItemList.firstChild) {
        expiryItemList.removeChild(expiryItemList.firstChild);
    }

    function calculateDaysLeft(expDate) {
        if (expDate !== "N/A") {
            const today = new Date();
            const expirationDate = new Date(expDate);
            const timeDifference = expirationDate - today;
            return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        }
    }

    function addItemToList(item) {
        const daysLeft = calculateDaysLeft(item.expDate);
        if (daysLeft <= 3) {
            const expiryItem = document.createElement('div');
            expiryItem.className = 'home-expiry-item';
            expiryItem.innerHTML = `
                <h2>${item.itemName}</h2> <h3>(<span class="home-expiry-item-span">${daysLeft}</span>) Days Left</h3>
            `;
            expiryItemList.appendChild(expiryItem);
        }
    }

    function populateList() {
        expiryItemList.innerHTML = '';
        fridgeList = JSON.parse(localStorage.getItem("fridgeList")) || [];
        const filteredItems = fridgeList.filter(item => calculateDaysLeft(item.expDate) <= 3); 
        
        if (filteredItems.length === 0) { 
            let safeMessage = document.createElement('div'); 
            safeMessage.className = 'home-expiry-item'; 
            safeMessage.innerHTML = '<h1>Your Fridge is Safe!</h1>'; 
            expiryItemList.appendChild(safeMessage); 
            document.querySelector('.home-expiry-image').style.backgroundImage = 'url(./images/freshFood.jpg)';
        } else {
            filteredItems.sort((a, b) => calculateDaysLeft(a.expDate) - calculateDaysLeft(b.expDate)); 
            filteredItems.slice(0, 3).forEach(item => { addItemToList(item); });
            document.querySelector('.home-expiry-image').style.backgroundImage = 'url(./images/expireSoon.webp)';
        }
    }

    populateList();

}

addItemsToExpiry();


/* HOME TAB TO FRIDGE TAB WITH SORTED BY EXPIRY */
document.querySelector('.home-expiry').addEventListener('click', () => {
    handleTabs('Fridge');
    let fridgeItems = Array.from(document.querySelectorAll('.fridge-item'));
    fridgeItems.sort((a, b) => { 
        const expA = a.querySelector('.fridge-item-exp span').textContent; 
        const expB = b.querySelector('.fridge-item-exp span').textContent; 
        if (expA === "N/A") return 1; 
        if (expB === "N/A") return -1; 
        return parseInt(expA) - parseInt(expB); 
    }); 
    const fridgeList = document.querySelector('.fridge-list');
    fridgeList.innerHTML = '';
    fridgeItems.forEach(item => fridgeList.appendChild(item));
});

/* USE THIS FOR TAB NAVIGATION */
function handleTabs(defaultTab = null) {
    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    // Clear previous active state
    tabContents.forEach(tabContent => {
        tabContent.classList.remove('active');
        tabContent.style.display = 'none';
    });
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Set up the click event listeners for the tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.tabTarget);
            tab.classList.add('active');
            target.classList.add('active');
            target.style.display = 'block';
        });
    });

    // If a default tab is provided, simulate a click on it
    if (defaultTab) {
        const targetTab = document.querySelector(`[data-tab-target="#${defaultTab}"]`);
        if (targetTab) {
            targetTab.click();
        }
    }
}

const inputs = document.querySelectorAll('input[type="text"]');
const inputs2 = document.querySelectorAll(`textarea[type="text"]`);
const inputs3 = document.querySelectorAll('input[type="number"]');

const keyboard = document.getElementById('keyboard'); 
const keyboard2 = document.getElementById('keyboard-numeric'); 

inputs.forEach(input => { 
    input.addEventListener('focus', () => { 
        keyboard.style.display = 'block'; 
    }); 
    input.addEventListener('blur', () => { 
        keyboard.style.display = 'none'; 
    }); 
});
inputs2.forEach(input => { 
    input.addEventListener('focus', () => { 
        keyboard.style.display = 'block'; 
    }); 
    input.addEventListener('blur', () => { 
        keyboard.style.display = 'none'; 
    }); 
});
inputs3.forEach(input => { 
    input.addEventListener('focus', () => { 
        keyboard2.style.display = 'block'; 
    }); 
    input.addEventListener('blur', () => { 
        keyboard2.style.display = 'none'; 
    }); 
});

/* Function to Select and Move Grocery List Items to Fridge List */
function groceryToFridge() {
    const selectedItems = document.querySelectorAll('.grocery-item.checked'); // Select checked items

    if (selectedItems.length === 0) {
        alert("No items selected to move to the fridge!");
        return;
    }

    // Get fridge list from local storage or initialize it as an empty array
    let fridgeList = JSON.parse(localStorage.getItem("fridgeList")) || [];
    let groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];

    selectedItems.forEach(item => {
        const itemName = item.getAttribute('data-id'); // Retrieve name to identify item
        const groceryItem = groceryList.find(product => product.name === itemName);

        if (groceryItem) {
            // Check if the item already exists in the fridge list
            let existingItem = fridgeList.find(fridgeItem => fridgeItem.itemName === groceryItem.name);

            if (existingItem) {
                // Update quantity if item already exists in the fridge
                existingItem.quantity += groceryItem.quantity;
                existingItem.qPerUnit = groceryItem.qPerUnit;
                existingItem.expDate = "N/A"
            } else {
                // Add new item to the fridge list
                let fridgeItem = {
                    itemName: groceryItem.name,
                    category: groceryItem.category,
                    quantity: groceryItem.quantity,
                    qPerUnit: groceryItem.qPerUnit,
                    unit: groceryItem.unit,
                    expDate: "N/A"
                };
                fridgeList.unshift(fridgeItem);
            }

            // Remove the item from grocery list after moving it
            groceryList = groceryList.filter(product => product.name !== itemName);
        }
    });

    // Save the updated lists to local storage
    localStorage.setItem("fridgeList", JSON.stringify(fridgeList));
    localStorage.setItem("groceryList", JSON.stringify(groceryList));

    // Reload the grocery list display and the fridge list
    displayGroceryList();
    loadIngredientList();
}
/* Function to handle item selection on click */
document.querySelectorAll('.grocery-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('checked'); // Toggle 'checked' class on click
    });
});

let consumeFound = document.querySelector('.recipeConsumeFound');
consumeFound.addEventListener('focusin', (event) => { 
    if (event.target.matches('input[type="number"]')) { 
        keyboard2.style.display = 'block'; 
    } 
}); 
consumeFound.addEventListener('focusout', (event) => { 
    if (event.target.matches('input[type="number"]')) { 
        keyboard2.style.display = 'none'; 
    }
})

function updateFridgeList(deductions) {
    // Retrieve the fridgeList from localStorage
    let fridgeList = JSON.parse(localStorage.getItem("fridgeList")) || [];

    // Iterate through the given list and update the quantities in the fridgeList
    deductions.forEach(([item, quantityToDeduct]) => {
        let existingItem = fridgeList.find(fridgeItem => fridgeItem.itemName === item.itemName);
        if (existingItem) {
            // Deduct the quantity
            if (quantityToDeduct > existingItem.quantity) {
                alert(`You only have ${existingItem.quantity} (${existingItem.unit})`);
            }else {
                existingItem.quantity -= quantityToDeduct;
                alert("Batch Update Successful!")
            }
            // Ensure the quantity doesn't go below zero
            if (existingItem.quantity < 0) {
                existingItem.quantity = 0;
            }
        }
    });

    // Save the updated fridgeList back to localStorage
    localStorage.setItem("fridgeList", JSON.stringify(fridgeList));
    loadIngredientList();
}
const root = document.documentElement;
let currentMode = "normal";
document.querySelector('#redTheme').addEventListener('click', () => {
    root.style.setProperty('--linear-grad', 'linear-gradient(to right, #000000, #222222)'); 
    root.style.setProperty('--primary-color1', '#B71C1C'); 
    root.style.setProperty('--primary-color2', '#D32F2F'); 
    root.style.setProperty('--secondary-color1', '#FFCDD2'); 
    root.style.setProperty('--secondary-color2', '#FFEBEE'); 
    root.style.setProperty('--red', '#ff0000');
})

document.querySelector('#defaultTheme').addEventListener('click', () => {
    root.style.setProperty('--linear-grad', 'linear-gradient(to right, #333333, #555555)'); 
    root.style.setProperty('--primary-color1', '#333333'); 
    root.style.setProperty('--primary-color2', '#5e5e5e'); 
    root.style.setProperty('--secondary-color1', '#fff'); 
    root.style.setProperty('--secondary-color2', '#f9f9f9'); 
    root.style.setProperty('--red', '#f44336');
})

document.querySelector('#blueTheme').addEventListener('click', () => {
    root.style.setProperty('--linear-grad', 'linear-gradient(to right, #333333, #555555)'); 
    root.style.setProperty('--primary-color1', '#0D47A1'); 
    root.style.setProperty('--primary-color2', '#1976D2'); 
    root.style.setProperty('--secondary-color1', '#BBDEFB'); 
    root.style.setProperty('--secondary-color2', '#E3F2FD'); 
    root.style.setProperty('--red', '#f44336');
})
