require('dotenv').config();

const server = require('../../server');
const request = require('supertest')(server);
let id;
let token;
let bookID;
const book = {
  isbn: 9781439835982,
  title: 'Concise Introduction to Pure Mathematics',
  subtitle: 'Third Edition',
  author: 'Martin Liebeck',
  published: '2010',
  publisher: 'CRC Press',
  description:
    'Accessible to all students with a sound background in high school mathematics, A Concise Introduction to Pure Mathematics, Third Edition presents some of the most fundamental and beautiful ideas in pure mathematics. It covers not only standard material but also many interesting topics not usually encountered at this level, such as the theory of solving cubic equations, the use of Euler’s formula to study the five Platonic solids, the use of prime numbers to encode and decode secret information, and the theory of how to compare the sizes of two infinite sets.',
  url:
    'http://books.google.com/books/content?id=JjQrpYswtYEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  category: 'Mathematics',
};

beforeAll((done) => {
  request
    .post('/api/register')
    .send({
      first_name: 'Jane',
      last_name: 'Robert',
      email: 'jane@gmail.com',
      password: 'password',
    })
    .then(() => {
      request
        .post('/api/login')
        .send({
          email: 'jane@gmail.com',
          password: 'password',
        })
        .end((err, res) => {
          id = res.body.user.id;
          token = res.body.token;
          done();
        });
    });
});

describe('Reviews auth check and addition', () => {
  it('Should require authorization', () => {
    return request.get(`/api/user/${id}/reviews`).expect(401);
  });
  it('Should return an array of user reviews when header is set with token', () => {
    return request
      .post('/api/books')
      .set('Authorization', token)
      .send(book)
      .then((res) => {
        bookID = res.body.id;
        return request
          .post(`/api/books/${bookID}/review`)
          .set('Authorization', token)
          .send({
            review: 'Awesome read!',
            reviewer: id,
            ratings: 5,
          });
      })
      .then(() => {
        return request
          .get(`/api/user/${id}/reviews`)
          .set('Authorization', token)
          .expect(200);
      });
  });
});

describe('Reviews id check', () => {
  it('Should return an object of review when user post a review', () => {
    return request
      .post(`/api/user/${id}/reviews`)
      .set('Authorization', token)
      .send({
        review: 'Awesome read!',
        reviewer: id,
        ratings: 5,
      })
      .expect(200);
  });

  it('Should return an object of review when user gets a review by ID', () => {
    return request
      .get('/api/reviews/1')
      .set('Authorization', token)
      .expect(200);
  });

  it('Should return an error if the review does not exist', () => {
    return request
      .get('/api/reviews/1000')
      .set('Authorization', token)
      .expect(404);
  });

  it('Should return an object of review when user edits a review', () => {
    return request
      .put('/api/reviews/1')
      .set('Authorization', token)
      .send({
        review: 'Awesome read! Really understood the subject',
        reviewer: id,
        ratings: 5,
      })
      .expect(200);
  });

  it('Should return an object of deleted review when user deletes a review', () => {
    return request
      .delete('/api/reviews/1')
      .set('Authorization', token)
      .expect(200);
  });
});
