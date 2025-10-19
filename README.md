# Admin Panel Material

ระบบแดชบอร์ดสำหรับผู้ดูแลระบบที่ทันสมัยและตอบสนอง สร้างด้วย Next.js 15, Material UI 3 (MUI v7), NestJS และ MongoDB มีฟีเจอร์การจัดการข้อมูลจริง (CRUD) ที่สมบูรณ์แบบพร้อมฟอนต์ภาษาไทยที่สวยงาม

A modern, responsive admin dashboard built with Next.js 15, Material UI 3 (MUI v7), NestJS and MongoDB. Features full CRUD operations with beautiful Thai fonts (Kanit).

![Admin Panel Dashboard](https://github.com/user-attachments/assets/26ad1aee-f8fc-4b88-9087-b1cc8d93f228)

## ✨ Features / คุณสมบัติ

- **Modern Dashboard**: Clean and professional admin interface with Material Design 3
- **Thai Font Support**: Beautiful Kanit font for Thai language / รองรับฟอนต์ภาษาไทย Kanit ที่สวยงาม
- **Full Backend with NestJS**: RESTful API with MongoDB / API แบบ RESTful พร้อม MongoDB
- **Real CRUD Operations**: Create, Read, Update, Delete for Users and Orders / การจัดการข้อมูลจริง เพิ่ม ลบ แก้ไข ได้จริง
- **Responsive Layout**: Fully responsive design that works on all screen sizes
- **Dark Mode**: Built-in theme switcher for light and dark modes
- **Interactive Stats**: Real-time statistics from database / สถิติแบบเรียลไทม์จากฐานข้อมูล
- **Data Visualization**: Revenue chart using Recharts library
- **Activity Feed**: Real-time activity feed with recent users and orders
- **TypeScript**: Fully typed codebase for better development experience

## 🚀 Tech Stack

### Frontend
- **[Next.js 15.5](https://nextjs.org/)** - React framework with App Router
- **[Material UI v7](https://mui.com/)** - React component library with Material Design 3
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Recharts](https://recharts.org/)** - Data visualization library
- **[Emotion](https://emotion.sh/)** - CSS-in-JS styling solution
- **[Axios](https://axios-http.com/)** - HTTP client for API calls
- **[Google Fonts - Kanit](https://fonts.google.com/specimen/Kanit)** - Beautiful Thai font

### Backend
- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

## 📦 Installation

### Prerequisites / ข้อกำหนดเบื้องต้น
- Node.js (v18 or higher)
- MongoDB (v6 or higher)

### 1. Clone the repository:
```bash
git clone https://github.com/somkheartk/admin-panel-material.git
cd admin-panel-material
```

### 2. Install frontend dependencies:
```bash
npm install
```

### 3. Install backend dependencies:
```bash
cd backend
npm install
```

### 4. Setup MongoDB

#### Option A: Using Docker (recommended):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: Install MongoDB locally:
Follow instructions at https://www.mongodb.com/docs/manual/installation/

### 5. Configure environment variables:

**Frontend** - Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend** - The `.env` file already exists in `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/admin-panel
PORT=3001
```

### 6. Seed the database with sample data (Thai language):
```bash
cd backend
npm run seed
```

This will create sample users and orders in Thai language.

### 7. Run the application:

**Terminal 1 - Run Backend:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:3001

**Terminal 2 - Run Frontend:**
```bash
npm run dev
```
Frontend will run on http://localhost:3000

### 8. Open your browser:
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
admin-panel-material/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with theme provider & Thai fonts
│   ├── page.tsx           # Dashboard page with real-time stats
│   ├── users/             # User management page
│   │   └── page.tsx       # CRUD operations for users
│   ├── orders/            # Order management page
│   │   └── page.tsx       # CRUD operations for orders
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── DashboardLayout.tsx    # Main layout wrapper
│   ├── Header.tsx            # Top navigation bar
│   ├── Sidebar.tsx           # Side navigation menu
│   ├── StatCard.tsx          # Statistics card component
│   ├── RevenueChart.tsx      # Revenue chart component
│   └── RecentActivity.tsx    # Activity feed with real data
├── lib/                   # Utilities and configurations
│   ├── api/              # API client
│   │   ├── client.ts     # Axios configuration
│   │   ├── users.ts      # Users API calls
│   │   └── orders.ts     # Orders API calls
│   ├── theme.ts          # MUI theme with Kanit font
│   └── ThemeRegistry.tsx # Theme provider wrapper
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── main.ts       # Application entry point
│   │   ├── app.module.ts # Root module
│   │   ├── users/        # Users module
│   │   │   ├── user.schema.ts      # MongoDB schema
│   │   │   ├── user.dto.ts         # Data transfer objects
│   │   │   ├── users.service.ts    # Business logic
│   │   │   ├── users.controller.ts # API endpoints
│   │   │   └── users.module.ts     # Module definition
│   │   ├── orders/       # Orders module
│   │   │   ├── order.schema.ts     # MongoDB schema
│   │   │   ├── order.dto.ts        # Data transfer objects
│   │   │   ├── orders.service.ts   # Business logic
│   │   │   ├── orders.controller.ts # API endpoints
│   │   │   └── orders.module.ts    # Module definition
│   │   └── seed.ts       # Database seeding script
│   ├── package.json      # Backend dependencies
│   ├── tsconfig.json     # TypeScript configuration
│   └── .env             # Environment variables
└── public/              # Static assets
```

## 🎨 Customization

### Theme Configuration

Edit `lib/theme.ts` to customize colors, typography, and component styles:

```typescript
const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1976d2',
          // ... customize colors
        },
      },
    },
    dark: {
      // ... dark mode colors
    },
  },
  // ... other theme options
});
```

### Adding New Pages

Create new pages in the `app` directory following Next.js App Router conventions:

```typescript
// app/users/page.tsx
'use client';
import DashboardLayout from '@/components/DashboardLayout';

