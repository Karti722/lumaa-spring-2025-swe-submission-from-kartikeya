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


## Setup Instructions

1. Clone the repo onto your local machine (git clone https://github.com/Karti722/lumaa-spring-2025-swe-submission-from-kartikeya.git)

### Backend

1. Navigate to the `tast_management/backend` directory on your terminal or Windows CMD.
2. Install dependencies with these two commands:
   ```
   npm install bcrypt@^5.0.1 cors@^2.8.5 dotenv@^10.0.0 express@^4.17.1 jsonwebtoken@^8.5.1 pg@^8.7.1 pg-hstore@^2.3.4
   ```
   ```
   npm install --save-dev @types/bcrypt@^5.0.0 @types/cors@^2.8.10 @types/express@^4.17.13 @types/jsonwebtoken@^8.5.5 @types/node@^16.11.7 @types/pg@^8.11.11 ts-node@^10.9.2 ts-node-dev@^2.0.0 typescript@^5.7.3
   ```

   
3. Set up the PostgreSQL database and run migrations as specified in the backend README.
4. set up tsconfig.json in the backend folder (root) 
   ```
   {
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
   ```
5. Start the server:
   ```
   npm run dev
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