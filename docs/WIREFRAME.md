# Wireframe Documentation / เอกสาร Wireframe

## Overview / ภาพรวม

This document provides wireframe specifications for the Admin Panel Material application. The design follows Material Design 3 principles with Thai language support.

เอกสารนี้แสดงข้อกำหนด Wireframe สำหรับระบบ Admin Panel Material โดยออกแบบตามหลัก Material Design 3 พร้อมการรองรับภาษาไทย

---

## Design System / ระบบการออกแบบ

### Colors / สี

#### Light Mode
- **Primary:** #1976d2 (Blue)
- **Secondary:** #dc004e (Pink)
- **Background:** #f5f5f5 (Light Gray)
- **Surface:** #ffffff (White)
- **Text Primary:** #000000 (Black)
- **Text Secondary:** rgba(0, 0, 0, 0.6) (Gray)

#### Dark Mode
- **Primary:** #90caf9 (Light Blue)
- **Secondary:** #f48fb1 (Light Pink)
- **Background:** #121212 (Very Dark Gray)
- **Surface:** #1e1e1e (Dark Gray)
- **Text Primary:** #ffffff (White)
- **Text Secondary:** rgba(255, 255, 255, 0.7) (Light Gray)

### Typography / รูปแบบตัวอักษร

- **Font Family:** 'Kanit', 'Roboto', sans-serif
- **H1:** 32px, Weight 500
- **H2:** 28px, Weight 500
- **H3:** 24px, Weight 500
- **H4:** 20px, Weight 500
- **H5:** 18px, Weight 400
- **Body1:** 16px, Weight 400
- **Body2:** 14px, Weight 400
- **Caption:** 12px, Weight 400

### Spacing / การจัดระยะห่าง

Based on 8px grid system:
- **xs:** 8px
- **sm:** 16px
- **md:** 24px
- **lg:** 32px
- **xl:** 40px

---

## Layout Structure / โครงสร้างเลย์เอาต์

```
┌─────────────────────────────────────────────────────────────┐
│ Header (64px height)                                        │
│  [Logo] Admin Panel                     [🌓] [User Menu]    │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│ Sidebar  │           Main Content Area                      │
│ (240px)  │                                                   │
│          │                                                   │
│  Menu    │                                                   │
│  Items   │                                                   │
│          │                                                   │
│          │                                                   │
│          │                                                   │
└──────────┴──────────────────────────────────────────────────┘
```

### Header Component
- Height: 64px
- Contains:
  - Logo and App Name (Left)
  - Theme Toggle Button (Right)
  - User Menu (Right)

### Sidebar Component
- Width: 240px (Desktop), Collapsible (Mobile)
- Contains:
  - Navigation Menu Items
  - Icons with Labels
  - Active State Highlighting

### Main Content Area
- Responsive Grid Layout
- Padding: 24px
- Max Width: 1200px (centered)

---

## Page Wireframes / Wireframe แต่ละหน้า

## 1. Dashboard Page / หน้าแดชบอร์ด

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Dashboard / แดชบอร์ด                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│ │ Total    │  │ Total    │  │ Revenue  │  │ New      │   │
│ │ Users    │  │ Orders   │  │          │  │ Users    │   │
│ │          │  │          │  │          │  │          │   │
│ │ [Icon]   │  │ [Icon]   │  │ [Icon]   │  │ [Icon]   │   │
│ │  125     │  │  487     │  │ ฿200,900 │  │   +12    │   │
│ │  +5.2%   │  │  +12.3%  │  │  +8.1%   │  │  Today   │   │
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Revenue Chart / กราฟรายได้                          │   │
│ │                                                      │   │
│ │    [Line Chart - 7 days]                            │   │
│ │                                                      │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─────────────────────┐  ┌─────────────────────────────┐  │
│ │ Recent Users        │  │ Recent Orders               │  │
│ │                     │  │                             │  │
│ │ • สมชาย ใจดี        │  │ • ORD-001 - ฿45,000        │  │
│ │ • สมหญิง รักดี      │  │ • ORD-002 - ฿52,900        │  │
│ │ • วิชัย สุขดี       │  │ • ORD-003 - ฿28,500        │  │
│ │ • นิดา มีสุข        │  │ • ORD-004 - ฿35,000        │  │
│ │ • ประยุทธ แข็งแกร่ง │  │ • ORD-005 - ฿18,900        │  │
│ │                     │  │                             │  │
│ └─────────────────────┘  └─────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Components:
1. **Stat Cards (4 cards)**
   - Card dimensions: Width flexible, Height 150px
   - Contains: Icon, Value, Label, Change percentage
   - Elevation: 1
   - Border Radius: 8px

