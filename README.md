# 🥦 VeggieCart — Full-Stack Vegetables E-Commerce

A beautiful, production-ready vegetable e-commerce platform built with React + Node.js + MongoDB.

---

## 📁 Project Structure

```
veggie-cart/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Cart.js              # Cart schema
│   │   └── Order.js             # Order schema
│   ├── routes/
│   │   ├── auth.js              # /api/auth — register, login
│   │   ├── products.js          # /api/products — list, seed
│   │   ├── cart.js              # /api/cart — CRUD
│   │   └── orders.js            # /api/orders — place, history
│   ├── server.js                # Express entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Sticky navbar with cart badge
│   │   │   ├── Navbar.css
│   │   │   ├── ProductCard.jsx  # Product card with add-to-cart
│   │   │   └── ProductCard.css
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Auth state + JWT
│   │   │   └── CartContext.jsx  # Cart state management
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Shop page with hero + grid
│   │   │   ├── Home.css
│   │   │   ├── Cart.jsx         # Cart management
│   │   │   ├── Cart.css
│   │   │   ├── Checkout.jsx     # Order placement
│   │   │   ├── Checkout.css
│   │   │   ├── Orders.jsx       # Order history
│   │   │   ├── Orders.css
│   │   │   ├── Auth.jsx         # Login + Register
│   │   │   └── Auth.css
│   │   ├── api.js               # Axios instance
│   │   ├── App.jsx              # Routes
│   │   ├── main.jsx
│   │   └── index.css            # Global styles + design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, React Router 6, Vite    |
| Styling     | Pure CSS (no framework), CSS vars |
| Backend     | Node.js, Express.js               |
| Database    | MongoDB Atlas (Mongoose)          |
| Auth        | JWT (jsonwebtoken + bcryptjs)     |
| HTTP Client | Axios                             |
| Toasts      | react-hot-toast                   |

---

## 🚀 Local Development Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/veggie-cart.git
cd veggie-cart
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev    # runs on http://localhost:5000
```

### 3. Seed the database (run once)
```
GET http://localhost:5000/api/products/seed
```
Open this URL in your browser after starting the backend.

### 4. Frontend setup
```bash
cd frontend
# No .env needed for local (Vite proxies to localhost:5000)
npm install
npm run dev    # runs on http://localhost:5173
```

---

## ☁️ Deployment on Render + GitHub

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: VeggieCart full-stack app"
git remote add origin https://github.com/YOUR_USERNAME/veggie-cart.git
git push -u origin main
```

### Step 2 — Set up MongoDB Atlas (free)
1. Go to https://cloud.mongodb.com
2. Create a free cluster (M0 Sandbox)
3. Add a database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Copy the connection string:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/veggie-cart`

### Step 3 — Deploy Backend on Render
1. Go to https://render.com → New → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `veggie-cart-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   ```
   MONGO_URI     = mongodb+srv://...
   JWT_SECRET    = any_long_random_string_here
   CLIENT_URL    = https://veggie-cart-frontend.onrender.com
   PORT          = 5000
   ```
5. Click **Deploy**
6. Wait for deploy, then visit: `https://veggie-cart-backend.onrender.com/api/products/seed`
   (This seeds the database with 12 products — do this once!)

### Step 4 — Deploy Frontend on Render
1. Render → New → **Static Site**
2. Connect same GitHub repo
3. Configure:
   - **Name**: `veggie-cart-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:
   ```
   VITE_API_URL = https://veggie-cart-backend.onrender.com/api
   ```
5. Click **Deploy**

### Step 5 — Update CORS
Go back to your backend service on Render, update:
```
CLIENT_URL = https://veggie-cart-frontend.onrender.com
```
(Replace with your actual frontend URL from Render)

---

## 🔑 Environment Variables Reference

### Backend `.env`
| Variable    | Description                    | Example                              |
|-------------|--------------------------------|--------------------------------------|
| PORT        | Server port                    | 5000                                 |
| MONGO_URI   | MongoDB Atlas connection string| mongodb+srv://user:pass@cluster/db   |
| JWT_SECRET  | Secret for JWT signing         | my_super_secret_key_abc123           |
| CLIENT_URL  | Frontend URL for CORS          | https://your-frontend.onrender.com   |

### Frontend `.env`
| Variable       | Description         | Example                                       |
|----------------|---------------------|-----------------------------------------------|
| VITE_API_URL   | Backend API base URL| https://your-backend.onrender.com/api         |

---

## 📡 API Reference

### Auth
| Method | Endpoint          | Body                          | Auth |
|--------|-------------------|-------------------------------|------|
| POST   | /api/auth/register| name, email, password         | No   |
| POST   | /api/auth/login   | email, password               | No   |

### Products
| Method | Endpoint              | Auth |
|--------|-----------------------|------|
| GET    | /api/products         | No   |
| GET    | /api/products/:id     | No   |
| GET    | /api/products/seed    | No   |

### Cart
| Method | Endpoint                      | Auth |
|--------|-------------------------------|------|
| GET    | /api/cart                     | Yes  |
| POST   | /api/cart/add                 | Yes  |
| PUT    | /api/cart/update/:productId   | Yes  |
| DELETE | /api/cart/remove/:productId   | Yes  |
| DELETE | /api/cart/clear               | Yes  |

### Orders
| Method | Endpoint          | Auth |
|--------|-------------------|------|
| POST   | /api/orders/place | Yes  |
| GET    | /api/orders/my    | Yes  |

---

## ✨ Features

- 🥕 **12 pre-seeded vegetables** with real Unsplash images
- 🔐 **JWT authentication** — register, login, persistent sessions
- 🛒 **Real-time cart** — add, remove, update quantities
- 📦 **Order placement** with simulated payment (COD)
- 📜 **Order history** page
- 🔍 **Live search** on the homepage
- 📱 **Fully responsive** mobile-first design
- 🎨 **Unique earthy-botanical aesthetic** — Playfair Display + DM Sans fonts
- 🌿 **No UI framework** — custom pure CSS with CSS variables

---

## 🔮 Future Enhancements

- [ ] Stripe/Razorpay payment integration
- [ ] Admin panel for product management
- [ ] Real delivery tracking
- [ ] AI-based recommendations
- [ ] Mobile app (React Native)
