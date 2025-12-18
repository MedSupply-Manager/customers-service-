const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  clientType: {
    type: String,
    enum: ['Hospital', 'Pharmacy', 'Client'],
    default: 'Client'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Méthode pour hasher le mot de passe
clientSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

// Méthode pour vérifier le mot de passe
clientSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Méthode login
clientSchema.methods.login = async function(email, password) {
  const client = await this.constructor.findOne({ email });
  if (!client) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  const isMatch = await client.comparePassword(password);
  if (!isMatch) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  return client;
};

// Méthode logout (invalider le token côté client)
clientSchema.methods.logout = function() {
  // La logique de déconnexion sera gérée côté client
  return { message: 'Déconnexion réussie' };
};

module.exports = mongoose.model('Client', clientSchema);