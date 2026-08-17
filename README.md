# Task Manager

A fullstack task management application built with React (frontend) and Express/Node.js (backend) with PostgreSQL database.

## Project Description

A simple yet functional task management application that allows users to create, edit, delete, search, and filter tasks. The application demonstrates fullstack development principles including RESTful API design, React state management, and database operations.

## Features

- **Add Task** - Create new tasks with title and description
- **Edit Task** - Update task title and description
- **Delete Task** - Remove tasks from the list
- **Mark Complete/Incomplete** - Toggle task completion status
- **Search Task** - Real-time search by task title
- **Filter Tasks** - Filter by All, Incomplete, or Completed tasks
- **Search + Filter** - Combine search and filter for refined results

## Technologies Used

### Frontend
- React 19
- Vite
- JavaScript (ES6+)

### Backend
- Node.js 18+
- Express 5
- PostgreSQL 14+
- pg (PostgreSQL client)
- cors
- dotenv

## How to Install/Run the Project

### Prerequisites
- Node.js 18 or newer
- PostgreSQL 14 or newer

### Installation Steps

1. **Clone or copy the project to your computer**

2. **Create the PostgreSQL database**
   ```bash
   psql -U postgres -c "CREATE DATABASE task_manager;"
   ```

3. **Import the database schema**
   ```bash
   psql -U postgres -d task_manager -f backend/schema.sql
   ```

4. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```
   Copy `.env.example` to `.env` and update your database password:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=task_manager
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=5000
   ```

5. **Start the backend**
   ```bash
   npm start
   ```

6. **Set up the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   ```

7. **Start the frontend**
   ```bash
   npm run dev
   ```

8. **Open the application**
   Navigate to `http://localhost:5173`

### Running the Application

- **Backend**: `cd backend && npm start` - runs the server directly
- **Frontend**: `cd frontend && npm run dev` - development mode with hot reload, `npm run build` - production build

## Database Setup

The database schema is defined in `backend/schema.sql`:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/tasks` | Get all tasks | - |
| POST | `/api/tasks` | Create new task | `{ title, description, completed }` |
| PUT | `/api/tasks/:id` | Update task | `{ title, description, completed }` |
| DELETE | `/api/tasks/:id` | Delete task | - |

### Error Responses
- `400 Bad Request` - Invalid input (missing title, no fields to update)
- `404 Not Found` - Task doesn't exist
- `500 Internal Server Error` - Database/connection errors

## Folder Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Database connection
│   │   ├── controllers/
│   │   │   └── taskController.js  # Business logic
│   │   ├── routes/
│   │   │   └── taskRoutes.js      # API routes
│   │   └── server.js              # Express server
│   ├── schema.sql                 # Database schema
│   ├── .env.example               # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main component
│   │   ├── App.css                # Component styles
│   │   └── index.css              # Global styles
│   └── package.json
└── README.md
```
