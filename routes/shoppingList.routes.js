const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/ShoppingList');
const { authenticate } = require('../middleware/auth.middleware');

// Créer une nouvelle liste d'achat
router.post('/', authenticate, async (req, res) => {
  try {
    const list = await ShoppingList.createList(req.user.id);
    res.status(201).json({
      message: 'Liste d\'achat créée',
      list
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir toutes les listes d'un client
router.get('/', authenticate, async (req, res) => {
  try {
    const lists = await ShoppingList.find({ client: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir une liste spécifique
router.get('/:id', authenticate, async (req, res) => {
  try {
    const list = await ShoppingList.findOne({
      _id: req.params.id,
      client: req.user.id
    }).populate('items.product');

    if (!list) {
      return res.status(404).json({ error: 'Liste non trouvée' });
    }

    const total = list.calculateTotal();

    res.json({
      list,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ajouter un médicament à la liste
router.post('/:id/items', authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Produit et quantité requis' });
    }

    const list = await ShoppingList.findOne({
      _id: req.params.id,
      client: req.user.id
    });

    if (!list) {
      return res.status(404).json({ error: 'Liste non trouvée' });
    }

    await list.addItem(productId, quantity);
    await list.populate('items.product');

    res.json({
      message: 'Médicament ajouté à la liste',
      list,
      total: list.calculateTotal()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un médicament de la liste
router.delete('/:id/items/:itemId', authenticate, async (req, res) => {
  try {
    const list = await ShoppingList.findOne({
      _id: req.params.id,
      client: req.user.id
    });

    if (!list) {
      return res.status(404).json({ error: 'Liste non trouvée' });
    }

    await list.removeItem(req.params.itemId);
    await list.populate('items.product');

    res.json({
      message: 'Médicament retiré de la liste',
      list,
      total: list.calculateTotal()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour le statut de la liste
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    const list = await ShoppingList.findOneAndUpdate(
      { _id: req.params.id, client: req.user.id },
      { status },
      { new: true }
    ).populate('items.product');

    if (!list) {
      return res.status(404).json({ error: 'Liste non trouvée' });
    }

    res.json({
      message: 'Statut mis à jour',
      list
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une liste
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const list = await ShoppingList.findOneAndDelete({
      _id: req.params.id,
      client: req.user.id
    });

    if (!list) {
      return res.status(404).json({ error: 'Liste non trouvée' });
    }

    res.json({ message: 'Liste supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;