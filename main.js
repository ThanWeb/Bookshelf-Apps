// INITIATION

window.addEventListener("load", function(){
    printListBook(1);
});

window.addEventListener("scroll", function(){
    setNavbar();
});

const localStorageKey = "BOOKS_DATA";
const bookInputForm = document.getElementById("inputBook");
const incompleteListBookDiv = document.getElementById("incompleteBookshelfList");
const completeListBookDiv = document.getElementById("completeBookshelfList");

bookInputForm.addEventListener("submit", function(){
    const inputTime = new Date().valueOf();
    const bookName = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookStatus = document.getElementById("inputBookIsComplete");
    let flag;
    if(bookStatus.checked)
        flag = true;
    else
        flag = false;
    const newBookData = {
        id : inputTime,
        name: bookName,
        author: bookAuthor,
        year: bookYear,
        isComplete: flag
    }
    insertBook(newBookData);
});

function initiationButtons(){
    const editButtons = document.querySelectorAll(".edit");
    const deleteButtons = document.querySelectorAll(".delete");
    const allId = document.querySelectorAll(".id");
    for(let i = 0; i < editButtons.length; i++){
        editButtons[i].addEventListener("click", function(){
            editBook(allId[i].innerHTML);
        });
        deleteButtons[i].addEventListener("click", function(){
            deleteBook(allId[i].innerHTML);
        });
    }
}

// CHECK STORAGE

function checkForStorage() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    else
        return true;
}

// INSERT

function insertBook(bookData){
    if(checkForStorage()){
        let newData = [];
        if(localStorage.getItem(localStorageKey) === null)
            newData = [];
        else{
            let oldData = localStorage.getItem(localStorageKey);
            oldData = JSON.parse(oldData);
            for(let i = 0; i < oldData.length; i++)
                newData.push(oldData[i])
        }
        newData.push(bookData);
        localStorage.setItem(localStorageKey, JSON.stringify(newData));
    }
}

// PRINT

function printListBook(x){
    const searchBookText = document.getElementById("searchBookText").value.toLowerCase();
    const eachBook = document.querySelectorAll(".each-book");
    for(let i = 0; i < eachBook.length; i++)
        eachBook[i].remove();
    let printedDiv, printedButtonDiv, printedBookDiv, allBooks, name, temp;
    let row = [];
    let printedRow = [];
    let printedButton = [];
    let textButton = ["Edit", "Delete"];
    let flag = [0, 0];
    if(checkForStorage()){
        if(localStorage.getItem(localStorageKey) !== null){
            allBooks = getBooks();
            for(let i = 0; i < allBooks.length; i++){
                name = allBooks[i].name;
                if(x == 2){
                    if(!(name.toLowerCase().indexOf(searchBookText) > -1))
                        continue;
                    else{
                        if(allBooks[i].isComplete == false){
                            temp = flag[0];
                            temp++;
                            flag[0] = temp;
                        }
                        else{
                            temp = flag[1];
                            temp++;
                            flag[1] = temp;
                        }
                    }
                }
                row[0] = `${allBooks[i].name}`;
                row[1] = `Ditulis Oleh ${allBooks[i].author}`;
                row[2] = `Terbit Pada Tahun ${allBooks[i].year}`;
                row[3] = allBooks[i].id;
                printedDiv = document.createElement("div");
                printedButtonDiv = document.createElement("div");
                for(let j = 0; j < row.length; j ++){
                    printedRow[j] = document.createElement("p");
                    printedRow[j].innerHTML = row[j];
                    if(j == row.length - 1)
                        printedRow[j].classList.add("hidden");
                    printedDiv.appendChild(printedRow[j]);
                    printedDiv.classList.add("identity");
                }
                for(j = 0; j < 2; j ++){
                    printedButton[j] = document.createElement("button");
                    printedButton[j].innerHTML = textButton[j];
                    printedButton[j].classList.add(textButton[j].toLowerCase())
                    printedButtonDiv.appendChild(printedButton[j]);
                    printedButtonDiv.classList.add("buttons");
                }
                printedBookDiv = document.createElement("div");
                printedBookDiv.appendChild(printedDiv);
                printedBookDiv.appendChild(printedButtonDiv);
                printedBookDiv.classList.add("each-book");
                if(allBooks[i].isComplete == true)
                    completeListBookDiv.appendChild(printedBookDiv);
                else if(allBooks[i].isComplete == false)
                    incompleteListBookDiv.appendChild(printedBookDiv)
                row = [];
                printedRow = [];
                printedButton = [];
            }
        }
    }
    initiationButtons();
    return flag;
}

