const db = require('../database/dbConfig');

module.exports = {
  addBookToShelf: book => {
    return db('shelf')
      .insert(book)
      .returning('*');
  },
  getUserShelf: id => {
    return db
      .select('*')
      .from('books')
      .where('shelf.user_id', id)
      .innerJoin('shelf', 'books.id', 'shelf.book_id');
  },
  findBookFromShelf: id => {
    return db('shelf')
      .where({ id })
      .first();
  },
  deleteBookFromShelf: id => {
    return db('shelf')
      .where({ id })
      .del()
      .returning('*');
  }
};
