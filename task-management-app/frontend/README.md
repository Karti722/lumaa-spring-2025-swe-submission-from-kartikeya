# Task Management Application - Frontend

## Overview

This is the frontend part of the Task Management application built using **React** and **TypeScript**. The application allows users to register, log in, and manage their tasks effectively.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd task-management-app/frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server, run:
```
npm start
```

The application will be available at `http://localhost:3000`.

### Environment Variables

You may need to set up environment variables to connect to the backend. Create a `.env` file in the root of the frontend directory and add the following:
```
REACT_APP_API_URL=http://localhost:5000
```

### Folder Structure

- **src/**: Contains all the source code for the frontend application.
  - **components/**: Reusable components for authentication and task management.
  - **pages/**: Page components that render specific views.
  - **services/**: Functions for making API calls to the backend.

### Features

- User Registration and Login
- Task Management (Create, Read, Update, Delete)
- JWT Authentication

### Testing

To run tests, use:
```
npm test
```

### Notes

- Ensure the backend server is running before starting the frontend application.
- The frontend communicates with the backend using RESTful API calls.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.