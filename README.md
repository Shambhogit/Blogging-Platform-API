# Blogging Platform API

A simple RESTful API for user registration, authentication, and blog post management, built with Node.js, Express, MongoDB, and Mongoose.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Important Packages](#important-packages)
- [Database Model](#database-model)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Create Post](#create-post)
  - [Update Post](#update-post)
  - [Delete Post](#delete-post)
  - [Get Single Post](#get-single-post)
  - [Get All Posts](#get-all-posts)
- [How to Run](#how-to-run)
- [Environment Variables](#environment-variables)

---

## Project Structure

```
Project URL - `https://github.com/Shambhogit/Blogging-Platform-API`
.
├── config/
│   └── database.js         # MongoDB connection setup
├── controllers/
│   └── user.controllers.js # User registration and login logic
│   └── post.controllers.js # Blog post logic
├── models/
│   └── user.model.js       # User schema/model
│   └── post.model.js       # Post schema/model
├── routes/
│   └── user.routes.js      # User-related API routes
│   └── post.routes.js      # Post-related API routes
├── middlewares/
│   └── user.middlewares.js # JWT authentication middleware
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

### User Model

The user model is defined in `models/user.model.js`:

```js
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, trim: true },
    last_name:  { type: String, required: true, trim: true },
    email_id:   { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/.+@.+\..+/, 'Please enter a valid email'] },
    password:   { type: String, required: true, minlength: 6 }
}, { timestamps: true });
```

### Post Model

The post model is defined in `models/post.model.js` (not shown here, but assumed):

```js
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
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

### Create Post

- **Endpoint:** `POST /api/v1/post/create`
- **Description:** Creates a new blog post. Requires authentication (JWT in `Authorization` header).
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
  ```json
  {
    "title": "My First Blog",
    "content": "This is the content of the blog.",
    "category": "Tech",
    "tags": ["nodejs", "backend"]
  }
  ```
- **Response:**
  - **Success (201):**
    ```json
    {
      "success": true,
      "message": "Post created Successfully",
      "newPost": {
        "_id": "...",
        "title": "My First Blog",
        "content": "This is the content of the blog.",
        "category": "Tech",
        "tags": ["nodejs", "backend"],
        "user_id": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
    ```
  - **Failure (400):**
    ```json
    {
      "success": false,
      "errors": [
        { "msg": "Title is required" }
      ]
    }
    ```
  - **Failure (401):**
    ```json
    {
      "success": false,
      "error": "No token provided"
    }
    ```

---

### Update Post

- **Endpoint:** `PUT /api/v1/post/update/:id`
- **Description:** Updates an existing post by ID. Only the post owner can update. Requires authentication.
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request Body (any field can be updated):**
  ```json
  {
    "title": "Updated Blog Title",
    "content": "Updated content",
    "category": "Programming",
    "tags": ["javascript"]
  }
  ```
- **Response:**
  - **Success (200):**
    ```json
    {
      "success": true,
      "message": "Post updated successfully",
      "data": {
        "_id": "...",
        "title": "Updated Blog Title",
        "content": "Updated content",
        "category": "Programming",
        "tags": ["javascript"],
        "user_id": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
    ```
  - **Failure (403):**
    ```json
    {
      "success": false,
      "error": "Unauthorized"
    }
    ```
  - **Failure (404):**
    ```json
    {
      "success": false,
      "error": "Post not found"
    }
    ```

---

### Delete Post

- **Endpoint:** `DELETE /api/v1/post/delete/:id`
- **Description:** Deletes a post by ID. Only the post owner can delete. Requires authentication.
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  - **Success (200):**
    ```json
    {
      "success": true,
      "message": "Post deleted successfully"
    }
    ```
  - **Failure (403):**
    ```json
    {
      "success": false,
      "error": "Unauthorized"
    }
    ```
  - **Failure (404):**
    ```json
    {
      "success": false,
      "error": "Post not found"
    }
    ```

---

### Get Single Post

- **Endpoint:** `GET /api/v1/post/get-post/:id`
- **Description:** Fetch a single post by its ID.
- **Response:**
  - **Success (200):**
    ```json
    {
      "success": true,
      "post": {
        "_id": "...",
        "title": "...",
        "content": "...",
        "category": "...",
        "tags": ["..."],
        "user_id": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
    ```
  - **Failure (404):**
    ```json
    {
      "success": false,
      "error": "Post not found"
    }
    ```

---

### Get All Posts

- **Endpoint:** `GET /api/v1/post/get-all-posts`
- **Description:** Fetch all posts. You can filter by tag using the `term` query parameter.
- **Query Parameters:**
  - `term` (optional): Filter posts by tag (case-insensitive).
- **Example:** `/api/v1/post/get-all-posts?term=nodejs`
- **Response:**
  - **Success (200):**
    ```json
    {
      "success": true,
      "count": 2,
      "posts": [
        {
          "_id": "...",
          "title": "...",
          "content": "...",
          "category": "...",
          "tags": ["nodejs", "backend"],
          "user_id": "...",
          "createdAt": "...",
          "updatedAt": "..."
        }
      ]
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

4. **API will be available at:** `http://localhost:3000/api/v1/`

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
