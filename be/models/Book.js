const mongoose = require('mongoose');

const subchapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' }
});

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    subchapters: [subchapterSchema]
});

const grimorioElementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' }
});

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    introduction: { type: String, default: '' },
    conclusion: { type: String, default: '' },
    chapters: [chapterSchema],
    content: { type: [String], default: [] },
    notes: { type: [String], default: [] },
    grimorio: { 
        type: Map, 
        of: [grimorioElementSchema], 
        default: () => new Map() 
    }
});

module.exports = mongoose.model('Book', bookSchema, 'BookModel');

