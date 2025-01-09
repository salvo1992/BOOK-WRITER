document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'https://book-writer.onrender.com'; // URL del backend
    const currentBookTitle = document.getElementById('current-book-title');
    const chapterSelector = document.getElementById('chapter-selector');
    const contentArea = document.getElementById('chapter-content');
    const saveContentButton = document.getElementById('save-content');
    const deleteContentButton = document.getElementById('delete-content');

    const currentBookId = localStorage.getItem("currentBookId");

    if (!currentBookId) {
        console.warn("Nessun libro selezionato. Ritorno alla pagina iniziale.");
        alert("Nessun libro selezionato. Torna alla pagina iniziale.");
        window.location.href = "books.html";
        return;
    }

    let currentBook = null;

    // Recupera i dettagli del libro
    async function fetchBook() {
        try {
            console.log(`Tentativo di recuperare il libro con ID: ${currentBookId}`);
            const response = await fetch(`${API_BASE_URL}/books/${currentBookId}`);
            if (!response.ok) {
                throw new Error('Errore nel recupero del libro.');
            }
            currentBook = await response.json();
            console.log("Libro recuperato:", currentBook);

            // Mostra il titolo del libro selezionato
            if (currentBookTitle) currentBookTitle.textContent = currentBook.title;

            // Popola il selettore dei capitoli
            populateChapters(currentBook.chapters || []);
        } catch (error) {
            console.error("Errore durante il recupero del libro:", error.message);
            alert("Errore nel recupero del libro. Torna alla pagina iniziale.");
            window.location.href = "books.html";
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
                    subchapterOption.textContent = `${index + 1}.${subIndex + 1} ${subchapter.title}`;
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
            : [parseInt(selectedValue.replace("chapter-", ""), 10), null];

        if (subIndex === null) {
            contentArea.value = currentBook.chapters[chapterIndex]?.content || "";
        } else {
            contentArea.value = currentBook.chapters[chapterIndex]?.subchapters[subIndex]?.content || "";
        }
    }

    // Salva il contenuto del capitolo o sotto-capitolo selezionato
    async function saveContent() {
        const selectedValue = chapterSelector.value;
        const [chapterIndex, subIndex] = selectedValue.includes("sub")
            ? selectedValue.replace("chapter-", "").split("-sub-").map(Number)
            : [parseInt(selectedValue.replace("chapter-", ""), 10), null];

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

    // Cancella il contenuto del capitolo o sotto-capitolo selezionato
    async function deleteContent() {
        const selectedValue = chapterSelector.value;
        const [chapterIndex, subIndex] = selectedValue.includes("sub")
            ? selectedValue.replace("chapter-", "").split("-sub-").map(Number)
            : [parseInt(selectedValue.replace("chapter-", ""), 10), null];

        const type = subIndex === null ? 'chapter' : 'subchapter';

        if (!confirm(`Sei sicuro di voler eliminare ${type === 'chapter' ? 'questo capitolo' : 'questo sotto-capitolo'}?`)) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/books/${currentBookId}?type=${type}&chapterIndex=${chapterIndex}&subchapterIndex=${subIndex}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                throw new Error('Errore durante l\'eliminazione del contenuto.');
            }

            alert(`${type === 'chapter' ? 'Capitolo' : 'Sotto-capitolo'} eliminato con successo!`);
            if (type === 'chapter') {
                currentBook.chapters.splice(chapterIndex, 1);
            } else {
                currentBook.chapters[chapterIndex].subchapters.splice(subIndex, 1);
            }
            populateChapters(currentBook.chapters);
            contentArea.value = ''; // Svuota l'area di testo
        } catch (error) {
            console.error("Errore durante l'eliminazione del contenuto:", error.message);
        }
    }

    // Event listeners
    chapterSelector.addEventListener('change', loadContent);
    saveContentButton.addEventListener('click', saveContent);
    deleteContentButton.addEventListener('click', deleteContent);

    // Recupera i dati iniziali del libro
    fetchBook();
});

