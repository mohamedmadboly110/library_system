# Book System API

A RESTful API for a book management system built with Node.js, Express, and MongoDB. Features user authentication, role-based access control, and book CRUD operations.

## Features

- ✅ User authentication (Register/Login with JWT)
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (User/Admin)
- ✅ Book CRUD operations
- ✅ Image upload for books (Multer)
- ✅ Pagination for book listing
- ✅ Data validation with Joi
- ✅ Error handling middleware
- ✅ Protected routes with JWT

## Project Structure

```
book_system_with_cursur/
├── app.js                 # Main application entry point
├── package.json           # Dependencies and scripts
├── .env.example          # Environment variables template
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   ├── User.js           # User model
│   └── Book.js           # Book model
├── routes/
│   ├── auth.js           # Authentication routes
│   └── books.js          # Book routes
├── controllers/
│   ├── authController.js # Authentication logic
│   └── bookController.js # Book CRUD logic
├── middleware/
│   ├── auth.js           # JWT verification
│   ├── admin.js          # Admin role check
│   └── errorHandler.js   # Error handling
├── utils/
│   └── validation.js     # Joi validation schemas
└── uploads/              # Image uploads directory
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/book_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3000
NODE_ENV=development
```

3. Make sure MongoDB is running on your system.

4. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as register

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Access:** Private

### Books

#### Get All Books
- **GET** `/api/books`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Access:** Public
- **Example:** `/api/books?page=1&limit=10`

#### Get Single Book
- **GET** `/api/books/:id`
- **Access:** Public

#### Create Book (Admin Only)
- **POST** `/api/books`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body (form-data):**
  - `title`: Book title
  - `author`: Author name
  - `description`: Book description
  - `image`: Image file (optional)

#### Update Book (Admin Only)
- **PUT** `/api/books/:id`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body (form-data):** Same as create (all fields optional)

#### Delete Book (Admin Only)
- **DELETE** `/api/books/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

## Creating an Admin User

By default, new users are created with the "user" role. To create an admin user, you can:

1. Use MongoDB shell or Compass to update a user's role:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

2. Or modify the User model temporarily to set default role to "admin" for testing.

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Joi** - Data validation
- **dotenv** - Environment variables

## License

ISC


