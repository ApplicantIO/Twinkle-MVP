# Environment Variables Setup

Create a `.env` file in the `backend` directory with the following content:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/twinkle?schema=public"

# JWT Secret (change this in production!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server
PORT=5000
NODE_ENV=development
```

## Instructions

1. Copy this content into a new file named `.env` in the `backend` directory
2. Replace `user` and `password` with your PostgreSQL credentials
3. Replace `JWT_SECRET` with a strong, random string (for production)
4. Adjust `PORT` if needed (default is 5000)

**Important:** Never commit the `.env` file to version control!

