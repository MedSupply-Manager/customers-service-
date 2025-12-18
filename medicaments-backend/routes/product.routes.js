const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth.middleware');

// Consulter le catalogue de médicaments (tous les produits)
router.get('/', async (req, res) => {
  try {
    const { search, category, actif } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { nom: new RegExp(search, 'i') },
        { code: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    if (category) {
      query.categorieId = parseInt(category);
    }
    
    if (actif !== undefined) {
      query.actif = actif === 'true';
    }

    const products = await Product.find(query).sort({ nom: 1 });
    
    res.json({
      total: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir un produit spécifique avec tous ses détails
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const details = product.consultDetails();
    
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouveau produit (admin uniquement)
router.post('/', authenticate, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({
      message: 'Produit créé avec succès',
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un produit
router.put('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, dateModification: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json({
      message: 'Produit mis à jour',
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un produit (soft delete)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { actif: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit désactivé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;