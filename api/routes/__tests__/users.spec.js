require('dotenv').config();

const server = require('../../server');
const request = require('supertest')(server);
let token;
let id;

beforeAll((done) => {
  request
  .post('/api/register')
  .send({
    first_name: 'Mark',
    last_name: 'Rob',
    email: 'mark@gmail.com',
    password: 'password',
  })
  .then(() => {
    request
    .post('/api/login')
    .send({
      email: 'mark@gmail.com',
      password: 'password',
    })
    .end((err, res) => {
      id = res.body.user.id;
      token = res.body.token;
      done();
    });
  });
});

describe('Users', () => {
  it('Should require authorization', () => {
    return request.get(`/api/users/${id}`).expect(401);
  });

  it('Should return an object of a user when the id is passed in the url', (done) => {
    return request
      .get(`/api/users/${id}`)
      .set('Authorization', token)
      .expect(200, done);
  });

  xit('Should return an array of a user books on shelf when the id is passed in the url', () => {
    return request
      .get(`/api/users/${id}/shelf`)
      .set('Authorization', token)
      .expect(200);
  });
});

