// books.js - Gestione dei Libri tramite API

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'http://localhost:5500'; // URL del backend
    const bookList = document.getElementById("book-list");
    const deleteBookButton = document.getElementById("delete-book"); // Recupera il pulsante elimina libro

    if (!bookList) {
        console.warn("Elemento book-list non trovato nel DOM. La pagina potrebbe non funzionare correttamente.");
        return;
    }

    // Recupera i libri dal database
    async function fetchBooks() {
        try {
            const response = await fetch(`${API_BASE_URL}/books`);
            if (!response.ok) {
                throw new Error('Errore nel recupero dei libri.');
            }
            const books = await response.json();
            console.log("Libri ricevuti:", books);
            renderBooks(books);
        } catch (error) {
            console.error("Errore durante il recupero dei libri:", error.message);
        }
    }

    // Mostra i libri nella lista
    function renderBooks(books) {
        bookList.innerHTML = "";
        books.forEach(book => {
            const li = document.createElement("li");
            li.textContent = book.title;
    
            // Pulsante per selezionare il libro
            const selectButton = document.createElement("button");
            selectButton.textContent = "Seleziona";
            selectButton.classList.add("btn-secondary");
            selectButton.addEventListener("click", () => {
                console.log(`Selezionato libro con ID: ${book._id}`);
                localStorage.setItem("currentBookId", book._id);
                alert(`Libro selezionato: ${book.title}`);
            });
    

            // Pulsante per scaricare il libro completo
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Scarica";
        downloadButton.classList.add("btn-secondary");
        downloadButton.addEventListener("click", () => {
            window.location.href = `${API_BASE_URL}/books/${book._id}/full`;
        });

    // Crea un nuovo libro
    async function createBook(title) {
        console.log('Dati inviati:', { title });

        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Errore nella creazione del libro: ${errorDetails.error || 'Errore sconosciuto'}`);
            }

            const newBook = await response.json();
            console.log('Libro creato:', newBook);

            localStorage.setItem("currentBookId", newBook._id);
            window.location.href = "outline.html";
        } catch (error) {
            console.error("Errore durante la creazione del libro:", error.message);
        }
    }

    // Pulsante per creare un nuovo libro
    const createBookButton = document.getElementById("create-book");
    if (createBookButton) {
        createBookButton.addEventListener("click", () => {
            const title = prompt("Inserisci il titolo del nuovo libro:");
            if (title) {
                createBook(title);
            }
        });
    } else {
        console.warn("Pulsante create-book non trovato nel DOM.");
    }

    // Pulsante per eliminare il libro
const deleteButton = document.createElement("button");
deleteButton.textContent = "Elimina";
deleteButton.classList.add("btn-danger");

deleteButton.addEventListener("click", async () => {
    if (confirm(`Sei sicuro di voler eliminare il libro "${book.title}"?`)) {
        try {
            // Effettua la richiesta DELETE con il tipo 'book'
            const response = await fetch(`${API_BASE_URL}/books/${book._id}?type=book`, { method: 'DELETE' });
            
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.error || 'Errore durante l\'eliminazione del libro.');
            }

            alert("Libro eliminato con successo!");
            fetchBooks(); // Ricarica la lista dei libri
        } catch (error) {
            console.error("Errore durante l'eliminazione del libro:", error.message);
        }
    }
});

    li.appendChild(selectButton);
    li.appendChild(downloadButton);
    li.appendChild(deleteButton);
    bookList.appendChild(li);
});
}

    // Recupera e visualizza i libri all'avvio
    fetchBooks();
});


