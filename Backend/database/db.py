import sqlite3

DATABASE = "database.db"


def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")  # Enforce foreign key constraints
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # ------------------ USERS TABLE ------------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    """)

    # Create index on email (faster login queries)
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_users_email
        ON users(email)
    """)

    # ------------------ EXPENSES TABLE ------------------
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL CHECK(amount >= 0),
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)

    # Create index on user_id (faster expense queries)
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_expenses_user_id
        ON expenses(user_id)
    """)

    conn.commit()
    conn.close()