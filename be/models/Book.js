const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    chapters: { type: [String], default: [] },
    introduction: { type: String, default: '' },
    conclusion: { type: String, default: '' },
    content: { type: [String], default: [] },
    notes: { type: [String], default: [] },
});

module.exports = mongoose.model('Book', bookSchema,'BookModel');

