# AI Mock Interview Platform

## Overview

AI Mock Interview Platform is a full-stack web application that helps users practice mock interviews, upload resumes, and track interview performance through detailed reports. The platform provides a professional environment for interview preparation and skill improvement.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Secure Logout

### Dashboard

* Overview of user activity
* Resume statistics
* Interview statistics
* Quick actions

### Resume Management

* Upload resumes
* View resume history
* Track uploaded resumes

### Mock Interviews

* Start role-based interviews
* Answer interview questions
* Submit interview responses
* Interview history tracking

### Reports

* Interview performance summary
* Score tracking
* Feedback display
* Progress monitoring

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JSON Web Token (JWT)

### AI Integration

* Google Gemini API

---

## Project Structure

```text
AI-Mock-Interview-Platform
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   ├── config
│   └── server.js
│
└── .gitignore
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Byte-Coder7/AI-Mock-Interview-Platform.git
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd server
npm install
npm run server
```

---

## Environment Variables

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## Future Scope

* AI-powered interview evaluation
* Voice-based interviews
* Resume analysis using AI
* Interview scheduling
* Performance analytics dashboard
* Deployment on cloud platforms

---

## Author

**Pooja Rawat**

BCA Final Year Project

AI Mock Interview Platform
