# Expense Tracker Backend

A secure multi-user expense tracking backend built with Flask.

## Features

- User Registration & Login
- Password Hashing
- JWT Authentication
- Protected Routes
- User-specific Expenses
- Full CRUD for Expenses
- SQLite Database
- Modular Architecture

## Tech Stack

- Python
- Flask
- SQLite
- JWT (PyJWT)
- Git

## API Endpoints

### Auth
POST /register  
POST /login  

### Expenses (Protected)
GET /expenses  
POST /expenses  
PUT /expenses/<id>  
DELETE /expenses/<id>

## Security

- Password hashing
- JWT token-based authentication
- User-level data isolation