export default function UsersPage() {
  return (
    <DashboardLayout>
      {/* Your page content */}
    </DashboardLayout>
  );
}
```

## 📱 Navigation Menu

The sidebar includes the following menu items:
- **Dashboard (/)** - Overview with real-time statistics / ภาพรวมพร้อมสถิติแบบเรียลไทม์
- **Users (/users)** - User management with CRUD operations / จัดการผู้ใช้พร้อม CRUD
- **Orders (/orders)** - Order management with CRUD operations / จัดการคำสั่งซื้อพร้อม CRUD
- Products (/products) - Coming soon
- Analytics (/analytics) - Coming soon
- Settings (/settings) - Coming soon

## 🔌 API Endpoints

The backend provides RESTful API endpoints:

### Users API
- `GET /users` - Get all users / ดึงข้อมูลผู้ใช้ทั้งหมด
- `GET /users/:id` - Get user by ID / ดึงข้อมูลผู้ใช้ตาม ID
- `GET /users/count` - Get total user count / นับจำนวนผู้ใช้ทั้งหมด
- `POST /users` - Create new user / สร้างผู้ใช้ใหม่
- `PUT /users/:id` - Update user / แก้ไขข้อมูลผู้ใช้
- `DELETE /users/:id` - Delete user / ลบผู้ใช้

### Orders API
- `GET /orders` - Get all orders / ดึงข้อมูลคำสั่งซื้อทั้งหมด
- `GET /orders/:id` - Get order by ID / ดึงข้อมูลคำสั่งซื้อตาม ID
- `GET /orders/count` - Get total order count / นับจำนวนคำสั่งซื้อทั้งหมด
- `GET /orders/revenue` - Get total revenue / ดึงข้อมูลรายได้รวม
- `POST /orders` - Create new order / สร้างคำสั่งซื้อใหม่
- `PUT /orders/:id` - Update order / แก้ไขคำสั่งซื้อ
- `DELETE /orders/:id` - Delete order / ลบคำสั่งซื้อ

## 🔧 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/somkheartk/admin-panel-material/issues).

## 📝 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [Recharts Documentation](https://recharts.org/en-US/)

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_source=github&utm_medium=readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
