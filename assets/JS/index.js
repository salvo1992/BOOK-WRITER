// index.js - Funzioni iniziali dell'app

document.addEventListener("DOMContentLoaded", () => {
    console.log("Applicazione inizializzata.");

    // Esempio di funzione iniziale per configurare l'app
    function initializeApp() {
        console.log("App configurata correttamente.");

        // Caricamento dinamico del messaggio di benvenuto
        const welcomeMessage = document.getElementById("welcome-message");
        if (welcomeMessage) {
            const userName = localStorage.getItem("userName") || "Ospite";
            welcomeMessage.textContent = `Benvenuto, ${userName}!`;
        } else {
            console.warn("Elemento welcome-message non trovato nel DOM.");
        }

        // Verifica della connessione al server (esempio)
        checkServerConnection();
    }

    // Funzione per verificare la connessione al server
    async function checkServerConnection() {
        try {
            const response = await fetch("/api/ping");
            if (response.ok) {
                console.log("Connessione al server riuscita.");
            } else {
                console.error("Errore nella connessione al server.");
            }
        } catch (error) {
            console.error("Errore nella connessione al server:", error);
        }
    }

    initializeApp();
});
