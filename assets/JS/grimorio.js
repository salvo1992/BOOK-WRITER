// grimorio.js - Gestione dinamica del Grimorio

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'https://book-writer.onrender.com'; // URL del backend
    const currentBookTitle = document.getElementById('current-book-title');
    const categoryList = document.getElementById('category-list');
    const elementsList = document.getElementById('elements-list');
    const selectedCategoryTitle = document.getElementById('selected-category');
    const addCategoryButton = document.getElementById('add-category');
    const addElementButton = document.getElementById('add-element');

    const currentBookId = localStorage.getItem("currentBookId");

    if (!currentBookId) {
        console.error("Nessun libro selezionato. Ritorno alla pagina iniziale.");
        alert("Nessun libro selezionato. Torna alla pagina iniziale.");
        window.location.href = "books.html";
        return;
    }

    let grimorioData = null;

    // Recupera i dettagli del libro selezionato
    async function fetchBook() {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${currentBookId}`);
            if (!response.ok) {
                throw new Error('Errore nel recupero del libro.');
            }
            const bookData = await response.json();
            grimorioData = bookData.grimorio || {};

            if (currentBookTitle) {
                currentBookTitle.textContent = bookData.title;
            }

            renderCategories();
        } catch (error) {
            console.error("Errore durante il recupero del libro:", error.message);
        }
    }

    // Salva il Grimorio nel backend
    async function saveGrimorio() {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${currentBookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ grimorio: grimorioData }),
            });

            if (!response.ok) {
                throw new Error('Errore nel salvataggio del Grimorio.');
            }

            console.log("Grimorio salvato con successo!");
        } catch (error) {
            console.error("Errore durante il salvataggio del Grimorio:", error.message);
        }
    }

    // Rendi le categorie nel menu
    function renderCategories() {
        categoryList.innerHTML = '';

        Object.keys(grimorioData).forEach(category => {
            const li = document.createElement('li');
            li.className = 'category-item';
            li.dataset.category = category;
            li.textContent = category;

            li.addEventListener('click', () => {
                renderElements(category);
            });

            categoryList.appendChild(li);
        });
    }

    // Rendi gli elementi della categoria selezionata
    function renderElements(category) {
        selectedCategoryTitle.textContent = category;
        elementsList.innerHTML = '';
        addElementButton.style.display = 'block';

        if (!grimorioData[category]) {
            grimorioData[category] = [];
        }

        grimorioData[category].forEach((element, index) => {
            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.src = element.image || 'assets/images/placeholder.png';
            img.alt = element.title || 'Immagine';
            card.appendChild(img);

            const title = document.createElement('div');
            title.className = 'card-title';
            title.textContent = element.title || 'Senza titolo';
            card.appendChild(title);

            const description = document.createElement('div');
            description.className = 'card-description';
            description.textContent = element.description || 'Nessuna descrizione';
            card.appendChild(description);

            const actions = document.createElement('div');
            actions.className = 'card-actions';

            const editButton = document.createElement('button');
            editButton.textContent = 'Modifica';
            editButton.addEventListener('click', () => editElement(category, index));
            actions.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Elimina';
            deleteButton.addEventListener('click', () => deleteElement(category, index));
            actions.appendChild(deleteButton);

            card.appendChild(actions);
            elementsList.appendChild(card);
        });
    }

    // Aggiungi una nuova categoria
    addCategoryButton.addEventListener('click', () => {
        const newCategory = prompt("Inserisci il nome della nuova categoria:");
        if (newCategory && !grimorioData[newCategory]) {
            grimorioData[newCategory] = [];
            renderCategories();
            saveGrimorio();
        } else {
            alert("Categoria già esistente o nome non valido.");
        }
    });

    // Aggiungi un nuovo elemento
    addElementButton.addEventListener('click', () => {
        const category = selectedCategoryTitle.textContent;
        if (!category || !grimorioData[category]) {
            alert("Seleziona una categoria valida.");
            return;
        }

        const title = prompt("Inserisci il titolo dell'elemento:");
        const description = prompt("Inserisci la descrizione dell'elemento:");
        const image = prompt("Inserisci l'URL dell'immagine (opzionale):");

        if (title) {
            grimorioData[category].push({ title, description, image });
            renderElements(category);
            saveGrimorio();
        } else {
            alert("Il titolo è obbligatorio.");
        }
    });

    // Modifica un elemento
    function editElement(category, index) {
        const element = grimorioData[category][index];
        const newTitle = prompt("Modifica il titolo:", element.title);
        const newDescription = prompt("Modifica la descrizione:", element.description);
        const newImage = prompt("Modifica l'URL dell'immagine:", element.image);

        if (newTitle) {
            grimorioData[category][index] = {
                title: newTitle,
                description: newDescription,
                image: newImage
            };
            renderElements(category);
            saveGrimorio();
        } else {
            alert("Il titolo non può essere vuoto.");
        }
    }

    // Elimina un elemento
    function deleteElement(category, index) {
        if (confirm("Sei sicuro di voler eliminare questo elemento?")) {
            grimorioData[category].splice(index, 1);
            renderElements(category);
            saveGrimorio();
        }
    }

    // Inizializza la pagina
    fetchBook();
});
