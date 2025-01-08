// outline.js - Gestione della struttura del libro tramite API

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'http://localhost:5500'; // URL del backend
    const currentBookTitle = document.getElementById('current-book-title');
    const chapterList = document.getElementById('chapter-list');
    const introductionInput = document.getElementById('book-introduction');
    const saveOutlineButton = document.getElementById('save-outline');
    const addChapterButton = document.getElementById('add-chapter');
    const addSubchapterButton = document.getElementById('add-subchapter');

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
            li.textContent = `${index + 1}. ${chapter.title}`;

            if (chapter.subchapters && chapter.subchapters.length > 0) {
                const ul = document.createElement('ul');
                chapter.subchapters.forEach((subchapter, subIndex) => {
                    const subLi = document.createElement('li');
                    subLi.textContent = `${index + 1}.${subIndex + 1} ${subchapter}`;
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
        if (isNaN(chapterIndex) || !currentBook.chapters[chapterIndex]) {
            alert("Capitolo non valido.");
            return;
        }

        const subchapterTitle = prompt("Inserisci il titolo del nuovo sotto-capitolo:");
        if (subchapterTitle) {
            if (!currentBook.chapters[chapterIndex].subchapters) {
                currentBook.chapters[chapterIndex].subchapters = [];
            }
            currentBook.chapters[chapterIndex].subchapters.push(subchapterTitle);
            renderChapters(currentBook.chapters);
        }
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

    // Recupera i dati iniziali del libro
    fetchBook();
});
