import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

print("PORT =", os.environ.get("PORT"))  # Print port to logs for debugging

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Load model and encoder once on startup
try:
    model = joblib.load("random_forest_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
    print("Model and label encoder loaded successfully.")
except Exception as e:
    print(f"CRITICAL: Could not load model files. Error: {e}")
    model = None
    label_encoder = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or label_encoder is None:
        return jsonify({"error": "Model is not available on the server."}), 500

    try:
        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON format."}), 400
    except Exception:
        return jsonify({"error": "Could not parse request data."}), 400

    required_features = ['temp', 'humidity', 'precipitation', 'windgust', 'windspeed', 'pressure']
    if not all(feature in data for feature in required_features):
        return jsonify({"error": f"Missing one or more required features: {required_features}"}), 400

    try:
        input_df = pd.DataFrame([data], columns=required_features)
        probabilities = model.predict_proba(input_df)[0]

        results = {
            label_encoder.inverse_transform([i])[0]: float(prob)
            for i, prob in enumerate(probabilities)
        }

        return jsonify({"prediction": results})

    except Exception as e:
        print(f"An error occurred during prediction: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

@app.route('/', methods=['GET'])
def health_check():
    return "ML prediction server is running.", 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=True, host='0.0.0.0', port=port)
