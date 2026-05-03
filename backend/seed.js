const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-fidelity audio with active noise cancellation. 30-hour battery life, premium leather cushions, and studio-quality sound.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 25,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Minimalist Leather Watch',
    description: 'Swiss movement, genuine leather strap, sapphire crystal glass. Water resistant to 50m. Timeless elegance for every occasion.',
    price: 189.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    stock: 15,
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical switches, aluminum frame, N-key rollover. Compatible with Windows and Mac. USB-C detachable cable.',
    price: 149.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500',
    stock: 30,
    rating: 4.6,
    numReviews: 18,
  },
  {
    name: 'Merino Wool Sweater',
    description: 'Ultra-soft 100% merino wool. Temperature regulating, odor resistant, and machine washable. Available in multiple colors.',
    price: 89.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500',
    stock: 40,
    rating: 4.7,
    numReviews: 31,
  },
  {
    name: 'Ceramic Pour-Over Coffee Set',
    description: 'Handcrafted ceramic dripper and carafe set. Includes 50 filters. Makes 2-4 cups of exceptional specialty coffee.',
    price: 65.00,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
    stock: 20,
    rating: 4.9,
    numReviews: 45,
  },
  {
    name: 'Yoga Mat Pro',
    description: 'Non-slip, eco-friendly TPE material. 6mm thickness for joint support. Includes carrying strap. 183cm x 61cm.',
    price: 59.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    stock: 50,
    rating: 4.4,
    numReviews: 67,
  },
  {
    name: 'Smart LED Desk Lamp',
    description: 'Touch-controlled, 5 color temperatures, wireless Qi charging base. Memory function remembers last settings. USB-A port.',
    price: 79.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    stock: 35,
    rating: 4.3,
    numReviews: 22,
  },
  {
    name: 'Running Shoes Elite',
    description: 'Lightweight carbon fiber plate, responsive foam midsole. Engineered mesh upper for breathability. Perfect for long distances.',
    price: 219.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    stock: 45,
    rating: 4.6,
    numReviews: 89,
  },
];

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