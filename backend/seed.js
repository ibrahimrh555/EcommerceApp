const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const sampleProducts = [{
  "_id": {
    "$oid": "69f63be3685e1a7d2be6c8c2"
  },
  "name": "Premium Wireless Headphones",
  "description": "High-fidelity audio with active noise cancellation. 30-hour battery life, premium leather cushions, and studio-quality sound.",
  "price": 299.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  "stock": 25,
  "rating": 4.5,
  "numReviews": 12,
  "reviews": [],
  "__v": 0,
  "createdAt": {
    "$date": "2026-05-02T18:01:07.674Z"
  },
  "updatedAt": {
    "$date": "2026-05-02T18:01:07.674Z"
  }
},
{
  "_id": {
    "$oid": "69f63be3685e1a7d2be6c8c3"
  },
  "name": "Minimalist Leather Watch",
  "description": "Swiss movement, genuine leather strap, sapphire crystal glass. Water resistant to 50m. Timeless elegance for every occasion.",
  "price": 189.99,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  "stock": 14,
  "rating": 4.8,
  "numReviews": 24,
  "reviews": [],
  "__v": 0,
  "createdAt": {
    "$date": "2026-05-02T18:01:07.676Z"
  },
  "updatedAt": {
    "$date": "2026-05-02T18:11:55.272Z"
  }
},
{
  "_id": {
    "$oid": "69f63be3685e1a7d2be6c8c4"
  },
  "name": "Mechanical Gaming Keyboard",
  "description": "RGB backlit mechanical switches, aluminum frame, N-key rollover. Compatible with Windows and Mac. USB-C detachable cable.",
  "price": 149.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500",
  "stock": 30,
  "rating": 4.6,
  "numReviews": 18,
  "reviews": [],
  "__v": 0,
  "createdAt": {
    "$date": "2026-05-02T18:01:07.676Z"
  },
  "updatedAt": {
    "$date": "2026-05-02T18:01:07.676Z"
  }
},
{
  "_id": {
    "$oid": "69f63be3685e1a7d2be6c8c5"
  },
  "name": "Merino Wool Sweater",
  "description": "Ultra-soft 100% merino wool. Temperature regulating, odor resistant, and machine washable. Available in multiple colors.",
  "price": 89.99,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500",
  "stock": 40,
  "rating": 4.7,
  "numReviews": 31,
  "reviews": [],
  "__v": 0,
  "createdAt": {
    "$date": "2026-05-02T18:01:07.676Z"
  },
  "updatedAt": {
    "$date": "2026-05-02T18:01:07.676Z"
  }
},
{
  "_id": {
    "$oid": "69f63be3685e1a7d2be6c8c6"
  },
  "name": "Ceramic Pour-Over Coffee Set",
  "description": "Handcrafted ceramic dripper and carafe set. Includes 50 filters. Makes 2-4 cups of exceptional specialty coffee.",
  "price": 65,
  "category": "Home & Kitchen",
  "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
  "stock": 20,
  "rating": 4.9,
  "numReviews": 45,
  "reviews": [],
  "__v": 0,
  "createdAt": {
    "$date": "2026-05-02T18:01:07.676Z"
  },
  "updatedAt": {
    "$date": "2026-05-02T18:01:07.676Z"
  }
},
{
  "_id": {
    "$oid": "69f63be3685e1a7d2be6c8c7"
  },
  "name": "Yoga Mat Pro",
  "description": "Non-slip, eco-friendly TPE material. 6mm thickness for joint support. Includes carrying strap. 183cm x 61cm.",
  "price": 59.99,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
  "stock": 50,
  "rating": 4.4,
  "numReviews": 67,
  "reviews": [],
  "__v": 0,
  "createdAt": {
    "$date": "2026-05-02T18:01:07.677Z"
  },
  "updatedAt": {
    "$date": "2026-05-02T18:01:07.677Z"
  }
},
{
  "_id": {
    "$oid": "69f63be3685e1a7d2be6c8c8"
  },
  "name": "Smart LED Desk Lamp",
  "description": "Touch-controlled, 5 color temperatures, wireless Qi charging base. Memory function remembers last settings. USB-A port.",
  "price": 79.99,
  "category": "Home & Kitchen",
  "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
  "stock": 35,
  "rating": 4.3,
  "numReviews": 22,
  "reviews": [],
  "__v": 0,
  "createdAt": {
    "$date": "2026-05-02T18:01:07.677Z"
  },
  "updatedAt": {
    "$date": "2026-05-02T18:01:07.677Z"
  }
},
{
  "_id": {
    "$oid": "69f63be3685e1a7d2be6c8c9"
  },
  "name": "Running Shoes Elite",
  "description": "Lightweight carbon fiber plate, responsive foam midsole. Engineered mesh upper for breathability. Perfect for long distances.",
  "price": 219.99,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  "stock": 45,
  "rating": 4.6,
  "numReviews": 89,
  "reviews": [],
  "__v": 0,
  "createdAt": {
    "$date": "2026-05-02T18:01:07.677Z"
  },
  "updatedAt": {
    "$date": "2026-05-02T18:01:07.677Z"
  }
},
{
  "_id": {
    "$oid": "69f63c4b8e7bd157f4dd09e9"
  },
  "name": "Portable Bluetooth Speaker",
  "description": "360° surround sound, IPX7 waterproof, 24-hour battery life. Built-in microphone for hands-free calls. Pairs with two devices simultaneously.",
  "price": 89.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
  "stock": 40,
  "rating": 4.5,
  "numReviews": 38
},
{
  "_id": {
    "$oid": "69f63c4b8e7bd157f4dd09ea"
  },
  "name": "Stainless Steel Water Bottle",
  "description": "Triple-wall insulation keeps drinks cold 48h or hot 24h. 750ml capacity, leak-proof lid, BPA-free. Dishwasher safe.",
  "price": 34.99,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
  "stock": 80,
  "rating": 4.7,
  "numReviews": 112
},
{
  "_id": {
    "$oid": "69f63c4b8e7bd157f4dd09eb"
  },
  "name": "Linen Throw Pillow Set",
  "description": "Set of 2 premium linen pillows with removable covers. Hypoallergenic filling, available in 6 neutral tones. 45x45cm.",
  "price": 49.99,
  "category": "Home & Kitchen",
  "image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500",
  "stock": 53,
  "rating": 4.4,
  "numReviews": 29,
  "updatedAt": {
    "$date": "2026-05-02T18:15:59.088Z"
  }
},
{
  "_id": {
    "$oid": "69f63c4b8e7bd157f4dd09ec"
  },
  "name": "Slim Leather Wallet",
  "description": "Genuine full-grain leather, RFID blocking, holds 8 cards + cash. Ultra-slim 6mm profile. Gift box included.",
  "price": 44.99,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
  "stock": 60,
  "rating": 4.6,
  "numReviews": 74
},
{
  "_id": {
    "$oid": "69f63c4b8e7bd157f4dd09ed"
  },
  "name": "Adjustable Dumbbell Set",
  "description": "Quick-change dial system, replaces 6 pairs of dumbbells. 2.5kg to 24kg per dumbbell. Anti-roll ergonomic handle.",
  "price": 249.99,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
  "stock": 18,
  "rating": 4.8,
  "numReviews": 53
},
{
  "_id": {
    "$oid": "69f63c4b8e7bd157f4dd09ee"
  },
  "name": "Bamboo Cutting Board Set",
  "description": "Set of 3 organic bamboo boards in graduated sizes. Juice groove, non-slip feet, anti-bacterial surface. Dishwasher safe.",
  "price": 39.99,
  "category": "Home & Kitchen",
  "image": "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500",
  "stock": 70,
  "rating": 4.5,
  "numReviews": 61
},
{
  "_id": {
    "$oid": "69f63c4b8e7bd157f4dd09ef"
  },
  "name": "Wireless Charging Pad",
  "description": "15W fast Qi wireless charger, compatible with iPhone, Samsung, AirPods. LED indicator, over-heat protection. USB-C cable included.",
  "price": 29.99,
  "category": "Electronics",
  "image": "https://th.bing.com/th/id/OIP.hqpaoxPCEHnn2Bxz7t4cigHaG7?w=235&h=220&c=7&r=0&o=5&dpr=1.5&pid=1.7",
  "stock": 90,
  "rating": 3,
  "numReviews": 1,
  "__v": 1,
  "reviews": [
    {
      "user": {
        "$oid": "69f63ca390ca00cb3d5b778a"
      },
      "name": "rachid ouahidi",
      "rating": 3,
      "comment": "bon",
      "_id": {
        "$oid": "69f646a090ca00cb3d5b779c"
      },
      "createdAt": {
        "$date": "2026-05-02T18:46:56.297Z"
      },
      "updatedAt": {
        "$date": "2026-05-02T18:46:56.297Z"
      }
    }
  ],
  "updatedAt": {
    "$date": "2026-05-02T18:46:56.298Z"
  }
},
{
  "_id": {
    "$oid": "69f63c4b8e7bd157f4dd09f0"
  },
  "name": "Canvas Tote Bag",
  "description": "Heavy-duty 12oz cotton canvas, reinforced handles, inner zip pocket. 40L capacity. Machine washable. Eco-friendly alternative to plastic.",
  "price": 24.99,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500",
  "stock": 100,
  "rating": 4.3,
  "numReviews": 85
},
{
  "_id": {
    "$oid": "69f6480b8e7bd157f4dd09f3"
  },
  "name": "Casque à Réduction de Bruit Sans Fil",
  "description": "Technologie ANC hybride, autonomie de 30 heures, coussinets à mémoire de forme. Connexion Bluetooth 5.2 et étui de transport rigide inclus.",
  "price": 159.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  "stock": 25,
  "rating": 4.8,
  "numReviews": 156
},
{
  "_id": {
    "$oid": "69f6480b8e7bd157f4dd09f4"
  },
  "name": "Tapis de Yoga Éco-responsable",
  "description": "Fabriqué en TPE recyclable, surface antidérapante double face, épaisseur 6mm pour un confort optimal. Sangle de transport incluse.",
  "price": 39.99,
  "category": "Sports",
  "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0YcL1upKFG0z74rpiwWiAxnzFACxsl_wwow&s",
  "stock": 45,
  "rating": 4.6,
  "numReviews": 89
},
{
  "_id": {
    "$oid": "69f6480b8e7bd157f4dd09f5"
  },
  "name": "Cafetière à Piston en Verre",
  "description": "Verre borosilicaté résistant à la chaleur, système de filtration en acier inoxydable à 4 niveaux. Capacité 1L (8 tasses).",
  "price": 27.5,
  "category": "Home & Kitchen",
  "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500",
  "stock": 35,
  "rating": 4.5,
  "numReviews": 42
},
{
  "_id": {
    "$oid": "69f6480b8e7bd157f4dd09f6"
  },
  "name": "Lunettes de Soleil Polarisées",
  "description": "Protection UV400, monture en alliage d'aluminium ultra-légère. Style aviateur classique. Livrées avec chiffon de nettoyage.",
  "price": 59.99,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
  "stock": 50,
  "rating": 4.7,
  "numReviews": 128
},
{
  "_id": {
    "$oid": "69f6480b8e7bd157f4dd09f7"
  },
  "name": "Lampe de Bureau LED Tactile",
  "description": "5 modes de couleur, 10 niveaux de luminosité. Port de charge USB intégré, bras ajustable à 180° et minuterie d'arrêt automatique.",
  "price": 45,
  "category": "Home & Office",
  "image": "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500",
  "stock": 20,
  "rating": 4.4,
  "numReviews": 65
},
{
  "_id": {
    "$oid": "69f6480b8e7bd157f4dd09f8"
  },
  "name": "Sac à Dos de Randonnée 40L",
  "description": "Tissu nylon imperméable, compartiment pour poche d'eau, multiples poches extérieures. Système de ventilation dorsale ergonomique.",
  "price": 74.99,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  "stock": 15,
  "rating": 4.9,
  "numReviews": 34
},
{
  "_id": {
    "$oid": "69f6480b8e7bd157f4dd09f9"
  },
  "name": "Souris Ergonomique Sans Fil",
  "description": "Design vertical pour réduire la tension du poignet. Capteur optique réglable (800/1200/1600 DPI). Compatible Windows et Mac.",
  "price": 32.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
  "stock": 110,
  "rating": 4.3,
  "numReviews": 210
},
{
  "_id": {
    "$oid": "69f6480b8e7bd157f4dd09fa"
  },
  "name": "Bougie Parfumée au Soja",
  "description": "Cire de soja 100% naturelle, parfum lavande et eucalyptus. Mèche en coton sans plomb. Durée de combustion d'environ 50 heures.",
  "price": 19.5,
  "category": "Home & Kitchen",
  "image": "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500",
  "stock": 150,
  "rating": 4.6,
  "numReviews": 95
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd09fc"
  },
  "id": 1,
  "name": "Clavier Mécanique RGB",
  "description": "Switches bleus tactiles, rétroéclairage personnalisable, châssis en aluminium.",
  "price": 79.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500",
  "stock": 25,
  "rating": 4.7,
  "numReviews": 142
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd09fd"
  },
  "id": 2,
  "name": "Souris Gaming Sans Fil",
  "description": "Capteur 16000 DPI, 6 boutons programmables, autonomie 60h.",
  "price": 54.5,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
  "stock": 40,
  "rating": 4.5,
  "numReviews": 89
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd09fe"
  },
  "id": 3,
  "name": "Écran 27\" 4K UHD",
  "description": "Dalle IPS, HDR10, bordures ultra-fines, idéal pour le graphisme.",
  "price": 349.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
  "stock": 15,
  "rating": 4.8,
  "numReviews": 56
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd09ff"
  },
  "id": 4,
  "name": "Webcam 1080p Pro",
  "description": "Microphone réducteur de bruit, autofocus, volet de confidentialité.",
  "price": 65,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
  "stock": 30,
  "rating": 4.2,
  "numReviews": 74
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a00"
  },
  "id": 5,
  "name": "Batterie Externe 20000mAh",
  "description": "Charge rapide USB-C PD 20W, permet de charger 3 appareils.",
  "price": 39.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
  "stock": 100,
  "rating": 4.6,
  "numReviews": 210
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a01"
  },
  "id": 6,
  "name": "Disque Dur Externe 2To",
  "description": "USB 3.0, compact et résistant aux chocs. Compatible PC/Mac.",
  "price": 85,
  "category": "Electronics",
  "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgp86i7QzeIUSyPykhNuLI39YPdQNeve_-ZQ&s",
  "stock": 55,
  "rating": 4.4,
  "numReviews": 98
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a02"
  },
  "id": 7,
  "name": "Support Ordinateur Portable",
  "description": "Aluminium ventilé, réglable en hauteur, ergonomique.",
  "price": 29.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
  "stock": 65,
  "rating": 4.3,
  "numReviews": 45
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a03"
  },
  "id": 8,
  "name": "Enceinte PC 2.1",
  "description": "Caisson de basses dédié, 50W RMS, entrée jack et Bluetooth.",
  "price": 95,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
  "stock": 20,
  "rating": 4.1,
  "numReviews": 33
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a04"
  },
  "id": 9,
  "name": "Microphone USB Streaming",
  "description": "Condensateur haute fidélité, mode cardioïde, pied inclus.",
  "price": 110,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500",
  "stock": 18,
  "rating": 4.7,
  "numReviews": 82
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a05"
  },
  "id": 10,
  "name": "Lampe d'écran LED",
  "description": "Anti-éblouissement, température de couleur réglable, alimentation USB.",
  "price": 45,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500",
  "stock": 42,
  "rating": 4.5,
  "numReviews": 67
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a06"
  },
  "id": 11,
  "name": "Machine Espresso Automatique",
  "description": "Pression 15 bars, broyeur intégré, écran tactile.",
  "price": 499,
  "category": "Home & Kitchen",
  "image": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500",
  "stock": 10,
  "rating": 4.9,
  "numReviews": 120
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a07"
  },
  "id": 12,
  "name": "Friteuse sans Huile",
  "description": "Capacité 5L, 8 programmes, technologie circulation d'air chaud.",
  "price": 129.99,
  "category": "Home & Kitchen",
  "image": "https://taurusmaroc.ma/wp-content/uploads/2023/06/FRITEUSE-TAURUS-12-12-600x600.jpg",
  "stock": 25,
  "rating": 4.7,
  "numReviews": 340
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a08"
  },
  "id": 13,
  "name": "Set de Couteaux Japonais",
  "description": "Acier Damas, 5 pièces avec bloc en bois magnétique.",
  "price": 189,
  "category": "Home & Kitchen",
  "image": "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500",
  "stock": 15,
  "rating": 4.8,
  "numReviews": 54
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a09"
  },
  "id": 14,
  "name": "Robot Pâtissier 6L",
  "description": "Moteur puissant 1200W, kit pâtisserie inclus (fouet, crochet).",
  "price": 250,
  "category": "Home & Kitchen",
  "image": "https://ma.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/33/810846/1.jpg?2909",
  "stock": 12,
  "rating": 4.6,
  "numReviews": 88
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a0a"
  },
  "id": 15,
  "name": "Bouilloire Électrique Design",
  "description": "Inox noir mat, réglage de température au degré près.",
  "price": 69.99,
  "category": "Home & Kitchen",
  "image": "https://www.integral-location.ma/app/uploads/2021/02/BL002.jpg",
  "stock": 35,
  "rating": 4.4,
  "numReviews": 112
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a0b"
  },
  "id": 16,
  "name": "Poêle en Fonte 30cm",
  "description": "Pré-assaisonnée, compatible tous feux dont induction.",
  "price": 45,
  "category": "Home & Kitchen",
  "image": "https://www.galer.eu/896-large_default/poele-en-fonte-o-30cm.jpg",
  "stock": 50,
  "rating": 4.7,
  "numReviews": 215
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a0c"
  },
  "id": 17,
  "name": "Mélangeur Plongeant",
  "description": "800W, pied amovible inox, livré avec hachoir et fouet.",
  "price": 55,
  "category": "Home & Kitchen",
  "image": "https://ma.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/06/411514/1.jpg?2106",
  "stock": 40,
  "rating": 4.3,
  "numReviews": 76
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a0d"
  },
  "id": 18,
  "name": "Balance de Cuisine Digitale",
  "description": "Précision au gramme, fonction tare, surface en verre trempé.",
  "price": 19.99,
  "category": "Home & Kitchen",
  "image": "https://images.unsplash.com/photo-1591130901921-3f0652bb3915?w=500",
  "stock": 80,
  "rating": 4.5,
  "numReviews": 145
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a0e"
  },
  "id": 19,
  "name": "Aspirateur Balai Sans Fil",
  "description": "Puissance 150AW, autonomie 45 min, filtre HEPA.",
  "price": 299,
  "category": "Home & Kitchen",
  "image": "https://www.eziclean.ma/cdn/shop/files/aspirateursansfilezilceanR12flex.jpg?v=1726753588",
  "stock": 20,
  "rating": 4.6,
  "numReviews": 92
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a0f"
  },
  "id": 20,
  "name": "Purificateur d'Air",
  "description": "Filtre 3-en-1, élimine 99% des allergènes, mode nuit silencieux.",
  "price": 149,
  "category": "Home & Kitchen",
  "image": "https://tangerois.ma/28798-large_default/purificateur-d-air-tp7a-eu-dyson.webp",
  "stock": 28,
  "rating": 4.7,
  "numReviews": 58
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a10"
  },
  "id": 21,
  "name": "Veste de Randonnée Hardshell",
  "description": "Imperméable, respirante, capuche réglable, idéale haute montagne.",
  "price": 129,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=500",
  "stock": 30,
  "rating": 4.8,
  "numReviews": 44
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a11"
  },
  "id": 22,
  "name": "Tapis de Course Pliable",
  "description": "Vitesse 12km/h, écran LCD, 12 programmes d'entraînement.",
  "price": 450,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500",
  "stock": 8,
  "rating": 4.5,
  "numReviews": 29
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a12"
  },
  "id": 23,
  "name": "Set de Bandes Résistances",
  "description": "5 niveaux de force, avec poignées et attaches chevilles.",
  "price": 24.99,
  "category": "Sports",
  "image": "https://www.fitnessdigital.fr/images/productos/XL/19/Tunturi-Exercise-Resistance-1.jpg",
  "stock": 120,
  "rating": 4.4,
  "numReviews": 180
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a13"
  },
  "id": 24,
  "name": "Ballon de Yoga Anti-éclatement",
  "description": "Diamètre 65cm, pompe incluse, supporte jusqu'à 200kg.",
  "price": 19.5,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500",
  "stock": 60,
  "rating": 4.6,
  "numReviews": 65
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a14"
  },
  "id": 25,
  "name": "Montre de Sport GPS",
  "description": "Suivi cardiaque, cartographie, étanche 50m, multisports.",
  "price": 199.99,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
  "stock": 45,
  "rating": 4.7,
  "numReviews": 110
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a15"
  },
  "id": 26,
  "name": "Raquette de Tennis Pro",
  "description": "Graphite haute densité, équilibre parfait, cordage inclus.",
  "price": 145,
  "category": "Sports",
  "image": "https://m.media-amazon.com/images/I/71a3nHqqbRL._AC_SL1500_.jpg",
  "stock": 22,
  "rating": 4.5,
  "numReviews": 37
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a16"
  },
  "id": 27,
  "name": "Sac de Couchage 0°C",
  "description": "Garnissage synthétique chaud, forme sarcophage, ultra léger.",
  "price": 79,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500",
  "stock": 35,
  "rating": 4.3,
  "numReviews": 52
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a17"
  },
  "id": 28,
  "name": "Lampe Frontale 500 Lumens",
  "description": "Rechargeable USB, plusieurs modes d'éclairage, bandeau lavable.",
  "price": 34.99,
  "category": "Sports",
  "image": "https://groupepronature.ca/cdn/shop/files/LampefrontaleCyprus-500Lumens_SKH-500AA3IR_3000x3000.jpg?v=1684251995\n",
  "stock": 75,
  "rating": 4.6,
  "numReviews": 89
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a18"
  },
  "id": 29,
  "name": "Vélo d'Appartement Magnétique",
  "description": "8 niveaux de résistance, selle ajustable, capteurs de pouls.",
  "price": 189,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
  "stock": 14,
  "rating": 4.4,
  "numReviews": 41
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a19"
  },
  "id": 30,
  "name": "Corde à Sauter de Vitesse",
  "description": "Câble en acier gainé, roulements à billes, longueur réglable.",
  "price": 12.99,
  "category": "Sports",
  "image": "https://images.unsplash.com/photo-1434596922112-19c563067271?w=500",
  "stock": 150,
  "rating": 4.8,
  "numReviews": 130
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a1a"
  },
  "id": 31,
  "name": "Montre Homme Chronographe",
  "description": "Bracelet cuir marron, cadran noir, étanche 3 ATM.",
  "price": 115,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
  "stock": 25,
  "rating": 4.6,
  "numReviews": 84
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a1b"
  },
  "id": 32,
  "name": "Sac à Main en Cuir",
  "description": "Design italien, bandoulière amovible, compartiments intérieurs.",
  "price": 159,
  "category": "Fashion",
  "image": "https://ma.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/26/923854/1.jpg?0526",
  "stock": 18,
  "rating": 4.7,
  "numReviews": 47
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a1c"
  },
  "id": 33,
  "name": "Baskets Urbaines",
  "description": "Look rétro, semelle confortable, matériaux durables.",
  "price": 89.99,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
  "stock": 40,
  "rating": 4.5,
  "numReviews": 156
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a1d"
  },
  "id": 34,
  "name": "Lunettes de Vue Blue Light",
  "description": "Filtre la lumière bleue des écrans, monture polycarbonate légère.",
  "price": 25,
  "category": "Fashion",
  "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOt0wSh_k2i-Jr3_M8Gte-7D1u1giBU2XA3A&s",
  "stock": 90,
  "rating": 4.3,
  "numReviews": 72
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a1e"
  },
  "id": 35,
  "name": "Écharpe en Cachemire",
  "description": "100% cachemire, douce et chaude, plusieurs couleurs disponibles.",
  "price": 55,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500",
  "stock": 50,
  "rating": 4.9,
  "numReviews": 39
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a1f"
  },
  "id": 36,
  "name": "Ceinture Réversible en Cuir",
  "description": "Noir/Marron, boucle rotative, cuir véritable.",
  "price": 32.5,
  "category": "Fashion",
  "image": "https://productimage.zegna.com/is/image/zegna/LHBOV-B027AZ-NER-F?wid=412&hei=549",
  "stock": 65,
  "rating": 4.4,
  "numReviews": 58
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a20"
  },
  "id": 37,
  "name": "Chapeau de Soleil en Paille",
  "description": "Large bord, ruban élégant, protection solaire UPF 50+.",
  "price": 22,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=500",
  "stock": 35,
  "rating": 4.2,
  "numReviews": 21
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a21"
  },
  "id": 38,
  "name": "Pyjama en Coton Bio",
  "description": "Ensemble haut et pantalon, tissu ultra-doux, coupe décontractée.",
  "price": 45,
  "category": "Fashion",
  "image": "https://snagtights.eu/cdn/shop/files/Andreea-Size-C-PJs-Sweet-Treat1_62a96e9a-a6f5-4e6d-9567-35feb65ba642.jpg?v=1770740802",
  "stock": 42,
  "rating": 4.6,
  "numReviews": 44
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a22"
  },
  "id": 39,
  "name": "Portefeuille RFID Femme",
  "description": "Grande capacité, cuir synthétique premium, protection données.",
  "price": 28,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
  "stock": 85,
  "rating": 4.5,
  "numReviews": 93
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a23"
  },
  "id": 40,
  "name": "Gants en Cuir Tactiles",
  "description": "Doublure polaire, bout des doigts compatible écrans tactiles.",
  "price": 39,
  "category": "Fashion",
  "image": "https://images.unsplash.com/photo-1542103749-8ef59b94f47e?w=500",
  "stock": 25,
  "rating": 4.7,
  "numReviews": 31
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a24"
  },
  "id": 41,
  "name": "Sérum Visage Vitamine C",
  "description": "Éclaircissant, anti-âge, flacon compte-gouttes 30ml.",
  "price": 34.5,
  "category": "Beauty",
  "image": "https://ma.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/19/575665/1.jpg?6825",
  "stock": 60,
  "rating": 4.8,
  "numReviews": 122
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a25"
  },
  "id": 42,
  "name": "Sèche-Cheveux Ionique",
  "description": "2200W, réduit les frisottis, concentrateur et diffuseur inclus.",
  "price": 59.99,
  "category": "Beauty",
  "image": "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500",
  "stock": 40,
  "rating": 4.4,
  "numReviews": 154
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a26"
  },
  "id": 43,
  "name": "Brosse à Dents Électrique",
  "description": "Minuteur 2 min, 3 modes de brossage, étui de voyage.",
  "price": 49,
  "category": "Beauty",
  "image": "https://coinpara.ma/13060-large_default/oral-b-brosse-a-dent-rechargeable-d-20-profes-care-3000.jpg",
  "stock": 110,
  "rating": 4.7,
  "numReviews": 320
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a27"
  },
  "id": 44,
  "name": "Palette d'Ombres à Paupières",
  "description": "18 teintes mates et irisées, haute pigmentation.",
  "price": 38,
  "category": "Beauty",
  "image": "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=500",
  "stock": 55,
  "rating": 4.5,
  "numReviews": 67
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a28"
  },
  "id": 45,
  "name": "Huile de Barbe Organique",
  "description": "Hydrate et adoucit, parfum bois de santal, 50ml.",
  "price": 19.99,
  "category": "Beauty",
  "image": "https://hendiya.com/cdn/shop/files/Packshot_Huile_Confort_Serum_Visage_et_Barbe_Hommes_Hendiya_Bio_ee0b6d6e-c20e-4730-a808-2b7fadce9351_2048x.jpg?v=1757620918",
  "stock": 90,
  "rating": 4.6,
  "numReviews": 45
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a29"
  },
  "id": 46,
  "name": "Masque Visage Argile Rose",
  "description": "Nettoyage profond, affine le grain de peau, bio.",
  "price": 22.5,
  "category": "Beauty",
  "image": "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500",
  "stock": 70,
  "rating": 4.3,
  "numReviews": 89
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a2a"
  },
  "id": 47,
  "name": "Rasoir Électrique Sans Fil",
  "description": "Têtes rotatives 4D, utilisable sous la douche, charge rapide.",
  "price": 89,
  "category": "Beauty",
  "image": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500",
  "stock": 35,
  "rating": 4.5,
  "numReviews": 112
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a2b"
  },
  "id": 48,
  "name": "Crème Solaire Visage SPF 50+",
  "description": "Non grasse, résistante à l'eau, protège contre UVA/UVB.",
  "price": 18,
  "category": "Beauty",
  "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
  "stock": 130,
  "rating": 4.7,
  "numReviews": 95
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a2c"
  },
  "id": 49,
  "name": "Rouge à Lèvres Mat Longue Tenue",
  "description": "Texture crémeuse, sans transfert, couleur rouge intense.",
  "price": 15,
  "category": "Beauty",
  "image": "https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=500",
  "stock": 200,
  "rating": 4.4,
  "numReviews": 140
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a2d"
  },
  "id": 50,
  "name": "Set de Pinceaux de Maquillage",
  "description": "12 pinceaux pro, poils synthétiques doux, pochette incluse.",
  "price": 32,
  "category": "Beauty",
  "image": "https://media.sephora.eu/content/dam/digital/pim/published/S/SEPHORA_COLLECTION/697583/337978-media_swatch.jpg?scaleWidth=750&scaleHeight=750&scaleMode=fit",
  "stock": 45,
  "rating": 4.8,
  "numReviews": 78
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a2e"
  },
  "id": 51,
  "name": "Carnet de Notes A5 Cuir",
  "description": "Papier recyclé premium, couverture rigide, fermeture élastique.",
  "price": 14.99,
  "category": "Office",
  "image": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500",
  "stock": 120,
  "rating": 4.7,
  "numReviews": 56
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a2f"
  },
  "id": 52,
  "name": "Stylo Plume Luxe",
  "description": "Corps en métal, plume en acier inoxydable, coffret cadeau.",
  "price": 45,
  "category": "Office",
  "image": "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=500",
  "stock": 30,
  "rating": 4.9,
  "numReviews": 28
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a30"
  },
  "id": 53,
  "name": "Organiseur de Bureau Bambou",
  "description": "Compartiments pour stylos, courrier et smartphone.",
  "price": 24.5,
  "category": "Office",
  "image": "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=500",
  "stock": 55,
  "rating": 4.5,
  "numReviews": 42
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a31"
  },
  "id": 54,
  "name": "Destructeur de Documents",
  "description": "Coupe croisée, détruit jusqu'à 6 feuilles simultanément.",
  "price": 59,
  "category": "Office",
  "image": "https://reperstore.net/2424-large_default/destructeur-de-documents-olympia-ps-54-cc.jpg",
  "stock": 15,
  "rating": 4.2,
  "numReviews": 35
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a32"
  },
  "id": 55,
  "name": "Chaise de Bureau Ergonomique",
  "description": "Dossier maille, support lombaire réglable, accoudoirs 2D.",
  "price": 189,
  "category": "Office",
  "image": "https://bigoffice.ma/wp-content/uploads/2024/05/Chaise-de-bureau-ergonomique-en-mesh-noir-avec-accoudoirs-reglables-et-roulettes-1.png",
  "stock": 10,
  "rating": 4.6,
  "numReviews": 64
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a33"
  },
  "id": 56,
  "name": "Agrafeuse Sans Effort",
  "description": "Technologie à ressort, réduit l'effort de 50%, capacité 30 f.",
  "price": 12,
  "category": "Office",
  "image": "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=500",
  "stock": 100,
  "rating": 4.4,
  "numReviews": 18
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a34"
  },
  "id": 57,
  "name": "Tableau Blanc Magnétique",
  "description": "90x60cm, cadre alu, livré avec effaceur et aimants.",
  "price": 39.99,
  "category": "Office",
  "image": "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500",
  "stock": 25,
  "rating": 4.3,
  "numReviews": 29
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a35"
  },
  "id": 58,
  "name": "Set de Marqueurs Colorés",
  "description": "24 couleurs, double pointe (fine et large), séchage rapide.",
  "price": 18.5,
  "category": "Office",
  "image": "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=500",
  "stock": 80,
  "rating": 4.7,
  "numReviews": 110
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a36"
  },
  "id": 59,
  "name": "Calculatrice Scientifique",
  "description": "Plus de 250 fonctions, écran 2 lignes, solaire et piles.",
  "price": 22,
  "category": "Office",
  "image": "https://ma.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/53/394656/1.jpg?9605",
  "stock": 60,
  "rating": 4.6,
  "numReviews": 48
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a37"
  },
  "id": 60,
  "name": "Lampe de Bureau Architecte",
  "description": "Bras articulé, pince de fixation, douille E27.",
  "price": 35,
  "category": "Office",
  "image": "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500",
  "stock": 45,
  "rating": 4.4,
  "numReviews": 53
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a38"
  },
  "id": 61,
  "name": "Taille-haie Électrique",
  "description": "Lame 55cm, moteur 600W, poignée pivotante.",
  "price": 89,
  "category": "Garden",
  "image": "https://images.unsplash.com/photo-1599423300746-b62533397364?w=500",
  "stock": 20,
  "rating": 4.5,
  "numReviews": 38
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a39"
  },
  "id": 62,
  "name": "Set d'Outils de Jardinage",
  "description": "10 pièces inox avec sac de transport et gants.",
  "price": 34.99,
  "category": "Garden",
  "image": "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500",
  "stock": 50,
  "rating": 4.6,
  "numReviews": 92
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a3a"
  },
  "id": 63,
  "name": "Tuyau d'Arrosage Extensible",
  "description": "30m, pistolet 8 fonctions, ne s'emmêle pas.",
  "price": 29.5,
  "category": "Garden",
  "image": "https://mrbricolage.ma/wp-content/uploads/2022/07/854549-1.jpg",
  "stock": 75,
  "rating": 4.2,
  "numReviews": 115
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a3b"
  },
  "id": 64,
  "name": "Hamac de Jardin",
  "description": "Coton tissé, supporte 2 personnes (200kg), sac de rangement.",
  "price": 39.99,
  "category": "Garden",
  "image": "https://images.unsplash.com/photo-1531303435785-3853ba035cda?w=500",
  "stock": 40,
  "rating": 4.8,
  "numReviews": 63
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a3c"
  },
  "id": 65,
  "name": "Projecteur Solaire Extérieur",
  "description": "LED 1000 lumens, détecteur de mouvement, étanche IP65.",
  "price": 24,
  "category": "Garden",
  "image": "https://goldlight.ma/cdn/shop/products/Picsart_22-02-18_20-40-08-772_e99cfdb2-86e6-43a3-ab7d-f729a1294d0d.jpg?v=1645215100",
  "stock": 95,
  "rating": 4.4,
  "numReviews": 150
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a3d"
  },
  "id": 66,
  "name": "Barbecue à Charbon",
  "description": "Couvercle émaillé, thermomètre intégré, roues de transport.",
  "price": 125,
  "category": "Garden",
  "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500",
  "stock": 15,
  "rating": 4.7,
  "numReviews": 42
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a3e"
  },
  "id": 67,
  "name": "Gants de Jardinage Anti-ronces",
  "description": "Cuir de chèvre, manchettes longues protectrices.",
  "price": 18,
  "category": "Garden",
  "image": "https://cdn.oogarden.net/Product/0288/0288-0083/0288-0083-Zoom-01.jpg",
  "stock": 110,
  "rating": 4.5,
  "numReviews": 27
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a3f"
  },
  "id": 68,
  "name": "Composteur Domestique 300L",
  "description": "Plastique recyclé, aération optimale, montage sans outils.",
  "price": 49,
  "category": "Garden",
  "image": "https://media2.hubo.be/img/Eco-Master-composteur-domestique-300l-noir_04023122154525.jpg?base=derivates&s1=3&s2=001&s3=109&s4=015&name=04023122154525_000.jpg",
  "stock": 25,
  "rating": 4.3,
  "numReviews": 34
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a40"
  },
  "id": 69,
  "name": "Table de Jardin Pliante",
  "description": "Aspect bois, résine haute densité, facile d'entretien.",
  "price": 75,
  "category": "Garden",
  "image": "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=500",
  "stock": 30,
  "rating": 4.1,
  "numReviews": 21
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a41"
  },
  "id": 70,
  "name": "Nain de Jardin Moderne",
  "description": "Résine peinte à la main, design humoristique, résiste au gel.",
  "price": 19.99,
  "category": "Garden",
  "image": "https://www.wanda-collection.com/18861-large_default/sculpture-jardin-deco-tomte-50-cm-turquoise.jpg",
  "stock": 60,
  "rating": 4.6,
  "numReviews": 55
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a42"
  },
  "id": 71,
  "name": "Panier pour Chien Apaisant",
  "description": "Peluche ultra-douce, rebord surélevé, lavable en machine.",
  "price": 35.5,
  "category": "Pets",
  "image": "https://dandysdog.com/wp-content/uploads/2022/03/bouledogue-panier-anti-stress-apaisant-chien.png",
  "stock": 45,
  "rating": 4.8,
  "numReviews": 132
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a43"
  },
  "id": 72,
  "name": "Fontaine à Eau pour Chat",
  "description": "Filtre charbon actif, capacité 2L, pompe ultra-silencieuse.",
  "price": 28.99,
  "category": "Pets",
  "image": "https://animalux.ma/cdn/shop/files/1_78.jpg?v=1711032778",
  "stock": 65,
  "rating": 4.5,
  "numReviews": 84
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a44"
  },
  "id": 73,
  "name": "Laisse Enroulable 5m",
  "description": "Poignée ergonomique, système de freinage rapide, pour chiens < 25kg.",
  "price": 16,
  "category": "Pets",
  "image": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500",
  "stock": 90,
  "rating": 4.4,
  "numReviews": 56
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a45"
  },
  "id": 74,
  "name": "Arbre à Chat 140cm",
  "description": "Plusieurs niveaux, griffoirs sisal, plateformes et cachettes.",
  "price": 79,
  "category": "Pets",
  "image": "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500",
  "stock": 12,
  "rating": 4.7,
  "numReviews": 49
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a46"
  },
  "id": 75,
  "name": "Sac de Transport Animaux",
  "description": "Homologué avion, ventilation mesh, coussin intérieur amovible.",
  "price": 32.5,
  "category": "Pets",
  "image": "https://www.animalsouk.ma/animalerie-maroc/wp-content/uploads/2025/08/d1b49812e0adb25d00361e5aa13cd030.webp",
  "stock": 35,
  "rating": 4.6,
  "numReviews": 37
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a47"
  },
  "id": 76,
  "name": "Brosse de Toilettage Vapeur",
  "description": "Élimine les poils morts, fonction vapeur pour détendre le poil.",
  "price": 19.99,
  "category": "Pets",
  "image": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500",
  "stock": 80,
  "rating": 4.3,
  "numReviews": 120
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a48"
  },
  "id": 77,
  "name": "Jouet Interactif pour Chien",
  "description": "Lanceur de balles automatique, distance réglable.",
  "price": 85,
  "category": "Pets",
  "image": "https://wigglie.ma/cdn/shop/files/38.jpg?v=1742934592&width=400",
  "stock": 20,
  "rating": 4.5,
  "numReviews": 28
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a49"
  },
  "id": 78,
  "name": "Gamelle Anti-glouton",
  "description": "Labyrinthe intérieur, favorise une digestion lente.",
  "price": 12.5,
  "category": "Pets",
  "image": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500",
  "stock": 150,
  "rating": 4.4,
  "numReviews": 64
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a4a"
  },
  "id": 79,
  "name": "Harnais de Sécurité Voiture",
  "description": "Sangle réglable, attache sur clip ceinture, confort rembourré.",
  "price": 14,
  "category": "Pets",
  "image": "https://image.made-in-china.com/202f0j00ZIrfdTOAkSbi/Universal-Material-Safety-Belt-3-Point-Car-Seatbelt-with-Retractor.webp",
  "stock": 110,
  "rating": 4.2,
  "numReviews": 41
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a4b"
  },
  "id": 80,
  "name": "Shampooing Chien Peaux Sensibles",
  "description": "À l'aloe vera et avoine, sans parabène, 500ml.",
  "price": 11.99,
  "category": "Pets",
  "image": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500",
  "stock": 100,
  "rating": 4.7,
  "numReviews": 53
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a4c"
  },
  "id": 81,
  "name": "Casque VR Autonome",
  "description": "Pas besoin de PC, stockage 128Go, contrôleurs inclus.",
  "price": 449,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500",
  "stock": 15,
  "rating": 4.8,
  "numReviews": 95
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a4d"
  },
  "id": 82,
  "name": "Liseuse Numérique 7\"",
  "description": "Étanche, lumière chaude réglable, stockage 32Go.",
  "price": 179,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500",
  "stock": 40,
  "rating": 4.7,
  "numReviews": 210
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a4e"
  },
  "id": 83,
  "name": "Tablette Graphique Pro",
  "description": "Stylet sans pile, 8192 niveaux de pression, 8 touches raccourcis.",
  "price": 85,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=500",
  "stock": 25,
  "rating": 4.5,
  "numReviews": 62
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a4f"
  },
  "id": 84,
  "name": "Caméra de Surveillance WiFi",
  "description": "Vision nocturne, détection humaine, audio bidirectionnel.",
  "price": 49.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1557862921-37829c790f19?w=500",
  "stock": 80,
  "rating": 4.3,
  "numReviews": 145
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a50"
  },
  "id": 85,
  "name": "Routeur WiFi 6",
  "description": "Vitesse jusqu'à 3000 Mbps, couverture 4 pièces, 4 ports LAN.",
  "price": 110,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500",
  "stock": 22,
  "rating": 4.6,
  "numReviews": 58
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a51"
  },
  "id": 86,
  "name": "Mini Vidéoprojecteur",
  "description": "Full HD 1080p supporté, HDMI/USB, haut-parleurs intégrés.",
  "price": 135,
  "category": "Electronics",
  "image": "https://fournishop.ma/32184-large_default/-mini-videoprojecteur-pico-qumi-q5-.jpg",
  "stock": 35,
  "rating": 4.2,
  "numReviews": 89
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a52"
  },
  "id": 87,
  "name": "Contrôleur DJ USB",
  "description": "2 platines, carte son intégrée, compatible Serato/Djay.",
  "price": 249,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500",
  "stock": 10,
  "rating": 4.9,
  "numReviews": 34
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a53"
  },
  "id": 88,
  "name": "Hub USB-C 7-en-1",
  "description": "Sortie HDMI 4K, 3 ports USB 3.0, lecteurs SD/TF.",
  "price": 35,
  "category": "Electronics",
  "image": "https://pcgamercasa.ma/13736-large_default/hub-usb-c-hp-7-en-1-supporte-pd-power-delivery-50h55aa-pc-gamer-casa-maroc.jpg",
  "stock": 150,
  "rating": 4.4,
  "numReviews": 178
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a54"
  },
  "id": 89,
  "name": "Clé Streaming TV 4K",
  "description": "Accès direct Netflix, Prime, YouTube. Commande vocale.",
  "price": 59.99,
  "category": "Electronics",
  "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500",
  "stock": 120,
  "rating": 4.7,
  "numReviews": 540
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a55"
  },
  "id": 90,
  "name": "Ventilateur de Bureau USB",
  "description": "Silencieux, rotation 360°, 3 vitesses.",
  "price": 15.5,
  "category": "Electronics",
  "image": "https://ma.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/27/375556/1.jpg?2644",
  "stock": 200,
  "rating": 4.1,
  "numReviews": 45
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a56"
  },
  "id": 91,
  "name": "Miroir Lumineux LED",
  "description": "Anti-buée, luminosité réglable, idéal maquillage.",
  "price": 75,
  "category": "Home",
  "image": "https://www.bricosmart.ma/33544-large_default/miroir-led-6080-cm-cadre-noir-3000k.jpg",
  "stock": 25,
  "rating": 4.5,
  "numReviews": 57
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a57"
  },
  "id": 92,
  "name": "Tapis Berbère Salon",
  "description": "160x230cm, motifs géométriques, laine synthétique douce.",
  "price": 149,
  "category": "Home",
  "image": "https://images.unsplash.com/photo-1531303435785-3853ba035cda?w=500",
  "stock": 15,
  "rating": 4.8,
  "numReviews": 42
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a58"
  },
  "id": 93,
  "name": "Plaids en Grosse Maille",
  "description": "Tissé main, très chaud, style scandinave.",
  "price": 45,
  "category": "Home",
  "image": "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?w=500",
  "stock": 40,
  "rating": 4.6,
  "numReviews": 81
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a59"
  },
  "id": 94,
  "name": "Étagère Échelle Bois",
  "description": "4 niveaux, structure bambou, design minimaliste.",
  "price": 59.99,
  "category": "Home",
  "image": "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500",
  "stock": 20,
  "rating": 4.4,
  "numReviews": 29
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a5a"
  },
  "id": 95,
  "name": "Bougeoir en Marbre",
  "description": "Set de 2, base lourde, pour bougies flambeaux.",
  "price": 32,
  "category": "Home",
  "image": "https://cdn.shopify.com/s/files/1/0613/3107/9307/files/DEQ23WES99804-193052_b1e1bbad54934eae9920ad18e2dff5cd_mod_2.jpg?v=1728484906&width=420&height=560&crop=center",
  "stock": 35,
  "rating": 4.3,
  "numReviews": 14
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a5b"
  },
  "id": 96,
  "name": "Vase en Verre Recyclé",
  "description": "Soufflé à la bouche, couleur bleu océan, h 30cm.",
  "price": 28.5,
  "category": "Home",
  "image": "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500",
  "stock": 50,
  "rating": 4.7,
  "numReviews": 23
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a5c"
  },
  "id": 97,
  "name": "Réveil Simulateur d'Aube",
  "description": "Radio FM, 7 sons naturels, simulation lever de soleil.",
  "price": 49,
  "category": "Home",
  "image": "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=500",
  "stock": 45,
  "rating": 4.5,
  "numReviews": 112
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a5d"
  },
  "id": 98,
  "name": "Distributeur de Savon Automatique",
  "description": "Capteur infrarouge, finition inox brossé, 400ml.",
  "price": 24.99,
  "category": "Home",
  "image": "https://assina.ma/wp-content/uploads/2023/12/distributeur-de-savon-automatique-avec-capteur-intelligent-infrarouge-au-maroc.jpg",
  "stock": 80,
  "rating": 4.2,
  "numReviews": 65
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a5e"
  },
  "id": 99,
  "name": "Mousseline de Lit (Linge de lit)",
  "description": "Housse de couette + 2 taies, 100% coton lavé.",
  "price": 65,
  "category": "Home",
  "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500",
  "stock": 30,
  "rating": 4.9,
  "numReviews": 56
},
{
  "_id": {
    "$oid": "69f648998e7bd157f4dd0a5f"
  },
  "id": 100,
  "name": "Parfum d'Intérieur Vanille",
  "description": "Bâtonnets diffuseurs, parfum longue durée 3 mois.",
  "price": 18,
  "category": "Home",
  "image": "https://www.coeurdecigale.com/wp-content/uploads/2023/02/parfum-ambiance-vanille-scaled.jpg",
  "stock": 150,
  "rating": 4.6,
  "numReviews": 48
}];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await Product.deleteMany();
    console.log('Products cleared');

    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} products seeded`);

    // Create an admin user
    await User.deleteMany({ email: 'admin@shop.com' });
    await User.create({
      name: 'Admin',
      email: 'admin@shop.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user created: admin@shop.com / admin123');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();