# 📚 Book Management System

A complete **Full-Stack Book Management System** built with **Python (FastAPI)**, **Next.js**, **MongoDB**, and **JWT Authentication**.

---

## ✨ Features

- 🔐 **JWT Authentication** – Register, Login, Protected routes with bcrypt password hashing
- 📖 **Full CRUD** – Create, Read, Update, Delete books
- 🔍 **Search & Filter** – Search by title, filter by category, sort by price/date
- 📄 **Pagination** – Server-side pagination with configurable page sizes
- 🛡️ **RBAC** – Role-based access control (Admin/User)
- ⚡ **Async Operations** – Fully async backend with Motor (MongoDB async driver)
- 📱 **Responsive UI** – Mobile-friendly layout with collapsible sidebar
- 🔔 **Toast Notifications** – Elegant success/error feedback
- ⏳ **Loading States** – Skeleton loaders and spinners

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python 3 | Runtime |
| FastAPI | Web Framework |
| MongoDB + Motor | Database (Async Driver) |
| Pydantic | Validation |
| bcrypt | Password Hashing |
| python-jose | JWT Tokens |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 | React Framework (App Router) |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Axios | HTTP Client |
| React Hook Form + Zod | Form Validation |
| Lucide React | Icons |
| React Hot Toast | Notifications |

---

## 📂 Project Structure

```
book-management/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config/
│   │   │   ├── database.py      # MongoDB connection (Motor)
│   │   │   ├── jwt_handler.py   # JWT create/decode
│   │   │   └── settings.py      # Environment config
│   │   ├── models/
│   │   │   ├── user_model.py    # User Pydantic models
│   │   │   └── book_model.py    # Book Pydantic models
│   │   ├── schemas/
│   │   │   ├── auth_schema.py   # Auth request/response schemas
│   │   │   └── book_schema.py   # Book request/response schemas
│   │   ├── routes/
│   │   │   ├── auth_routes.py   # /api/auth/* endpoints
│   │   │   └── book_routes.py   # /api/books/* endpoints
│   │   ├── services/
│   │   │   ├── auth_service.py  # Auth business logic
│   │   │   └── book_service.py  # Book CRUD logic
│   │   ├── middleware/
│   │   │   └── auth_middleware.py # JWT auth dependency
│   │   └── utils/
│   │       ├── password.py      # bcrypt hash/verify
│   │       └── response.py      # Standard response helpers
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/                 # Next.js App Router pages
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── dashboard/
    │   │   └── books/
    │   │       ├── page.tsx     # Book list
    │   │       ├── add/         # Add book form
    │   │       └── [id]/        # Book details & edit
    │   ├── components/
    │   │   ├── BookCard.tsx
    │   │   ├── Loader.tsx
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── layout/
    │   │   │   ├── Sidebar.tsx
    │   │   │   ├── Navbar.tsx
    │   │   │   └── DashboardLayout.tsx
    │   │   └── ui/
    │   │       ├── Button.tsx
    │   │       ├── Input.tsx
    │   │       └── Card.tsx
    │   ├── services/
    │   │   └── api.ts           # Axios client + typed API calls
    │   ├── hooks/
    │   │   └── useAuth.ts       # Auth hook
    │   ├── types/
    │   │   └── book.ts          # TypeScript interfaces
    │   ├── utils/
    │   │   └── toast.ts         # Toast helpers
    │   └── lib/
    │       ├── auth.ts          # Token management
    │       └── axios.ts         # Base axios config
    ├── .env.example
    └── tailwind.config.ts
```

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Backend

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

> API: http://localhost:8000
> Swagger Docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

> App: http://localhost:3000

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT | ❌ |
| GET | `/api/auth/profile` | Get current user | ✅ |

### Books
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/books` | Create book | ✅ User |
| GET | `/api/books` | List books (search/filter/sort/page) | ❌ |
| GET | `/api/books/:id` | Get book details | ❌ |
| PUT | `/api/books/:id` | Update book | ✅ Admin |
| DELETE | `/api/books/:id` | Delete book | ✅ Admin |

---

## 🔐 Environment Variables

### Backend (`.env`)
```
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 📸 Screenshots

> Register → Login → Dashboard → Books → Add/Edit/Delete

---

## 📝 License

MIT
