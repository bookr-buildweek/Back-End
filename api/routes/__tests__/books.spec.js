require('dotenv').config();

const server = require('../../server');
const request = require('supertest')(server);
let token;
let bookId;

beforeAll((done) => {
  request
    .post('/api/register')
    .send({
      first_name: 'Bob',
      last_name: 'Robert',
      email: 'bob@gmail.com',
      password: 'password',
    })
    .then((res) => {
      request
        .post('/api/login')
        .send({
          email: 'bob@gmail.com',
          password: 'password',
        })
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 1000)); // avoid jest open handle error
});

describe('Books auth and addition', () => {
  it('Should require authorization', () => {
    return request.get('/api/books').expect(401);
  });

  it('Should return an array of books when header is set with token', () => {
    return request.get('/api/books').set('Authorization', token).expect(200);
  });

  it('Should post a book when header is set with token', () => {
    return request
      .post('/api/books')
      .set('Authorization', token)
      .send({
        isbn: 9780521296489,
        title: 'Philosophy of Mathematics',
        subtitle: 'Selected Readings',
        author: 'Paul Benacerraf & Hilary Putnam',
        published: '1983',
        publisher: 'Cambridge University Press',
        description:
          "The twentieth century has witnessed an unprecedented crisis in the foundations of mathematics, featuring a world-famous paradox (Russell's Paradox), a challenge to 'classical' mathematics from a world-famous mathematician (the 'mathematical intuitionism' of Brouwer), a new foundational school (Hilbert's Formalism), and the profound incompleteness results of Kurt Gödel.",
        url:
          'http://books.google.com/books/content?id=JjQrpYswtYEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        category: 'Mathematics',
      })
      .expect(201)
      .then((res) => {
        bookId = res.body.id;
      });
  });
});

describe('Books id check', () => {
  it('Should return an object of an individual book when the id is passed in the url', () => {
    return request
      .get(`/api/books/${bookId}`)
      .set('Authorization', token)
      .expect(200);
  });

  it('Should return an error if the book is not available', () => {
    return request
      .get('/api/books/1000')
      .set('Authorization', token)
      .expect(404);
  });

  it('Users are add a book to shelf', () => {
    return request
      .post(`/api/books/${bookId}/shelf`)
      .send({
        user_id: 1,
      })
      .set('Authorization', token)
      .expect(201)
      .expect('Content-Type', /json/);
  });

  it('Should delete the book with that id', () => {
    return request
      .delete(`/api/books/${bookId}`)
      .set('Authorization', token)
      .expect(200);
  });
});
