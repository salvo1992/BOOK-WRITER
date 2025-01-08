// download.js - Scarica il libro completo

document.addEventListener("DOMContentLoaded", () => {
    const downloadButton = document.getElementById('download-book');

    const currentBookId = localStorage.getItem("currentBookId");
    if (!currentBookId) {
        console.warn("Nessun libro selezionato, ma procedo senza alert.");
    }

    // Scarica il libro completo
    async function downloadBook() {
        try {
            const response = await fetch(`/api/books/${currentBookId}/full`);
            if (!response.ok) {
                throw new Error('Errore durante il download del libro.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'book.html';
            document.body.appendChild(a);
            a.click();
            a.remove();

            alert("Libro scaricato con successo!");
        } catch (error) {
            console.error(error.message);
            alert("Errore durante il download del libro.");
        }
    }

    // Aggiunge l'evento al pulsante di download
    downloadButton.addEventListener('click', downloadBook);
});
