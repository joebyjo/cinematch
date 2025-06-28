# using official nodejs
FROM node:18-bullseye

# installing mysql client
RUN apt-get update \
    && apt-get install -y default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y zsh git curl \
  && git clone --depth=1 https://github.com/romkatv/powerlevel10k.git /root/powerlevel10k \
  && echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >> /root/.zshrc \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# making zsh default shell
RUN chsh -s /usr/bin/zsh root

# using custom .bashrc
# COPY .devcontainer/dotfiles/.bashrc /root/.bashrc

# setting working directory
WORKDIR /workspace/backend

# copying dependencies in to working directory to install
COPY backend/package.json backend/package-lock.json ./
RUN npm install

