const request = require('supertest');
const app = require('../server');
const dbHandler = require('./db-handler');
const User = require('../models/User');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

jest.setTimeout(60000);

describe('Auth API', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'Senior Lawyer'
  };

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(mockUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    
    const user = await User.findOne({ email: mockUser.email });
    expect(user).toBeTruthy();
    expect(user.name).toEqual(mockUser.name);
  });

  it('should fail registration with invalid data (short password)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...mockUser, password: '123' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should login an existing user', async () => {
    // Manually create user (or use register if testing integration)
    await request(app).post('/api/auth/register').send(mockUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: mockUser.email,
        password: mockUser.password
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with incorrect password', async () => {
    await request(app).post('/api/auth/register').send(mockUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: mockUser.email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
  });
});