2. **Revenue Chart Card**
   - Full width
   - Height: 400px
   - Contains: Title, Line chart with 7 data points
   - X-axis: Days of week
   - Y-axis: Revenue amount (฿)

3. **Recent Activity Cards (2 columns)**
   - Equal width (50% each with gap)
   - Height: Auto
   - List format with avatar/icon
   - Shows latest 5 items

---

## 2. Users Page / หน้าจัดการผู้ใช้

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Users Management / จัดการผู้ใช้                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Search: ค้นหา...] [Filter ▼]           [+ เพิ่มผู้ใช้]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Name        | Email          | Phone      | Status | ⋮  ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ สมชาย ใจดี  | somchai@...    | 081-234... | Active | ⋮  ││
│ │ สมหญิง รักดี | somying@...    | 082-345... | Active | ⋮  ││
│ │ วิชัย สุขดี  | wichai@...     | 083-456... | Active | ⋮  ││
│ │ นิดา มีสุข   | nida@...       | 084-567... | Active | ⋮  ││
│ │ ประยุทธ แข็.  | prayut@...     | 085-678... | Inact. | ⋮  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Rows per page: 10 ▼]        [1-5 of 125]  [< 1 2 3 ... >]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Components:
1. **Action Bar**
   - Search input (left)
   - Filter dropdown (left)
   - Add User button (right)
   - Height: 64px

2. **Data Table**
   - Columns: Name, Email, Phone, Status, Role, Actions
   - Row height: 52px
   - Alternating row background
   - Hover effect on rows
   - Sortable columns

3. **Row Actions Menu**
   - Edit (เปลี่ยน icon)
   - Delete (ลบ icon)
   - View Details (ดูรายละเอียด icon)

4. **Pagination**
   - Rows per page selector
   - Page navigation
   - Total count display

### Add/Edit User Dialog
```
┌───────────────────────────────────────┐
│ เพิ่มผู้ใช้ใหม่ / Add New User    [X]│
├───────────────────────────────────────┤
│                                       │
│ ชื่อ-นามสกุล / Name *                │
│ [___________________________________] │
│                                       │
│ อีเมล / Email *                       │
│ [___________________________________] │
│                                       │
│ เบอร์โทร / Phone                      │
│ [___________________________________] │
│                                       │
│ สถานะ / Status                        │
│ [Active ▼___________________________] │
│                                       │
│ บทบาท / Role                          │
│ [___________________________________] │
│                                       │
│              [ยกเลิก]  [บันทึก]      │
└───────────────────────────────────────┘
```

### Dialog Components:
- Width: 600px (max)
- Form Fields:
  - Text inputs with labels
  - Required field indicators (*)
  - Validation messages
- Action buttons:
  - Cancel (text button)
  - Save (contained button, primary color)

---

## 3. Orders Page / หน้าจัดการคำสั่งซื้อ

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Orders Management / จัดการคำสั่งซื้อ                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Search: ค้นหา...] [Status: All ▼]      [+ เพิ่มออเดอร์]  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Order# | Customer    | Product      | Amount | Status|⋮ ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ ORD-001| สมชาย ใจดี  | Dell XPS 15  | ฿45,000|✓Comp.|⋮ ││
│ │ ORD-002| สมหญิง รักดี | iPhone 15... | ฿52,900|⏱Pend.|⋮ ││
│ │ ORD-003| วิชัย สุขดี  | MacBook Pro  | ฿89,900|⏱Pend.|⋮ ││
│ │ ORD-004| นิดา มีสุข   | iPad Pro     | ฿35,000|🚚Ship.|⋮ ││
│ │ ORD-005| ประยุทธ แข.  | AirPods Pro  | ฿8,900 |✓Comp.|⋮ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Rows per page: 10 ▼]        [1-5 of 487] [< 1 2 3 ... >] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Components:
1. **Action Bar**
   - Search input (left)
   - Status filter dropdown (left)
   - Add Order button (right)

