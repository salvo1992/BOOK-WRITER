// outline.js - Logica per la struttura del libro

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("outline-form");
    const chapterList = document.getElementById("chapter-list");

    // Recupera i dati del libro selezionato o crea un nuovo libro
    const currentBookIndex = localStorage.getItem("currentBookIndex");
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let currentBook = currentBookIndex ? books[currentBookIndex] : {
        title: "",
        introduction: "",
        chapters: [],
        conclusion: ""
    };

    // Popola il form con i dati del libro selezionato
    function populateForm() {
        form.title.value = currentBook.title;
        form.introduction.value = currentBook.introduction;
        chapterList.innerHTML = "";
        currentBook.chapters.forEach((chapter, index) => {
            const li = document.createElement("li");
            li.textContent = chapter;
            li.addEventListener("click", () => removeChapter(index));
            chapterList.appendChild(li);
        });
        form.conclusion.value = currentBook.conclusion;
    }

    // Aggiunge un capitolo alla lista
    function addChapter() {
        const chapterName = prompt("Nome del capitolo:");
        if (chapterName) {
            currentBook.chapters.push(chapterName);
            populateForm();
        }
    }

    // Rimuove un capitolo dalla lista
    function removeChapter(index) {
        currentBook.chapters.splice(index, 1);
        populateForm();
    }

    // Salva i dati del libro
    function saveBook() {
        currentBook.title = form.title.value;
        currentBook.introduction = form.introduction.value;
        currentBook.conclusion = form.conclusion.value;
        if (currentBookIndex !== null) {
            books[currentBookIndex] = currentBook;
        } else {
            books.push(currentBook);
        }
        localStorage.setItem("books", JSON.stringify(books));
        alert("Libro salvato con successo!");
    }

    // Eventi
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        saveBook();
    });

    document.getElementById("add-chapter").addEventListener("click", addChapter);

    // Popolamento iniziale del form
    populateForm();

    console.log("Pagina della struttura del libro caricata con successo!");
});
