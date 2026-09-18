# Ghure Ashi Backend API

Express and MySQL backend for the Ghure Ashi travel website. This document is the source of truth for running the backend and selecting the correct API URL from the frontend, Postman, or another client.

## Quick Reference

| Setting | Value |
| --- | --- |
| Local API base URL | `http://localhost:3000` |
| Port | `process.env.PORT` or `3000` |
| JSON content type | `application/json` |
| User API prefix | `/api/users` |
| Full details API prefix | `/api/user-details` |

The final request URL is always:

```text
BASE_URL + route path
```

Examples:

```text
http://localhost:3000/api/users/createuser
http://localhost:3000/api/user-details/update/2
```

There is no API prefix such as `/backend`, `/server`, or `/v1` in the current application.

## Technology

- Node.js with native ES modules
- Express 5
- MySQL 8+
- `mysql2/promise`
- `express-validator`
- `bcrypt`
- `dotenv`

## Project Structure

```text
backend/
	database/schema/       MySQL table definitions
	src/app.js             Express app and route prefixes
	src/controllers/       Request and response handling
	src/db/db.js           MySQL connection pool
	src/middleware/        Request validation
	src/repository/        Database queries
	src/routes/            Endpoint definitions
	server.js              Environment loading and HTTP server startup
```

## Requirements

- Node.js 18 or newer
- npm
- MySQL 8 or newer
- A database created before starting the server

## Installation

From the `backend/` directory:

```bash
npm install
```

Create a file named `.env` in `backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ghureashi
DB_PORT=3306
```

Apply the schema files in this order:

1. `database/schema/001_users.sql`
2. `database/schema/002_users_full_details.sql`

Start the server:

```bash
node server.js
```

The terminal should show a successful database connection and the server URL. If `PORT=4000` is configured, every request must use `http://localhost:4000` instead of `http://localhost:3000`.

## How To Find The Correct API URL

Use this three-part process:

1. Read the port in `.env`. If it is missing, use `3000`.
2. Read the prefix in `src/app.js`.
3. Read the path in the matching file under `src/routes/`.

For example:

```js
app.use("/api/user-details", userFullDetails);
```

and:

```js
router.put("/update/:userId", userFullDetailsValidation, updateUserFullDetails);
```

produce this URL:

```text
PUT http://localhost:3000/api/user-details/update/:userId
```

Replace `:userId` with a real ID, for example `/update/2`.

## API Endpoints

### Users

