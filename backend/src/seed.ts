import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-panel';

// Define schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  status: String,
  role: String,
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  orderNumber: String,
  customerName: String,
  product: String,
  amount: Number,
  status: String,
  description: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', OrderSchema);

const users = [
  { name: 'สมชาย ใจดี', email: 'somchai@example.com', phone: '081-234-5678', status: 'active', role: 'admin' },
  { name: 'สมหญิง รักดี', email: 'somying@example.com', phone: '082-345-6789', status: 'active', role: 'user' },
  { name: 'ประเสริฐ สุขใจ', email: 'prasert@example.com', phone: '083-456-7890', status: 'active', role: 'user' },
  { name: 'วิภา มีสุข', email: 'wipa@example.com', phone: '084-567-8901', status: 'active', role: 'user' },
  { name: 'นิรันดร์ เจริญ', email: 'niran@example.com', phone: '085-678-9012', status: 'inactive', role: 'user' },
];

const orders = [
  { orderNumber: 'ORD-001', customerName: 'สมชาย ใจดี', product: 'โน้ตบุ๊ค Dell XPS', amount: 45000, status: 'completed', description: 'จัดส่งเรียบร้อย' },
  { orderNumber: 'ORD-002', customerName: 'สมหญิง รักดี', product: 'iPhone 15 Pro', amount: 42000, status: 'pending', description: 'รอการชำระเงิน' },
  { orderNumber: 'ORD-003', customerName: 'ประเสริฐ สุขใจ', product: 'iPad Air', amount: 25000, status: 'completed', description: 'จัดส่งแล้ว' },
  { orderNumber: 'ORD-004', customerName: 'วิภา มีสุข', product: 'MacBook Pro', amount: 65000, status: 'processing', description: 'กำลังจัดเตรียมสินค้า' },
  { orderNumber: 'ORD-005', customerName: 'นิรันดร์ เจริญ', product: 'AirPods Pro', amount: 8900, status: 'completed', description: 'จัดส่งเรียบร้อย' },
  { orderNumber: 'ORD-006', customerName: 'สมชาย ใจดี', product: 'Apple Watch', amount: 15000, status: 'pending', description: 'รอการยืนยัน' },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Order.deleteMany({});

    // Insert users
    console.log('Inserting users...');
    await User.insertMany(users);
    console.log(`Inserted ${users.length} users`);

    // Insert orders
    console.log('Inserting orders...');
    await Order.insertMany(orders);
    console.log(`Inserted ${orders.length} orders`);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
