const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Client = require('../models/Client');

describe('Tests d\'authentification', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/medicaments_test_db');
  });

  afterAll(async () => {
    await Client.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Client.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('devrait créer un nouveau client', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123!',
          clientType: 'Client'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Inscription réussie');
      expect(response.body.client).toHaveProperty('email', 'test@example.com');
    });

    it('ne devrait pas créer un client avec un email existant', async () => {
      const clientData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!'
      };

      await request(app)
        .post('/api/auth/register')
        .send(clientData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(clientData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('déjà utilisé');
    });

    it('devrait valider les champs obligatoires', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const client = new Client({
        username: 'testuser',
        email: 'test@example.com',
        clientType: 'Client'
      });
      await client.setPassword('Password123!');
      await client.save();
    });

    it('devrait connecter un client avec des identifiants valides', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('Connexion réussie');
    });

    it('ne devrait pas connecter avec un mot de passe incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
    });

    it('ne devrait pas connecter avec un email inexistant', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('devrait déconnecter un client', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Déconnexion réussie');
    });
  });
});