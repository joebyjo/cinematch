FROM node:18-bullseye

# install mysql client
RUN apt-get update \
    && apt-get install -y --no-install-recommends default-mysql-client curl \
    && rm -rf /var/lib/apt/lists/*

# download wait-for-it script and make it executable
RUN curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh

# set working dir
WORKDIR /app

# copy dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev


WORKDIR /app
COPY . .

# expose port
EXPOSE 8080

# start backend server
WORKDIR /app/backend
CMD ["npm", "run", "start"]
