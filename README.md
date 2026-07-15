# 🏠 UDEE — ระบบร้านค้าออนไลน์โต๊ะและเฟอร์นิเจอร์

พัฒนาด้วย **React + Node.js + MySQL**

---

## 👥 ทีมพัฒนา

| รูป | รหัสนักศึกษา | ชื่อ-สกุล | หน้าที่ |
|-----|------------|-----------|--------|
| 👨‍💻 | 67094657 | วรินทร วรธรรม | Product List / Product Detail |
| 👩‍💻 | 67101868 | ปวีณภัทร สินหมู | Order / Payment / Tracking |
| 👩‍💻 | 67124936 | พลอยไพลิน วัชระ | Shopping Cart / Checkout |
| 👨‍💻 | 67136194 | กรฤทธคุมพวก | Login / Register / Profile |
| 👨‍💻 | 67131555 | ปัฐวัติ แสนคำเพิงใจ | Admin Dashboard / Report |

---

## 🛠 เทคโนโลยี

- **Frontend:** React, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, Prisma, JWT
- **Database:** MySQL 8.0+
- **DevOps:** Docker Compose

---

## 🚀 การติดตั้งและรัน

### วิธีที่ 1: ใช้ Docker (แนะนำ)

```bash
docker compose up --build
```

Services จะรันที่:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MySQL: localhost:3306

### วิธีที่ 2: รัน Local

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev
```

---

## 📡 API Endpoints หลัก

- `GET /api/products` - ดูรายชื่อสินค้า
- `GET /api/products/:id` - ดูรายละเอียดสินค้า
- `POST /api/orders` - สร้างออเดอร์
- `GET /api/orders` - ดูออเดอร์ทั้งหมด
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ

---

## 🗄️ Database Schema

Users, Products, Categories, Cart, Orders, OrderItems, ProductImage

ดูรายละเอียดใน `backend/prisma/schema.prisma`

---

## 🐛 ปัญหาทั่วไป

**MySQL Connection Error:** ตรวจสอบ `.env` และ MySQL กำลังรัน

**Port Already in Use:** ค้นหาและ kill process ที่ใช้ port

**CORS Error:** ตรวจสอบ CORS config ใน `app.js`

------
