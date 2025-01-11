document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'https://book-writer.onrender.com'; // URL del backend
    const noteList = document.getElementById('notes-list');
    const noteInput = document.getElementById('note-content');
    const saveNoteButton = document.getElementById('save-note');
    const currentBookTitle = document.getElementById('current-book-title');
    const currentBookId = localStorage.getItem("currentBookId");

    if (!currentBookId) {
        console.warn("Nessun libro selezionato. Ritorno alla pagina iniziale.");
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
            if (currentBookTitle) currentBookTitle.textContent = currentBook.title;
            renderNotes(currentBook.notes || []);
        } catch (error) {
            console.error("Errore durante il recupero del libro:", error.message);
        }
    }

    // Mostra le note nella lista
    function renderNotes(notes) {
        noteList.innerHTML = "";
        (notes || []).forEach((note, index) => {
            const li = document.createElement('li');
            const noteText = document.createElement('span');
            noteText.textContent = `${index + 1}. ${note}`;

            // Pulsante per modificare una nota
            const editButton = document.createElement('button');
            editButton.textContent = "Modifica";
            editButton.classList.add("btn-secondary");
            editButton.addEventListener('click', () => editNote(index));

            // Pulsante per eliminare una nota
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Elimina";
            deleteButton.classList.add("btn-danger");
            deleteButton.addEventListener('click', () => deleteNote(index));

            li.appendChild(noteText);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            noteList.appendChild(li);
        });

        // Aggiungi pulsante per aprire il Grimorio
        const grimorioButton = document.createElement('button');
        grimorioButton.textContent = "Apri Grimorio";
        grimorioButton.className = "btn-primary";
        grimorioButton.addEventListener('click', () => {
            window.location.href = "grimorio.html";
        });

        noteList.appendChild(grimorioButton);
    }

    // Salva una nuova nota
    async function saveNote() {
        const noteContent = noteInput.value.trim();
        if (!noteContent) {
            alert("Il contenuto della nota non può essere vuoto.");
            return;
        }

        if (!currentBook.notes) currentBook.notes = [];
        currentBook.notes.push(noteContent);

        try {
            const response = await fetch(`${API_BASE_URL}/books/${currentBookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notes: currentBook.notes }),
            });

            if (!response.ok) {
                throw new Error('Errore nel salvataggio della nota.');
            }

            alert("Nota salvata con successo!");
            renderNotes(currentBook.notes);
            noteInput.value = "";
        } catch (error) {
            console.error("Errore durante il salvataggio della nota:", error.message);
        }
    }

    // Modifica una nota
    async function editNote(index) {
        const newContent = prompt("Modifica la nota:", currentBook.notes[index]);
        if (newContent !== null) {
            currentBook.notes[index] = newContent;

            try {
                const response = await fetch(`${API_BASE_URL}/books/${currentBookId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ notes: currentBook.notes }),
                });

                if (!response.ok) {
                    throw new Error('Errore nella modifica della nota.');
                }

                alert("Nota modificata con successo!");
                renderNotes(currentBook.notes);
            } catch (error) {
                console.error("Errore durante la modifica della nota:", error.message);
            }
        }
    }

    // Cancella una nota
    async function deleteNote(index) {
        if (!confirm(`Sei sicuro di voler eliminare la nota ${index + 1}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/books/${currentBookId}?type=note&noteIndex=${index}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.error || 'Errore durante l\'eliminazione della nota.');
            }

            alert("Nota eliminata con successo!");
            currentBook.notes.splice(index, 1); // Aggiorna la lista localmente
            renderNotes(currentBook.notes);
        } catch (error) {
            console.error("Errore durante l'eliminazione della nota:", error.message);
        }
    }

    // Event listener per salvare una nuova nota
    if (saveNoteButton) {
        saveNoteButton.addEventListener('click', saveNote);
    }

    // Recupera i dati del libro all'avvio
    fetchBook();
});
