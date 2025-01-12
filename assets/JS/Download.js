document.addEventListener("DOMContentLoaded", () => {
    const previewButton = document.getElementById('preview-book');
    const previewContainer = document.getElementById('preview-container');
    const colorInput = document.getElementById('cover-color');
    const downloadButton = document.getElementById('download-book');

    const currentBookId = localStorage.getItem("currentBookId");
    if (!currentBookId) {
        console.warn("Nessun libro selezionato, reindirizzo alla pagina libri.");
        window.location.href = "books.html";
        return;
    }

    let currentBook = null;

    // Recupera i dettagli del libro dal server
    async function fetchBook() {
        try {
            const response = await fetch(`/api/books/${currentBookId}`);
            if (!response.ok) {
                throw new Error('Errore nel recupero del libro.');
            }

            currentBook = await response.json();
            console.log("Libro recuperato:", currentBook);
        } catch (error) {
            console.error("Errore durante il recupero del libro:", error.message);
        }
    }

    // Mostra l'anteprima interattiva del libro
    function renderBookPreview() {
        if (!currentBook) {
            alert("Errore: libro non caricato.");
            return;
        }

        const coverColor = colorInput.value || "#ffffff";

        // Pulisce il contenitore dell'anteprima
        previewContainer.innerHTML = "";

        // Crea la copertina
        const cover = document.createElement('div');
        cover.className = 'book-cover';
        cover.style.backgroundColor = coverColor;
        cover.innerHTML = `
            <h1>${currentBook.title}</h1>
            <p class="author">Utente Ospite</p>
        `;
        previewContainer.appendChild(cover);

        // Crea la pagina dell'introduzione
        if (currentBook.introduction) {
            const introPage = document.createElement('div');
            introPage.className = 'book-page';
            introPage.innerHTML = `
                <h2>Introduzione</h2>
                <p>${currentBook.introduction}</p>
            `;
            previewContainer.appendChild(introPage);
        }

        // Crea l'indice
        const indexPage = document.createElement('div');
        indexPage.className = 'book-page';
        indexPage.innerHTML = `
            <h2>Indice</h2>
            <ul>
                ${currentBook.chapters.map((chapter, index) => `<li>${index + 1}. ${chapter.title || 'Senza titolo'}</li>`).join('')}
            </ul>
        `;
        previewContainer.appendChild(indexPage);

        // Crea le pagine dei capitoli e dei sotto-capitoli
        currentBook.chapters.forEach((chapter, index) => {
            const chapterPage = document.createElement('div');
            chapterPage.className = 'book-page';
            chapterPage.innerHTML = `
                <h2>Capitolo ${index + 1}: ${chapter.title || 'Senza titolo'}</h2>
                <p>${chapter.content || 'Nessun contenuto disponibile.'}</p>
            `;
            previewContainer.appendChild(chapterPage);

            // Aggiungi i sotto-capitoli
            chapter.subchapters.forEach((subchapter, subIndex) => {
                const subchapterPage = document.createElement('div');
                subchapterPage.className = 'book-page';
                subchapterPage.innerHTML = `
                    <h3>${chapter.title || 'Capitolo'} - ${subchapter.title || 'Senza titolo'}</h3>
                    <p>${subchapter.content || 'Nessun contenuto disponibile.'}</p>
                `;
                previewContainer.appendChild(subchapterPage);
            });
        });

        // Aggiungi le note
        if (currentBook.notes && currentBook.notes.length > 0) {
            const notesPage = document.createElement('div');
            notesPage.className = 'book-page';
            notesPage.innerHTML = `
                <h2>Note</h2>
                <ul>
                    ${currentBook.notes.map(note => `<li>${note}</li>`).join('')}
                </ul>
            `;
            previewContainer.appendChild(notesPage);
        }

        // Aggiungi il Grimorio
        if (currentBook.grimorio) {
            Object.keys(currentBook.grimorio).forEach(category => {
                const grimorioPage = document.createElement('div');
                grimorioPage.className = 'book-page';
                grimorioPage.innerHTML = `
                    <h2>${category}</h2>
                    ${currentBook.grimorio[category].map(item => `
                        <div class="grimorio-item">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ""}
                        </div>
                    `).join('')}
                `;
                previewContainer.appendChild(grimorioPage);
            });
        }

        alert("Anteprima generata con successo!");
    }

    // Scarica il libro come PDF
    async function downloadBook() {
        try {
            const response = await fetch(`/api/books/${currentBookId}/full`);
            if (!response.ok) {
                throw new Error("Errore durante la generazione del file scaricabile.");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentBook.title.replace(/\s+/g, '_')}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Errore durante il download del libro:", error.message);
        }
    }

    // Event listener per il pulsante di anteprima
    previewButton.addEventListener("click", renderBookPreview);

    // Event listener per il pulsante di download
    downloadButton.addEventListener("click", downloadBook);

    // Carica i dati del libro all'avvio
    fetchBook();
});

