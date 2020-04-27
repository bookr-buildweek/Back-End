const server = require('../../server');
const request = require('supertest')(server);

describe('Authentication', () => {
  it('Users are able to sign up', () => {
    return request
      .post('/api/register')
      .send({
        first_name: 'Pamela',
        last_name: 'Robert',
        email: 'pamela@gmail.com',
        password: 'password'
      })
      .expect(201)
      .expect('Content-Type', /json/);
  });
  it('Users are able to login', async () => {
    return request
      .post('/api/register')
      .send({
        first_name: 'Pamela',
        last_name: 'Robert',
        email: 'pamela@gmail.com',
        password: 'password'
      })
      .then(res => {
        return request
          .post('/api/login')
          .send({
            email: 'pamela@gmail.com',
            password: 'password'
          })
          .expect(200);
      });
  });

  it('Gives error message when username or password is not inputed', () => {
    return request
      .post('/api/register')
      .send({
        first_name: 'Pamela',
        email: 'pamela@gmail.com'
      })
      .expect(422);
  });
});
