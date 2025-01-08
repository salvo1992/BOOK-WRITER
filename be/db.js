// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connesso con successo!');
    } catch (error) {
        console.error('Errore nella connessione a MongoDB:', error.message);
        process.exit(1); // Termina il processo in caso di errore
    }
};

module.exports = connectDB;
