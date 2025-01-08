// common.js - Funzioni comuni per l'applicazione

/**
 * Recupera i dati dalla memoria locale
 * @param {string} key - La chiave dei dati da recuperare
 * @returns {any} - I dati recuperati o null se non esistono
 */
function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || null;
}

/**
 * Salva i dati nella memoria locale
 * @param {string} key - La chiave per identificare i dati
 * @param {any} value - I dati da salvare
 */
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Elimina i dati dalla memoria locale
 * @param {string} key - La chiave dei dati da eliminare
 */
function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

/**
 * Recupera l'indice del libro corrente
 * @returns {number|null} - L'indice del libro corrente o null
 */
function getCurrentBookIndex() {
    return localStorage.getItem("currentBookIndex") !== null
        ? parseInt(localStorage.getItem("currentBookIndex"), 10)
        : null;
}

/**
 * Imposta l'indice del libro corrente
 * @param {number} index - L'indice del libro da impostare
 */
function setCurrentBookIndex(index) {
    localStorage.setItem("currentBookIndex", index);
}

/**
 * Recupera i libri salvati
 * @returns {Array} - Un array di libri salvati
 */
function getBooks() {
    return getFromLocalStorage("books") || [];
}

/**
 * Salva l'array dei libri
 * @param {Array} books - L'array dei libri da salvare
 */
function saveBooks(books) {
    saveToLocalStorage("books", books);
}

/**
 * Funzione per avviare il download di un file
 * @param {string} url - L'URL del file da scaricare
 * @param {string} filename - Il nome del file da salvare
 */
function downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

console.log("Script comune caricato con successo!");
