# Makefile for managing full-stack project

# Variables
BACKEND_DIR=backend
FRONTEND_DIR=frontend
DB_DIR=$(BACKEND_DIR)/db

include $(BACKEND_DIR)/.env


# Default target
.PHONY: help
help:
	@echo "Usage:"
	@echo "  make install           Install backend dependencies"
	@echo "  make dev               Start backend with nodemon"
	@echo "  make start             Start the backend server"
	@echo "  make db-create         Create the database and tables"
	@echo "  make db-seed           Insert initial seed data"
	@echo "  make db-dump           Dump the database"
	@echo "  make db-reset          Drop and recreate database"

install:
	# @cd $(BACKEND_DIR) && npm install
	@service mysql start
	@echo ' [*] Started mysql'
	@mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$(DB_PASS)'; FLUSH PRIVILEGES;"
	@echo ' [*] Set MySQL root password'


start:
	@echo ' [*] Starting Prod'
	@cd $(BACKEND_DIR) && npm start

dev:
	@echo ' [*] Starting Dev'
	@cd $(BACKEND_DIR) && npm run dev

db-create:
	mysql -u$(DB_USER) -p$(DB_PASS) < $(DB_DIR)/schema.sql
	@echo ' [*] Created database'

db-seed:
	mysql -u$(DB_USER) -p$(DB_PASS) $(DB_NAME) < $(DB_DIR)/seed.sql
	@echo ' [*] Populated database'

db-dump:
	mysqldump --databases $(DB_NAME) > $(DB_DIR)/dump.sql
	@echo ' [*] Dumped database'

db-reset:
	mysql -u$(DB_USER) -p$(DB_PASS) -e "DROP DATABASE IF EXISTS $(DB_NAME); CREATE DATABASE $(DB_NAME);"
	make db-create
	make db-seed
	@echo ' [*] Reset the database'
