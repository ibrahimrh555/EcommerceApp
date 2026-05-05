# LuxeShop — Application E‑Commerce Full‑Stack

Application e‑commerce complète construite avec **React (CRA)** côté client et **Express + MongoDB** côté serveur.

## Architecture

```
ecommerce-app/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── Adminroutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── seed.js
│   └── server.js
└── fronte/
    ├── public/
    └── src/
        ├── admin/
        ├── components/
        ├── context/
        ├── pages/
        └── user/
```

## Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)

## Installation & démarrage

### 1) Backend

```bash
cd backend
npm install
```

Créer `backend/.env` :

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=change_this_secret_in_production
NODE_ENV=development

# Stripe (optionnel si vous n'utilisez pas le paiement)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Seeder la base (optionnel) :

```bash
cd backend
node seed.js
# Crée des produits + 1 compte admin : admin@shop.com / admin123
```

Lancer le serveur :

```bash
cd backend
npm run dev
# ou
npm start
```

Endpoint de santé : `GET /api/health`.

### 2) Frontend

Le frontend est dans le dossier `fronte/` et est configuré avec un `proxy` vers `http://localhost:5000`.

```bash
cd fronte
npm install
npm start
```

Application : http://localhost:3000

## API

### Auth

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter |
| GET | `/api/auth/profile` | Profil (auth requis) |
| PUT | `/api/auth/profile` | Modifier profil |

### Produits

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/products` | Liste (filtres : `?keyword=&category=`) |
| GET | `/api/products/:id` | Détail produit |
| POST | `/api/products` | Créer (admin) |
| PUT | `/api/products/:id` | Modifier (admin) |
| DELETE | `/api/products/:id` | Supprimer (admin) |
| POST | `/api/products/:id/reviews` | Ajouter un avis (auth) |

### Commandes

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/orders` | Créer une commande |
| GET | `/api/orders/myorders` | Mes commandes |
| GET | `/api/orders/:id` | Détail commande (owner ou admin) |
| GET | `/api/orders` | Toutes les commandes (admin) |
| PUT | `/api/orders/:id/status` | Modifier statut (admin) |

Notes :

- Frais de livraison : 0€ si total > 100€, sinon 10€.
- Le stock est décrémenté à la création de commande.

### Admin

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/admin/stats` | Stats globales |
| GET | `/api/admin/products` | Liste produits |
| POST | `/api/admin/products` | Créer produit |
| PUT | `/api/admin/products/:id` | Modifier produit |
| DELETE | `/api/admin/products/:id` | Supprimer produit |
| GET | `/api/admin/orders` | Liste commandes |
| PUT | `/api/admin/orders/:id` | Modifier commande |
| GET | `/api/admin/users` | Liste utilisateurs |
| DELETE | `/api/admin/users/:id` | Supprimer utilisateur |
| PUT | `/api/admin/users/:id/role` | Changer rôle |

### Paiement (Stripe)

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/payment/create-intent` | Crée un PaymentIntent (auth) |
| POST | `/api/payment/confirm/:orderId` | Marque la commande payée (auth) |
| POST | `/api/payment/webhook` | Webhook Stripe (server-to-server) |

## Déploiement

### Variables d'environnement (prod)

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET=un_secret_tres_long_et_aleatoire
NODE_ENV=production
PORT=5000
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Build frontend

```bash
cd fronte
npm run build
```

Le dossier `fronte/build/` peut ensuite être servi par un serveur statique (Netlify/Vercel) ou via Express (si vous ajoutez la configuration correspondante).