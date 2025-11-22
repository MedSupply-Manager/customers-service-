const mongoose = require('mongoose');

const medicalProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  }
});

// Méthode pour calculer le total de ligne
medicalProductSchema.methods.lineTotal = function() {
  return this.quantity * this.unitPrice;
};

const shoppingListSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'draft'
  },
  items: [medicalProductSchema]
}, {
  timestamps: true
});

// Méthode pour créer une liste
shoppingListSchema.statics.createList = async function(clientId) {
  const list = new this({
    client: clientId,
    status: 'draft',
    items: []
  });
  await list.save();
  return list;
};

// Méthode pour ajouter un item
shoppingListSchema.methods.addItem = async function(productId, quantity) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(productId);
  
  if (!product) {
    throw new Error('Produit non trouvé');
  }

  // Vérifier si le produit existe déjà dans la liste
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity: quantity,
      unitPrice: product.prixUnitaire
    });
  }

  await this.save();
  return this;
};

// Méthode pour supprimer un item
shoppingListSchema.methods.removeItem = async function(itemId) {
  this.items = this.items.filter(item => 
    item._id.toString() !== itemId.toString()
  );
  await this.save();
  return this;
};

// Méthode pour calculer le total
shoppingListSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.quantity * item.unitPrice);
  }, 0);
};

module.exports = mongoose.model('ShoppingList', shoppingListSchema);