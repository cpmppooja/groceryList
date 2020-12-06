var loginKey, shoppingList, userSaved, editIndex;
const STRING_SEPARATOR = "#ieuruyj7dfjUY&*",
    ARRAY_SEPARATOR = "#kkerjherh&*";
showScreen(0);

/**
 * Welcome logged in user
 *@arg{string} name: name
 *@arg{string} password: password
 *
 *
 */



function welcomeUser(name, password) {
    document.getElementById('welcome').innerHTML = `Welcome ${name}`;
    loginKey = name + password;
    // hide loginElement
    showScreen(1);
    getList();
}
/**
 *Show one screen at a time
 *@arg{number} page: 0-Login Screen 1-Shopping Screen 2-Edit Item
 *
 * **/
function showScreen(page) {
    document.getElementById('loginDiv').style.display = page == 0 ? 'block' : 'none';
    document.getElementById('shoppingListDiv').style.display = page == 1 ? 'block' : 'none';
    document.getElementById('olderList').style.display = page == 1 ? 'block' : 'none';
    document.getElementById('edtItem').style.display = page == 2 ? 'block' : 'none';

}

/**
 *
 *
 * Show error for login
 *
 * *
 */


function loginErr(err) {
    document.getElementById('loginErr').innerHTML = err;
}

/**
 *
 *
 * Show error for list
 *
 * *
 */


function groceryErr(err) {
    document.getElementById('shoppingErr').innerHTML = err;
}

/**
 *
 *
 * login
 *
 * *
 */


function login(isTesting = false) {
    let name = document.getElementById("name");
    let password = document.getElementById("password");
    if (isTesting) {
        name.value = "tup";
        password.value = "tu";
    }
    let savedPass = localStorage.getItem(name.value);
    // TODO password hashing

    // if user already registered
    if (!!savedPass) {
        // if password is checked
        if (password.value === savedPass) {
            welcomeUser(name.value, password.value);
        } else {
            loginErr("Password doesn't match");
        }

    } else {
        loginKey = undefined;
        if (confirm("User Doesn't exists\nRegister?")) {
            //registerUser();
            localStorage.setItem(name.value, password.value);
            welcome(name.value, password.value);
        } else {
            loginErr("User denied registration");
        }
    }
}
/**
 *
 *
 * Add new Item to list
 *
 * *
 */

function addItem() {
    let ul = document.getElementById("itemList");
    if (ul.children.length >= 5) {
        return groceryErr('List full. Cannot add more item');
    }
    let newItem = document.getElementById("shopping");
    shoppingList.push(newItem.value);
    pushItem(newItem.value);
    newItem.value = '';
}



/**
 *
 * Creating new list
 *
 *
 * *
 */
function createNewList() {
    saveList();
    shoppingList = [];
    pushList();
}




/**
 *
 * Gettt List from storage
 *
 *
 * *
 */


function getList() {
    let shoppingListString = localStorage.getItem(loginKey);
    if (!!shoppingListString) {
        userSaved = shoppingListString.split(ARRAY_SEPARATOR);
        shoppingList = userSaved[userSaved.length - 1].split(STRING_SEPARATOR);
        console.log('savedLists', userSaved, 'last list', shoppingList);
        pushList();
    } else {
        shoppingList = [];
        userSaved = [];
    }
}
/**
 * push new list
 *
 *
 *
 * *
 */
function pushList() {
    console.log("Shopping list",shoppingList);
    document.getElementById("itemList").innerHTML = "";
    shoppingList.forEach((item) => {
        pushItem(item);
    });
    if (userSaved.length > 1) {
        oldListPush(0);
        if (userSaved.length > 2)
            oldListPush(1);
    }

}
/**
 * push older list
 *
 *
 *
 * *
 */
function oldListPush(listNo) {
    document.getElementById("listOlder" + listNo).style.display = "block"
    let list = userSaved[userSaved.length - 2 - listNo].split(STRING_SEPARATOR);
    document.getElementById("oldItemList" + listNo).innerHTML = "";
    list.forEach((item) => {
        pushItem(item, "oldItemList" + listNo);
    });

}

/*
 *
 *
 *Remove item
 *
 *
 */

function delItem() {
    shoppingList.splice(editIndex, 1);
    console.log('Deleted at', editIndex, "shopping", shoppingList);
    editScreen(false);
}

/*
 *
 *
 * Edit item
 *
 *
 */
function editItem() {
    let itemName = document.getElementById("editItem").value;
    shoppingList[editIndex] = itemName;
    console.log('Edit at', editIndex, "shopping", shoppingList, "item", itemName);
    editIndex = undefined;
    editScreen(false);
}

/*
 * Calling for edit
 *@arg{bool} isEdit whether to show list or edit
 *@arg{string} id: index to edit
 *@arg{string} itemName: name of item
 *
 *
 */
function editScreen(isEdit, id, itemName ) {
    showScreen(isEdit ? 2 : 1);
    if (isEdit) {
        editIndex = Number(id);
        let name = document.getElementById("editItem");
        name.value = itemName;
    } else {
        pushList();
    }

}

/**
 * Pushing item  in list
 *@arg{string} itemName: name of item
 *@arg{string} id: name of ol id
 *
 *
 */
function pushItem(itemName, id = "itemList") {
    // if (shoppingList.indexOf(itemName) > -1) {
    //     return shoppingErr("Item already in list");
    // }
    let ul = document.getElementById(id);
    let li = document.createElement("li");
    var children = ul.children.length;
    if (id === "itemList") {
        li.setAttribute("class", "my-10 ");
        li.setAttribute("title", "Edit or remove");
        li.setAttribute("id", children);
        li.setAttribute("onclick", `editScreen(true, ${children},'${itemName}')`);
    }
    li.appendChild(document.createTextNode(itemName));
    ul.appendChild(li);
    groceryErr(5 - children - 1 + " item left");
}

/**
 * Selecting older list in super list
 *
 *
 */


function selectOlderList(id) {
    shoppingList = userSaved[userSaved.length - 2 - Number(id)].split(STRING_SEPARATOR);
    pushList();
}

/**
 * Save list in super list
 *
 *
 */


function saveList() {
    if (!userSaved) {
        userSaved = [];
    }
    userSaved.push(shoppingList.join(STRING_SEPARATOR));
    // console.log("Saved as ", userSaved);
    if (userSaved.length > 3) {
        userSaved.splice(0, userSaved.length - 3);
    }

}


/**
 * Save and exit
 *
 *
 */



function save() {
    saveList();
    localStorage.setItem(loginKey, userSaved.join(ARRAY_SEPARATOR));
    window.location.reload();

}

/**
 * testing
 *
 *
 */


function testing() {

    pushItem("Fruit");
    pushItem("Mango");
    pushItem("Mango");
}
// login(true);
// testing();