# Stage 1: Build NestJS frontend
FROM node:14 AS frontend-builder

WORKDIR /app/frontend

COPY insightforge-scratch/package*.json ./
RUN npm install

COPY insightforge-scratch .
RUN npm run build

# Stage 2: Build FastAPI backend
FROM python:3.9 AS backend-builder

WORKDIR /app/backend

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend .

# Stage 3: Final image
FROM python:3.9-slim

# Install Node.js
RUN apt-get update && apt-get install -y nodejs npm supervisor

WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
COPY --from=frontend-builder /app/frontend/node_modules /app/frontend/node_modules
COPY --from=frontend-builder /app/frontend/package.json /app/frontend/package.json

# Copy backend
COPY --from=backend-builder /app/backend /app/backend
COPY --from=backend-builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Set up Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 3000 8000

CMD ["/usr/bin/supervisord"]