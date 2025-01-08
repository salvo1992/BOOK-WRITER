const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = express.Router();
const Book = require('../models/Book');



// Rotte API
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero dei libri.' });
    }
});

router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Libro non trovato.' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero del libro.' });
    }
});

router.post('/books', async (req, res) => {
    console.log('Richiesta ricevuta per la creazione del libro:', req.body);

    try {
        if (!req.body.title) {
            return res.status(400).json({ error: 'Il titolo è obbligatorio.' });
        }

        const newBook = new Book({
            title: req.body.title,
            chapters: [],
            introduction: '',
            conclusion: '',
            content: [],
            notes: [],
        });

        const savedBook = await newBook.save();
        console.log('Libro salvato nel database:', savedBook);

        res.status(201).json(savedBook);
    } catch (error) {
        console.error('Errore nella creazione del libro:', error.message);
        res.status(500).json({ error: 'Errore nella creazione del libro.' });
    }
});


router.put('/books/:id', async (req, res) => {
    console.log('Richiesta ricevuta per la creazione del libro:', req.body);

    try {
        
     

        const newBook = new Book({
            title: req.body.title,
            chapters: [],
            introduction: '',
            conclusion: '',
            content: [],
            notes: [],
        });

        const savedBook = await newBook.save();
        console.log('Libro salvato nel database:', savedBook);

        res.status(201).json(savedBook);
    } catch (error) {
        console.error('Errore nella creazione del libro:', error.message);
        res.status(500).json({ error: 'Errore nella creazione del libro.' });
    }
});




router.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: 'Errore nell\'aggiornamento del libro.' });
    }
});

router.delete('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Libro eliminato con successo.' });
    } catch (error) {
        res.status(500).json({ error: 'Errore nell\'eliminazione del libro.' });
    }
});

// Endpoint per la rilegatura del libro
router.get('/books/:id/full', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Libro non trovato.' });
        }

        const bookContent = `
            <html>
            <head>
                <title>${book.title}</title>
            </head>
            <body>
                <h1>${book.title}</h1>
                <h2>Introduzione</h2>
                <p>${book.introduction || 'Nessuna introduzione'}</p>
                <h2>Capitoli</h2>
                ${book.chapters.map((chapter, index) => `<h3>Capitolo ${index + 1}: ${chapter}</h3><p>${book.content[index] || ''}</p>`).join('')}
                <h2>Conclusione</h2>
                <p>${book.conclusion || 'Nessuna conclusione'}</p>
                <h2>Note</h2>
                <ul>
                    ${book.notes.map(note => `<li>${note}</li>`).join('')}
                </ul>
            </body>
            </html>
        `;

        res.setHeader('Content-Disposition', 'attachment; filename="book.html"');
        res.setHeader('Content-Type', 'text/html');
        res.send(bookContent);
    } catch (error) {
        res.status(500).json({ error: 'Errore nella generazione del libro completo.' });
    }
});

module.exports = router;

