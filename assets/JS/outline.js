// outline.js - Gestione della struttura del libro tramite API

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'http://localhost:5500'; // URL del backend
    const currentBookTitle = document.getElementById('current-book-title');
    const chapterList = document.getElementById('chapter-list');
    const introductionInput = document.getElementById('book-introduction');
    const saveOutlineButton = document.getElementById('save-outline');
    const addChapterButton = document.getElementById('add-chapter');
    const addSubchapterButton = document.getElementById('add-subchapter');
    // Bottone per selezionare ed eliminare capitoli o sotto-capitoli
    const deleteChapterButton = document.getElementById('delete-chapter');
    const deleteSubchapterButton = document.getElementById('delete-subchapter');

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
            renderChapters(currentBook.chapters || []);
            introductionInput.value = currentBook.introduction || "";
        } catch (error) {
            console.error("Errore durante il recupero del libro:", error.message);
        }
    }

    // Mostra capitoli e sotto-capitoli
    function renderChapters(chapters) {
        chapterList.innerHTML = "";
        chapters.forEach((chapter, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${chapter.title}`; // Mostra il titolo del capitolo
    
            if (chapter.subchapters && chapter.subchapters.length > 0) {
                const ul = document.createElement('ul');
                chapter.subchapters.forEach((subchapter, subIndex) => {
                    const subLi = document.createElement('li');
                    subLi.textContent = `${index + 1}.${subIndex + 1} ${subchapter.title}`; // Mostra il titolo del sotto-capitolo
                    ul.appendChild(subLi);
                });
                li.appendChild(ul);
            }
    
            chapterList.appendChild(li);
        });
    }
    // Aggiungi un nuovo capitolo
    addChapterButton.addEventListener('click', () => {
        const chapterTitle = prompt("Inserisci il titolo del nuovo capitolo:");
        if (chapterTitle) {
            if (!currentBook.chapters) currentBook.chapters = [];
            currentBook.chapters.push({ title: chapterTitle, subchapters: [] });
            renderChapters(currentBook.chapters);
        }
    });

    // Aggiungi un nuovo sotto-capitolo
    addSubchapterButton.addEventListener('click', () => {
        const chapterIndex = parseInt(prompt("Seleziona il numero del capitolo per il sotto-capitolo:"), 10) - 1;
    
        // Controlla se l'indice del capitolo è valido
        if (isNaN(chapterIndex) || !currentBook.chapters[chapterIndex]) {
            alert("Numero di capitolo non valido.");
            return;
        }
    
        // Chiedi il titolo del sotto-capitolo
        const subchapterTitle = prompt("Inserisci il titolo del nuovo sotto-capitolo:");
        if (!subchapterTitle) {
            alert("Il titolo del sotto-capitolo non può essere vuoto.");
            return;
        }
    
        // Aggiungi il sotto-capitolo come oggetto con il titolo
        if (!currentBook.chapters[chapterIndex].subchapters) {
            currentBook.chapters[chapterIndex].subchapters = [];
        }
        currentBook.chapters[chapterIndex].subchapters.push({ title: subchapterTitle });
    
        // Renderizza nuovamente i capitoli
        renderChapters(currentBook.chapters);
    });
    

    // Salva le modifiche all'outline
    saveOutlineButton.addEventListener('click', async () => {
        const introduction = introductionInput.value;

        try {
            const response = await fetch(`${API_BASE_URL}/books/${currentBookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentBookId, // Aggiunta dell'ID nel body
                    introduction,
                    chapters: currentBook.chapters
                }),
            });

            if (!response.ok) {
                throw new Error('Errore nel salvataggio delle modifiche.');
            }

            alert("Modifiche salvate con successo!");
            window.location.href = "writer.html";
        } catch (error) {
            console.error("Errore durante il salvataggio delle modifiche:", error.message);
        }
    });

    // Espandi la textarea in base al contenuto
    introductionInput.addEventListener('input', () => {
        introductionInput.style.height = "auto";
        introductionInput.style.height = `${introductionInput.scrollHeight}px`;
    });

    // Elimina un capitolo
deleteChapterButton.addEventListener('click', async () => {
    const chapterIndex = parseInt(prompt("Inserisci il numero del capitolo da eliminare:"), 10) - 1;

    if (isNaN(chapterIndex) || !currentBook.chapters[chapterIndex]) {
        alert("Capitolo non valido.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/books/${currentBookId}?type=chapter&chapterIndex=${chapterIndex}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Errore durante l\'eliminazione del capitolo.');
        }

        alert("Capitolo eliminato con successo!");
        currentBook.chapters.splice(chapterIndex, 1);
        renderChapters(currentBook.chapters);
    } catch (error) {
        console.error("Errore durante l'eliminazione del capitolo:", error.message);
    }
});

// Elimina un sotto-capitolo
deleteSubchapterButton.addEventListener('click', async () => {
    const chapterIndex = parseInt(prompt("Inserisci il numero del capitolo:"), 10) - 1;
    const subchapterIndex = parseInt(prompt("Inserisci il numero del sotto-capitolo da eliminare:"), 10) - 1;

    if (
        isNaN(chapterIndex) ||
        isNaN(subchapterIndex) ||
        !currentBook.chapters[chapterIndex] ||
        !currentBook.chapters[chapterIndex].subchapters[subchapterIndex]
    ) {
        alert("Sotto-capitolo non valido.");
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/books/${currentBookId}?type=subchapter&chapterIndex=${chapterIndex}&subchapterIndex=${subchapterIndex}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            throw new Error('Errore durante l\'eliminazione del sotto-capitolo.');
        }

        alert("Sotto-capitolo eliminato con successo!");
        currentBook.chapters[chapterIndex].subchapters.splice(subchapterIndex, 1);
        renderChapters(currentBook.chapters);
    } catch (error) {
        console.error("Errore durante l'eliminazione del sotto-capitolo:", error.message);
    }
});

    // Recupera i dati iniziali del libro
    fetchBook();
});
