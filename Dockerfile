# Stage 1: Build the frontend (React)
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Backend (Flask)
FROM python:3.11-slim
WORKDIR /app

# Install backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Copy built frontend into backend's static directory
COPY --from=frontend-builder /app/frontend/build ./frontend_build

# Set environment variable and expose port
ENV PORT=8080
EXPOSE 8080

# Run backend
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]