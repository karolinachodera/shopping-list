const button: HTMLElement = document.querySelector(".add")!;
const form: HTMLElement = document.querySelector("#adding-items")!;
const select: HTMLElement = form.querySelector("select")!;
const quickButtons = document.querySelectorAll(".quick-add button");
let localStorageItems: string = localStorage.getItem("items")!;
let items: ItemObject[] = JSON.parse(localStorageItems) || [];
let index: number = 0; 
let list: HTMLElement | null;
let removeListButton: HTMLElement | null;

interface ItemObject {
    name: string;
    category: string;
    id: number;
    isChecked: boolean;
}

function ItemObject(name: string, category: string) {
    this.name = name;
    this.category = category;
    this.id = index;
    this.isChecked = false;
}

function moveToEnd(e: Event): void{
    let itemHtml: HTMLElement = this;
    let index: number = items.findIndex(item => item.id === itemHtml.dataset.id);
    items[index].isChecked = !items[index].isChecked;
    localStorage.setItem("items", JSON.stringify(items));

    if(items[index].isChecked) {
        itemHtml.classList.add("checked");
        (e.target as HTMLElement).setAttribute("checked", "true");
        removeListButton.before(itemHtml);
    } else {
        itemHtml.classList.remove("checked");
        (e.target as HTMLElement).removeAttribute("checked");
        let checked: HTMLElement | null = list.querySelector("input:checked");
        if(checked && checked.closest("li")) {
            checked.closest("li").before(itemHtml);
        }
    }
}

function startList(items: ItemObject[]) {
    if(items.length > 0) {
        createList();
        if(list) {
            list.innerHTML = items.sort((itemA, itemB): number => {
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
}

function createList(): void {
    let listHtml = document.createElement("ul");
    listHtml.setAttribute("id", "shopping-list");
    listHtml.setAttribute("class", "box");
    form.before(listHtml);
    list = document.querySelector("#shopping-list") as HTMLElement;
    createRemoveButton();
}

function removeList(): void {
    localStorage.clear();
    list.remove();
    items = [];
    index = 0;
    list = null;
    removeListButton = null;
}

function createRemoveButton(): void {
    if(list) {
        removeListButton = document.createElement("button");
        removeListButton.classList.add("remove-list");
        removeListButton.classList.add("add");
        removeListButton.textContent = "Usuń listę";
        list.append(removeListButton);
        removeListButton.addEventListener("click", removeList);
    }
}

function createListItem(item: ItemObject) {
    items.push(item);
    index++;

    if(items.length === 1 && !list) {
        createList();
    }
    if(list) {
        const html: HTMLElement = document.createElement("li");
        html.setAttribute("data-id", `${item.id}`);
        html.classList.add(`${item.category}`);
        html.innerHTML = `<input type="checkbox" ${item.isChecked ? "checked" : ""}>${item.name}
                        <button class="trash">❌</button>`;

        let checked: HTMLElement | null = list.querySelector("input:checked");

        if(checked && checked.parentElement) {
            checked.parentElement.before(html);
        } else if(!removeListButton) {
            list.append(html);
        } else {
            removeListButton.before(html);
        }

        const listItem: HTMLElement = list.querySelector(`li[data-id="${item.id}"]`)!;
        const trashButton: HTMLElement = listItem.querySelector(".trash")!;
        listItem.addEventListener("change", moveToEnd);
        trashButton.addEventListener("click", removeListItem);
        localStorage.setItem("items", JSON.stringify(items));
    }
}

function removeListItem(): void {
    let index: number = items.findIndex(item => item.id == this.parentNode.dataset.id);
    this.parentNode.remove();
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));

    if(items.length === 0 && list) {
        removeList();
    }
}

function startItem(e: Event): void {
    e.preventDefault();
    let name: string = this.querySelector("input[type='text']").value;
    let category: string = (select as HTMLSelectElement).options[(select as HTMLSelectElement).selectedIndex].value;
    const item: ItemObject = new ItemObject(name, category);
    createListItem(item);
    this.reset();
}

function startQuickItem(): void {
    let name: string = this.textContent;
    let category: string = this.value;
    const item: ItemObject = new ItemObject(name, category);
    createListItem(item);
}

form.addEventListener("submit", startItem);
quickButtons.forEach(button => button.addEventListener("click", startQuickItem));
startList(items);