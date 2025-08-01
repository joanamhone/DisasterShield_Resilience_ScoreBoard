# Use a lightweight official Python image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model files
COPY main.py .
COPY random_forest_model.pkl .
COPY label_encoder.pkl .

# Optional: list files to confirm during build (can remove after debugging)
RUN echo "Files in /app:" && ls -l /app

# Set the PORT environment variable (Cloud Run sets this automatically, but safe to default)
ENV PORT=8080

# Use gunicorn to serve the Flask app, binding to the port Cloud Run provides
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "main:app"]
