from flask import Flask
import os
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv
from database.db import init_db
from routes.expenses import expense_routes
from routes.auth import auth_routes

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# ------------------ LOGGING CONFIGURATION ------------------

if not os.path.exists("logs"):
    os.mkdir("logs")

file_handler = RotatingFileHandler(
    "logs/app.log",
    maxBytes=10240,   # 10KB per file
    backupCount=5     # Keep 5 backup logs
)

file_handler.setLevel(logging.INFO)

formatter = logging.Formatter(
    "%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"
)

file_handler.setFormatter(formatter)

app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)

app.logger.info("Expense Tracker startup")

# ------------------ INITIALIZATION ------------------

init_db()

app.register_blueprint(expense_routes)
app.register_blueprint(auth_routes)
@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Unhandled Exception: {str(e)}")
    return {
        "success": False,
        "message": "Internal Server Error",
        "data": None
    }, 500

@app.route("/")
def home():
    return "Expense Tracker API Running 🚀"

if __name__ == "__main__":
    app.run(debug=True)