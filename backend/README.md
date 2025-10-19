# Admin Panel Backend

NestJS backend with MongoDB for the admin panel application.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/admin-panel
PORT=3001
```

## Running MongoDB

### Using Docker (recommended):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Or install MongoDB locally:
Follow instructions at https://www.mongodb.com/docs/manual/installation/

## Database Seeding

Seed the database with initial data:

```bash
npm run seed
```

This will create sample users and orders in Thai language.

## Running the Backend

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The backend will run on http://localhost:3001

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `GET /users/count` - Get total user count
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Orders
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `GET /orders/count` - Get total order count
- `GET /orders/revenue` - Get total revenue
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

## Example API Requests

### Create User
```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ทดสอบ ผู้ใช้",
    "email": "test@example.com",
    "phone": "086-123-4567",
    "status": "active",
    "role": "user"
  }'
```

### Create Order
```bash
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "ORD-007",
    "customerName": "ทดสอบ ลูกค้า",
    "product": "สินค้าทดสอบ",
    "amount": 1000,
    "status": "pending",
    "description": "คำอธิบาย"
  }'
```
