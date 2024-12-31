// books.js - Logica per la gestione della lista dei libri

document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("book-list ul");

    // Recupera i libri dalla memoria locale
    const books = JSON.parse(localStorage.getItem("books")) || [];

    // Funzione per aggiornare la lista dei libri
    function renderBooks() {
        bookList.innerHTML = "";
        books.forEach((book, index) => {
            const li = document.createElement("li");
            li.textContent = book.title;
            li.addEventListener("click", () => openBook(index));
            bookList.appendChild(li);
        });
    }

    // Funzione per aprire un libro
    function openBook(index) {
        alert(`Aprendo il libro: ${books[index].title}`);
        // Logica per navigare alla visualizzazione del libro
    }

    // Render iniziale
    renderBooks();

    console.log("Lista dei libri caricata con successo!");
});
