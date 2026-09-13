# Travel Website

A full-stack travel booking website built with React and Vite on the frontend, plus an Express and MySQL backend. The frontend includes destination discovery, destination details, authentication screens, user profiles, bookings, testimonials, and an admin area for managing trips, users, bookings, notifications, payments, and settings.

## Tech Stack

- React 19 and React Router
- Vite 8
- Tailwind CSS 4
- Zustand for client-side state
- Axios for HTTP requests
- Express 5 and MySQL 8+

## Project Structure

```text
frontend/    React application and static JSON data
backend/     Express server and MySQL connection
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A running MySQL database for the backend

### Install dependencies

Install dependencies in each application:

```bash
cd frontend
npm install

cd ../backend
npm install
```

### Configure the backend

Create `backend/.env` with the connection details for your MySQL database:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
```

The backend checks the database connection when it starts. Make sure the database exists and the schema files in `backend/database/schema/` have been applied before running it.

### Run the applications

Start the backend in one terminal:

```bash
cd backend
node server.js
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Vite will print the local frontend URL, normally `http://localhost:5173`. The backend listens on `http://localhost:3000` unless `PORT` is changed.

## Frontend Commands

Run these commands from `frontend/`:

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run Oxlint
```

## Backend Status

The Express server is currently set up for database connectivity and application expansion. API routes and request middleware can be added in `backend/src/app.js` as the booking workflow is connected to MySQL.

## Data

Sample frontend data is stored in `frontend/public/`:

- `destinationsData.json`
- `bookingsData.json`
- `notificationsData.json`
- `testimonial.json`
- `usersData.json`
