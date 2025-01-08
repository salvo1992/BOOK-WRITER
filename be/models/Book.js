const mongoose = require('mongoose');

const subchapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' } // Aggiungi content ai sotto-capitoli
});

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' }, // Aggiungi content ai capitoli
    subchapters: [subchapterSchema] // Array di sotto-capitoli
});

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    introduction: { type: String, default: '' },
    conclusion: { type: String, default: '' },
    chapters: [chapterSchema], // Array di capitoli
    content: { type: [String], default: [] },
    notes: { type: [String], default: [] }
});

module.exports = mongoose.model('Book', bookSchema,'BookModel');

