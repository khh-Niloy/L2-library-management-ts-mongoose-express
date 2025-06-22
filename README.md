# 📚 Library Management API

A robust RESTful API built with **Express**, **TypeScript**, and **MongoDB (Mongoose)** for managing books and borrowing functionality.

## 🚀 Features

- ✅ Create, read, update, delete (CRUD) operations for books
- 📚 Borrow books with availability check and quantity deduction
- 🧠 Mongoose static/middleware for business logic (e.g., auto-update availability)
- 🔍 Filtering, sorting, and pagination for books
- 📊 Borrowed summary using **MongoDB aggregation pipeline**
- 📦 Clean code structure with error handling and validation

---

## 📬 API Endpoints

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | /api/books     | Create a new book           |
| GET    | /api/books     | Get all books (filter/sort) |
| GET    | /api/books/:id | Get book by ID              |
| PUT    | /api/books/:id | Update a book               |
| DELETE | /api/books/:id | Delete a book               |
| POST   | /api/borrow    | Borrow a book               |
| GET    | /api/borrow    | Borrowed books summary      |

📌 Response formats are exactly as defined in the assignment instructions.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Tools:** Dotenv, Nodemon
- **Validation:** Zod

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/khh-Niloy/L2-library-management-ts-mongoose-express.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a .env file in the root directory and give your connection string

```bash
MONGO_URI="your string"
```

### 4. Run the Project

npm run server (write script for this)

<br/>
> Developed by Hasib Hossain Niloy <br/>
- email: khhniloy0@gmail.com <br/>
- portfolio: https://niloy-portfolio.vercel.app/
