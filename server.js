const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const dbUser = process.env.MONGO_USER || 'yourMongoUser';
const dbPass = process.env.MONGO_PASS || 'yourMongoPass';
const dbHost = process.env.MONGO_HOST || 'mongo-svc'; 
const dbName = 'testdb';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = `mongodb://admin:password@mongo-svc:27017/testdb?authSource=admin`;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
});

const Book = mongoose.model('Book', bookSchema);
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (err) {
    res.status(400).send('Invalid ID');
  }
});

app.post('/books', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
});

app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).send('Book not found');
    res.json(updatedBook);
  } catch (err) {
    res.status(400).send('Invalid ID');
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).send('Book not found');
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(400).send('Invalid ID');
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