2. **Data Table**
   - Columns: Order Number, Customer, Product, Amount, Status, Actions
   - Status badges with colors:
     - Completed: Green
     - Pending: Orange
     - Shipped: Blue
     - Cancelled: Red

3. **Row Actions Menu**
   - Edit
   - View Details
   - Delete
   - Update Status

### Add/Edit Order Dialog
```
┌───────────────────────────────────────┐
│ เพิ่มคำสั่งซื้อใหม่ / Add Order  [X] │
├───────────────────────────────────────┤
│                                       │
│ หมายเลขออเดอร์ / Order Number *      │
│ [___________________________________] │
│                                       │
│ ชื่อลูกค้า / Customer Name *          │
│ [___________________________________] │
│                                       │
│ สินค้า / Product *                    │
│ [___________________________________] │
│                                       │
│ จำนวนเงิน / Amount (฿) *              │
│ [___________________________________] │
│                                       │
│ สถานะ / Status                        │
│ [Pending ▼_________________________] │
│                                       │
│ รายละเอียด / Description              │
│ [___________________________________] │
│ [___________________________________] │
│ [___________________________________] │
│                                       │
│              [ยกเลิก]  [บันทึก]      │
└───────────────────────────────────────┘
```

---

## 4. Mobile Responsive Design / การออกแบบแบบ Responsive

### Mobile Layout (< 768px)
```
┌─────────────────────┐
│ [≡] Admin Panel [⋮] │ ← Header with Menu Button
├─────────────────────┤
│                     │
│ ┌─────────────────┐ │
│ │ Total Users     │ │ ← Stacked Stat Cards
│ │ [Icon] 125      │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ Total Orders    │ │
│ │ [Icon] 487      │ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ Revenue Chart   │ │
│ │ [Chart]         │ │
│ └─────────────────┘ │
│                     │
└─────────────────────┘
```

### Mobile Features:
- Hamburger menu for sidebar
- Collapsible sidebar drawer
- Stacked stat cards (1 column)
- Simplified data tables (horizontal scroll)
- Bottom sheet for dialogs
- Touch-friendly button sizes (min 44px)

---

## 5. Component Specifications / ข้อกำหนดคอมโพเนนต์

### Stat Card Component
```
Properties:
- title: string (e.g., "Total Users")
- value: number | string (e.g., 125)
- icon: IconComponent
- change: string (e.g., "+5.2%")
- changeType: "positive" | "negative"
- color: primary | secondary | success | error

Dimensions:
- Min Height: 150px
- Padding: 24px
- Border Radius: 8px
- Elevation: 1
```

### Data Table Component
```
Properties:
- columns: Column[]
- data: any[]
- onEdit: (row) => void
- onDelete: (row) => void
- sortable: boolean
- pagination: boolean
- rowsPerPage: number

Features:
- Sortable columns
- Row selection
- Custom cell renderers
- Action menu per row
- Pagination controls
```

### Form Dialog Component
```
Properties:
- open: boolean
- title: string
- onClose: () => void
- onSubmit: (data) => void
- fields: Field[]
- initialValues: object

Features:
- Form validation
- Error messages
- Required field indicators
- Responsive layout
```

---

## 6. Interaction States / สถานะการโต้ตอบ

### Button States
1. **Default:** Normal appearance
2. **Hover:** Lighter/darker background
3. **Active:** Pressed effect
4. **Disabled:** Reduced opacity, no pointer
5. **Loading:** Spinner icon

### Input States
1. **Default:** Normal border
2. **Focus:** Primary color border, label animation
3. **Error:** Red border, error message below
4. **Disabled:** Gray background, no interaction
5. **Filled:** Has content

### Card States
1. **Default:** Elevation 1
2. **Hover:** Elevation 2 (for interactive cards)
3. **Selected:** Primary color border

---

## 7. Navigation Flow / การนำทาง

