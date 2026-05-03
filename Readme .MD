# LuxeShop — Application E-Commerce Full-Stack

Une application e-commerce complète construite avec **React.js** (frontend) et **Express.js + MongoDB** (backend).

---

## 🏗️ Architecture

```
ecommerce-app/
├── backend/
│   ├── models/
│   │   ├── User.js          # Modèle utilisateur (bcrypt, JWT)
│   │   ├── Product.js       # Modèle produit (avis inclus)
│   │   └── Order.js         # Modèle commande
│   ├── routes/
│   │   ├── authRoutes.js    # Register, Login, Profile
│   │   ├── productRoutes.js # CRUD produits + avis
│   │   └── orderRoutes.js   # Créer/lister/détail commandes
│   ├── middleware/
│   │   └── auth.js          # Middleware JWT (protect, admin)
│   ├── server.js            # Point d'entrée Express
│   ├── seed.js              # Données de démonstration
│   └── .env                 # Variables d'environnement
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.jsx  # Gestion état utilisateur
        │   └── CartContext.jsx  # Gestion panier (localStorage)
        ├── components/
        │   └── Navbar.jsx
        ├── pages/
        │   ├── Home.jsx         # Catalogue + recherche + filtres
        │   ├── ProductPage.jsx  # Détail produit + avis
        │   ├── Cart.jsx         # Panier + checkout 3 étapes
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Orders.jsx       # Mes commandes
        │   └── OrderDetail.jsx  # Suivi commande
        └── App.jsx              # Routes + providers
```

---

## ⚡ Installation

### Prérequis
- Node.js 18+
- MongoDB (local ou MongoDB Atlas)

### 1. Backend

```bash
cd ecommerce-app/backend
npm install
```

Configurer le fichier `.env` :
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=change_this_secret_in_production
NODE_ENV=development
```

Alimenter la base de données (optionnel) :
```bash
node seed.js
# Crée 8 produits + 1 compte admin (admin@shop.com / admin123)
```

Démarrer le backend :
```bash
npm run dev     # développement (nodemon)
npm start       # production
```

### 2. Frontend

```bash
cd ecommerce-app/frontend
npm install
npm start
```

L'application sera disponible sur **http://localhost:3000**

---

## 🔌 API Endpoints

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter |
| GET | `/api/auth/profile` | Profil (auth requis) |
| PUT | `/api/auth/profile` | Modifier profil |

### Produits
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/products` | Liste (filtre par `?keyword=&category=`) |
| GET | `/api/products/:id` | Détail produit |
| POST | `/api/products` | Créer (admin) |
| PUT | `/api/products/:id` | Modifier (admin) |
| DELETE | `/api/products/:id` | Supprimer (admin) |
| POST | `/api/products/:id/reviews` | Ajouter avis (auth) |

### Commandes
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/orders` | Créer une commande |
| GET | `/api/orders/myorders` | Mes commandes |
| GET | `/api/orders/:id` | Détail commande |
| GET | `/api/orders` | Toutes les commandes (admin) |
| PUT | `/api/orders/:id/status` | Modifier statut (admin) |

---

## ✨ Fonctionnalités

- **Catalogue produits** avec recherche et filtres par catégorie
- **Fiche produit détaillée** avec galerie, stock, et système d'avis
- **Panier persistant** (localStorage) avec gestion des quantités
- **Checkout en 3 étapes** : panier → livraison → confirmation
- **Authentification JWT** (register/login/logout)
- **Suivi de commandes** avec indicateur de progression visuel
- **Livraison gratuite** automatique à partir de 100€
- **Gestion des stocks** (décrémentation automatique)
- **Rôles admin/user**

---

## 🔐 Compte de démonstration

Après avoir exécuté `node seed.js` :

| Email          | Mot de passe | Rôle  |
|----------------|--------------|-------|
| admin@shop.com | admin123     | Admin |

---

## 🚀 Déploiement

### Variables d'environnement en production
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET=un_secret_tres_long_et_aleatoire
NODE_ENV=production
PORT=5000
```

### Build frontend
```bash
cd frontend && npm run build
```

Servir le dossier `build/` depuis Express en production, ou déployer sur Vercel/Netlify.