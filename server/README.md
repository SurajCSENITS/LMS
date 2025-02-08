# LMS Backend Server

This is the backend server for the Learning Management System (LMS) project. It provides APIs for managing courses, users, and other LMS functionalities.

## Features

- User authentication and authorization
- Course management (create, update, delete, list)
- User management (register, update profile, list)
- Enrollment management

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Mongoose for MongoDB object modeling

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/lms-backend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd lms-backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

## Running the Server

Start the server in development mode:
```bash
npm run dev
```

The server will be running at `http://localhost:5000`.

## API Documentation

API documentation is available at `http://localhost:5000/api-docs` when the server is running.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.