// GET BOOKS

function getBooks(){
    let bookData = [];
    bookData = localStorage.getItem(localStorageKey);
    bookData = JSON.parse(bookData);
    return bookData;
}

// EDIT

function editBook(id){
    let data = getBooks();
    let index;
    const editForm = document.querySelector(".modal-form");
    const editTitle = document.getElementById("editBookTitle");
    const editAuthor = document.getElementById("editBookAuthor");
    const editYear = document.getElementById("editBookYear");
    const editComplete = document.getElementById("editBookIsComplete");
    for(let i = 0; i < data.length; i++){
        if(id == data[i].id)
            index = i;
    }
    editTitle.value = data[index].name;
    editAuthor.value = data[index].author;
    editYear.value = data[index].year;
    if(data[index].isComplete == true)
        editComplete.checked = true;
    else
        editComplete.checked = false;
    editForm.style.display = "flex";
    editForm.addEventListener("submit", function(){
        data[index].name = editTitle.value;
        data[index].author = editAuthor.value;
        data[index].year = editYear.value;
        if(editComplete.checked)
            data[index].isComplete = true;
        else
            data[index].isComplete = false;
        localStorage.setItem(localStorageKey, JSON.stringify(data));
    });
}

function exitForm(){
    const editForm = document.querySelector(".modal-form");
    editForm.style.display = "none";
}

// DELETE

function deleteBook(id){
    if(confirm("Lanjutkan Penghapusan")){
        let data = getBooks();
        for(let i = 0; i < data.length; i++){
            if(id == data[i].id)
                index = i;
        }
        data.splice(index, 1);
        localStorage.setItem(localStorageKey, JSON.stringify(data));
        location.reload();
    }
}

// NAVIGATION

let temp, indexTemp;
let navigations = document.querySelectorAll(".nav");
for(let i = 0; i < navigations.length; i++){
    navigations[i].addEventListener("click", function(){
        changePosition(navigations[i].innerHTML, i);
        setTimeout(deleteAnimation, 500);
    });
}

function changePosition(text, index){
    let navText = [];
    if(index != 1){
        for(let i = 0; i < navigations.length; i++)
            navText.push(navigations[i].innerHTML);

        for(let i = 0; i < navigations.length; i++){
            if(navText[i] == text)
                indexTemp = i;
        }

        temp = navText[1];
        navText[1] = navText[indexTemp];
        navText[indexTemp] = temp;
        navigations[1].classList.add("animation");
        navigations[index].classList.add("animation");
        navigations[1].innerHTML = navText[1];
        navigations[index].innerHTML = navText[index];
    }
}

function deleteAnimation(){
    navigations.forEach(nav => {
        nav.classList.remove("animation");
    });
}

let title = document.querySelector(".title");
let navbar = document.querySelector("nav");
let height = navbar.offsetTop;
function setNavbar(){
    if(window.pageYOffset > height)
        navbar.classList.add("sticky-nav")
    else
        navbar.classList.remove("sticky-nav");
}

// SEARCH

const searchField = document.getElementById("searchBookText");
const noResult = document.querySelectorAll(".no-result");
searchField.addEventListener("keyup", function(){
    let find = printListBook(2);
    for(let i = 0; i < find.length; i++){
        if(find[i] == 0)
            noResult[i].classList.remove("hidden");
        else
            noResult[i].classList.add("hidden");
    }
});
