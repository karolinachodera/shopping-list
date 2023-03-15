const button = document.querySelector(".add");
let list; // const insted of let, becouse we konw that it will be list
console.log("list", list)
let removeListButton; // what is it?
console.log("removeListButton", removeListButton)
const form = document.querySelector("#adding-items");
const select = form.querySelector("select");
const quickButtons = document.querySelectorAll(".quick-add button");
let items = JSON.parse(localStorage.getItem("items")) || [];
let index = 0; 

function moveToEnd(e) { // what does this function do?
    let index = items.findIndex(item => item.id == this.dataset.id);
    console.log("this", this, "this.dataset.id", this.dataset.id, "index", index)
    let itemHtml = this;
    console.log("itemHtml",itemHtml)
    items[index].isChecked = !items[index].isChecked; // is this operation necessary? can we just put negation to the items?
    localStorage.setItem("items", JSON.stringify(items));

    if(items[index].isChecked) {
        this.classList.add("checked");
        console.log("this.classList", this.classList)
        e.target.setAttribute("checked", true);
        removeListButton.before(itemHtml);
    } else {
        this.classList.remove("checked");
        e.target.removeAttribute("checked");
        let checked = list.querySelector("input:checked");
        if(checked) {
            checked.closest("li").before(itemHtml);
        }
    }
}

function insertBeforeChecked(html) {
    let checked = list.querySelector("input:checked");
    if(checked) {
        checked.closest("li").before(html);
    }
}

function startList(items) {
    if(items.length > 0) {
        createList();
        list.innerHTML = items.sort((itemA, itemB) => {
            let isCheckedA = itemA.isChecked ? 0 : 1;
            let isCheckedB = itemB.isChecked ? 0 : 1;
            return isCheckedB - isCheckedA;

        }).map((item) => {
            if(item.id >= index) {
                index = item.id + 1;
            }
            return `<li data-id="${item.id}" class="${item.category} ${item.isChecked ? 'checked' : ''}">
                <input type="checkbox" ${item.isChecked ? "checked" : ""}>${item.name}
                <button class="trash">❌</button>
            </li>`
        }).join("");
        createRemoveButton();
        const listItems = list.querySelectorAll("li");
        listItems.forEach(item => item.addEventListener("change", moveToEnd));
        const trashButtons = list.querySelectorAll(".trash");
        trashButtons.forEach(button => button.addEventListener("click", removeListItem));
    } 
}

function createList() {
    let listHtml = document.createElement("ul");
    listHtml.setAttribute("id", "shopping-list");
    listHtml.setAttribute("class", "box");
    form.before(listHtml);
    list = document.querySelector("#shopping-list");
    list.append(createRemoveButton());
}

function removeList() {
    localStorage.clear();
    list.remove();
    items = [];
    index = 0;
    list = document.querySelector("#shopping-list");
    removeListButton = document.createElement("button");
}

// better to return the element from this function and call list.append in the caller
function createRemoveButton() {
    removeListButton = document.createElement("button");
    removeListButton.classList.add("remove-list");
    removeListButton.classList.add("add");
    removeListButton.textContent = "Usuń listę";
    list.append(removeListButton); 
    removeListButton.addEventListener("click", removeList);
    console.log(removeListButton);
}

function createListItem(item) {
    items.push(item);
    index++; // What is it for

    if(items.length === 1 && !list) {
        createList();
    }

    const html = document.createElement("li"); // what was the reason to call const as a "html"?
    console.log("html", html);
    html.setAttribute("data-id", `${item.id}`);
    html.classList.add(`${item.category}`);
    html.innerHTML = `<input type="checkbox" ${item.isChecked ? "checked" : ""}>${item.name}
                        <button class="trash">❌</button>`;
                        console.log(removeListButton);

    let checked = list.querySelector("input:checked");

        if(checked) {
            checked.parentElement.before(html);
        } else if(!removeListButton) {
            list.append(html);
        } else {
            removeListButton.before(html);
        }

    const listItem = list.querySelector(`li[data-id="${item.id}"]`);
    const trashButton = listItem.querySelector(".trash");
    listItem.addEventListener("change", moveToEnd);
    trashButton.addEventListener("click", removeListItem);
    localStorage.setItem("items", JSON.stringify(items));
}

function removeListItem() {
    let index = items.findIndex(item => item.id == this.parentNode.dataset.id);
    this.parentNode.remove();
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));

    if(items.length === 0) {
        removeList();
    }
}

function ItemObject(name, category) {
    this.name = name;
    this.category = category;
    this.id = index;
    this.isChecked = false;
}

function addListItem(item) {
    items.push(item);
    index++;
    createListItem(item);
}

function startItem(e) {
    e.preventDefault();
    let name = this.querySelector("input[type='text']").value;
    let category = select.options[select.selectedIndex].value;
    const item = new ItemObject(name, category);
    createListItem(item);
    this.reset();
}

function startQuickItem() {
    let name = this.textContent;
    let category = this.value;
    const item = new ItemObject(name, category);
    createListItem(item);
}

form.addEventListener("submit", startItem);
quickButtons.forEach(button => button.addEventListener("click", startQuickItem));
startList(items);
console.log("list", list)
