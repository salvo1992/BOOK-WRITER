// writer.js - Gestione della scrittura dei capitoli tramite API

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'http://localhost:5500'; // URL del backend
    const currentBookTitle = document.getElementById('current-book-title');
    const chapterSelector = document.getElementById('chapter-selector');
    const contentArea = document.getElementById('chapter-content');
    const saveContentButton = document.getElementById('save-content');
    const deleteContentButton = document.getElementById('delete-content');

    const currentBookId = localStorage.getItem("currentBookId");

    if (!currentBookId) {
        console.error("Errore: Nessun ID libro trovato. Ritorno alla pagina dei libri.");
        alert("Nessun libro selezionato. Torna alla pagina iniziale.");
        window.location.href = "books.html";
        return;
    }

    let currentBook = null;

    // Recupera i dettagli del libro
    async function fetchBook() {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${currentBookId}`);
            if (!response.ok) {
                throw new Error('Errore nel recupero del libro.');
            }
            currentBook = await response.json();
            currentBookTitle.textContent = currentBook.title;
            populateChapters(currentBook.chapters || []);
        } catch (error) {
            console.error("Errore durante il recupero del libro:", error.message);
        }
    }

    // Popola il selettore dei capitoli
    function populateChapters(chapters) {
        chapterSelector.innerHTML = "";
        chapters.forEach((chapter, index) => {
            const chapterOption = document.createElement('option');
            chapterOption.value = `chapter-${index}`;
            chapterOption.textContent = `${index + 1}. ${chapter.title}`;
            chapterSelector.appendChild(chapterOption);

            if (chapter.subchapters) {
                chapter.subchapters.forEach((subchapter, subIndex) => {
                    const subchapterOption = document.createElement('option');
                    subchapterOption.value = `chapter-${index}-sub-${subIndex}`;
                    subchapterOption.textContent = `${index + 1}.${subIndex + 1} ${subchapter}`;
                    chapterSelector.appendChild(subchapterOption);
                });
            }
        });
    }

    // Carica il contenuto del capitolo o sotto-capitolo selezionato
    function loadContent() {
        const selectedValue = chapterSelector.value;
        const [chapterIndex, subIndex] = selectedValue.includes("sub")
            ? selectedValue.replace("chapter-", "").split("-sub-").map(Number)
            : [parseInt(selectedValue.replace("chapter-", "")), null];

        if (subIndex === null) {
            contentArea.value = currentBook.chapters[chapterIndex].content || "";
        } else {
            contentArea.value = currentBook.chapters[chapterIndex].subchapters[subIndex].content || "";
        }
    }

    // Salva il contenuto del capitolo o sotto-capitolo selezionato
    async function saveContent() {
        const selectedValue = chapterSelector.value;
        const [chapterIndex, subIndex] = selectedValue.includes("sub")
            ? selectedValue.replace("chapter-", "").split("-sub-").map(Number)
            : [parseInt(selectedValue.replace("chapter-", "")), null];

        const content = contentArea.value;

        if (subIndex === null) {
            currentBook.chapters[chapterIndex].content = content;
        } else {
            if (!currentBook.chapters[chapterIndex].subchapters[subIndex]) {
                currentBook.chapters[chapterIndex].subchapters[subIndex] = {};
            }
            currentBook.chapters[chapterIndex].subchapters[subIndex].content = content;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/books/${currentBookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chapters: currentBook.chapters }),
            });

            if (!response.ok) {
                throw new Error('Errore nel salvataggio del contenuto.');
            }

            alert("Contenuto salvato con successo!");
        } catch (error) {
            console.error("Errore durante il salvataggio del contenuto:", error.message);
        }
    }

    // Elimina il contenuto del capitolo o sotto-capitolo selezionato
    async function deleteContent() {
        const selectedValue = chapterSelector.value;
        const [chapterIndex, subIndex] = selectedValue.includes("sub")
            ? selectedValue.replace("chapter-", "").split("-sub-").map(Number)
            : [parseInt(selectedValue.replace("chapter-", "")), null];

        if (subIndex === null) {
            currentBook.chapters[chapterIndex].content = "";
        } else {
            currentBook.chapters[chapterIndex].subchapters[subIndex].content = "";
        }

        try {
            const response = await fetch(`${API_BASE_URL}/books/${currentBookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chapters: currentBook.chapters }),
            });

            if (!response.ok) {
                throw new Error('Errore nella cancellazione del contenuto.');
            }

            alert("Contenuto eliminato con successo!");
            contentArea.value = "";
        } catch (error) {
            console.error("Errore durante la cancellazione del contenuto:", error.message);
        }
    }

    // Event listeners
    chapterSelector.addEventListener('change', loadContent);
    saveContentButton.addEventListener('click', saveContent);
    deleteContentButton.addEventListener('click', deleteContent);

    // Recupera i dati iniziali del libro
    fetchBook();
});
