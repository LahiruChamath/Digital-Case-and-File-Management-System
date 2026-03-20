const request = require('supertest');
const app = require('../server');
const dbHandler = require('./db-handler');
const Case = require('../models/Case');
const User = require('../models/User');
const Client = require('../models/Client');
const jwt = require('jsonwebtoken');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

jest.setTimeout(60000);

describe('Case API', () => {
  let token;
  let client;

  beforeEach(async () => {
    // Create admin user for token
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Attorney'
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');

    // Create a mock client
    client = await Client.create({
      name: 'Test Client',
      type: 'Individual',
      email: 'client-' + Date.now() + '@example.com',
      phone: '1234567890'
    });
  });

  it('should create a new case successfully', async () => {
    const mockCase = {
      title: 'New Investigation',
      caseNumber: 'CASE-' + Date.now(),
      client: client._id.toString(),
      type: 'Litigation',
      status: 'Active',
      description: 'Test description'
    };

    const res = await request(app)
      .post('/api/cases')
      .set('Authorization', `Bearer ${token}`)
      .send(mockCase);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toEqual(mockCase.title);
    
    const count = await Case.countDocuments();
    expect(count).toEqual(1);
  });

  it('should fail to create a case with missing title (validation check)', async () => {
    const res = await request(app)
      .post('/api/cases')
      .set('Authorization', `Bearer ${token}`)
      .send({
        client: client._id.toString(),
        type: 'Litigation'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0].msg).toEqual('Case title is required');
  });

  it('should fail to create a case with invalid client ID', async () => {
    const res = await request(app)
      .post('/api/cases')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Bad Case',
        client: '123', // Invalid MongoID
        type: 'Criminal'
      });

    expect(res.statusCode).toEqual(400);
  });

  it('should fail without authorization', async () => {
    const res = await request(app).post('/api/cases').send({});
    expect(res.statusCode).toEqual(401);
  });
});
