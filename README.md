# Admin Panel Material

A modern, responsive admin dashboard built with Next.js 15 and Material UI 3 (MUI v7). Features a clean Material Design 3 aesthetic with dark mode support, interactive statistics cards, data visualization, and a real-time activity feed.

![Admin Panel Dashboard](https://github.com/user-attachments/assets/26ad1aee-f8fc-4b88-9087-b1cc8d93f228)

## ✨ Features

- **Modern Dashboard**: Clean and professional admin interface with Material Design 3
- **Responsive Layout**: Fully responsive design that works on all screen sizes
- **Dark Mode**: Built-in theme switcher for light and dark modes
- **Interactive Stats**: Statistics cards with trend indicators and hover effects
- **Data Visualization**: Revenue chart using Recharts library
- **Activity Feed**: Real-time activity feed with color-coded event types
- **Navigation**: Fixed sidebar with icon-based navigation menu
- **TypeScript**: Fully typed codebase for better development experience

## 🚀 Tech Stack

- **[Next.js 15.5](https://nextjs.org/)** - React framework with App Router
- **[Material UI v7](https://mui.com/)** - React component library with Material Design 3
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Recharts](https://recharts.org/)** - Data visualization library
- **[Emotion](https://emotion.sh/)** - CSS-in-JS styling solution
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/somkheartk/admin-panel-material.git
cd admin-panel-material
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🏗️ Project Structure

```
admin-panel-material/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── DashboardLayout.tsx    # Main layout wrapper
│   ├── Header.tsx            # Top navigation bar
│   ├── Sidebar.tsx           # Side navigation menu
│   ├── StatCard.tsx          # Statistics card component
│   ├── RevenueChart.tsx      # Revenue chart component
│   └── RecentActivity.tsx    # Activity feed component
├── lib/                   # Utilities and configurations
│   ├── theme.ts          # MUI theme configuration
│   └── ThemeRegistry.tsx # Theme provider wrapper
└── public/               # Static assets
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
- Dashboard (/)
- Users (/users)
- Products (/products)
- Orders (/orders)
- Analytics (/analytics)
- Settings (/settings)

Add or modify menu items in `components/Sidebar.tsx`.

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
