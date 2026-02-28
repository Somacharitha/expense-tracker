from database.db import get_connection
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3


def create_user(username, email, password):
    conn = get_connection()
    cursor = conn.cursor()

    # Normalize email to lowercase
    email = email.lower()

    hashed_password = generate_password_hash(password)

    try:
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password)
        )
        conn.commit()
        user_id = cursor.lastrowid

    except sqlite3.IntegrityError:
        conn.close()
        return None  # Email already exists

    conn.close()

    return {
        "id": user_id,
        "username": username,
        "email": email
    }


def authenticate_user(email, password):
    conn = get_connection()
    cursor = conn.cursor()

    # Normalize email to lowercase
    email = email.lower()

    cursor.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user["password"], password):
        return {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"]
        }

    return None