# Taskify — Task Management Application

A modern, role-based task management application built with the MERN stack. Taskify allows team leads to create, assign, manage, and track tasks while team members can view and update the tasks assigned to them.

## 🌐 Live Demo

**Frontend:** [(https://taskify-nu-nine.vercel.app/)]

---

##  Overview

Taskify is designed around a simple team-based task management workflow.

There are two primary roles:

* **Lead** — Creates, assigns, edits, deletes, and monitors tasks for the team.
* **Member** — Views tasks assigned to them and progresses their tasks through the workflow.

The application provides a responsive interface for both desktop and mobile devices.

---

##  Features

### Authentication

* User registration and login
* Role-based authentication
* JWT-based authentication
* Access token and refresh token handling
* Secure HTTP-only cookies
* Protected routes
* Role-based access control

### Task Management

* Create tasks
* View all team tasks
* View individual task details
* Update tasks
* Delete tasks
* Assign tasks to team members
* Set task priority
* Set task due dates
* Update task status

### Task Workflow

Tasks follow a simple workflow:

```text
TODO → IN_PROGRESS → COMPLETED
```

Team members can progress their assigned tasks through the workflow.

### Task Filtering & Sorting

* Search tasks
* Filter by status
* Filter by priority
* Sort by due date
* Sort by priority
* Sort alphabetically by title

### Role-Based UI

#### Team Lead

* View all team tasks
* Create tasks
* Assign tasks to members
* Edit tasks
* Delete tasks
* View task details
* Monitor task status

#### Team Member

* View assigned tasks
* View task details
* Start tasks
* Complete tasks
* View the team lead associated with tasks

### Responsive Design

* Desktop table-based task view
* Mobile card-based task view
* Responsive navigation
* Responsive task management interface

### Real-Time Updates

Taskify uses real-time communication to notify team members when task-related changes occur.

Examples include:

```text
task:created
task:updated
task:status-updated
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios
* React Hot Toast
* Lucide React

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose
* JWT
* Socket.IO

### Architecture & Development Practices

* Clean Architecture
* SOLID principles
* Repository Pattern
* Dependency Injection
* DTO Pattern
* Mapper Pattern
* Domain Entities
* Use Case driven application structure
* Centralized error handling
* ESLint
* Prettier

---

## 🏗️ Project Structure

```text
Taskify/
│
├── backend/
│   ├── src/
│   │   ├── application/
│   │   │   ├── dtos/
│   │   │   ├── interfaces/
│   │   │   ├── mappers/
│   │   │   └── use-cases/
│   │   │
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── errors/
│   │   │   └── repositories/
│   │   │
│   │   ├── infrastructure/
│   │   │   ├── config/
│   │   │   ├── database/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   └── di/
│   │   │
│   │   ├── interfaces/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   └── routes/
│   │   │
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── types/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

##  Authentication Flow

Taskify uses JWT authentication with access and refresh tokens.

```text
User
 │
 ▼
Login
 │
 ▼
Backend Authentication
 │
 ├── Access Token
 │
 └── Refresh Token
 │
 ▼
Secure HTTP-only Cookies
 │
 ▼
Protected API Requests
```

Access tokens are short-lived while refresh tokens are used to obtain a new access token when required.

---

##  Task Access Rules

Task visibility and actions depend on the user's role.

| Role   | Task Access    | Create | Edit | Delete | Update Status |
| ------ | -------------- | ------ | ---- | ------ | ------------- |
| Lead   | All team tasks | ✅      | ✅    | ✅      | ❌             |
| Member | Assigned tasks | ❌      | ❌    | ❌      | ✅             |

This ensures that team members can only interact with tasks assigned to them, while leads maintain control over team task management.

---

##  Task Properties

Each task contains information such as:

```text
Title
Description
Status
Priority
Team
Created By
Assigned To
Due Date
Completion Date
Created At
Updated At
```

The API response also provides display-friendly information such as:

```text
Team Name
Lead Name
Assigned Member Name
```

This keeps presentation-related information out of the domain entity while allowing the frontend to display meaningful task information.

---

##  Task Status

Tasks use three statuses:

```text
TODO
IN_PROGRESS
COMPLETED
```

The normal member workflow is:

```text
TODO
  ↓
IN_PROGRESS
  ↓
COMPLETED
```

---

##  Task Priority

Tasks can have one of three priority levels:

```text
LOW
MEDIUM
HIGH
```

---

##  Running the Project Locally

### Prerequisites

Make sure you have:

* Node.js
* MongoDB
* npm

installed on your system.

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory.

Example:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_MAX_AGE=900000
REFRESH_TOKEN_MAX_AGE=604800000

CLIENT_URL=http://localhost:5173
```

Start the development server:

```bash
npm run dev
```

Build the backend:

```bash
npm run build
```

Start the production build:

```bash
npm start
```

---

# Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the required environment file and configure the backend API URL.

Example:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will then be available through the Vite development server.

---

##  Deployment

Taskify is deployed using separate hosting platforms.

```text
                    ┌─────────────────┐
                    │     Vercel      │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             │ HTTPS API
                             ▼
                    ┌─────────────────┐
                    │     Render      │
                    │     Backend     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     MongoDB     │
                    │     Database    │
                    └─────────────────┘
```

### Production URLs

**Frontend**

[https://taskify-nu-nine.vercel.app/]

**Backend API**

[https://taskify-api-and0.onrender.com]

Replace both placeholders with the actual deployed URLs.

---

##  Architecture

The backend follows Clean Architecture principles.

The main layers are:

```text
Interfaces
    ↓
Application
    ↓
Domain
    ↑
Infrastructure
```

### Domain

Contains the core business rules and entities.

```text
Entities
Repositories Interfaces
Domain Errors
```

The domain layer does not depend on infrastructure implementations.

### Application

Contains application-specific business operations.

```text
Use Cases
DTOs
Interfaces
Mappers
```

Each major operation is represented by a dedicated use case.

### Infrastructure

Contains external implementations.

```text
MongoDB
Mongoose Models
Repository Implementations
JWT Services
Password Services
Real-Time Services
Configuration
Dependency Injection
```

### Interfaces

Handles communication with the outside world.

```text
Controllers
Routes
Middleware
HTTP handling
```

---

## 🧩 SOLID Principles

The project follows SOLID principles throughout the backend architecture.

### Single Responsibility Principle

Classes and modules are responsible for a specific concern.

For example:

* Controllers handle HTTP requests.
* Use cases handle application logic.
* Repositories handle persistence.
* Mappers handle data transformation.

### Open/Closed Principle

The application is structured so that behavior can be extended through interfaces and implementations without modifying the core business logic.

For example, repository and service abstractions allow infrastructure implementations to be replaced or extended.

### Liskov Substitution Principle

Concrete implementations such as repository classes implement their corresponding domain repository contracts and can be substituted wherever those abstractions are expected.

### Interface Segregation Principle

The application defines focused interfaces for different responsibilities rather than forcing classes to depend on large interfaces containing unrelated methods.

### Dependency Inversion Principle

The application and domain layers depend on abstractions rather than concrete infrastructure implementations.

Dependency Injection is used to provide the concrete implementations.

---

#  API Overview

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/verify-otp
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/logout
```

### Tasks

```text
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:taskId
PUT    /api/tasks/:taskId
PATCH  /api/tasks/:taskId/status
DELETE /api/tasks/:taskId
GET    /api/tasks/statistics
```

> API paths may vary depending on the configured route prefix.

---

##  UI

Taskify provides a responsive task management interface with:

* Dashboard
* Task management
* Task filtering
* Task sorting
* Task creation
* Task editing
* Task details
* Task deletion
* Status workflow
* Role-specific actions
* Responsive desktop and mobile layouts

---

##  Future Improvements

Possible future improvements include:

* Task comments
* Task activity history
* Notifications
* Email notifications
* Advanced task analytics
* File attachments
* Pagination
* Advanced team management
* Calendar-based task view
* Improved real-time collaboration

---

##  Author

**Stephin David**

MERN Stack Developer

---

##  License

This project is created for demonstration and educational purposes.
