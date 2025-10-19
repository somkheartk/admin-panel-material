# API Specification / เอกสารข้อกำหนด API

## Overview / ภาพรวม

This document provides comprehensive API specification for the Admin Panel Material backend API. The API follows RESTful principles and returns JSON responses.

เอกสารนี้แสดงข้อกำหนด API อย่างละเอียดสำหรับ Backend API ของระบบ Admin Panel Material โดย API ถูกพัฒนาตามหลักการ RESTful และส่งกลับข้อมูลในรูปแบบ JSON

## Base URL

```
Development: http://localhost:3001
Production: [To be configured]
```

## Common Response Format / รูปแบบการตอบกลับทั่วไป

### Success Response
```json
{
  "data": {...},
  "message": "Success"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## Users API / API ผู้ใช้

### 1. Get All Users / ดึงข้อมูลผู้ใช้ทั้งหมด

**Endpoint:** `GET /users`

**Description:** Retrieve a list of all users in the system.

**Request:**
```
GET /users
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "สมชาย ใจดี",
    "email": "somchai@example.com",
    "phone": "0812345678",
    "status": "active",
    "role": "แอดมิน",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "สมหญิง รักดี",
    "email": "somying@example.com",
    "phone": "0823456789",
    "status": "active",
    "role": "ผู้ใช้",
    "createdAt": "2024-01-16T11:20:00.000Z",
    "updatedAt": "2024-01-16T11:20:00.000Z"
  }
]
```

**Error Responses:**
- `500 Internal Server Error` - Database connection error

---

### 2. Get User by ID / ดึงข้อมูลผู้ใช้ตาม ID

**Endpoint:** `GET /users/:id`

**Description:** Retrieve a single user by their ID.

**Request:**
```
GET /users/507f1f77bcf86cd799439011
```

**Path Parameters:**
- `id` (string, required) - User ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "status": "active",
  "role": "แอดมิน",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - User not found
- `500 Internal Server Error` - Database error

---

### 3. Get Users Count / นับจำนวนผู้ใช้

**Endpoint:** `GET /users/count`

**Description:** Get the total count of users in the system.

**Request:**
```
GET /users/count
```

**Response (200 OK):**
```json
{
  "count": 125
}
```

**Error Responses:**
- `500 Internal Server Error` - Database error

---

### 4. Create New User / สร้างผู้ใช้ใหม่

**Endpoint:** `POST /users`

**Description:** Create a new user in the system.

**Request:**
```
POST /users
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "วิชัย สุขดี",
  "email": "wichai@example.com",
  "phone": "0834567890",
  "status": "active",
  "role": "ผู้ใช้"
}
```

**Body Parameters:**
- `name` (string, required) - User's full name
- `email` (string, required) - User's email address (must be unique and valid email format)
- `phone` (string, optional) - User's phone number
- `status` (string, optional) - User status (default: "active")
- `role` (string, optional) - User role

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "วิชัย สุขดี",
  "email": "wichai@example.com",
  "phone": "0834567890",
  "status": "active",
  "role": "ผู้ใช้",
  "createdAt": "2024-01-17T09:15:00.000Z",
  "updatedAt": "2024-01-17T09:15:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Validation error (missing required fields or invalid format)
- `409 Conflict` - Email already exists
- `500 Internal Server Error` - Database error

**Validation Rules:**
- `name`: Required, must be a string
- `email`: Required, must be valid email format, must be unique
- `phone`: Optional, must be a string
- `status`: Optional, must be a string
- `role`: Optional, must be a string

---

### 5. Update User / แก้ไขข้อมูลผู้ใช้

**Endpoint:** `PUT /users/:id`

**Description:** Update an existing user's information.

**Request:**
```
PUT /users/507f1f77bcf86cd799439011
Content-Type: application/json
```

**Path Parameters:**
- `id` (string, required) - User ID

**Request Body:**
```json
{
  "name": "สมชาย ใจดี (อัพเดท)",
  "phone": "0898765432",
  "status": "inactive"
}
```

**Body Parameters (all optional):**
- `name` (string) - User's full name
- `email` (string) - User's email address
- `phone` (string) - User's phone number
- `status` (string) - User status
- `role` (string) - User role

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "สมชาย ใจดี (อัพเดท)",
  "email": "somchai@example.com",
  "phone": "0898765432",
  "status": "inactive",
  "role": "แอดมิน",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-17T10:45:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Validation error
- `404 Not Found` - User not found
- `409 Conflict` - Email already exists (if email is being updated)
- `500 Internal Server Error` - Database error

---

### 6. Delete User / ลบผู้ใช้

**Endpoint:** `DELETE /users/:id`

**Description:** Delete a user from the system.

**Request:**
```
DELETE /users/507f1f77bcf86cd799439011
```

**Path Parameters:**
- `id` (string, required) - User ID

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "status": "active",
  "role": "แอดมิน",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - User not found
- `500 Internal Server Error` - Database error

---

## Orders API / API คำสั่งซื้อ

### 1. Get All Orders / ดึงข้อมูลคำสั่งซื้อทั้งหมด

**Endpoint:** `GET /orders`

**Description:** Retrieve a list of all orders in the system.

**Request:**
```
GET /orders
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "orderNumber": "ORD-001",
    "customerName": "สมชาย ใจดี",
    "product": "โน๊ตบุ๊ค Dell XPS 15",
    "amount": 45000,
    "status": "completed",
    "description": "สินค้าพร้อมส่ง",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439022",
    "orderNumber": "ORD-002",
    "customerName": "สมหญิง รักดี",
    "product": "iPhone 15 Pro Max",
    "amount": 52900,
    "status": "pending",
    "description": "รอการจัดส่ง",
    "createdAt": "2024-01-16T11:20:00.000Z",
    "updatedAt": "2024-01-16T11:20:00.000Z"
  }
]
```

**Error Responses:**
- `500 Internal Server Error` - Database connection error

---

### 2. Get Order by ID / ดึงข้อมูลคำสั่งซื้อตาม ID

**Endpoint:** `GET /orders/:id`

**Description:** Retrieve a single order by its ID.

**Request:**
```
GET /orders/507f1f77bcf86cd799439021
```

**Path Parameters:**
- `id` (string, required) - Order ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "orderNumber": "ORD-001",
  "customerName": "สมชาย ใจดี",
  "product": "โน๊ตบุ๊ค Dell XPS 15",
  "amount": 45000,
  "status": "completed",
  "description": "สินค้าพร้อมส่ง",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - Order not found
- `500 Internal Server Error` - Database error

---

### 3. Get Orders Count / นับจำนวนคำสั่งซื้อ

**Endpoint:** `GET /orders/count`

**Description:** Get the total count of orders in the system.

**Request:**
```
GET /orders/count
```

**Response (200 OK):**
```json
{
  "count": 487
}
```

**Error Responses:**
- `500 Internal Server Error` - Database error

---

### 4. Get Total Revenue / ดึงข้อมูลรายได้รวม

**Endpoint:** `GET /orders/revenue`

**Description:** Calculate and return the total revenue from all orders.

**Request:**
```
GET /orders/revenue
```

**Response (200 OK):**
```json
{
  "totalRevenue": 2456789.50
}
```

**Error Responses:**
- `500 Internal Server Error` - Database error

---

### 5. Create New Order / สร้างคำสั่งซื้อใหม่

**Endpoint:** `POST /orders`

**Description:** Create a new order in the system.

**Request:**
```
POST /orders
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderNumber": "ORD-003",
  "customerName": "วิชัย สุขดี",
  "product": "MacBook Pro M3",
  "amount": 89900,
  "status": "pending",
  "description": "สั่งจองล่วงหน้า"
}
```

**Body Parameters:**
- `orderNumber` (string, required) - Unique order number
- `customerName` (string, required) - Customer's full name
- `product` (string, required) - Product name or description
- `amount` (number, required) - Order amount in THB
- `status` (string, optional) - Order status (default: "pending")
- `description` (string, optional) - Additional order details

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439023",
  "orderNumber": "ORD-003",
  "customerName": "วิชัย สุขดี",
  "product": "MacBook Pro M3",
  "amount": 89900,
  "status": "pending",
  "description": "สั่งจองล่วงหน้า",
  "createdAt": "2024-01-17T09:15:00.000Z",
  "updatedAt": "2024-01-17T09:15:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Validation error (missing required fields or invalid format)
- `500 Internal Server Error` - Database error

**Validation Rules:**
- `orderNumber`: Required, must be a string
- `customerName`: Required, must be a string
- `product`: Required, must be a string
- `amount`: Required, must be a number
- `status`: Optional, must be a string
- `description`: Optional, must be a string

---

### 6. Update Order / แก้ไขคำสั่งซื้อ

**Endpoint:** `PUT /orders/:id`

**Description:** Update an existing order's information.

**Request:**
```
PUT /orders/507f1f77bcf86cd799439021
Content-Type: application/json
```

**Path Parameters:**
- `id` (string, required) - Order ID

**Request Body:**
```json
{
  "status": "shipped",
  "description": "จัดส่งแล้ว หมายเลขพัสดุ TH123456789"
}
```

**Body Parameters (all optional):**
- `orderNumber` (string) - Order number
- `customerName` (string) - Customer's name
- `product` (string) - Product name
- `amount` (number) - Order amount
- `status` (string) - Order status
- `description` (string) - Order description

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "orderNumber": "ORD-001",
  "customerName": "สมชาย ใจดี",
  "product": "โน๊ตบุ๊ค Dell XPS 15",
  "amount": 45000,
  "status": "shipped",
  "description": "จัดส่งแล้ว หมายเลขพัสดุ TH123456789",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-17T10:45:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Validation error
- `404 Not Found` - Order not found
- `500 Internal Server Error` - Database error

---

### 7. Delete Order / ลบคำสั่งซื้อ

**Endpoint:** `DELETE /orders/:id`

**Description:** Delete an order from the system.

**Request:**
```
DELETE /orders/507f1f77bcf86cd799439021
```

**Path Parameters:**
- `id` (string, required) - Order ID

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "orderNumber": "ORD-001",
  "customerName": "สมชาย ใจดี",
  "product": "โน๊ตบุ๊ค Dell XPS 15",
  "amount": 45000,
  "status": "completed",
  "description": "สินค้าพร้อมส่ง",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - Order not found
- `500 Internal Server Error` - Database error

---

## HTTP Status Codes / รหัสสถานะ HTTP

| Status Code | Description | การใช้งาน |
|-------------|-------------|-----------|
| 200 OK | Request successful | คำขอสำเร็จ |
| 201 Created | Resource created successfully | สร้างข้อมูลสำเร็จ |
| 400 Bad Request | Invalid request data | ข้อมูลคำขอไม่ถูกต้อง |
| 404 Not Found | Resource not found | ไม่พบข้อมูล |
| 409 Conflict | Duplicate resource | ข้อมูลซ้ำ |
| 500 Internal Server Error | Server error | เกิดข้อผิดพลาดในเซิร์ฟเวอร์ |

---

## Data Models / โครงสร้างข้อมูล

### User Model
```typescript
{
  _id: ObjectId,           // MongoDB generated ID
  name: string,            // User's full name
  email: string,           // User's email (unique)
  phone?: string,          // Phone number (optional)
  status: string,          // User status (default: "active")
  role?: string,           // User role (optional)
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

### Order Model
```typescript
{
  _id: ObjectId,           // MongoDB generated ID
  orderNumber: string,     // Unique order number
  customerName: string,    // Customer's name
  product: string,         // Product name/description
  amount: number,          // Order amount in THB
  status: string,          // Order status (default: "pending")
  description?: string,    // Additional details (optional)
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

---

## Rate Limiting / การจำกัดอัตราการเรียก API

Currently, there are no rate limits implemented. This may be added in future versions.

ปัจจุบันยังไม่มีการจำกัดอัตราการเรียก API อาจจะเพิ่มในเวอร์ชันต่อไป

---

## Authentication & Authorization / การยืนยันตัวตนและสิทธิ์การเข้าถึง

Currently, the API does not require authentication. This is intended for development and demonstration purposes only. In production, proper authentication and authorization should be implemented.

ปัจจุบัน API ไม่ต้องการการยืนยันตัวตน ซึ่งเหมาะสำหรับการพัฒนาและสาธิตเท่านั้น ในระบบจริงควรมีการยืนยันตัวตนและสิทธิ์การเข้าถึงที่เหมาะสม

---

## CORS Configuration / การตั้งค่า CORS

The API accepts requests from all origins (`*`) for development purposes. In production, this should be restricted to specific domains.

API ยอมรับคำขอจากทุกแหล่งที่มา (`*`) สำหรับการพัฒนา ในระบบจริงควรจำกัดเฉพาะโดเมนที่ระบุ

---

## Error Handling / การจัดการข้อผิดพลาด

All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Validation failed: email must be a valid email",
  "error": "Bad Request"
}
```

Common error scenarios:
1. **Validation Errors (400)**: Invalid input data
2. **Not Found (404)**: Resource doesn't exist
3. **Conflict (409)**: Duplicate resource (e.g., email already exists)
4. **Server Errors (500)**: Database or server issues

---

## API Testing / การทดสอบ API

### Using cURL

**Get all users:**
```bash
curl http://localhost:3001/users
```

**Create a user:**
```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ทดสอบ API",
    "email": "test@example.com",
    "phone": "0812345678"
  }'
```

**Update a user:**
```bash
curl -X PUT http://localhost:3001/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

**Delete a user:**
```bash
curl -X DELETE http://localhost:3001/users/507f1f77bcf86cd799439011
```

### Using Postman

1. Import the endpoints into Postman
2. Set the base URL to `http://localhost:3001`
3. Use the appropriate HTTP methods (GET, POST, PUT, DELETE)
4. For POST and PUT requests, set Content-Type header to `application/json`

---

## Changelog / บันทึกการเปลี่ยนแปลง

### Version 1.0.0 (Current)
- Initial API implementation
- Users CRUD operations
- Orders CRUD operations
- Revenue calculation endpoint
- Count endpoints for statistics

---

## Support / การสนับสนุน

For issues or questions, please create an issue on the GitHub repository:
https://github.com/somkheartk/admin-panel-material/issues

สำหรับปัญหาหรือคำถาม กรุณาสร้าง issue บน GitHub repository:
https://github.com/somkheartk/admin-panel-material/issues
