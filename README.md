# 🍔 Food Delivery App

A full-stack food delivery application with a React frontend and Express/MongoDB backend.

## 📁 Project Structure

```
Food_Delivery_App/
├── Backend/          # Express.js + MongoDB REST API
│   ├── Data/         # Database seed data
│   ├── Middleware/   # Auth & validation middleware
│   ├── Model/        # Mongoose models
│   ├── Routes/       # API route handlers
│   ├── Server.js     # Server entry point
│   ├── seed.js       # Database seeding script
│   └── seedFood.js   # Food items seeding script
└── Frontend/         # React + Vite SPA
    ├── src/
    │   ├── api/      # API client (axios)
    │   ├── components/
    │   ├── constants/
    │   ├── pages/
    │   └── styles/
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd Backend
npm install
cp .env.example .env   # Then edit .env with your MongoDB URI & JWT secret
npm run seed           # Seed initial data
npm run dev            # Start dev server on http://localhost:5000
```

### Frontend Setup

```bash
cd Frontend
npm install
cp .env.example .env   # Then set VITE_API_URL to your backend URL
npm run dev            # Start dev server on http://localhost:5173
```

## 🔧 Environment Variables

### Backend (`Backend/.env`)

| Variable    | Description                          |
|-------------|--------------------------------------|
| `PORT`      | Server port (default: 5000)          |
| `MONGO_URI` | MongoDB connection string            |
| `JWT_SECRET`| Secret key for JWT signing           |

### Frontend (`Frontend/.env`)

| Variable        | Description                    |
|-----------------|--------------------------------|
| `VITE_API_URL`  | Backend API base URL           |

## 📜 Available Scripts

### Backend

| Script          | Description                    |
|-----------------|--------------------------------|
| `npm start`     | Start production server        |
| `npm run dev`   | Start dev server with nodemon  |
| `npm run seed`  | Seed database with initial data|
| `npm run seed:food` | Seed food items           |

### Frontend

| Script          | Description                    |
|-----------------|--------------------------------|
| `npm run dev`   | Start Vite dev server          |
| `npm run build` | Build for production           |
| `npm run preview` | Preview production build     |

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 7, React Router 7, Axios, Lucide React
- **Backend**: Node.js, Express 4, Mongoose 8, JWT, bcryptjs
- **Database**: MongoDB

## 🔒 Security Notes

- Never commit `.env` files — they contain secrets
- Use `.env.example` as a template for required environment variables
- Change the `JWT_SECRET` to a strong random value in production