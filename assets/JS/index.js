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

        // Configurazione chatbot button
        const chatbotButton = document.getElementById("chatbot");
        if (chatbotButton) {
            chatbotButton.addEventListener("click", () => {
                window.location.href = "chatbot.html";
            });
        }

        // Configura il pulsante per iniziare un nuovo libro
        const startBookButton = document.getElementById("start-book");
        if (startBookButton) {
            startBookButton.addEventListener("click", () => {
                window.location.href = "books.html";
            });
        }

        // Configura il pulsante per accedere all'account
        const accountButton = document.getElementById("account");
        if (accountButton) {
            accountButton.addEventListener("click", () => {
                alert("Funzione account in arrivo!");
            });
        }

        // Configura il pulsante per feedback
        const feedbackButton = document.getElementById("feedback");
        if (feedbackButton) {
            feedbackButton.addEventListener("click", () => {
                alert("Grazie per il tuo feedback! Questa funzione sarà presto implementata.");
            });
        }
    }

    initializeApp();
});
