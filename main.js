window.addEventListener("load", function(){
    printListBook();
    initiationButtons();
});

const localStorageKey = "BOOKS_DATA";
const bookInputForm = document.getElementById("inputBook");
// const test = document.querySelector(".test");

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
    let data = getBooks();
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

function checkForStorage() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    else
        return true;
}

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

function printListBook(){
    const incompleteListBookDiv = document.getElementById("incompleteBookshelfList");
    const completeListBookDiv = document.getElementById("completeBookshelfList");
    let printedDiv, printedButtonDiv, printedBookDiv;
    let allBooks;
    let row = [];
    let printedRow = [];
    let printedButton = [];
    let textButton = ["Edit", "Delete"];
    if(checkForStorage()){
        if(localStorage.getItem(localStorageKey) !== null){
            allBooks = getBooks();
            for(let i = 0; i < allBooks.length; i++){
                row[0] = allBooks[i].name;
                row[1] = allBooks[i].author;
                row[2] = allBooks[i].year;
                row[3] = allBooks[i].id;
                printedDiv = document.createElement("div");
                printedButtonDiv = document.createElement("div");
                for(let j = 0; j < row.length; j ++){
                    printedRow[j] = document.createElement("p");
                    printedRow[j].innerHTML = row[j];
                    if(j == row.length - 1)
                        printedRow[j].classList.add("id");
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
}

function getBooks(){
    let bookData = [];
    bookData = localStorage.getItem(localStorageKey);
    bookData = JSON.parse(bookData);
    return bookData;
}

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
    editForm.style.display = "flex";
    editForm.addEventListener("submit", function(){
        if(confirm("Lanjutkan Penyuntingan")){
            data[index].name = editTitle.value;
            data[index].author = editAuthor.value;
            data[index].year = editYear.value;
            if(editComplete.checked)
                data[index].isComplete = true;
            else
                data[index].isComplete = false;
            localStorage.setItem(localStorageKey, JSON.stringify(data));
        }
    });
}

function exitForm(){
    const editForm = document.querySelector(".modal-form");
    editForm.style.display = "none";
}

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