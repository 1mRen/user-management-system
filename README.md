# User Management System

## Table of Contents

- [Introduction](#introduction)
- [Installation Instructions](#installation-instructions)
  - [Prerequisites](#prerequisites)
- [Backend Setup (Node.js + MySQL)](#backend-setup-nodejs--mysql)
  - [Clone the repository](#clone-the-repository)
  - [Install dependencies](#install-dependencies)
  - [Set up environment variables](#set-up-environment-variables)
  - [Start the backend server](#start-the-backend-server)
- [Frontend Setup (Angular)](#frontend-setup-angular)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Introduction

The **User Management System** is a web-based application designed to streamline user authentication, authorization, and account management. It provides a secure and efficient way to handle user registration, authentication, and role-based access control. 

Built with **Node.js** and **MySQL** for the backend and **Angular** for the frontend, this system ensures a seamless experience for both users and administrators. Key features include JWT authentication, email verification, password recovery, profile management, and an admin dashboard for managing user accounts. Additionally, a fake backend implementation is available to facilitate development and testing without requiring a live backend.

This project is developed by:
- Marc Lawrence Magadan
- Jairus Azer Andrade
- John Clarence Palma

---

## Installation Instructions

Follow these steps to set up the project locally:

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [MySQL](https://www.mysql.com/)
- [Angular CLI](https://angular.io/cli) (for frontend development)

---

## Backend Setup (Node.js + MySQL)

1. **Clone the repository**  
   ```sh
   git clone https://github.com/your-repo/user-management-system.git
   cd user-management-system/backend
   ```

2. **Install dependencies**  
   Run the following command to install the required dependencies:
   ```sh
   npm install 
   ```

3. **Set up environment variables**  
   Create a `.env` file in the root of the `backend` folder and add the following environment variables:
   ```env
   # Database Configuration
   DB_HOST=your_db_host
   DB_PORT=3306
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=your_db_name

   # JWT Secret
   JWT_SECRET=your_jwt_secret

   # Email Configuration
   EMAIL_FROM=your_email@example.com
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ```
   Replace the values with your actual database credentials and email configuration.

4. **Start the backend server**  
   ```sh
   npm start
   ```
   For development mode with auto-restart on file changes, use:
   ```sh
   npm run start:dev
   ```

---

## Frontend Setup (Angular)

1. **Navigate to the frontend directory**
   ```sh
   cd ../frontend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start the frontend server**
   ```sh
   ng serve
   ```
   The application will be available at `http://localhost:4200/`.

---

## API Documentation

The API documentation is available via Swagger. After starting the backend server, access it at:
```
http://localhost:4000/api-docs/#
```

---

## Contributing

Contributions are welcome! If you’d like to contribute, please follow these steps:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For any inquiries or support, reach out to the developers:
- **Marc Lawrence Magadan** - mmarclawrence@gmail.com
- **Jairus Azer Andrade** - 
- **John Clarence Palma** -