| Method | URL | Purpose |
| --- | --- | --- |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:id` | Get one user |
| `POST` | `/api/users/createuser` | Create a user |
| `PUT` | `/api/users/updateuser/:id` | Update a user |
| `DELETE` | `/api/users/deleteuser/:id` | Delete one user |
| `DELETE` | `/api/users/deleteall` | Delete all users |

### User full details

| Method | URL | Purpose |
| --- | --- | --- |
| `POST` | `/api/user-details/create` | Create full details for a user |
| `GET` | `/api/user-details` | Get all full details |
| `GET` | `/api/user-details/:userId` | Get full details by user ID |
| `PUT` | `/api/user-details/update/:userId` | Update full details by user ID |

## Request Examples

All JSON requests require this header:

```http
Content-Type: application/json
```

### Create a user

```http
POST http://localhost:3000/api/users/createuser
```

```json
{
	"fullname": "Rahul Sharma",
	"email": "rahul.sharma@example.com",
	"phone": "9876543210",
	"password": "password123"
}
```

Example success response:

```json
{
	"message": "User created successfully",
	"user": {
		"id": 2,
		"fullname": "Rahul Sharma",
		"email": "rahul.sharma@example.com",
		"phone": "9876543210"
	}
}
```

Save the returned `user.id`. It is required when creating the user's full details.

### Get a user

```http
GET http://localhost:3000/api/users/2
```

### Create full user details

The parent user must already exist. The `userId` value must match an existing `users.id` or MySQL will reject the request with a foreign-key error.

```http
POST http://localhost:3000/api/user-details/create
```

```json
{
	"userId": 2,
	"profileImg": "https://example.com/profile.jpg",
	"DOB": "1998-05-15",
	"gender": "Male",
	"address_line1": "123 MG Road",
	"address_line2": "Near City Mall",
	"city": "Bengaluru",
	"state": "Karnataka",
	"pin_code": "560001",
	"country": "India",
	"nationality": "Indian",
	"passport_number": "P1234567",
	"preferred_airport": "Kempegowda International Airport",
	"preferred_seat": "Window",
	"dietary_preferences": "Vegetarian",
	"medical_notes": "No known allergies",
	"Emergency_contact_name": "Anita Sharma",
	"Emergency_contact_number": "9876543210",
	"Emergency_contact_relationship": "Mother"
}
```

Only one full-details record should be created for each user. Creating it twice returns:

```json
{
	"message": "User full details already exist"
}
```

### Get full details

```http
GET http://localhost:3000/api/user-details/2
```

### Update full details

The update ID belongs in the URL. Do not change `user_id` in the request body.

```http
PUT http://localhost:3000/api/user-details/update/2
```

```json
{
	"profileImg": "https://example.com/profile-updated.jpg",
	"DOB": "1998-05-15",
	"gender": "Male",
	"address_line1": "45 Updated MG Road",
	"address_line2": "Apartment 4B",
	"city": "Bengaluru",
	"state": "Karnataka",
	"pin_code": "560001",
	"country": "India",
	"nationality": "Indian",
	"passport_number": "P1234567",
	"preferred_airport": "Kempegowda International Airport",
	"preferred_seat": "Aisle",
	"dietary_preferences": "Vegetarian",
	"medical_notes": "No known allergies",
	"Emergency_contact_name": "Anita Sharma",
	"Emergency_contact_number": "9876543210",
	"Emergency_contact_relationship": "Mother"
}
```

## Validation Rules

### User fields

- `fullname`: required, minimum 3 characters.
- `email`: required and valid email format.
- `phone`: required, 10 digits.
- `password`: required, minimum 6 characters.

### Full details fields

- Create requires `userId`, `DOB`, `gender`, address, location, nationality, and passport fields.
- `gender` must be `Male`, `Female`, or `Other`.
- `DOB` must be an ISO date such as `1998-05-15`.
- Optional fields may be omitted or sent as an empty value.
- The ID for update and read operations comes from the URL parameter.

Validation failures return HTTP `400`:

```json
{
	"errors": [
		{
			"type": "field",
			"value": "",
			"msg": "Full name is required",
			"path": "fullname",
			"location": "body"
		}
	]
}
```

## Status Codes

| Status | Meaning |
| --- | --- |
| `200` | Request completed successfully |
| `201` | Resource created successfully |
| `400` | Invalid input, duplicate record, or invalid request |
| `404` | User or details record was not found |
| `500` | Server or database error |

## Common Problems

### Cannot connect to the API

- Confirm the backend terminal is running.
- Confirm the frontend uses the same port as `.env`.
- Use `http://localhost:3000`, not the Vite frontend port `5173`.
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT`.

### Foreign-key error for `user_id`

Create a user first, copy the returned `user.id`, and use that ID in `POST /api/user-details/create`. Do not assume the ID is always `1`.

### `User full details already exist`

The user already has a details row. Use `PUT /api/user-details/update/:userId` instead of creating another row.

### `User not found`

Verify that the ID in the URL exists in the `users` table.

## Development Checklist

Before opening a pull request:

- Confirm the endpoint URL includes the correct port and route prefix.
- Test success, validation, duplicate, not-found, and database-error paths.
- Do not return passwords in API responses.
- Keep database queries in repositories and request logic in controllers.
- Run the backend from `backend/` with `node server.js`.
- Add or update documentation when a route or request field changes.
