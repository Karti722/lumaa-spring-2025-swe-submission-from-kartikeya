# Task Management App - Deployment Guide

This is a full-stack application with separate frontend and backend services.

## Project Structure
```
task-management-app/
├── backend/          # Node.js + TypeScript + Express API
│   ├── src/
│   ├── package.json
│   └── .env
├── frontend/         # React + TypeScript + Webpack
│   ├── src/
│   ├── package.json
│   └── .env
└── README.md
```

## Deployment on Render

### Backend Service
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node.js

### Frontend Service (Option 1: Static Site)
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Frontend Service (Option 2: Web Service)
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run serve`
- **Environment**: Node.js

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=10000
DB_USER=postgres
DB_HOST=db.fcbtoqydzkmegvmmhefr.supabase.co
DB_NAME=postgres
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-service.onrender.com
```

## Technologies Used
- **Backend**: Node.js, Express, TypeScript, PostgreSQL (Supabase), JWT, bcrypt
- **Frontend**: React, TypeScript, Webpack, Axios, React Router
- **Database**: Supabase PostgreSQL
- **Deployment**: Render.com