```
Dashboard
├── Users
│   ├── Add User
│   ├── Edit User
│   └── View User Details
├── Orders
│   ├── Add Order
│   ├── Edit Order
│   └── View Order Details
├── Products (Coming Soon)
├── Analytics (Coming Soon)
└── Settings (Coming Soon)
```

### Navigation Patterns:
- Sidebar menu for main navigation
- Breadcrumbs for sub-pages
- Back button for detail pages
- Modal dialogs for forms
- Confirmation dialogs for destructive actions

---

## 8. Accessibility / การเข้าถึง

### Requirements:
- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **Screen Readers:** Proper ARIA labels and roles
- **Color Contrast:** WCAG AA compliant (4.5:1 for normal text)
- **Focus Indicators:** Visible focus states
- **Touch Targets:** Minimum 44x44px for touch devices
- **Alt Text:** All images and icons have descriptions

---

## 9. Loading States / สถานะการโหลด

### Skeleton Screens
```
┌─────────────────────────────────────┐
│ ▮▮▮▮▮▮▮▮▮▮ (animated)              │
│                                     │
│ ▮▮▮▮  ▮▮▮▮  ▮▮▮▮  ▮▮▮▮            │
│                                     │
│ ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮              │
│ ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮              │
└─────────────────────────────────────┘
```

### Loading Indicators:
- **Page Load:** Skeleton screens matching layout
- **Data Fetch:** Circular progress indicator
- **Action Progress:** Button spinner
- **Infinite Scroll:** Bottom loader

---

## 10. Error States / สถานะข้อผิดพลาด

### Empty States
```
┌─────────────────────────────────────┐
│                                     │
│           [📋 Icon]                 │
│                                     │
│        ไม่มีข้อมูล                  │
│      No data available              │
│                                     │
│      [+ เพิ่มรายการแรก]             │
│                                     │
└─────────────────────────────────────┘
```

### Error Messages
```
┌─────────────────────────────────────┐
│           [⚠️ Icon]                 │
│                                     │
│   เกิดข้อผิดพลาดในการโหลดข้อมูล    │
│   Error loading data                │
│                                     │
│      [ลองอีกครั้ง / Try Again]      │
└─────────────────────────────────────┘
```

---

## 11. Confirmation Dialogs / ไดอะล็อกยืนยัน

### Delete Confirmation
```
┌───────────────────────────────────────┐
│ ⚠️ ยืนยันการลบ / Confirm Delete      │
├───────────────────────────────────────┤
│                                       │
│ คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? │
│ Are you sure you want to delete this? │
│                                       │
│ การกระทำนี้ไม่สามารถยกเลิกได้          │
│ This action cannot be undone.         │
│                                       │
│              [ยกเลิก]  [ลบ]          │
│              [Cancel]  [Delete]       │
└───────────────────────────────────────┘
```

---

## 12. Theme Toggle / สลับธีม

### Toggle Button
```
Light Mode: [☀️]
Dark Mode:  [🌙]

Location: Top right corner of header
Interaction: Click to toggle between themes
Animation: Smooth transition (0.3s)
```

---

## Implementation Notes / หมายเหตุการพัฒนา

### Frontend Technologies:
- **Framework:** Next.js 15 with App Router
- **UI Library:** Material UI v7 (Material Design 3)
- **Styling:** Emotion (CSS-in-JS)
- **Charts:** Recharts
- **Icons:** Material Icons

### Responsive Breakpoints:
- **xs:** 0px - 599px (Mobile)
- **sm:** 600px - 959px (Tablet)
- **md:** 960px - 1279px (Desktop)
- **lg:** 1280px - 1919px (Large Desktop)
- **xl:** 1920px+ (Extra Large)

### Design Files:
Currently, wireframes are documented in this file. For high-fidelity designs, consider using:
- Figma
- Adobe XD
- Sketch

---

## References / อ้างอิง

- **Material Design 3:** https://m3.material.io/
- **Material UI Documentation:** https://mui.com/
- **Accessibility Guidelines (WCAG):** https://www.w3.org/WAI/WCAG21/quickref/

---

## Version History / ประวัติการปรับปรุง

### Version 1.0.0 (Current)
- Initial wireframe documentation
- Dashboard page layout
- Users management page
- Orders management page
- Mobile responsive design
- Component specifications
