from functools import wraps
from flask import request, jsonify, current_app
import jwt


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"error": "Token is missing"}), 401

        # Expecting: Bearer <token>
        parts = auth_header.split()

        if len(parts) != 2 or parts[0] != "Bearer":
            return jsonify({"error": "Invalid token format"}), 401

        token = parts[1]

        try:
            data = jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )

            current_user = {
                "id": data["user_id"]
            }

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except Exception:
            return jsonify({"error": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)

    return decorated