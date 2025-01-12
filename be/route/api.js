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
            grimorio: {} // Aggiunto Grimorio iniziale vuoto
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
    console.log('Richiesta ricevuta per l aggiornamento del libro:', req.body);

    try {
        const { title, introduction, chapters, conclusion, content, notes, grimorio } = req.body;

        const updatedFields = {};

        if (title) updatedFields.title = title;
        if (introduction) updatedFields.introduction = introduction;
        if (chapters) updatedFields.chapters = chapters;
        if (conclusion) updatedFields.conclusion = conclusion;
        if (content) updatedFields.content = content;
        if (notes) updatedFields.notes = notes;
        if (grimorio) updatedFields.grimorio = grimorio; // Gestione Grimorio

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ error: 'Libro non trovato.' });
        }

        console.log('Libro aggiornato:', updatedBook);
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error('Errore nell aggiornamento del libro:', error.message);
        res.status(500).json({ error: 'Errore nell aggiornamento del libro.' });
    }
});

router.delete('/books/:id', async (req, res) => {
    const { type, chapterIndex, subchapterIndex, noteIndex, category, elementIndex} = req.query; // Parametri dinamici

    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Libro non trovato.' });
        }

        switch (type) {
            case 'chapter': // Elimina un capitolo
                if (chapterIndex === undefined || !book.chapters[chapterIndex]) {
                    return res.status(400).json({ error: 'Capitolo non valido.' });
                }
                book.chapters.splice(chapterIndex, 1);
                break;

            case 'subchapter': // Elimina un sotto-capitolo
                if (
                    chapterIndex === undefined ||
                    subchapterIndex === undefined ||
                    !book.chapters[chapterIndex] ||
                    !book.chapters[chapterIndex].subchapters[subchapterIndex]
                ) {
                    return res.status(400).json({ error: 'Sotto-capitolo non valido.' });
                }
                book.chapters[chapterIndex].subchapters.splice(subchapterIndex, 1);
                break;

            case 'note': // Elimina una nota
                if (noteIndex === undefined || !book.notes[noteIndex]) {
                    return res.status(400).json({ error: 'Nota non valida.' });
                }
                book.notes.splice(noteIndex, 1);
                break;

            case 'grimorio': // Elimina un elemento del Grimorio
                if (
                    !category ||
                    !book.grimorio[category] ||
                    elementIndex === undefined ||
                    !book.grimorio[category][elementIndex]
                ) {
                    return res.status(400).json({ error: 'Elemento Grimorio non valido.' });
                }
                book.grimorio[category].splice(elementIndex, 1);
                if (book.grimorio[category].length === 0) {
                    delete book.grimorio[category];
                }
                break;    

            case 'book': // Elimina l'intero libro
                await Book.findByIdAndDelete(req.params.id);
                return res.json({ message: 'Libro eliminato con successo.' });

            default:
                return res.status(400).json({ error: 'Tipo di elemento non valido.' });
        }

        // Salva le modifiche al libro
        await book.save();
        res.json({ message: 'Elemento eliminato con successo.', book });
    } catch (error) {
        console.error('Errore durante l\'eliminazione:', error.message);
        res.status(500).json({ error: 'Errore durante l\'eliminazione.' });
    }
});


// Endpoint per la rilegatura del libro
router.get('/books/:id/full', async (req, res) => {
    try {
        console.log("Il router è stato raggiunto correttamente.");
        console.log(`Inizio generazione del libro con ID: ${req.params.id}`);

        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Libro non trovato.' });
        }

        console.log("Dati libro recuperati:", book);

        // Converti il grimorio in un oggetto semplice
        const grimorio = {};
        if (book.grimorio) {
            book.grimorio.forEach((value, key) => {
                grimorio[key] = value;
            });
        }

        // Genera l'HTML per il libro
        const generateHTML = (book, grimorio) => {
            try {
                return `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${book.title}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .page { page-break-after: always; }
                            .cover { text-align: center; background-color: #f4f4f4; padding: 50px; }
                            .chapter { margin-bottom: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="cover">
                            <h1>${book.title}</h1>
                            <p>${book.introduction || 'Nessuna introduzione disponibile.'}</p>
                        </div>
                        <div class="page">
                            <h2>Indice</h2>
                            <ul>
                                ${book.chapters.map((chapter, index) => `<li>Capitolo ${index + 1}: ${chapter.title}</li>`).join('')}
                            </ul>
                        </div>
                        ${book.chapters.map((chapter, index) => `
                            <div class="page chapter">
                                <h2>Capitolo ${index + 1}: ${chapter.title}</h2>
                                <p>${chapter.content || 'Nessun contenuto'}</p>
                                ${chapter.subchapters.map((sub, subIndex) => `
                                    <h3>Sottocapitolo ${index + 1}.${subIndex + 1}: ${sub.title}</h3>
                                    <p>${sub.content || 'Nessun contenuto'}</p>
                                `).join('')}
                            </div>
                        `).join('')}
                        <div class="page">
                            <h2>Note</h2>
                            <ul>
                                ${book.notes.map(note => `<li>${note}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="page">
                            <h2>Grimorio</h2>
                            ${Object.keys(grimorio).map(category => `
                                <h3>${category}</h3>
                                ${(Array.isArray(grimorio[category]) ? grimorio[category] : [])
                                    .map(item => `
                                        <div>
                                            <h4>${item.title}</h4>
                                            <p>${item.description || 'Nessuna descrizione'}</p>
                                            ${item.image ? `<img src="${item.image}" alt="${item.title}" style="max-width: 100%;">` : ''}
                                        </div>
                                    `).join('')}
                            `).join('')}
                        </div>
                    </body>
                    </html>
                `;
            } catch (templateError) {
                console.error('Errore durante la generazione del contenuto HTML:', templateError.message);
                throw new Error('Errore nella generazione del contenuto HTML.');
            }
        };

        const htmlContent = generateHTML(book, grimorio);
        res.setHeader('Content-Disposition', 'attachment; filename="book.html"');
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    } catch (error) {
        console.error('Errore nella generazione del libro completo:', error.message);
        res.status(500).json({ error: 'Errore nella generazione del libro completo.' });
    }
});





module.exports = router;


