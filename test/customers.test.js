// tests/client.routes.test.js
const request = require("supertest");
const express = require("express");

// --- Mock the Sequelize models BEFORE loading the routers ---
jest.mock("../src/models/medication", () => ({
  findAll: jest.fn(),
  findByPk: jest.fn()
}));

jest.mock("../src/models/shoppingList", () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn()
}));

jest.mock("../src/models/shoppingItem", () => ({
  create: jest.fn(),
  findAll: jest.fn()
}));

const Medication = require("../src/models/medication");
const ShoppingList = require("../src/models/shoppingList");
const ShoppingItem = require("../src/models/shoppingItem");

// --- Routers (tes routes doivent être exportées ici) ---
const medicationsRouter = require("../src/routes/medications"); // GET /medications, GET /medications/:id
const shoppingListRouter = require("../src/routes/shoppinglists"); // POST /shopping-lists, POST /shopping-lists/:id/items, POST /shopping-lists/:id/checkout, GET /shopping-lists/:id

const app = express();
app.use(express.json());
app.use("/medications", medicationsRouter);
app.use("/shopping-lists", shoppingListRouter);

describe("Client Service Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------------
  // GET /medications
  // -----------------------------
  it("GET /medications should return a list of medications", async () => {
    const mockMeds = [
      { id: 1, name: "Aspirine", unitPrice: 1.2 },
      { id: 2, name: "Paracétamol", unitPrice: 0.8 }
    ];
    Medication.findAll.mockResolvedValue(mockMeds);

    const res = await request(app).get("/medications");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockMeds);
    expect(Medication.findAll).toHaveBeenCalledTimes(1);
  });

  // -----------------------------
  // GET /medications/:id
  // -----------------------------
  it("GET /medications/:id should return medication details", async () => {
    const mockMed = { id: 1, name: "Aspirine", unitPrice: 1.2 };
    Medication.findByPk.mockResolvedValue(mockMed);

    const res = await request(app).get("/medications/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockMed);
    expect(Medication.findByPk).toHaveBeenCalledWith("1");
  });

  it("GET /medications/:id should return 404 when not found", async () => {
    Medication.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/medications/999");

    expect(res.statusCode).toBe(404);
  });

  // -----------------------------
  // POST /shopping-lists
  // -----------------------------
  it("POST /shopping-lists should create a new shopping list", async () => {
    const mockList = { id: 1, clientId: 10, createdAt: new Date(), status: "DRAFT" };
    ShoppingList.create.mockResolvedValue(mockList);

    const res = await request(app)
      .post("/shopping-lists")
      .send({ clientId: 10 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(mockList);
    expect(ShoppingList.create).toHaveBeenCalledWith({ clientId: 10 });
  });

  it("POST /shopping-lists should return 500 on error", async () => {
    ShoppingList.create.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/shopping-lists")
      .send({ clientId: 10 });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  // -----------------------------
  // POST /shopping-lists/:id/items
  // -----------------------------
  it("POST /shopping-lists/:id/items should add an item to the shopping list", async () => {
    const mockMed = { id: 2, name: "Paracétamol", unitPrice: 0.8 };
    const mockItem = { id: 5, shoppingListId: 1, medicationId: 2, quantity: 3 };

    // ensure medication exists
    Medication.findByPk.mockResolvedValue(mockMed);
    ShoppingItem.create.mockResolvedValue(mockItem);

    const res = await request(app)
      .post("/shopping-lists/1/items")
      .send({ medicationId: 2, quantity: 3 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(mockItem);
    expect(Medication.findByPk).toHaveBeenCalledWith(2);
    expect(ShoppingItem.create).toHaveBeenCalledWith({
      shoppingListId: "1",
      medicationId: 2,
      quantity: 3
    });
  });

  it("POST /shopping-lists/:id/items should return 400 if medication not found", async () => {
    Medication.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .post("/shopping-lists/1/items")
      .send({ medicationId: 999, quantity: 1 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // -----------------------------
  // GET /shopping-lists/:id
  // -----------------------------
  it("GET /shopping-lists/:id should return the shopping list with items", async () => {
    const mockList = { id: 1, clientId: 10, status: "DRAFT" };
    const mockItems = [
      { id: 5, medicationId: 2, quantity: 3, unitPrice: 0.8 }
    ];

    ShoppingList.findByPk.mockResolvedValue(mockList);
    ShoppingItem.findAll.mockResolvedValue(mockItems);

    const res = await request(app).get("/shopping-lists/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ...mockList, items: mockItems });
    expect(ShoppingList.findByPk).toHaveBeenCalledWith("1");
    expect(ShoppingItem.findAll).toHaveBeenCalledWith({ where: { shoppingListId: "1" } });
  });

  it("GET /shopping-lists/:id should return 404 when list missing", async () => {
    ShoppingList.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/shopping-lists/999");

    expect(res.statusCode).toBe(404);
  });

  // -----------------------------
  // POST /shopping-lists/:id/checkout
  // -----------------------------
  it("POST /shopping-lists/:id/checkout should validate the shopping list", async () => {
    const mockList = { id: 1, clientId: 10, status: "DRAFT", save: jest.fn() };

    ShoppingList.findByPk.mockResolvedValue(mockList);
    ShoppingList.update.mockResolvedValue([1]); // Sequelize returns [affectedCount]

    const res = await request(app)
      .post("/shopping-lists/1/checkout")
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Checkout successful");
    expect(ShoppingList.update).toHaveBeenCalledWith(
      { status: "VALIDATED" },
      { where: { id: "1" } }
    );
  });

  it("POST /shopping-lists/:id/checkout should return 404 if list not found", async () => {
    ShoppingList.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .post("/shopping-lists/999/checkout")
      .send({});

    expect(res.statusCode).toBe(404);
  });
});
