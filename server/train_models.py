import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
import pickle
import os

# Load your dataset
df = pd.read_csv("flight_data.csv")

# Encode categorical features
categorical_columns = [
    "Airline", "Airplane Number", "Arrival Time", "Departure Time",
    "Arrival Location", "Departure Location", "Weather", "Air Traffic Control"
]

for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])

# Convert target column to binary
df["Delay"] = df["Historical Delays"].apply(lambda x: 1 if "Delay" in x else 0)

# Features and labels
# Features and labels
X = df.drop(columns=["Historical Delays", "Delay"])
y = df["Delay"]

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train models
logreg = LogisticRegression(max_iter=1000)
logreg.fit(X_train, y_train)

rf = RandomForestClassifier()
rf.fit(X_train, y_train)

dt = DecisionTreeClassifier()
dt.fit(X_train, y_train)

# Save models
os.makedirs("models", exist_ok=True)

with open("models/logistic_model.pkl", "wb") as f:
    pickle.dump(logreg, f)

with open("models/random_forest_model.pkl", "wb") as f:
    pickle.dump(rf, f)

with open("models/decision_tree_model.pkl", "wb") as f:
    pickle.dump(dt, f)

print("✅ Models trained and saved successfully to /models/")
