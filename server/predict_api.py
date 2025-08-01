from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Load models
with open("models/logistic_model.pkl", "rb") as f:
    logreg = pickle.load(f)

with open("models/random_forest_model.pkl", "rb") as f:
    rf = pickle.load(f)

with open("models/decision_tree_model.pkl", "rb") as f:
    dt = pickle.load(f)

def encode_input(data):
    df = pd.read_csv("flight_data.csv")
    encoding = {col: {val: idx for idx, val in enumerate(df[col].unique())}
                for col in ["Airline", "Airplane Number", "Arrival Time", "Departure Time",
                            "Arrival Location", "Departure Location", "Weather", "Air Traffic Control"]}
    encoded = [encoding[col].get(data[col], 0) for col in encoding]
    return pd.DataFrame([encoded], columns=encoding.keys())

@app.route("/predict-delay", methods=["POST"])
def predict_delay():
    data = request.get_json()
    model_name = data.get("model", "logistic")
    input_df = encode_input(data)

    if model_name == "logistic":
        prediction = logreg.predict(input_df)[0]
    elif model_name == "random_forest":
        prediction = rf.predict(input_df)[0]
    elif model_name == "decision_tree":
        prediction = dt.predict(input_df)[0]
    else:
        return jsonify({"error": "Invalid model name"}), 400

    save_to_db(data, prediction)
    return jsonify({"delay": bool(prediction)})

def save_to_db(data, prediction):
    conn = sqlite3.connect("flight_predictions.db")
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            airline TEXT, airplane_number TEXT, arrival_time TEXT,
            departure_time TEXT, arrival_location TEXT,
            departure_location TEXT, weather TEXT,
            air_traffic TEXT, delay INTEGER
        )
    """)
    cur.execute("""
        INSERT INTO predictions (airline, airplane_number, arrival_time, departure_time,
            arrival_location, departure_location, weather, air_traffic, delay)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["Airline"], data["Airplane Number"], data["Arrival Time"], data["Departure Time"],
        data["Arrival Location"], data["Departure Location"], data["Weather"],
        data["Air Traffic Control"], prediction
    ))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    app.run(debug=True, port=5001)
