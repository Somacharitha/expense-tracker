
def validate_expense_data(data):
    if not data:
        return "Request body is missing"

    if "amount" not in data:
        return "Amount is required"

    if "category" not in data:
        return "Category is required"

    if "date" not in data:
        return "Date is required"

    try:
        float(data["amount"])
    except (ValueError, TypeError):
        return "Amount must be a valid number"

    if not isinstance(data["category"], str) or not data["category"].strip():
        return "Category must be a valid string"

    if not isinstance(data["date"], str) or len(data["date"]) != 10:
        return "Date must be in format YYYY-MM-DD"

    return None