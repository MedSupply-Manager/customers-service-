⚡ Guide de Démarrage Rapide
🎯 En 5 minutes
1️⃣ Installation
bash
# Cloner le projet
git clone https://github.com/votre-username/medicaments-backend.git
cd medicaments-backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
2️⃣ Configuration MongoDB
Option A : MongoDB Local

bash
# Assurez-vous que MongoDB est installé et démarré
mongod
Option B : MongoDB Atlas (Recommandé)

Créez un compte sur https://www.mongodb.com/cloud/atlas
Créez un cluster gratuit
Obtenez l'URI de connexion
Modifiez .env :
env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/medicaments_db
3️⃣ Lancer l'application
bash
# Charger les données initiales (optionnel)
npm run seed

# Démarrer en mode développement
npm run dev
✅ L'API est maintenant accessible sur http://localhost:5000

4️⃣ Tester l'API
bash
# Test de santé
curl http://localhost:5000/health

# Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "clientType": "Client"
  }'

# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "Client123!"
  }'
🧪 Tests
bash
# Exécuter tous les tests
npm test

# Tests avec couverture
npm run test:coverage

# Linting
npm run lint
🐳 Avec Docker
bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
📝 Identifiants par défaut (après seed)
Type	Email	Mot de passe
Hospital	hopital@example.com	Hospital123!
Pharmacy	pharmacie@example.com	Pharmacy123!
Client	jean@example.com	Client123!
🚀 Déploiement sur GitHub
bash
# Initialiser git (si pas encore fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit"

# Créer le repository sur GitHub
# Puis ajouter l'origine remote
git remote add origin https://github.com/votre-username/medicaments-backend.git

# Pousser le code
git push -u origin main
🔑 Configuration des Secrets GitHub
Allez sur votre repository GitHub
Settings → Secrets and variables → Actions
Ajoutez ces secrets :
MONGODB_TEST_URI=mongodb://localhost:27017/test_db
HEROKU_API_KEY=votre_cle_heroku
HEROKU_APP_NAME=votre-app-name
HEROKU_EMAIL=votre@email.com
📦 Commandes NPM
bash
npm start           # Démarrer en production
npm run dev         # Démarrer en développement
npm test            # Exécuter les tests
npm run test:coverage  # Tests avec couverture
npm run lint        # Vérifier le code
npm run lint:fix    # Corriger le code
npm run seed        # Charger les données initiales
🔍 Endpoints API Principaux
Authentification
POST /api/auth/register    # Inscription
POST /api/auth/login       # Connexion
POST /api/auth/logout      # Déconnexion
Produits
GET  /api/products         # Liste des médicaments
GET  /api/products/:id     # Détails d'un produit
POST /api/products         # Créer un produit (auth)
Listes d'achat
POST   /api/shopping-lists                    # Créer une liste
GET    /api/shopping-lists                    # Mes listes
GET    /api/shopping-lists/:id               # Détails d'une liste
POST   /api/shopping-lists/:id/items         # Ajouter un médicament
DELETE /api/shopping-lists/:id/items/:itemId # Retirer un médicament
Client
GET /api/clients/profile           # Mon profil
PUT /api/clients/profile           # Modifier mon profil
PUT /api/clients/change-password   # Changer mot de passe
🛠️ Dépannage Rapide
MongoDB ne se connecte pas
bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongod

# Ou pour Windows
net start MongoDB
Port 5000 déjà utilisé
env
# Modifier dans .env
PORT=3001
Tests échouent
bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
📚 Prochaines Étapes
✅ Testez tous les endpoints avec Postman
✅ Configurez le CI/CD sur GitHub
✅ Déployez sur Heroku
✅ Ajoutez vos propres fonctionnalités
💡 Conseils
Utilisez MongoDB Atlas pour éviter les problèmes de configuration locale
Activez les logs avec DEBUG=* pour voir tous les détails
Consultez le fichier CICD_GUIDE.md pour le déploiement
🆘 Besoin d'aide ?
Consultez le README.md complet
Vérifiez les logs : heroku logs --tail (si déployé)
Relisez le CICD_GUIDE.md
🎉 Bon développement !

