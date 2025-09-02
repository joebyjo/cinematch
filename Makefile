
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
	@echo " [*] Installing backend dependencies"
	@cd $(BACKEND_DIR) && npm install

start:
	@echo ' [*] Starting Prod'
	@cd $(BACKEND_DIR) && npm start

dev:
	@echo ' [*] Starting Dev'
	@cd $(BACKEND_DIR) && npm run dev

mysql:
	@mysql -h $(DB_HOST) -u$(DB_USER) -p$(DB_PASS) --port $(DB_PORT) $(DB_NAME)

db-create:
	@mysql -h $(DB_HOST) -u$(DB_USER) -p$(DB_PASS) --port $(DB_PORT)  < $(DB_DIR)/schema.sql
	@mysql -h $(DB_HOST) -u$(DB_USER) -p$(DB_PASS) --port $(DB_PORT) $(DB_NAME) < $(DB_DIR)/views.sql
	@echo ' [*] Created database'

db-start:
	@service mysql start
	@echo ' [*] Started mysql'

db-seed:
	@echo "[*] Importing seed data..."
	@if [ -f "$(DB_DIR)/seed.sql" ]; then \
		mysql -h "$(DB_HOST)" -u"$(DB_USER)" -p"$(DB_PASS)" --port $(DB_PORT) "$(DB_NAME)" < "$(DB_DIR)/seed.sql"; \
		echo "[*] Seed data imported."; \
	else \
		echo "[!] No seed.sql found at $(DB_DIR)/seed.sql."; \
	fi

db-dump:
	@mysqldump -h $(DB_HOST) -u$(DB_USER) -p$(DB_PASS) --port $(DB_PORT) --databases $(DB_NAME) > $(DB_DIR)/dump.sql
	@echo ' [*] Dumped database'

db-reset:
	@echo "[*] Dropping and recreating database $(DB_NAME)..."
	@mysql -h $(DB_HOST) -u$(DB_USER) -p$(DB_PASS) --port $(DB_PORT) -e "DROP DATABASE IF EXISTS $(DB_NAME);"
	@echo ' [*] Reset the database'
	@make db-create
	@make db-seed
