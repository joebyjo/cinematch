
# variables
BACKEND_DIR=backend
FRONTEND_DIR=frontend
DB_DIR=$(BACKEND_DIR)/db

include $(BACKEND_DIR)/.env


# default target
.PHONY: help
help:
	@echo "Usage:"
	@echo "    make install           Install backend dependencies"
	@echo "    make dev               Start backend with nodemon"
	@echo "    make start             Start the backend server"
	@echo "    make db-start          Start mysql"
	@echo "    make db-create         Create the database and tables"
	@echo "    make db-seed           Insert initial seed data"
	@echo "    make db-dump           Dump the database"
	@echo "    make db-reset          Drop and recreate database"

install:
	@cd $(BACKEND_DIR) && npm install
	@service mysql start
	@echo ' [*] Started mysql'
	@mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$(DB_PASS)'; FLUSH PRIVILEGES;"
	@echo ' [*] Set MySQL root password'


start:
	@make db-start
	@echo ' [*] Starting Prod'
	@cd $(BACKEND_DIR) && npm start

dev:
	@make db-start
	@echo ' [*] Starting Dev'
	@cd $(BACKEND_DIR) && npm run dev

db-create:
	@mysql -h $(DB_HOST) -u$(DB_USER) -p$(DB_PASS) < $(DB_DIR)/schema.sql
	@mysql -h $(DB_HOST) -u$(DB_USER) -p$(DB_PASS) $(DB_NAME) < $(DB_DIR)/views.sql
	@echo ' [*] Created database'

db-start:
	@service mysql start
	@echo ' [*] Started mysql'

db-seed:
	@mysql -h $(DB_HOST) -u$(DB_USER) -p$(DB_PASS) $(DB_NAME) < $(DB_DIR)/seed.sql
	@echo ' [*] Populated database'

db-dump:
	@mysqldump -u$(DB_USER) -p$(DB_PASS) --databases $(DB_NAME) > $(DB_DIR)/dump.sql
	@echo ' [*] Dumped database'

db-reset:
	@mysql -h $(DB_HOST) -u$(DB_USER) -p$(DB_PASS) -e "DROP DATABASE IF EXISTS $(DB_NAME);"
	@echo ' [*] Reset the database'
	@make db-create
	@make db-seed
