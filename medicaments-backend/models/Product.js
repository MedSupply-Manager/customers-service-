const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  prixUnitaire: {
    type: Number,
    required: true,
    min: 0
  },
  unite: {
    type: String,
    default: 'unité'
  },
  categorieId: {
    type: Number,
    required: true
  },
  fournisseurId: {
    type: Number
  },
  seuilAlerte: {
    type: Number,
    default: 10
  },
  imageUrl: {
    type: String
  },
  actif: {
    type: Boolean,
    default: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Méthode pour consulter les détails
productSchema.methods.consultDetails = function() {
  return {
    id: this._id,
    code: this.code,
    nom: this.nom,
    description: this.description,
    prixUnitaire: this.prixUnitaire,
    unite: this.unite,
    categorieId: this.categorieId,
    actif: this.actif
  };
};

module.exports = mongoose.model('Product', productSchema);