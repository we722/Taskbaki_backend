# Taskbaki Backend

Taskbaki হলো একটি ক্যাপচা টাস্ক ভিত্তিক আর্নিং প্ল্যাটফর্ম যেখানে ইউজাররা ক্যাপচা সলভ করে পয়েন্ট অর্জন করতে পারে এবং সেই পয়েন্ট ইনকামে রূপান্তরিত হয়।

## Features

- User Registration & Login
- Math CAPTCHA Task System
- Point Earning System (10 points per correct answer)
- Dashboard showing points and INR value
- Withdraw system with point deduction and INR calculation
- Admin/Owner dashboard (for special login)
- MongoDB database integration

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- dotenv for environment variables

## Folder Structure
Taskbaki_backend/ ├── models/ │   └── User.js ├── routes/ │   ├── authRoutes.js │   ├── taskRoutes.js │   └── withdrawRoutes.js ├── .env ├── .gitignore ├── package.json ├── server.js └── README.md

## Installation & Run

```bash
git clone https://github.com/your-username/Taskbaki_backend.git
cd Taskbaki_backend
npm install
