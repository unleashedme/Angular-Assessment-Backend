# Backend API (Node.js)

This repository contains the backend REST API developed as part of the Software Engineer Intern evaluation for NSQTech Private Limited. 

The API is built with **Node.js, Express, and TypeScript**, utilizing **MongoDB** for database storage. It is engineered with enterprise-grade security practices, including cryptographic password hashing and strict data normalization.

## Key Features
* **Authentication & Authorization:** Secure `/api/login` endpoint that issues JSON Web Tokens (JWT) containing cryptographically signed role payloads.
* **Data Security:** Passwords are never stored in plain text. Utilizing `bcrypt` pre-save hooks on the Mongoose schema for secure hashing.
* **Tenant Isolation:** The `/api/records` endpoint strictly extracts the `userId` from the decoded JWT—ignoring request bodies—to ensure users can only ever fetch their own data.
* **Database Seeding:** A dedicated TypeScript seed script to instantly wipe and populate the MongoDB instance with dummy users and records for seamless evaluation.
* **Strong Typing:** Fully typed interfaces for all Mongoose models and Express requests/responses.

## Technology Stack
* **Runtime & Framework:** Node.js, Express.js
* **Language:** TypeScript
* **Database:** MongoDB (via Mongoose ORM)
* **Security:** `bcrypt` (Hashing), `jsonwebtoken` (Auth)

## Setup & Installation

### Prerequisites
* Node.js (v20 LTS recommended)
* MongoDB (Local instance or Atlas URI)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/unleashedme/Angular-Assessment-Frontend.git
   cd Angular-Assessment-Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a ````.env```` file in the root directory and add your configurations:
   ```bash
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/mploychek_eval
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Seed the Database:
   Run the following command to populate MongoDB with test users and records:
   ```bash
   npx ts-node src/seed.ts
   ```
   Test Credentials Generated:
   * Admin ID: admin01 | Password: password123
   * User ID: user01 | Password: password123
5. Start the server:
   ```bash
   npm run dev
   ```
   The API will be available at http://localhost:3000
