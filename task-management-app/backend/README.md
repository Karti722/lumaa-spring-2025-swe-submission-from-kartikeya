# Task Management Application Backend

## Overview

This is the backend for the Task Management application built using Node.js (or Nest.js) and PostgreSQL. The backend handles user authentication and task management functionalities.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd task-management-app/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the PostgreSQL database and make sure to store the password somewhere safe for reference (like a .txt file on your desktop):
   - Create a new database for the application.
   - Run the necessary migrations to set up the `users` and `tasks` tables using the query tool in PgAdmin4 under your tasks database. Insert the following code and run it.
 ```
 CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    isComplete BOOLEAN DEFAULT FALSE,
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE
);
 ```
 4. Create a super user when adding Login/Group roles in PgAdmin 4. Remember to also store this
 5. Add these values in a format in the main README


### Running the Application

1. Start the server:
   ```
   npm run dev
   ```

2. The server will run on `http://localhost:5000` (or the port specified in your configuration).

### API Endpoints

- **Authentication**
  - `POST /auth/register`: Register a new user.
  - `POST /auth/login`: Log in an existing user and receive a JWT token.

- **Tasks Management**
  - `GET /tasks`: Retrieve a list of tasks.
  - `POST /tasks`: Create a new task.
  - `PUT /tasks/:id`: Update an existing task.
  - `DELETE /tasks/:id`: Delete a task.

## Folder Structure

- `src/`: Contains the source code for the backend application.
  - `controllers/`: Contains the logic for handling requests and responses.
  - `models/`: Defines the data models for users and tasks.
  - `routes/`: Defines the API routes for authentication and task management.
  - `services/`: Contains business logic for authentication and task management.
  - `utils/`: Contains utility functions for database connection, JWT handling, and password hashing.
  - `app.ts`: Initializes the Express application and sets up middleware.
  - `server.ts`: Starts the server and listens on a specified port.

## Testing

- I used the ThunderClient extension from VS Code to test all api end points individually, with the appropriate payloads as well

