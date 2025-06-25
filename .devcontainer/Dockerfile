# Use an official Node.js LTS image
FROM node:18-bullseye

# Install MySQL client
RUN apt-get update \
    && apt-get install -y default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /workspace/backend

# Copy only package files from host into container for npm install
COPY backend/package.json backend/package-lock.json ./
RUN npm install

