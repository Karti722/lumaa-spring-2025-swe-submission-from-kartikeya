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

3. Set up the PostgreSQL database:
   - Create a new database for the application.
   - Run the necessary migrations to set up the `users` and `tasks` tables.

### Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

```
DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database_name>
JWT_SECRET=<your_jwt_secret>
```

### Running the Application

1. Start the server:
   ```
   npm run start
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

- Ensure that all endpoints are tested using tools like Postman or Insomnia.
- You can also write unit tests for your services and controllers.

## Contribution

Feel free to fork the repository and submit pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License.