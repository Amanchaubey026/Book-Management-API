const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const Book = require('../models/book.schema');
const { body, validationResult } = require('express-validator');
const bookRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API endpoints for managing books
 */

bookRouter.use(auth);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */
bookRouter.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /books/author/{author}:
 *   get:
 *     summary: Retrieve books by author
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: author
 *         required: true
 *         description: Author's name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of books by author
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */
bookRouter.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const books = await Book.find({ author });
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /books/publicationYear/{publicationYear}:
 *   get:
 *     summary: Retrieve books by publication year
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: publicationYear
 *         required: true
 *         description: Publication year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of books published in the given year
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */
bookRouter.get('/publicationYear/:publicationYear', async (req, res) => {
  try {
    const publicationYear = req.params.publicationYear;
    const books = await Book.find({ publicationYear });
    res.status(200).send(books);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
bookRouter.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('publicationYear').isInt().withMessage('Publication year must be a valid integer'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  const { title, author, publicationYear } = req.body;
  try {
    const newBook = new Book({ title, author, publicationYear });
    await newBook.save();
    res.status(201).send(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
bookRouter.put('/:id', [
  body('title').optional().notEmpty().withMessage('Title is required'),
  body('author').optional().notEmpty().withMessage('Author is required'),
  body('publicationYear').optional().isInt().withMessage('Publication year must be a valid integer'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  const { title, author, publicationYear } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, publicationYear },
      { new: true }
    );
    res.status(200).send(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       500:
 *         description: Internal server error
 */
bookRouter.delete('/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = bookRouter;
