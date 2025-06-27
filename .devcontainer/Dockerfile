# using official nodejs
FROM node:18-bullseye

# installing mysql client
RUN apt-get update \
    && apt-get install -y default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# using custom .bashrc
COPY .devcontainer/dotfiles/.bashrc /root/.bashrc

# setting working directory
WORKDIR /workspace/backend

# copying dependencies in to working directory to install
COPY backend/package.json backend/package-lock.json ./
RUN npm install

