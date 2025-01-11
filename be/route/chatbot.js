const express = require("express");

const router = express.Router();

router.post("/chatbot", async (req, res) => {
    const { prompt } = req.body; // Estrarre il messaggio dell'utente dal corpo della richiesta

    if (!prompt) {
        return res.status(400).json({ error: "Il prompt è obbligatorio." });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // Legge la chiave dal file .env
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Specifica il modello
                messages: [{ role: "user", content: prompt }], // Invia il messaggio
                max_tokens: 200, // Numero massimo di token nella risposta
                temperature: 0.7, // Controlla la creatività della risposta
            }),
        });

        const data = await response.json();

        if (response.ok) {
            res.json(data); // Rispondi con i dati ricevuti da OpenAI
        } else {
            console.error("Errore dall'API di OpenAI:", data);
            res.status(500).json({ error: "Errore dall'API di OpenAI", details: data });
        }
    } catch (error) {
        console.error("Errore durante la richiesta al chatbot:", error.message);
        res.status(500).json({ error: "Errore durante la richiesta al chatbot." });
    }
});

module.exports = router;
