# Backend Setup & Deployment Guide
## **Check Here** ➡️ [Implementaion video](https://drive.google.com/file/d/1p7gUYv2x6NJoL6DCpx8p43XhhbuzB9JQ/view?usp=sharing)

This guide will help you set up, run, and deploy the backend of the project.

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MySQL](https://www.mysql.com/) database
- [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Kalparatna/Accredian-backend-task.git
   cd Accredian-backend-task
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and configure it with the following:

```
PORT=5000
DATABASE_URL="mysql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>"
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

- Replace `<USER>`, `<PASSWORD>`, `<HOST>`, `<PORT>`, and `<DATABASE>` with your MySQL credentials.
- Ensure that your MySQL database is accessible from the backend server.

## Database Setup

1. Run Prisma migrations to set up the database schema:
   ```sh
   npx prisma migrate dev --name init
   ```

2. Generate Prisma Client:
   ```sh
   npx prisma generate
   ```

3. Test the database connection:
   ```sh
   node server.js
   ```
   If the server starts without errors, your database is correctly configured.

## Running the Server

Start the backend server locally:
```sh
npm start
```

The server should now be running on `http://localhost:5000`.
