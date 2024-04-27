#Book Management API


##Introduction
This project is a Book Management API designed to handle CRUD operations for books and user authentication. It provides endpoints for registering and logging in users, managing books, and logging out.

##Features
-User authentication with JWT tokens.
-CRUD operations for books including creation, retrieval, updating, and deletion.
-Secure endpoints with authorization middleware.
-Utilizes Express.js for server-side routing and MongoDB for database management.
-Installation & Getting Started
-Clone the repository.
-Navigate to the project directory.
-Install dependencies by running npm install.
-Start the server by running npm run server.
-Access the API through the provided localhost URL.


##Directory Structure
<pre>
book-management-api/
├─ src/
│  ├─ config/
│  │  ├─ dbConfig.js
│  ├─ middleware/
│  │  ├─ auth.middleware.js
│  ├─ models/
│  │  ├─ blacklist.schema.js
│  │  ├─ book.schema.js
│  │  ├─ user.schema.js
│  ├─ routes/
│  │  ├─ book.routes.js
│  │  ├─ user.routes.js
├─ .env
├─ index.js
├─ package.json
├─ README.md
<pre>

##Dependencies
- `bcrypt: ^5.1.1`
- `dotenv: ^16.4.5`
- `express: ^4.19.2`
- `express-validator: ^7.0.1`
- `jsonwebtoken: ^9.0.2`
- `mongoose: ^8.3.2`
- `nodemon: ^3.1.0`
- `swagger-jsdoc: ^6.2.8`
- `swagger-ui-express: ^5.0.0`


Scripts
- `server`: Start the server using nodemon for automatic reloading.


##API Endpoints

##User Authentication
-Register a New User
-POST /user/signup
-Register a new user with username, email, and password.

-Login
-POST /user/login
-Login with email and password to obtain a JWT token.

=Logout
-POST /user/logout
-Invalidate the JWT token to logout.


##Book Management
-Retrieve All Books
-GET /book
-Retrieve a list of all books.

-Retrieve Books by Author
-GET /book/author/{author}
-Retrieve books by a specific author.

-Retrieve Books by Publication Year
-GET /book/publicationYear/{publicationYear}
-Retrieve books published in a specific year.

-Create a New Book
-POST /book
-Create a new book with title, author, and publication year.

-Update a Book
-PUT /book/{id}
-Update an existing book by ID with new details.

-Delete a Book
-DELETE /book/{id}
-Delete a book by ID.


##API Documentation
-API documentation is available at /api-docs endpoint, generated using Swagger UI.
-Now, users and developers can easily understand and utilize your Book Management API.