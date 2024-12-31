// write.js - Logica per la scrittura delle pagine del libro

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("write-form");

    // Recupera i dati del libro selezionato
    const currentBookIndex = localStorage.getItem("currentBookIndex");
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let currentBook = currentBookIndex ? books[currentBookIndex] : null;

    if (!currentBook) {
        alert("Nessun libro selezionato. Ritorna alla pagina precedente per scegliere un libro.");
        return;
    }

    // Aggiunge una pagina al capitolo selezionato
    function savePage(event) {
        event.preventDefault();

        const chapter = form.chapter.value;
        const pageNumber = form["page-number"].value;
        const content = form.content.value;

        if (!chapter || !pageNumber || !content) {
            alert("Tutti i campi sono obbligatori.");
            return;
        }

        if (!currentBook.content) {
            currentBook.content = {};
        }

        if (!currentBook.content[chapter]) {
            currentBook.content[chapter] = {};
        }

        currentBook.content[chapter][pageNumber] = content;
        books[currentBookIndex] = currentBook;
        localStorage.setItem("books", JSON.stringify(books));

        alert("Pagina salvata con successo!");
        form.reset();
    }

    // Event listener per il salvataggio della pagina
    form.addEventListener("submit", savePage);

    console.log("Pagina di scrittura caricata con successo!");
});