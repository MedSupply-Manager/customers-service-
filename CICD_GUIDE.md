🚀 Guide CI/CD - Intégration et Déploiement Continus
📖 Qu'est-ce que le CI/CD ?
CI/CD signifie Continuous Integration / Continuous Deployment (Intégration Continue / Déploiement Continu).

CI (Intégration Continue)
Fusion automatique du code dans le dépôt principal
Exécution automatique des tests
Vérification de la qualité du code
Détection précoce des bugs
CD (Déploiement Continu)
Déploiement automatique en production
Tests post-déploiement
Livraison rapide des fonctionnalités
🔄 Notre Pipeline CI/CD
Code Push → Tests → Build → Sécurité → Déploiement → Tests d'intégration
📋 Étapes du Pipeline
1️⃣ Tests et Vérifications
Exécution sur Node.js 18.x et 20.x
Tests unitaires avec Jest
Rapport de couverture de code
Linting avec ESLint
2️⃣ Build
Vérification de la compilation
Validation des dépendances
3️⃣ Analyse de Sécurité
Audit npm pour les vulnérabilités
Analyse avec Snyk (optionnel)
4️⃣ Déploiement
Déploiement automatique sur Heroku (branche main uniquement)
Configuration des variables d'environnement
5️⃣ Tests d'Intégration
Vérification de l'API déployée
Test de santé du service
🛠️ Configuration GitHub
Étape 1 : Créer un Repository GitHub
bash
# Initialiser git
git init

# Ajouter l'origine remote
git remote add origin https://github.com/votre-username/medicaments-backend.git

# Commit initial
git add .
git commit -m "Initial commit"
git push -u origin main
Étape 2 : Configurer les Secrets GitHub
Allez dans : Settings → Secrets and variables → Actions → New repository secret

Ajoutez ces secrets :

Secret	Description	Exemple
MONGODB_TEST_URI	URI MongoDB pour tests	mongodb://localhost:27017/test_db
HEROKU_API_KEY	Clé API Heroku	Obtenir depuis Heroku Dashboard
HEROKU_APP_NAME	Nom de l'app Heroku	medicaments-api-prod
HEROKU_EMAIL	Email Heroku	votre@email.com
SNYK_TOKEN	Token Snyk (optionnel)	Obtenir depuis snyk.io
Étape 3 : Fichiers nécessaires dans GitHub
medicaments-backend/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          ✅ Pipeline CI/CD
├── models/                     ✅ Modèles
├── routes/                     ✅ Routes
├── middleware/                 ✅ Middlewares
├── tests/                      ✅ Tests
├── scripts/                    ✅ Scripts utilitaires
├── server.js                   ✅ Point d'entrée
├── package.json                ✅ Dépendances
├── .env.example                ✅ Variables d'env (exemple)
├── .gitignore                  ✅ Fichiers à ignorer
├── .eslintrc.json             ✅ Config ESLint
├── Dockerfile                  ✅ Configuration Docker
├── docker-compose.yml         ✅ Docker Compose
└── README.md                   ✅ Documentation
🏗️ Configuration Heroku
Étape 1 : Créer une application Heroku
bash
# Se connecter à Heroku
heroku login

# Créer une nouvelle app
heroku create medicaments-api-prod

# Ajouter MongoDB Atlas
heroku addons:create mongolab:sandbox

# Ou utiliser MongoDB Atlas directement
# Créez un cluster sur https://www.mongodb.com/cloud/atlas
Étape 2 : Configurer les variables d'environnement
bash
# Via CLI
heroku config:set JWT_SECRET="votre_secret_jwt_tres_long_et_securise"
heroku config:set NODE_ENV="production"
heroku config:set PORT=5000

