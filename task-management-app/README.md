# Task Management Application

## Overview

This is a full-stack "Task Management" application built using React + TypeScript for the frontend, Node.js for the backend, and PostgreSQL for the database. The application allows users to register, log in, and manage tasks effectively.

## Features

- **User Authentication**: Users can register and log in to access their tasks.
- **Task Management**: Users can create, view, update, and delete tasks.
- **Secure Routes**: Task operations are protected and require authentication.

## Technologies Used

- **Frontend**: React, TypeScript, Axios
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Database**: PostgreSQL
- **Authentication**: JWT for token-based authentication, bcrypt for password hashing

## Project Structure

```
task-management-app
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── app.ts
│   │   ├── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.tsx
│   │   ├── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── README.md
└── .gitignore
```

## Setup Instructions

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Set up the PostgreSQL database and run migrations as specified in the backend README.
4. Start the server:
   ```
   npm run start
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Update the API base URL in the frontend to point to the backend server.
4. Start the React application:
   ```
   npm start
   ```

## Usage

1. Register a new user through the registration form.
2. Log in using the registered credentials.
3. Manage tasks by creating, updating, and deleting them from the tasks page.

## Notes

- Ensure that the PostgreSQL server is running before starting the backend.
- The application is designed to be minimal and functional, focusing on core features.

## License

This project is licensed under the MIT License.