from flask import Blueprint, request
import sqlite3
from routes.middleware import token_required
from utils.response import success_response, error_response
from validators.expense_validator import validate_expense_data

expense_routes = Blueprint("expense_routes", __name__)

DATABASE = "database.db"


# ------------------ GET EXPENSES (WITH OPTIONAL FILTER) ------------------
@expense_routes.route("/expenses", methods=["GET"])
@token_required
def get_expenses(current_user):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    category = request.args.get("category")

    if category:
        cursor.execute(
            "SELECT id, amount, category, date FROM expenses WHERE user_id=? AND category=?",
            (current_user["id"], category)
        )
    else:
        cursor.execute(
            "SELECT id, amount, category, date FROM expenses WHERE user_id=?",
            (current_user["id"],)
        )

    rows = cursor.fetchall()
    conn.close()

    expenses = [
        {
            "id": row[0],
            "amount": row[1],
            "category": row[2],
            "date": row[3]
        }
        for row in rows
    ]

    return success_response(
        data=expenses,
        message="Expenses fetched successfully"
    )


# ------------------ TOTAL EXPENSE ------------------
@expense_routes.route("/expenses/total", methods=["GET"])
@token_required
def total_expenses(current_user):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT SUM(amount) FROM expenses WHERE user_id=?",
        (current_user["id"],)
    )

    result = cursor.fetchone()
    conn.close()

    total = result[0] if result[0] else 0

    return success_response(
        data={"total_expense": total},
        message="Total expense calculated successfully"
    )


# ------------------ MONTHLY SUMMARY ------------------
@expense_routes.route("/expenses/monthly-summary", methods=["GET"])
@token_required
def monthly_summary(current_user):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT substr(date, 1, 7) AS month, SUM(amount)
        FROM expenses
        WHERE user_id=?
        GROUP BY month
    """, (current_user["id"],))

    rows = cursor.fetchall()
    conn.close()

    summary = {row[0]: row[1] for row in rows}

    return success_response(
        data=summary,
        message="Monthly summary generated successfully"
    )


# ------------------ POST EXPENSE ------------------
@expense_routes.route("/expenses", methods=["POST"])
@token_required
def add_expense(current_user):
    data = request.get_json()

    # Use external validator
    validation_error = validate_expense_data(data)
    if validation_error:
        return error_response(validation_error, 400)

    amount = float(data["amount"])

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO expenses (amount, category, date, user_id) VALUES (?, ?, ?, ?)",
        (amount, data["category"], data["date"], current_user["id"])
    )

    conn.commit()
    expense_id = cursor.lastrowid
    conn.close()

    return success_response(
        data={
            "id": expense_id,
            "amount": amount,
            "category": data["category"],
            "date": data["date"]
        },
        message="Expense added successfully"
    )


# ------------------ UPDATE EXPENSE ------------------
@expense_routes.route("/expenses/<int:expense_id>", methods=["PUT"])
@token_required
def update_expense(current_user, expense_id):
    data = request.get_json()

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM expenses WHERE id=? AND user_id=?",
        (expense_id, current_user["id"])
    )

    record = cursor.fetchone()

    if not record:
        conn.close()
        return error_response("Expense not found", 404)

    # Validate only if fields provided
    if data:
        if "amount" in data:
            try:
                float(data["amount"])
            except (ValueError, TypeError):
                conn.close()
                return error_response("Amount must be a valid number", 400)

    amount = float(data.get("amount", record[1]))
    category = data.get("category", record[2])
    date = data.get("date", record[3])

    cursor.execute(
        "UPDATE expenses SET amount=?, category=?, date=? WHERE id=? AND user_id=?",
        (amount, category, date, expense_id, current_user["id"])
    )

    conn.commit()
    conn.close()

    return success_response(
        message="Expense updated successfully"
    )


# ------------------ DELETE EXPENSE ------------------
@expense_routes.route("/expenses/<int:expense_id>", methods=["DELETE"])
@token_required
def delete_expense(current_user, expense_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM expenses WHERE id=? AND user_id=?",
        (expense_id, current_user["id"])
    )

    conn.commit()
    conn.close()

    return success_response(
        message="Expense deleted successfully"
    )