# Ou via Dashboard Heroku
# Settings → Config Vars → Reveal Config Vars
Étape 3 : Obtenir la clé API Heroku
Allez sur https://dashboard.heroku.com/account
Section "API Key"
Cliquez sur "Reveal" et copiez la clé
Ajoutez-la dans GitHub Secrets comme HEROKU_API_KEY
🔐 Configuration MongoDB Atlas (Recommandé)
Étape 1 : Créer un cluster
Allez sur https://www.mongodb.com/cloud/atlas
Créez un compte gratuit
Créez un cluster M0 (gratuit)
Étape 2 : Configurer l'accès
Database Access → Add New Database User
Username : adminUser
Password : Générer un mot de passe fort
Built-in Role : Atlas Admin
Network Access → Add IP Address
Cliquez sur "Allow Access from Anywhere" (0.0.0.0/0)
Pour production, restreindre aux IPs spécifiques
Étape 3 : Obtenir l'URI de connexion
Cliquez sur "Connect" sur votre cluster
Choisissez "Connect your application"
Copiez l'URI de connexion
Remplacez <password> par votre mot de passe
bash
# Ajouter sur Heroku
heroku config:set MONGODB_URI="mongodb+srv://adminUser:<password>@cluster0.xxxxx.mongodb.net/medicaments_db?retryWrites=true&w=majority"
🚦 Déclenchement du Pipeline
Push sur main (Déploiement automatique)
bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
Pull Request (Tests uniquement)
bash
git checkout -b feature/nouvelle-fonctionnalite
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite
# Créer une Pull Request sur GitHub
📊 Monitoring du Pipeline
Via GitHub Actions
Allez dans l'onglet Actions de votre repository
Visualisez l'exécution en temps réel
Consultez les logs détaillés de chaque étape
Badges de statut
Ajoutez dans votre README.md :

markdown
![CI/CD](https://github.com/votre-username/medicaments-backend/workflows/CI/CD%20Pipeline/badge.svg)
🐛 Résolution des Problèmes
Problème : Tests échouent
bash
# Exécuter les tests localement
npm test

# Vérifier les erreurs
npm run lint
Problème : Déploiement Heroku échoue
bash
# Vérifier les logs Heroku
heroku logs --tail --app medicaments-api-prod

# Redémarrer l'application
heroku restart --app medicaments-api-prod
Problème : MongoDB non accessible
bash
# Tester la connexion MongoDB
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net" --username adminUser

# Vérifier les IPs autorisées dans Atlas
✅ Checklist de Déploiement
 Repository GitHub créé
 Secrets GitHub configurés
 Application Heroku créée
 MongoDB Atlas configuré
 Variables d'environnement définies
 Tests passent localement
 Pipeline CI/CD fonctionne
 API accessible en production
 Documentation à jour
🔄 Workflow Recommandé
Pour le développement
bash
# Créer une branche feature
git checkout -b feature/nom-fonctionnalite

# Développer et tester localement
npm run dev
npm test

# Commit et push
git add .
git commit -m "feat: description"
git push origin feature/nom-fonctionnalite

# Créer une Pull Request
# → Pipeline CI s'exécute automatiquement

# Après revue et validation
# → Merge vers main
# → Pipeline CD déploie automatiquement
Pour les hotfixes
bash
# Créer une branche hotfix
git checkout -b hotfix/correction-urgente

# Corriger et tester
npm test

# Commit, push et merge rapidement
git commit -m "fix: correction urgente"
git push origin hotfix/correction-urgente
# Merger vers main immédiatement
📈 Améliorations Futures
 Ajouter des tests e2e avec Cypress
 Mettre en place une stratégie de rollback
 Ajouter des environnements staging/production
 Intégrer Prometheus pour le monitoring
 Configurer des alertes Slack/Email
 Implémenter Blue-Green Deployment
📚 Ressources Utiles
GitHub Actions Documentation
Heroku Dev Center
MongoDB Atlas Docs
Jest Testing
💡 Conseil : Commencez petit, testez chaque étape, et améliorez progressivement votre pipeline !

🎯 Objectif : Livrer du code de qualité, rapidement et en toute confiance !

