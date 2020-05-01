exports.up = function(knex) {
  return knex.schema
    .createTable('books', book => {
      book.increments();
      book
        .bigInteger('isbn')
        .unique()
        .unsigned()
        .notNullable();
      book.string('title').notNullable();
      book.string('subtitle');
      book.string('author').notNullable();
      book.string('publisher').notNullable();
      book.string('published').notNullable();
      book.text('description').notNullable();
      book.string('url').notNullable();
      book.string('category');
    })
    .createTable('reviews', review => {
      review.increments();
      review
        .integer('reviewer')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      review
        .integer('ratings')
        .unsigned()
        .notNullable();
      review.text('review').notNullable();
      review
        .integer('book_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('books')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('shelf', shelf => {
      shelf.increments();
      shelf
        .integer('book_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('books')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      shelf
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('shelf')
    .dropTableIfExists('reviews')
    .dropTableIfExists('books');
};
