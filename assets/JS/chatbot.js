document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const chatOutput = document.getElementById("chat-output");

    // Funzione per inviare una richiesta all'API del backend
    async function fetchChatResponse(prompt) {
        try {
            const response = await fetch("https://book-writer.onrender.com/chatbot", {
                method: "POST",
                authorizer: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // Legge la chiave dal file .env
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
        }});

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Errore nell'API: ${data.error || "Errore sconosciuto"}`);
            }

            return data.choices[0].message.content; // Estrai il contenuto della risposta
        } catch (error) {
            console.error("Errore durante la richiesta al chatbot:", error.message);
            throw error;
        }
    }

    // Gestione dell'invio del messaggio
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim();

        if (userMessage === "") {
            return;
        }

        // Mostra il messaggio dell'utente
        const userMessageElement = document.createElement("div");
        userMessageElement.className = "message user-message";
        userMessageElement.textContent = userMessage;
        chatOutput.appendChild(userMessageElement);

        // Pulisce l'input dell'utente
        userInput.value = "";

        // Mostra una risposta di caricamento
        const loadingMessageElement = document.createElement("div");
        loadingMessageElement.className = "message loading-message";
        loadingMessageElement.textContent = "Il chatbot sta rispondendo...";
        chatOutput.appendChild(loadingMessageElement);

        try {
            // Ottieni la risposta dal backend
            const chatbotResponse = await fetchChatResponse(userMessage);

            // Rimuovi il messaggio di caricamento
            chatOutput.removeChild(loadingMessageElement);

            // Mostra la risposta del chatbot
            const botMessageElement = document.createElement("div");
            botMessageElement.className = "message bot-message";
            botMessageElement.textContent = chatbotResponse;
            chatOutput.appendChild(botMessageElement);
        } catch (error) {
            // Rimuovi il messaggio di caricamento
            chatOutput.removeChild(loadingMessageElement);

            // Mostra un messaggio di errore
            const errorMessageElement = document.createElement("div");
            errorMessageElement.className = "message error-message";
            errorMessageElement.textContent = "Errore: Impossibile contattare il chatbot.";
            chatOutput.appendChild(errorMessageElement);
        }

        // Scorri verso il basso
        chatOutput.scrollTop = chatOutput.scrollHeight;
    });
});
