const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Client = require('../models/Client');
const Product = require('../models/Product');
const ShoppingList = require('../models/ShoppingList');

describe('Tests Liste d\'achat', () => {
  let token;
  let clientId;
  let productId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/medicaments_test_db');
    
    // Créer un client test
    const client = new Client({
      username: 'testclient',
      email: 'client@test.com',
      clientType: 'Client'
    });
    await client.setPassword('Password123!');
    await client.save();
    clientId = client._id;

    // Générer un token
    token = jwt.sign(
      { id: client._id, email: client.email },
      process.env.JWT_SECRET || 'votre_secret_jwt',
      { expiresIn: '24h' }
    );

    // Créer un produit test
    const product = await Product.create({
      code: 'MED001',
      nom: 'Paracétamol',
      description: 'Anti-douleur',
      prixUnitaire: 5.50,
      categorieId: 1,
      actif: true
    });
    productId = product._id;
  });

  afterAll(async () => {
    await Client.deleteMany({});
    await Product.deleteMany({});
    await ShoppingList.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await ShoppingList.deleteMany({});
  });

  describe('POST /api/shopping-lists', () => {
    it('devrait créer une nouvelle liste d\'achat', async () => {
      const response = await request(app)
        .post('/api/shopping-lists')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Liste d\'achat créée');
      expect(response.body.list).toHaveProperty('status', 'draft');
    });

    it('ne devrait pas créer une liste sans authentification', async () => {
      const response = await request(app)
        .post('/api/shopping-lists');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/shopping-lists', () => {
    it('devrait récupérer toutes les listes du client', async () => {
      await ShoppingList.createList(clientId);
      await ShoppingList.createList(clientId);

      const response = await request(app)
        .get('/api/shopping-lists')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('POST /api/shopping-lists/:id/items', () => {
    let listId;

    beforeEach(async () => {
      const list = await ShoppingList.createList(clientId);
      listId = list._id;
    });

    it('devrait ajouter un médicament à la liste', async () => {
      const response = await request(app)
        .post(`/api/shopping-lists/${listId}/items`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: productId,
          quantity: 2
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Médicament ajouté à la liste');
      expect(response.body.list.items.length).toBe(1);
      expect(response.body.total).toBeGreaterThan(0);
    });

    it('ne devrait pas ajouter sans productId', async () => {
      const response = await request(app)
        .post(`/api/shopping-lists/${listId}/items`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantity: 2
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/shopping-lists/:id/items/:itemId', () => {
    let listId;
    let itemId;

    beforeEach(async () => {
      const list = await ShoppingList.createList(clientId);
      await list.addItem(productId, 2);
      listId = list._id;
      itemId = list.items[0]._id;
    });

    it('devrait supprimer un médicament de la liste', async () => {
      const response = await request(app)
        .delete(`/api/shopping-lists/${listId}/items/${itemId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Médicament retiré de la liste');
      expect(response.body.list.items.length).toBe(0);
    });
  });

  describe('PATCH /api/shopping-lists/:id/status', () => {
    let listId;

    beforeEach(async () => {
      const list = await ShoppingList.createList(clientId);
      listId = list._id;
    });

    it('devrait mettre à jour le statut de la liste', async () => {
      const response = await request(app)
        .patch(`/api/shopping-lists/${listId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'confirmed'
        });

      expect(response.status).toBe(200);
      expect(response.body.list.status).toBe('confirmed');
    });
  });
});