"use strict";
const button = document.querySelector(".add");
const form = document.querySelector("#adding-items");
const select = form.querySelector("select");
const quickButtons = Array.from(document.querySelectorAll(".quick-add button"));
let localStoredItems = localStorage.getItem("items");
let items = localStoredItems ? JSON.parse(localStoredItems) : [];
let index = 0;
let list = document.querySelector("#shopping-list") || null;
let removeListButton;
class ItemObject {
    constructor(name, category) {
        this.name = name;
        this.category = category;
        this.id = index;
        this.isChecked = false;
    }
}
function moveToEnd(e) {
    let index = items.findIndex(item => item.id === Number(this.dataset.id));
    items[index].isChecked = !items[index].isChecked;
    localStorage.setItem("items", JSON.stringify(items));
    if (items[index].isChecked) {
        this.classList.add("checked");
        e.target.setAttribute("checked", "true");
        if (removeListButton) {
            removeListButton.before(this);
        }
        else {
            list.append(this);
        }
    }
    else {
        this.classList.remove("checked");
        e.target.removeAttribute("checked");
        let checked = list.querySelector("input:checked");
        if (checked) {
            checked.closest("li").before(this);
        }
    }
}
function startList(items) {
    if (items.length > 0) {
        createList();
        if (list) {
            list.innerHTML = items.sort((itemA, itemB) => {
                let isCheckedA = itemA.isChecked ? 0 : 1;
                let isCheckedB = itemB.isChecked ? 0 : 1;
                return isCheckedB - isCheckedA;
            }).map((item) => {
                if (item.id >= index) {
                    index = item.id + 1;
                }
                return `<li data-id="${item.id}" class="${item.category} ${item.isChecked ? 'checked' : ''}">
                        <input type="checkbox" ${item.isChecked ? "checked" : ""}>${item.name}
                        <button class="trash">❌</button>
                    </li>`;
            }).join("");
            createRemoveButton();
            const listItems = list.querySelectorAll("li");
            listItems.forEach(item => item.addEventListener("change", moveToEnd));
            const trashButtons = list.querySelectorAll(".trash");
            trashButtons.forEach(button => button.addEventListener("click", removeListItem));
        }
    }
}
function createList() {
    if (!list) {
        let listHtml = document.createElement("ul");
        listHtml.setAttribute("id", "shopping-list");
        listHtml.setAttribute("class", "box");
        form.before(listHtml);
        list = document.querySelector("#shopping-list");
        createRemoveButton();
    }
}
function removeList() {
    localStorage.clear();
    list.remove();
    items = [];
    index = 0;
    list = null;
    removeListButton = null;
}
function createRemoveButton() {
    if (list) {
        removeListButton = document.createElement("button");
        removeListButton.classList.add("remove-list");
        removeListButton.classList.add("add");
        removeListButton.textContent = "Usuń listę";
        list.append(removeListButton);
        removeListButton.addEventListener("click", removeList);
    }
}
function createListItem(item) {
    items.push(item);
    index++;
    if (items.length === 1 && !list) {
        createList();
    }
    if (list) {
        const html = document.createElement("li");
        html.setAttribute("data-id", `${item.id}`);
        html.classList.add(`${item.category}`);
        html.innerHTML = `<input type="checkbox" ${item.isChecked ? "checked" : ""}>${item.name}
                        <button class="trash">❌</button>`;
        let checked = list.querySelector("input:checked");
        if (checked && checked.parentElement) {
            checked.parentElement.before(html);
        }
        else if (!removeListButton) {
            list.append(html);
        }
        else {
            removeListButton.before(html);
        }
        const listItem = list.querySelector(`li[data-id="${item.id}"]`);
        const trashButton = listItem.querySelector(".trash");
        listItem.addEventListener("change", moveToEnd);
        trashButton.addEventListener("click", removeListItem);
        localStorage.setItem("items", JSON.stringify(items));
    }
}
function removeListItem() {
    let parentItem = this.parentElement;
    let index = items.findIndex(item => item.id === Number(parentItem.dataset.id));
    parentItem.remove();
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    if (items.length === 0 && list) {
        removeList();
    }
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
    let name = this.textContent || "?";
    let category = this.value;
    const item = new ItemObject(name, category);
    createListItem(item);
}
form.addEventListener("submit", startItem);
quickButtons.forEach(button => button.addEventListener("click", startQuickItem));
startList(items);
form.addEventListener("submit", startItem);
quickButtons.forEach(button => button.addEventListener("click", startQuickItem));
startList(items);
