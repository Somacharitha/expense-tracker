def success_response(data=None, message="Success"):
    return {
        "success": True,
        "message": message,
        "data": data
    }, 200


def error_response(message="Error", status_code=400):
    return {
        "success": False,
        "message": message,
        "data": None
    }, status_code