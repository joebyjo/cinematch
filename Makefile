# Makefile for managing full-stack project

# Variables
BACKEND_DIR=backend
FRONTEND_DIR=frontend

# Default target
.PHONY: help
help:
	@echo "Usage:"
	@echo "  make install           Install backend dependencies"
	@echo "  make dev               Start backend with nodemon"
	@echo "  make start             Start the backend server"


install:
	cd $(BACKEND_DIR) && npm install

start:
	cd $(BACKEND_DIR) && npm start

dev:
	cd $(BACKEND_DIR) && npm run dev
