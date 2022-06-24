// INITIATION

const localStorageKey = "BOOKS_DATA";
const bookInputForm = document.getElementById("inputBook");
const incompleteListBookDiv = document.getElementById("incompleteBookshelfList");
const completeListBookDiv = document.getElementById("completeBookshelfList");
const editForm = document.querySelector(".modal-form");

window.addEventListener("load", function(){
    searchBook();
});

window.addEventListener("scroll", function(){
    checkScrollPosition();
    setNavbar();
});

bookInputForm.addEventListener("submit", function(){
    let inputTime = new Date().valueOf();
    let bookTitle = document.getElementById("inputBookTitle").value;
    let bookAuthor = document.getElementById("inputBookAuthor").value;
    let bookYear = document.getElementById("inputBookYear").value;
    bookYear = parseInt(bookYear);
    let bookStatus = document.getElementById("inputBookIsComplete");
    let flag;
    if(bookStatus.checked)
        flag = true;
    else
        flag = false;
    const newBookData = {
        id : inputTime,
        title: bookTitle,
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
    let printedDiv, printedButtonDiv, printedBookDiv, allBooks, title, temp;
    let row = [];
    let printedRow = [];
    let printedButton = [];
    let textButton = ["Edit", "Delete"];
    let flag = [0, 0];
    if(checkForStorage()){
        if(localStorage.getItem(localStorageKey) !== null){
            allBooks = getBooks();
            for(let i = 0; i < allBooks.length; i++){
                title = allBooks[i].title;
                if(x == 2){
                    if(!(title.toLowerCase().indexOf(searchBookText) > -1))
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
                row[0] = `${allBooks[i].title}`;
                row[1] = `Ditulis Oleh ${allBooks[i].author}`;
                row[2] = `Terbit Pada Tahun ${allBooks[i].year}`;
                row[3] = allBooks[i].id;
                printedDiv = document.createElement("div");
                printedButtonDiv = document.createElement("div");
                for(let j = 0; j < row.length; j ++){
                    printedRow[j] = document.createElement("p");
                    printedRow[j].innerHTML = row[j];
                    if(j == row.length - 1)
                        printedRow[j].classList.add("hidden", "id");
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
    const editTitle = document.getElementById("editBookTitle");
    const editAuthor = document.getElementById("editBookAuthor");
    const editYear = document.getElementById("editBookYear");
    const editComplete = document.getElementById("editBookIsComplete");
    for(let i = 0; i < data.length; i++){
        if(id == data[i].id)
            index = i;
    }
    editTitle.value = data[index].title;
    editAuthor.value = data[index].author;
    editYear.value = (data[index].year);
    if(data[index].isComplete == true)
        editComplete.checked = true;
    else
    editComplete.checked = false;
    editForm.style.display = "flex";
    editForm.addEventListener("submit", function(){
        data[index].title = editTitle.value;
        data[index].author = editAuthor.value;
        data[index].year = parseInt(editYear.value);
        if(editComplete.checked)
            data[index].isComplete = true;
        else
            data[index].isComplete = false;
        localStorage.setItem(localStorageKey, JSON.stringify(data));
    });
}

function exitForm(){
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
        changePosition(navigations[i].innerHTML, i, 1);
        setTimeout(deleteAnimation, 500);
    });
}

function changePosition(text, index, flag){
    let navText = [];
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
    navigations[1].href = "#" + `${navText[1]}` + "_div";
    navigations[index].href = "#" + `${navText[index]}` + "_div";
    navigations[1].innerHTML = navText[1];
    navigations[index].innerHTML = navText[index];

    if(flag == 1)
        autoScroll(navigations[1].innerHTML);
}

function deleteAnimation(){
    navigations.forEach(nav => {
        nav.classList.remove("animation");
    });
}

// CHECK SCROLL POSITION

function checkScrollPosition(){
    
}

// AUTO SCROLL

let inputPosition = document.getElementById("input_div").offsetTop;
let searchPosition = document.getElementById("search_div").offsetTop;
let cabinetPosition = document.getElementById("cabinet_div").offsetTop;
let navbar = document.querySelector("nav");
let height = navbar.offsetTop;
let gotoInput = inputPosition - height;
let gotoSearch = searchPosition - height - 30;
let gotoCabinet = cabinetPosition - height;
function autoScroll(text){
    if(text == 'Tambah Buku')
        window.scrollTo(0, gotoInput);
    else if(text == 'Cari Buku')
        window.scrollTo(0, gotoSearch);
    else if(text == 'Rak Buku')
        window.scrollTo(0, gotoCabinet);
}

// SCROLL NAVIGATION

let title = document.querySelector(".title");
let listheight = document.querySelector(".active").offsetHeight;
let width = screen.width;
function setNavbar(){
    if(window.scrollY > height){
        console.log(width);
        navbar.classList.add("sticky-nav");
        if(width <= 320)
            navbar.style.height = `${listheight + -10}px`;
        else
            navbar.style.height = `${listheight + 10}px`;
    }
    else{
        navbar.classList.remove("sticky-nav");
        navbar.style.height = `inherit`;
    }
}
// SEARCH

const searchField = document.getElementById("searchBookText");
const noResult = document.querySelectorAll(".no-result");
searchField.addEventListener("keyup", function(){
    searchBook();
});

function searchBook(){
    let find = printListBook(2);
    for(let i = 0; i < find.length; i++){
        if(find[i] == 0)
            noResult[i].classList.remove("hidden");
        else
            noResult[i].classList.add("hidden");
    }
}
