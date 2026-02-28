from flask import Blueprint, request, jsonify, current_app
from models.user_model import create_user, authenticate_user
import jwt
import datetime

auth_routes = Blueprint("auth_routes", __name__)

# REGISTER
@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data or not all(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "All fields required"}), 400

    user = create_user(data["username"], data["email"], data["password"])

    if not user:
        return jsonify({"error": "User already exists"}), 400

    return jsonify({"message": "User registered successfully"}), 201


# LOGIN
@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Email and password required"}), 400

    user = authenticate_user(data["email"], data["password"])

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {
            "user_id": user["id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        },
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({"token": token})