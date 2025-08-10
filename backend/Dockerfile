# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port Flask runs on
ENV PORT=8080
EXPOSE 8080

# Run the app
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]