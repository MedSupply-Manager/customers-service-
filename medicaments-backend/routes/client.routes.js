const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { authenticate } = require('../middleware/auth.middleware');

// Obtenir le profil du client connecté
router.get('/profile', authenticate, async (req, res) => {
  try {
    const client = await Client.findById(req.user.id).select('-passwordHash');
    
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour le profil
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    const client = await Client.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({
      message: 'Profil mis à jour',
      client
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Changer le mot de passe
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mots de passe requis' });
    }

    const client = await Client.findById(req.user.id);
    
    const isValid = await client.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    }

    await client.setPassword(newPassword);
    await client.save();

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;