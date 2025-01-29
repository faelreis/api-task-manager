# Task Manager API

A simple task manager built with Node.js, Express, Prisma, and TypeScript. This API allows users to manage tasks, including authentication and role-based access.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building REST APIs.
- **Prisma**: ORM for interacting with the database.
- **Zod**: Data validation library.
- **JWT (JSON Web Token)**: Token-based authentication.
- **Bcrypt**: Library for hashing passwords.
- **TypeScript**: Superset of JavaScript used to improve code reliability and readability.

## Running the Project

### Prerequisites

Before getting started, you need to have Node.js and Prisma installed. If you don't have them, follow the steps below.

1. **Install Node.js**:

   - [Download Node.js](https://nodejs.org/)

2. **Install Prisma**:

   - After cloning the repository, install the dependencies by running the command:

     ```bash
     npm install
     ```

3. **Set up the database**:

   - Configure your database in the `.env` file. A sample configuration is provided in the `.env.example` file. Copy this file to `.env` and adjust the values as needed.
   - Run the migration to set up the database:

     ```bash
     npx prisma migrate dev
     ```

4. **Run the project**:

   - To run the server in development mode with hot reloading:

     ```bash
     npm run dev
     ```

   - To build the project and run it in production mode:

     ```bash
     npm run build
     npm start
     ```

### Available Scripts

- **`dev`**: Starts the server in development mode with automatic reloading.
- **`test:dev`**: Runs the tests in development mode.
- **`build`**: Builds the project for production.
- **`start`**: Starts the server with the built files for production.

### Routes

Here are some of the available routes in the project:

#### 1. **Users**

- **GET /users**: Returns a list of all users (requires authentication).
- **POST /users**: Registers a new user.
- **PATCH /users/:id**: Updates a user's information (requires authentication and role validation: `admin` or `member`).
- **DELETE /users/:id**: Deletes a user (requires authentication and role validation: `admin` or `member`).
- **POST /users/:userId/teams/:teamId**: Adds a user to a team (requires authentication and `admin` role).

#### 2. **Sessions**

- **POST /sessions**: Authenticates the user and returns a JWT.
- **POST /sessions/refresh**: Authenticates the user with a refresh token and returns a new JWT.

#### 3. **Teams**

- **GET /teams**: Returns a list of all teams (requires authentication and `admin` role).
- **POST /teams**: Creates a new team (requires authentication and `admin` role).
- **GET /teams/:id**: Returns details of a specific team (requires authentication and role validation: `admin` or `member`).
- **PATCH /teams/:id**: Updates a team's information (requires authentication and `admin` role).
- **DELETE /teams/:id**: Deletes a team (requires authentication and `admin` role).

#### 4. **Tasks**

- **GET /tasks**: Returns a list of all tasks (requires authentication and role validation: `admin` or `member`).
- **POST /tasks**: Creates a new task (requires authentication and role validation: `admin` or `member`).
- **PATCH /tasks/:id**: Updates a task (requires authentication and role validation: `admin` or `member`).
- **DELETE /tasks/:id**: Deletes a task (requires authentication and role validation: `admin` or `member`).
- **GET /tasks/:id/history**: Returns the task history (requires authentication and role validation: `admin` or `member`).

## Dependencies

### Dependencies

- **@prisma/client**: Prisma client for database interaction.
- **bcrypt**: Library for password hashing.
- **cors**: Middleware for enabling CORS.
- **express**: Web framework for Node.js.
- **express-async-errors**: Middleware for handling async errors in Express.
- **jsonwebtoken**: Library for generating and verifying JWT tokens.
- **supertest**: Library for testing APIs.
- **tsup**: TypeScript bundler for production.
- **zod**: Data validation library.

### Development Dependencies

- **jest**: Testing framework.
- **prisma**: Database migration and client tool.
- **ts-jest**: TypeScript support for Jest.
- **ts-node**: Runs TypeScript code in Node.js.
- **tsx**: Runs TypeScript files directly in Node.js.
- **typescript**: Superset of JavaScript used for development.

## License

This project is licensed under the ISC License. Please refer to the [LICENSE](./LICENSE) file for more information.

---

Developed by [Rafael Reis Franco](https://github.com/faelreis).
