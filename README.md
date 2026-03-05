# Expense Tracker Web Application

A full-stack web application designed to help users track, manage, and analyze their daily expenses efficiently.
The system allows users to securely log in, add expenses, edit or delete records, and visualize spending patterns through an interactive dashboard.

This project demonstrates full-stack development using modern web technologies including **React, Flask, REST APIs, and SQLite**.

---

# Project Overview

Managing personal finances manually can be difficult and time-consuming. This application simplifies expense management by providing a digital platform where users can record their transactions and monitor their financial habits through visual analytics.

The application includes authentication, expense management features, and a dashboard for analyzing spending patterns.

---

# Key Features

### User Authentication

Secure login and registration system to protect user data.

### Expense Management

Users can add new expenses, edit existing entries, and delete records.

### Interactive Dashboard

Visual charts help users understand spending habits.

### Expense Categorization

Transactions can be organized by categories.

### Real-time Updates

Expense changes immediately update the dashboard.

### Responsive User Interface

Works across different screen sizes and devices.

---

# Tech Stack

### Frontend

React
HTML
CSS
JavaScript

### Backend

Flask (Python)
REST API Architecture

### Database

SQLite

### Libraries & Tools

Chart.js – Data visualization
Axios – API communication
Git – Version control
GitHub – Code hosting

---

# System Architecture

The application follows a **client–server architecture**.

**Frontend (React)**
Handles user interface and user interactions.

**Backend (Flask API)**
Processes requests, handles authentication, and performs business logic.

**Database (SQLite)**
Stores user accounts and expense records.

Workflow:

User → React Frontend → Flask API → SQLite Database → Response → UI Update

---

# Project Structure

```
expense-tracker
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Dashboard
│   │   │   ├── ExpenseForm
│   │   │   ├── ExpenseList
│   │   │   └── Charts
│   │   │
│   │   ├── pages
│   │   │   ├── Login
│   │   │   ├── Register
│   │   │   └── Dashboard
│   │   │
│   │   ├── App.js
│   │   └── index.js
│
├── backend
│   ├── app.py
│   ├── models.py
│   ├── routes.py
│   ├── database.db
│   └── requirements.txt
│
├── screenshots
│   ├── login.png
│   ├── register.png
│   └── dashboard.png
│
└── README.md
```

---

# Application Workflow

1. User registers or logs into the system.
2. Authentication verifies user credentials.
3. User adds expense information (amount, category, date).
4. Backend API stores data in SQLite database.
5. Dashboard retrieves expense data via API.
6. Charts visualize spending patterns dynamically.

---

# Application Screenshots

### Login Page

![Login](screenshots/Login.png)

### Register Page

![Register](screenshots/register.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

---

# Installation & Setup

Clone the repository

```
git clone https://github.com/Somacharitha/expense-tracker.git
```

Navigate to project directory

```
cd expense-tracker
```

### Backend Setup

Install dependencies

```
pip install -r requirements.txt
```

Run the Flask server

```
python app.py
```

### Frontend Setup

Navigate to frontend folder

```
cd frontend
```

Install dependencies

```
npm install
```

Start the frontend

```
npm start
```

The application will run locally in your browser.

---

---

# Learning Outcomes

Through this project the following concepts were implemented:

Full-stack web development
REST API design
Frontend-backend integration
Database management
State management in React
Data visualization

---

# Author

Nagareddy Somacharitha
Computer Science Engineering Student
Interested in Full Stack Development and AI-powered Web Applications

GitHub: https://github.com/Somacharitha
