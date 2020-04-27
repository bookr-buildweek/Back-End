const Books = require('../../models/books');
const Shelf = require('../../models/shelf');
const ratingsAverage = require('../../lib/findReviewAverage');

module.exports = {
  getBooks: async (req, res) => {
    try {
      const books = await Books.getAllBooks();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getBook: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Books.findBookBy(id);
      if (book) {
        const reviews = await Books.getBookReviews(id);
        book.averageRatings = ratingsAverage(reviews);
        book.reviews = reviews;
      } else {
        res.status(404).json({ error: 'This book does not exist' });
      }
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  addNewBook: async (req, res) => {
    try {
      const [newBook] = await Books.addBook(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  deleteBookById: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Books.findBookBy(id);
      if (book) {
        const delBook = await Books.deleteBook(id);
        res.status(200).json({ deletedBook: delBook });
      } else {
        res.status(404).json('This book does not exist');
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  saveBooktoShelf: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.body;
      const book = await Books.findBookBy(id);

      if (book) {
        const userShelf = await Shelf.getUserShelf(user_id);

        const bookExists = userShelf.filter(
          book => book.book_id === Number(id)
        );
        if (bookExists.length > 0) {
          res.status(422).json('You have already have this book in your shelf');
        } else {
          const [savedBook] = await Shelf.addBookToShelf({
            user_id: Number(user_id),
            book_id: Number(id)
          });
          res.status(201).json({ savedBook, message: 'Book saved to library' });
        }
      } else {
        res.status(404).json({ error: 'Book not available' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteBookFromShelf: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Shelf.findBookFromShelf(id);
      if (book) {
        const [delBook] = await Shelf.deleteBookFromShelf(id);
        res.status(200).json({ deletedBook: delBook });
      } else {
        res.status(404).json('This book does not exist in your shelf.');
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};
