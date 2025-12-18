const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Client = require('../models/Client');
const Product = require('../models/Product');

dotenv.config();

const seedData = async () => {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medicaments_db');
    console.log('✅ Connecté à MongoDB');

    // Nettoyer les données existantes
    console.log('🗑️  Nettoyage des données existantes...');
    await Client.deleteMany({});
    await Product.deleteMany({});

    // Créer des clients test
    console.log('👥 Création des clients...');
    
    const hospital = new Client({
      username: 'hopital_central',
      email: 'hopital@example.com',
      clientType: 'Hospital'
    });
    await hospital.setPassword('Hospital123!');
    await hospital.save();

    const pharmacy = new Client({
      username: 'pharmacie_sante',
      email: 'pharmacie@example.com',
      clientType: 'Pharmacy'
    });
    await pharmacy.setPassword('Pharmacy123!');
    await pharmacy.save();

    const client = new Client({
      username: 'jean_dupont',
      email: 'jean@example.com',
      clientType: 'Client'
    });
    await client.setPassword('Client123!');
    await client.save();

    console.log('✅ Clients créés');

    // Créer des produits
    console.log('💊 Création des médicaments...');
    
    const products = [
      {
        code: 'PARA001',
        nom: 'Paracétamol 500mg',
        description: 'Anti-douleur et antipyrétique',
        prixUnitaire: 3.50,
        unite: 'boîte',
        categorieId: 1,
        fournisseurId: 100,
        seuilAlerte: 50,
        actif: true
      },
      {
        code: 'IBU001',
        nom: 'Ibuprofène 400mg',
        description: 'Anti-inflammatoire non stéroïdien',
        prixUnitaire: 5.90,
        unite: 'boîte',
        categorieId: 1,
        fournisseurId: 101,
        seuilAlerte: 30,
        actif: true
      },
      {
        code: 'AMOX001',
        nom: 'Amoxicilline 1g',
        description: 'Antibiotique à large spectre',
        prixUnitaire: 12.50,
        unite: 'boîte',
        categorieId: 2,
        fournisseurId: 102,
        seuilAlerte: 20,
        actif: true
      },
      {
        code: 'ASP001',
        nom: 'Aspirine 100mg',
        description: 'Antiagrégant plaquettaire',
        prixUnitaire: 4.20,
        unite: 'boîte',
        categorieId: 1,
        fournisseurId: 100,
        seuilAlerte: 40,
        actif: true
      },
      {
        code: 'DOLIP001',
        nom: 'Doliprane 1000mg',
        description: 'Paracétamol dosage fort',
        prixUnitaire: 4.80,
        unite: 'boîte',
        categorieId: 1,
        fournisseurId: 103,
        seuilAlerte: 60,
        actif: true
      },
      {
        code: 'VIT001',
        nom: 'Vitamine C 1g',
        description: 'Complément vitaminique',
        prixUnitaire: 8.50,
        unite: 'boîte',
        categorieId: 3,
        fournisseurId: 104,
        seuilAlerte: 25,
        actif: true
      },
      {
        code: 'OMEP001',
        nom: 'Oméprazole 20mg',
        description: 'Inhibiteur de la pompe à protons',
        prixUnitaire: 9.90,
        unite: 'boîte',
        categorieId: 4,
        fournisseurId: 105,
        seuilAlerte: 15,
        actif: true
      },
      {
        code: 'SERUM001',
        nom: 'Sérum physiologique',
        description: 'Solution saline stérile',
        prixUnitaire: 6.50,
        unite: 'boîte de 20',
        categorieId: 5,
        fournisseurId: 100,
        seuilAlerte: 100,
        actif: true
      }
    ];

    await Product.insertMany(products);
    console.log('✅ Médicaments créés');

    console.log('\n📊 Résumé :');
    console.log(`   - ${await Client.countDocuments()} clients créés`);
    console.log(`   - ${await Product.countDocuments()} produits créés`);
    
    console.log('\n🔑 Identifiants de connexion :');
    console.log('   Hospital: hopital@example.com / Hospital123!');
    console.log('   Pharmacy: pharmacie@example.com / Pharmacy123!');
    console.log('   Client: jean@example.com / Client123!');
    
    console.log('\n✨ Données initiales créées avec succès!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();