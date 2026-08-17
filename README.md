# Task Manager – Installation & Setup

Follow these steps to install and run the Task Manager application on another computer.

## 1. Install the Requirements

Install:

* **Node.js 18 or newer**
* **PostgreSQL 14 or newer**

Check Node.js installation:

```bash
node -v
npm -v
```

---

## 2. Copy the Project

Copy the Task Manager project to your computer.

Open **Command Prompt** or **PowerShell** inside the project folder.

---

## 3. Create the PostgreSQL Database

Create a database named:

```text
task_manager
```

You can create it using **pgAdmin** or `psql`.

Using `psql`:

```bash
psql -U postgres -c "CREATE DATABASE task_manager;"
```

---

## 4. Import the Database

Run the provided `schema.sql` file:

```bash
psql -U postgres -d task_manager -f backend/schema.sql
```

Enter your PostgreSQL password when asked.

---

## 5. Set Up the Backend

Go to the backend folder:

```bash
cd backend
```

Install the required packages:

```bash
npm install
```

---

## 6. Set Up the `.env` File

The project already includes a `.env.example` file inside the `backend` folder.

### Step 1 – Copy `.env.example`

Inside the `backend` folder, make a copy of:

```text
.env.example
```

### Step 2 – Rename the copy

Rename the copied file to:

```text
.env
```

### Step 3 – Update the database password

Open the `.env` file and make sure the database information is correct:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgresql_password
```

Replace:

```text
your_postgresql_password
```

with the password you created when installing PostgreSQL.

> **Important:** Do not delete or modify `.env.example`. Keep it as a template for other users.


## 7. Start the Backend

While inside the `backend` folder, run:

```bash
npm start
```

**Keep this terminal open.**

---

## 8. Set Up the Frontend

Open a **new** Command Prompt or PowerShell window.

Go to the frontend folder:

```bash
cd frontend
```

Install the required packages:

```bash
npm install
```

---

## 9. Start the Frontend

Run:

```bash
npm run dev
```

Vite will display a URL, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

---

## 10. Running the Application

Every time you want to run the project:

### Terminal 1 – Backend

```bash
cd backend
npm start
```

### Terminal 2 – Frontend

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Done!

The Task Manager application should now be running.
