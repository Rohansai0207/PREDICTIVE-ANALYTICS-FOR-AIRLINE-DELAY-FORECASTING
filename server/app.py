from flask import Flask, request, jsonify
from flask_cors import CORS
from otp_logic import generate_otp, otp_storage
from email_utils import send_otp_email

app = Flask(__name__)
CORS(app)

# Root route for welcome message
@app.route("/")
def home():
    return "Welcome to Flight Delay Prediction!"

# Route to send OTP
@app.route("/register/send-otp", methods=["POST"])
def send_otp():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    otp = generate_otp()
    otp_storage[email] = otp
    send_otp_email(email, otp)
    print(f"OTP for {email}: {otp}")
    return jsonify({"message": "OTP sent to email."}), 200

# Route to verify OTP
@app.route("/register/verify", methods=["POST"])
def verify_registration():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")

    if otp_storage.get(email) == otp:
        del otp_storage[email]
        return jsonify({"message": "Registration successful"}), 200
    return jsonify({"error": "Invalid OTP"}), 400

# Route for forgot password
@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email required"}), 400

    send_otp_email(email, "Use this link to reset your password (demo)")
    return jsonify({"message": "Reset link sent to your email."}), 200

# Favicon route
@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

if __name__ == "__main__":
    app.run(debug=True, port=5000)
