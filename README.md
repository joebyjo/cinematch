# 🎬 Cinematch

Cinematch is a web application designed to simplify the process of discovering movies and TV shows. Aimed at casual viewers and entertainment enthusiasts who are overwhelmed by endless options, the app offers a fast, fun, and personalised experience using a Tinder-style swipe interface. Users can like or dislike content, and Cinematch learns their preferences to provide tailored recommendations. With features like easy sign-up/login, trending content exploration, search functionality, swipe-based discovery, personal watchlists, and user ratings, the app delivers a seamless and engaging way to find what to watch next, perfect for those who want less browsing and more watching.


---

## 🧰 Project Structure

```
├── .devcontainer.json
├── .gitignore
├── Makefile            # Useful commands for setup and dev
├── README.md
├── backend/            # Express backend with routes, services, db
│   ├── app.js
│   ├── bin/
│   ├── db/             # Contains schema.sql, seed.sql, views.sql
│   ├── .env            # Environment variables for DB and backend
│   ├── package.json
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   └── views/
└── frontend/           # Static frontend files (HTML, CSS, JS)
```

---

## 🚀 Usage

Follow these steps to clone and run the app locally.

### 🔧 Initial Setup

run the following commands on your terminal

1. `make install`
2. `make db-reset`
3. `make start`
4. navigate to `localhost:8080` on your browser


