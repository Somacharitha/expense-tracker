import sqlite3

DATABASE = "database.db"


def get_all_expenses():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM expenses")
    rows = cursor.fetchall()
    conn.close()

    return [
        {"id": row[0], "amount": row[1], "category": row[2]}
        for row in rows
    ]


def create_expense(amount, category):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO expenses (amount, category) VALUES (?, ?)",
        (amount, category)
    )

    conn.commit()
    expense_id = cursor.lastrowid
    conn.close()

    return {"id": expense_id, "amount": amount, "category": category}


def update_expense_db(expense_id, amount, category):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE expenses SET amount=?, category=? WHERE id=?",
        (amount, category, expense_id)
    )

    conn.commit()
    conn.close()


def delete_expense_db(expense_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("DELETE FROM expenses WHERE id=?", (expense_id,))
    conn.commit()
    conn.close()