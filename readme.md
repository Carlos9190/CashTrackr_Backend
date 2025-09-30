# CashTrackr Backend

## 📌 Description

This is the backend for the **CashTrackr** project, a financial tracking application developed with the **PENN stack** (_PostgreSQL, Express.js, Next.js, and Node.js_). It provides a RESTful API for managing user transactions and financial data.

---

## 🛠 Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Framework for building REST APIs
- **PostgreSQL & Sequelize** - SQL database and ORM
- **JSON Web Tokens (JWT)** - Secure authentication
- **Bcrypt** - Password encryption
- **Nodemailer** - Email sending service
- **TypeScript** - Static typing for JavaScript

---

## 🚀 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Carlos9190/CashTrackr_Backend.git
cd CashTrackr_Backend
```

### 2️⃣ Install dependencies

```bash
npm install  # or yarn install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the project's root directory and define the following variables:

```env
# 🔗 Database connection
DATABASE_URL=your_postgresql_connection_string

# 🌐 Frontend URL in development
FRONTEND_URL=http://localhost:3000

# ✉️ SMTP email service configuration
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_password

# 🔑 Secret key for JSON Web Tokens
JWT_SECRET=your_super_secure_secret

# 🌍 Node environment
NODE_ENV=development
```

If you want to run the project in production, change `NODE_ENV` to `production`:

```env
NODE_ENV=production
```

---

## 📌 Usage

### 🔥 Start the Server

```bash
# 🚀 For Postman testing in local development:
npm run dev:api  # or yarn dev:api

# 🌍 For deployment or full application usage:
npm run dev  # or yarn dev
```

### 🔗 Endpoints

📄 For complete documentation, check the **Postman** collection at [CashTrackr_Endpoints](https://documenter.getpostman.com/view/29810403/2sB2cPjkTt).

---

## 📦 Dependencies

### 📌 Main Dependencies

```json
{
  "bcrypt": "^5.1.1",
  "colors": "^1.4.0",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "express-rate-limit": "^7.5.0",
  "express-validator": "^7.2.1",
  "jsonwebtoken": "^9.0.2",
  "morgan": "^1.10.0",
  "nodemailer": "^6.10.0",
  "pg": "^8.13.3",
  "pg-hstore": "^2.3.4",
  "sequelize-typescript": "^2.1.6"
}
```

### 🔧 Development Dependencies

```json
{
  "@types/bcrypt": "^5.0.2",
  "@types/express": "^5.0.0",
  "@types/jest": "^29.5.14",
  "@types/jsonwebtoken": "^9.0.8",
  "@types/morgan": "^1.9.9",
  "@types/nodemailer": "^6.4.17",
  "@types/supertest": "^6.0.2",
  "jest": "^29.7.0",
  "node-mocks-http": "^1.16.2",
  "nodemon": "^3.1.9",
  "supertest": "^7.0.0",
  "ts-jest": "^29.2.5",
  "ts-node": "^10.9.2",
  "typescript": "^5.7.3"
}
```

---

## 🤝 Contributing

1️⃣ **Fork the repository**.

2️⃣ **Create a branch** for your new feature or fix:

```bash
git checkout -b new-feature
```

3️⃣ **Make changes and commit them**:

```bash
git commit -m "Add new feature"
```

4️⃣ **Submit a Pull Request** for review.

## 📬 Contact

Developed by **Carlos Ibarra**.

- GitHub: [Carlos9190](https://github.com/Carlos9190)
- Frontend Repository: [CashTrackr_Frontend](https://github.com/Carlos9190/CashTrackr_Frontend)
