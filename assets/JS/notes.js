// notes.js - Logica per la gestione delle note e delle idee

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("notes-form");
    const notesList = document.getElementById("notes-list ul");

    // Recupera le note dalla memoria locale
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    // Funzione per aggiornare la lista delle note
    function renderNotes() {
        notesList.innerHTML = "";
        notes.forEach((note, index) => {
            const li = document.createElement("li");
            li.textContent = note;

            // Pulsante per eliminare la nota
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Elimina";
            deleteButton.addEventListener("click", () => deleteNote(index));

            li.appendChild(deleteButton);
            notesList.appendChild(li);
        });
    }

    // Funzione per aggiungere una nuova nota
    function addNote(event) {
        event.preventDefault();

        const noteContent = form.note.value;
        if (!noteContent) {
            alert("Il campo nota non può essere vuoto.");
            return;
        }

        notes.push(noteContent);
        localStorage.setItem("notes", JSON.stringify(notes));

        renderNotes();
        form.reset();
    }

    // Funzione per eliminare una nota
    function deleteNote(index) {
        notes.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        renderNotes();
    }

    // Event listener per aggiungere note
    form.addEventListener("submit", addNote);

    // Render iniziale delle note
    renderNotes();

    console.log("Pagina delle note caricata con successo!");
});
