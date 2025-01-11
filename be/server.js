const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoute = require('./route/api');

const chatbotRoute = require('./route/chatbot');
// Configurazione dell'ambiente
dotenv.config();
// Porta del server
const PORT = 5500;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connessione al database
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connesso al database MongoDB');
    } catch (error) {
        console.error('Errore nella connessione al database:', error.message);
        process.exit(1); // Termina il processo in caso di errore critico
    }
})();

app.use('/', apiRoute);
app.use('/', chatbotRoute);



app.listen(PORT, () => {
    console.log(`Server avviato sulla porta ${PORT}`);
});
