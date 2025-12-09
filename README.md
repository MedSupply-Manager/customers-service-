🏥 Système d'Achat de Médicaments - Backend
Backend Node.js avec MongoDB pour la gestion des commandes de médicaments.

📋 Table des matières
Prérequis
Installation
Configuration
Lancement
Tests
API Endpoints
CI/CD
Déploiement
🔧 Prérequis
Node.js >= 18.0.0
MongoDB >= 6.0
npm >= 9.0.0
📦 Installation
bash
# Cloner le repository
git clone https://github.com/votre-username/medicaments-backend.git
cd medicaments-backend

# Installer les dépendances
npm install
⚙️ Configuration
Créer un fichier .env à la racine :
bash
cp .env.example .env
Configurer les variables d'environnement dans .env
🚀 Lancement
Mode développement
bash
npm run dev
Mode production
bash
npm start
L'API sera accessible sur http://localhost:5000

🧪 Tests
bash
# Exécuter tous les tests
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Linting
npm run lint
📡 API Endpoints
Authentification
POST /api/auth/register - Inscription
POST /api/auth/login - Connexion
POST /api/auth/logout - Déconnexion
Clients
GET /api/clients/profile - Obtenir le profil (authentifié)
PUT /api/clients/profile - Modifier le profil
PUT /api/clients/change-password - Changer le mot de passe
Produits
GET /api/products - Liste des médicaments
GET /api/products/:id - Détails d'un produit
POST /api/products - Créer un produit (admin)
PUT /api/products/:id - Modifier un produit
DELETE /api/products/:id - Supprimer un produit
Listes d'achat
POST /api/shopping-lists - Créer une liste
GET /api/shopping-lists - Obtenir toutes les listes
GET /api/shopping-lists/:id - Détails d'une liste
POST /api/shopping-lists/:id/items - Ajouter un médicament
DELETE /api/shopping-lists/:id/items/:itemId - Retirer un médicament
PATCH /api/shopping-lists/:id/status - Modifier le statut
DELETE /api/shopping-lists/:id - Supprimer une liste
Route de santé
GET /health - Vérifier l'état de l'API
🔄 CI/CD Pipeline
Le projet utilise GitHub Actions pour l'intégration et le déploiement continus.

Pipeline
Tests : Exécution des tests sur Node.js 18.x et 20.x
Build : Vérification de la compilation
Sécurité : Audit npm et analyse Snyk
Déploiement : Déploiement automatique sur Heroku (branche main)
Tests d'intégration : Vérification post-déploiement
Configuration GitHub Secrets
Ajouter ces secrets dans Settings > Secrets and variables > Actions :

MONGODB_TEST_URI - URI MongoDB pour les tests
HEROKU_API_KEY - Clé API Heroku
HEROKU_APP_NAME - Nom de l'app Heroku
HEROKU_EMAIL - Email Heroku
SNYK_TOKEN - Token Snyk (optionnel)
🌐 Déploiement
Heroku
bash
# Se connecter à Heroku
heroku login

# Créer une application
heroku create votre-app-name

# Ajouter MongoDB Atlas
heroku addons:create mongolab:sandbox

# Configurer les variables d'environnement
heroku config:set JWT_SECRET=votre_secret_jwt
heroku config:set NODE_ENV=production

# Déployer
git push heroku main
Variables d'environnement sur Heroku
bash
heroku config:set MONGODB_URI=votre_uri_mongodb
heroku config:set JWT_SECRET=votre_secret_jwt
heroku config:set PORT=5000
📁 Structure du projet
medicaments-backend/
├── models/              # Modèles MongoDB
│   ├── Client.js
│   ├── Product.js
│   └── ShoppingList.js
├── routes/              # Routes API
│   ├── auth.routes.js
│   ├── client.routes.js
│   ├── product.routes.js
│   └── shoppingList.routes.js
├── middleware/          # Middlewares
│   └── auth.middleware.js
├── tests/              # Tests unitaires
│   ├── auth.test.js
│   └── shoppingList.test.js
├── .github/
│   └── workflows/
│       └── ci-cd.yml   # Pipeline CI/CD
├── server.js           # Point d'entrée
├── package.json
├── .env.example
├── .eslintrc.json
└── README.md
🔐 Sécurité
Hashage des mots de passe avec bcrypt
Authentification JWT
Validation des entrées
Protection CORS
Helmet pour les headers HTTP
📝 Licence
ISC

👥 Auteur
Votre Nom

⭐ N'oubliez pas de mettre une étoile si ce projet vous aide !


