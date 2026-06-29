# 🏠 UDEE — Tables & Desk Specialists E-Commerce System

ระบบร้านค้าออนไลน์สำหรับจำหน่ายโต๊ะและเฟอร์นิเจอร์ประเภทโต๊ะ  
พัฒนาด้วย **React + Node.js + MySQL**

---

## 📋 สารบัญ

- [ภาพรวมโปรเจค](#-ภาพรวมโปรเจค)
- [ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)
- [ทีมพัฒนา](#-ทีมพัฒนา)
- [เทคโนโลยี](#-เทคโนโลยี)
- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)
- [การติดตั้งและรัน](#-การติดตั้งและรัน)
- [API Endpoints](#-api-endpoints)
- [Database](#-database)
- [การพัฒนา](#-การพัฒนา)
- [ปัญหาทั่วไป](#-ปัญหาทั่วไป)

---

## 📖 ภาพรวมโปรเจค

**UDEE** เป็นระบบ E-Commerce ที่ออกแบบสำหรับจำหน่ายโต๊ะออนไลน์ โดยให้ลูกค้าสามารถ:
- ค้นหา กรอง และดูรายละเอียดโต๊ะตามประเภท ขนาด สี
- สั่งซื้อและชำระเงินผ่าน Bank Transfer + Slip Upload
- ติดตามสถานะออเดอร์ แบบ Real-time

ทั้งนี้ Manager สามารถจัดการสินค้า ยืนยันการชำระเงิน ดูรายงานยอดขาย  
และ Admin สามารถดูแลระบบและจัดการสิทธิ์ผู้ใช้

---

## ✨ ฟีเจอร์หลัก

### 👤 สำหรับลูกค้า (Customer)
- ✅ ค้นหาและกรองโต๊ะตามประเภท/ราคา/ขนาด/สี
- ✅ ดูรายละเอียดโต๊ะพร้อมรูป/ราคา/คำอธิบาย
- ✅ สมัครสมาชิก เข้าสู่ระบบ จัดการโปรไฟล์
- ✅ เพิ่มลงตะกร้า แก้ไข ลบสินค้า
- ✅ สั่งซื้อและอัพโหลด Slip
- ✅ ติดตามสถานะออเดอร์ (Pending → Paid → Shipped → Delivered)
- ✅ ดูประวัติการซื้อทั้งหมด
- ✅ รับการแจ้งเตือนผ่าน Email

### 💼 สำหรับผู้จัดการ (Manager)
- ✅ เพิ่ม/ลบ/แก้ไขสินค้า (ชื่อ/ราคา/ขนาด/สี/รูป)
- ✅ ดูและจัดการสต็อก
- ✅ ตั้งราคา/ส่วนลด/โปรโมชั่น
- ✅ ยืนยันการชำระเงิน (ตรวจ Slip)
- ✅ เปลี่ยนสถานะออเดอร์
- ✅ ดูรายงานยอดขาย/สถิติ

### 🔧 สำหรับผู้ดูแลระบบ (Admin)
- ✅ กำหนดสิทธิ์ผู้ใช้ (Role/Permission)
- ✅ ดูประวัติการใช้งาน (Activity Logs)
- ✅ ตั้งค่าระบบ
- ✅ Backup/Restore ฐานข้อมูล

---

## 👥 ทีมพัฒนา

| ลำดับ | รหัสนักศึกษา | ชื่อ-สกุล | หน้าที่ |
|-------|-----------|---------|--------|
| 1 | 67094657 | วรินทร วรธรรม | Product List / Product Detail |
| 2 | 67101868 | ปวีณภัทร สินหมู | Order / Payment / Tracking |
| 3 | 67124936 | พลอยไพลิน วัชระ | Shopping Cart / Checkout |
| 4 | 67136194 | กรฤทธคุมพวก | Login / Register / Profile |
| 5 | 67131555 | ปัฐวัติ แสนคำเพิงใจ | Admin Dashboard / Report / Integration (PM) |

---

## 🛠 เทคโนโลยี

### Frontend
- **React** 18+ - UI Framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Context API** - State Management

### Backend
- **Node.js** 18+ - Runtime
- **Express.js** - Web Framework
- **Prisma** - ORM
- **JWT** - Authentication
- **bcrypt** - Password Hashing
- **Multer** - File Upload

### Database & DevOps
- **MySQL** 8.0+ - Database
- **Docker & Docker Compose** - Containerization

---

## 📁 โครงสร้างโปรเจค

```
udee_ecommerce/
├── frontend/                 # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable Components
│   │   ├── pages/           # Page Components
│   │   ├── context/         # Context API
│   │   ├── services/        # API Services
│   │   ├── styles/          # Global Styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example         # Environment Variables Template
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── routes/          # API Routes
│   │   ├── controllers/     # Business Logic
│   │   ├── models/          # Data Models
│   │   ├── middleware/      # Express Middleware
│   │   ├── services/        # Business Services
│   │   ├── utils/           # Utility Functions
│   │   ├── config/          # Configuration
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma    # Database Schema
│   ├── .env.example         # Environment Variables Template
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── docker-compose.yml       # Docker Services
├── README.md
├── CONTRIBUTING.md          # Development Guide
└── API_ENDPOINTS.md         # API Documentation
```

---

## 🚀 การติดตั้งและรัน

### **ข้อกำหนด**
- Node.js 18+ และ npm
- MySQL 8.0+
- Docker & Docker Compose (Optional)

### **1. Clone Repository**

```bash
git clone https://github.com/r4lax001/udee_ecommerce.git
cd udee_ecommerce
```

### **2A. รัน with Docker (แนะนำ)**

```bash
docker compose up --build
```

**Services จะรันที่:**
- 🌐 Frontend: http://localhost:5173
- ⚙️ Backend: http://localhost:5000
- 🗄️ MySQL: localhost:3306

### **2B. รัน Local (ไม่ใช้ Docker)**

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# แก้ไข .env.local ตามต้องการ
npm run dev
```

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# แก้ไข .env ตามต้องการ

# Setup Database
npx prisma migrate dev

# Start Server
npm run dev
```

---

## 📡 API Endpoints

API ทั้งหมดมีรายละเอียด ใน **[API_ENDPOINTS.md](./API_ENDPOINTS.md)**

### ตัวอย่าง Endpoints:

**Products**
- `GET /api/products` - ดูรายชื่อสินค้าทั้งหมด
- `GET /api/products/:id` - ดูรายละเอียดสินค้า
- `POST /api/products` - เพิ่มสินค้า (Manager)
- `PUT /api/products/:id` - แก้ไขสินค้า (Manager)

**Orders**
- `POST /api/orders` - สร้างออเดอร์
- `GET /api/orders/:id` - ดูรายละเอียดออเดอร์
- `GET /api/orders` - ดูออเดอร์ทั้งหมด (Manager)
- `PUT /api/orders/:id/status` - เปลี่ยนสถานะ (Manager)

**Auth**
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/logout` - ออกจากระบบ

---

## 🗄️ Database

### Database Schema
- **users** - ข้อมูลลูกค้า/เจ้าของร้าน
- **products** - ข้อมูลสินค้า
- **product_options** - ตัวเลือกโต๊ะ (Size/Color/Material)
- **categories** - หมวดหมู่สินค้า
- **orders** - ใบสั่งซื้อ
- **order_items** - รายการสินค้าในออเดอร์
- **payments** - ข้อมูลการชำระเงิน
- **activity_logs** - ประวัติการใช้งาน (Admin)

ดูรายละเอียดใน `backend/prisma/schema.prisma`

### สร้าง Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed  # (Optional) สำหรับ seed data
```

---

## 💻 การพัฒนา

### Development Workflow

1. **สร้าง Branch ใหม่**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **ทำการเปลี่ยนแปลง และ Commit**
   ```bash
   git add .
   git commit -m "feat: เพิ่มฟีเจอร์..."
   ```

3. **Push และสร้าง Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- ✅ ใช้ JavaScript (ES6+)
- ✅ ใช้ Functional Components (React)
- ✅ ใช้ Hooks แทน Class Components
- ✅ ให้ Component ไฟล์ชื่อ PascalCase
- ✅ ให้ Variable/Function ชื่อ camelCase

### Testing

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
```

ดูรายละเอียดเพิ่มเติม ใน **[CONTRIBUTING.md](./CONTRIBUTING.md)**

---

## 🐛 ปัญหาทั่วไป

### MySQL Connection Error
**ปัญหา:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**วิธีแก้:**
- ตรวจสอบ `.env` ว่า DB_HOST, DB_USER, DB_PASSWORD ถูกต้อง
- ตรวจสอบ MySQL กำลังรัน
- หากใช้ Docker: ตรวจสอบ `docker compose ps`

### Port Already in Use
**ปัญหา:** `Port 5000 is already in use`

**วิธีแก้:**
```bash
# ค้นหา Process ที่ใช้ Port 5000
lsof -i :5000
# Kill Process
kill -9 <PID>
```

### CORS Error
**ปัญหา:** `Access to XMLHttpRequest blocked by CORS`

**วิธีแก้:**
- Backend ต้องกำหนด CORS ใน `app.js`
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

---

## 📚 อ้างอิงเพิ่มเติม

- [React Documentation](https://react.dev)
- [Node.js Documentation](https://nodejs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 📝 License

ระบบนี้พัฒนาสำหรับโปรเจคสำนักเรียน

---

## 📞 ติดต่อ

หากมีคำถามหรือปัญหา สามารถติดต่อได้ใน GitHub Issues หรือ Contact Team Lead

**Team Lead:** ปัฐวัติ แสนคำเพิงใจ (67131555)
