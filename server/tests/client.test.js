const request = require('supertest');
const app = require('../server');
const dbHandler = require('./db-handler');
const Client = require('../models/Client');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

jest.setTimeout(60000);

describe('Client API', () => {
  let token;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Legal Staff',
      email: 'staff@example.com',
      password: 'password123',
      role: 'Senior Lawyer'
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
  });

  it('should register a new client successfully', async () => {
    const mockClient = {
      name: 'John Doe',
      type: 'Individual',
      email: 'john@example.com',
      phone: '555-1234',
      address: '123 Law St'
    };

    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(mockClient);

    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual(mockClient.name);
    
    const client = await Client.findOne({ email: mockClient.email });
    expect(client).toBeTruthy();
  });

  it('should fail with invalid email', async () => {
    const res = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jane Smith',
        type: 'Individual',
        email: 'not-an-email',
        phone: '555-0000'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should add a communication log to a client', async () => {
    const client = await Client.create({
      name: 'Logged Client',
      type: 'Individual',
      email: 'log@example.com',
      phone: '555-9999'
    });

    const logEntry = {
      type: 'Email',
      summary: 'Follow up on case documents'
    };

    const res = await request(app)
      .post(`/api/clients/${client._id}/communication`)
      .set('Authorization', `Bearer ${token}`)
      .send(logEntry);

    expect(res.statusCode).toEqual(200);
    expect(res.body.communicationHistory.length).toEqual(1);
    expect(res.body.communicationHistory[0].summary).toEqual(logEntry.summary);
  });
});
