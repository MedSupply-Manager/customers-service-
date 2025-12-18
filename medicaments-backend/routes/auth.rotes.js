const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

// Service d'authentification
class AuthService {
  async authenticate(email, password) {
    try {
      const client = await Client.findOne({ email });
      
      if (!client) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const isValid = await client.comparePassword(password);
      
      if (!isValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Générer un token JWT
      const token = jwt.sign(
        { 
          id: client._id, 
          email: client.email,
          clientType: client.clientType 
        },
        process.env.JWT_SECRET || 'votre_secret_jwt',
        { expiresIn: '24h' }
      );

      return {
        client: {
          id: client._id,
          username: client.username,
          email: client.email,
          clientType: client.clientType
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, clientType } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingClient = await Client.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingClient) {
      return res.status(400).json({ error: 'Email ou nom d\'utilisateur déjà utilisé' });
    }

    // Créer un nouveau client
    const client = new Client({
      username,
      email,
      clientType: clientType || 'Client'
    });

    await client.setPassword(password);
    await client.save();

    res.status(201).json({ 
      message: 'Inscription réussie',
      client: {
        id: client._id,
        username: client.username,
        email: client.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const result = await authService.authenticate(email, password);
    
    res.json({
      message: 'Connexion réussie',
      ...result
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
  res.json({ message: 'Déconnexion réussie' });
});

module.exports = router;