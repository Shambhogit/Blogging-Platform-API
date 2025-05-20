# Blogging Platform API

A simple RESTful API for user registration and authentication, built with Node.js, Express, MongoDB, and Mongoose.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Important Packages](#important-packages)
- [Database Model](#database-model)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
- [How to Run](#how-to-run)
- [Environment Variables](#environment-variables)


---

## Project Structure

```
.
├── config/
│   └── database.js         # MongoDB connection setup
├── controllers/
│   └── user.controllers.js # User registration and login logic
├── models/
│   └── user.model.js       # User schema/model
├── routes/
│   └── user.routes.js      # User-related API routes
├── index.js                # Entry point of the application
├── package.json            # Project metadata and dependencies
└── .gitignore
```

---

## Important Packages

- **express**: Web framework for Node.js, used to build the API.
- **mongoose**: ODM for MongoDB, used for modeling and interacting with the database.
- **bcrypt**: Library for hashing passwords securely.
- **jsonwebtoken**: For generating and verifying JWT tokens for authentication.
- **express-validator**: Middleware for validating and sanitizing user input.
- **cors**: Middleware to enable Cross-Origin Resource Sharing.

---

## Database Model

The user model is defined in `models/user.model.js`:

```js
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name:  { type: String, required: true, trim: true },
    email_id:   { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/.+@.+\..+/, 'Please enter a valid email'] },
    password:   { type: String, required: true, minlength: 6 }
}, { timestamps: true });
```

---

## API Endpoints

### User Registration

- **Endpoint:** `POST /api/v1/user/register`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email_id": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```
- **Validation:**
  - `first_name` and `last_name`: Required, letters only.
  - `email_id`: Must be a valid email.
  - `password`: Minimum 8 characters.

- **Response:**
  - **Success (201):**
    ```json
    {
      "success": true,
      "message": "User registered successfully"
    }
    ```
  - **Failure (400):**
    ```json
    {
      "success": false,
      "errors": [
        { "msg": "User Already exists" }
      ]
    }
    ```

### User Login

- **Endpoint:** `GET /api/v1/user/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email_id": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```
- **Validation:**
  - `email_id`: Must be a valid email.
  - `password`: Minimum 8 characters.

- **Response:**
  - **Success (200):**
    ```json
    {
      "success": true,
      "token": "<JWT_TOKEN>",
      "user": {
        "_id": "...",
        "first_name": "John",
        "last_name": "Doe",
        "email_id": "john.doe@example.com",
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
    ```
  - **Failure (401):**
    ```json
    {
      "success": false,
      "error": "Authentication Failed!"
    }
    ```

---

## How to Run

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start MongoDB** (make sure MongoDB is running locally on port 27017).

3. **Start the server:**
   ```sh
   npm run dev
   ```

4. **API will be available at:** `http://localhost:3000/api/v1/user`

---

## Environment Variables

- The JWT secret is currently hardcoded in `controllers/user.controllers.js` as `JWT_SECRET`. For production, move this to an environment variable using the `dotenv` package.

---

## Notes

- All passwords are securely hashed using bcrypt before storage.
- JWT tokens are valid for 1 hour.
- Input validation is enforced using express-validator.

---
### Created by ` Shambho Jaybhaye `