# Twinkle MVP - Verified Creator Platform for Uzbekistan

A complete MVP for Twinkle, a verified creator platform that connects creators with audiences in Uzbekistan.

## 🚀 Tech Stack

### Backend
- **Node.js** with **Express** and **TypeScript**
- **Prisma ORM** with **PostgreSQL**
- **JWT** authentication with **bcrypt** password hashing
- RESTful API architecture

### Frontend
- **React 18** with **TypeScript**
- **Tailwind CSS** with **shadcn/ui** components
- **React Query (TanStack Query)** for server state management
- **React Router DOM** for routing
- **Axios** for HTTP requests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)

## 🛠️ Setup Instructions

### 1. Clone and Navigate

```bash
cd "Twinkle MVP"
```

### 2. Database Setup

1. **Install PostgreSQL** (if not already installed)
   - macOS: `brew install postgresql@14`
   - Linux: `sudo apt-get install postgresql`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Create a database**
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE twinkle;
   
   # Exit psql
   \q
   ```

### 3. Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   ```

4. **Edit `.env` file** with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/twinkle?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   PORT=5000
   NODE_ENV=development
   ```
   Replace `username` and `password` with your PostgreSQL credentials.

5. **Generate Prisma Client and push schema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Seed the database with an admin user**
   ```bash
   # You can use Prisma Studio to manually create an admin user, or run this SQL:
   psql -d twinkle -c "INSERT INTO users (id, email, \"passwordHash\", role, \"isVerified\", \"createdAt\") VALUES ('admin-123', 'admin@twinkle.uz', '\$2b\$10\$YourHashedPasswordHere', 'ADMIN', true, NOW());"
   ```
   
   **Note:** To generate a proper password hash, you can temporarily add this to your backend code or use an online bcrypt generator. For quick testing, you can also create the admin user through the signup endpoint and then manually update the role in the database.

   **Alternative: Quick Admin Setup Script**
   Create a file `backend/scripts/seed-admin.ts`:
   ```typescript
   import { PrismaClient } from '@prisma/client';
   import { hashPassword } from '../src/utils/password';
   
   const prisma = new PrismaClient();
   
   async function main() {
     const passwordHash = await hashPassword('admin123');
     await prisma.user.upsert({
       where: { email: 'admin@twinkle.uz' },
       update: {},
       create: {
         email: 'admin@twinkle.uz',
         passwordHash,
         role: 'ADMIN',
         isVerified: true,
       },
     });
     console.log('Admin user created: admin@twinkle.uz / admin123');
   }
   
   main()
     .catch(console.error)
     .finally(() => prisma.$disconnect());
   ```
   
   Then run: `npx tsx scripts/seed-admin.ts`

7. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   The backend should now be running on `http://localhost:5000`

### 4. Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The frontend should now be running on `http://localhost:3000`

## 🎯 Usage Guide

### User Flows

1. **Sign Up / Login**
   - Visit `http://localhost:3000`
   - Click "Sign Up" to create an account
   - Or click "Login" if you already have an account

2. **Become a Creator**
   - After logging in, navigate to "Become a Creator" (or `/creator/become`)
   - Fill out your creator profile (bio, platform links, audience size, category)
   - Submit the form
   - Your profile will be pending admin approval

3. **Admin Approval** (Admin only)
   - Login as admin (`admin@twinkle.uz` / `admin123` if you seeded it)
   - Navigate to `/admin`
   - View pending creator applications
   - Click "Approve Creator" to approve a creator

4. **Upload Videos** (Approved Creators only)
   - After being approved, navigate to `/creator/dashboard`
   - Click "Create New Video"
   - Fill in video details (title, description, video URL, thumbnail URL, tags)
   - Submit to create a video (initially as DRAFT)
   - Videos can be published later (status can be updated in the database)

5. **Browse Videos**
   - Visit `/browse` to see all published videos
   - Click on a video card to view it

6. **Join Waitlist**
   - On the home page, fill out the waitlist form
   - Submit your email and interest type

## 📁 Project Structure

```
Twinkle MVP/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── middleware/             # Auth & error middleware
│   │   ├── routes/                 # API routes
│   │   ├── services/               # Business logic (if needed)
│   │   ├── types/                  # TypeScript types
│   │   ├── utils/                  # Utility functions
│   │   └── index.ts                # Express server entry
│   ├── .env.example                # Environment variables template
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   └── Layout.tsx          # Main layout component
│   │   ├── contexts/               # React contexts (Auth)
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utilities & API client
│   │   ├── pages/                  # Page components
│   │   ├── types/                  # TypeScript types
│   │   ├── App.tsx                 # Main app component
│   │   └── main.tsx                # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## 🔐 Default Admin Credentials

After seeding the database:
- **Email:** `admin@twinkle.uz`
- **Password:** `admin123`

**⚠️ Important:** Change these credentials in production!

## 🧪 Testing the MVP

1. **Test Authentication**
   - Sign up a new user
   - Login with credentials
   - Verify JWT token is stored

2. **Test Creator Flow**
   - Create a creator profile
   - Login as admin and approve the creator
   - Login as the creator and upload a video

3. **Test Public Features**
   - Browse published videos
   - Join the waitlist

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env` is correct
- Check PostgreSQL logs for connection errors

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.ts`

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to sync schema with database

### CORS Issues
- Ensure backend CORS is configured correctly
- Check that frontend proxy is set up in `vite.config.ts`

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/twinkle?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
```

### Frontend (.env - optional)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Production Deployment

Before deploying to production:

1. **Security**
   - Change `JWT_SECRET` to a strong, random string
   - Use environment variables for all secrets
   - Enable HTTPS
   - Set up proper CORS policies

2. **Database**
   - Use a managed PostgreSQL service (e.g., AWS RDS, Heroku Postgres)
   - Run migrations properly: `npx prisma migrate deploy`

3. **Build**
   - Backend: `npm run build && npm start`
   - Frontend: `npm run build` (deploy the `dist` folder)

4. **Environment**
   - Set `NODE_ENV=production`
   - Configure production database URL
   - Set up proper logging and monitoring

## 📄 License

This project is proprietary software for Twinkle.

## 🤝 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for Twinkle**

