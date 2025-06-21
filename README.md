# Next.js Web CRUD User

โปรเจกต์นี้เป็นเว็บแอปพลิเคชัน CRUD (Create, Read, Update, Delete) สำหรับจัดการข้อมูลผู้ใช้ พัฒนาด้วย Next.js

## คุณสมบัติ

- เพิ่ม, แก้ไข, ลบ, และแสดงข้อมูลผู้ใช้
- มีหน้าจอ Login และใช้ JWT สำหรับการยืนยันตัวตน
- อินเทอร์เฟซใช้งานง่าย
- พัฒนาโดยใช้ Next.js
- เชื่อมต่อกับ backend ที่พัฒนาด้วย .NET 9 ([ดูรายละเอียด backend ที่นี่](https://github.com/Sitthiphong-krobkrong/dotnet9-jwt-concept))

## วิธีเริ่มต้นใช้งาน

1. ติดตั้ง dependencies

    ```bash
    npm install
    ```

2. เริ่มเซิร์ฟเวอร์

    ```bash
    npm run dev
    ```

3. เปิดเว็บเบราว์เซอร์ที่ `http://localhost:3000`

> **หมายเหตุ:** ต้องตั้งค่า backend (.NET 9) ให้พร้อมใช้งานก่อน สามารถดูรายละเอียดและวิธีการติดตั้ง backend ได้ที่ [dotnet9-jwt-concept](https://github.com/Sitthiphong-krobkrong/dotnet9-jwt-concept)

## โครงสร้างโปรเจกต์

- `/pages` — ไฟล์เพจหลัก
- `/components` — คอมโพเนนต์ที่ใช้ซ้ำ
- `/public` — ไฟล์สาธารณะ

## License

Distributed under the MIT License.