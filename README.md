---

# 🎬 Cinematch

Cinematch is a web application designed to simplify the process of discovering movies and TV shows. Aimed at casual viewers and entertainment enthusiasts who are overwhelmed by endless options, the app offers a fast, fun, and personalised experience using a Tinder-style swipe interface.

Users can like or dislike content, and Cinematch learns their preferences to provide tailored recommendations. With features like easy sign-up/login, trending content exploration, search functionality, swipe-based discovery, personal watchlists, and user ratings, the app delivers a seamless and engaging way to find what to watch next — perfect for those who want less browsing and more watching.

---

## 🧰 Project Structure

```
├── .devcontainer.json
├── .gitignore
├── Makefile              # Useful commands for setup and dev
├── README.md
├── backend/              # Express backend with routes, services, db
│   ├── app.js
│   ├── bin/
│   ├── db/               # Contains schema.sql, seed.sql, views.sql
│   ├── .env              # Environment variables for DB and backend
│   ├── package.json
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   └── views/
└── frontend/             # Static frontend files (HTML, CSS, JS)
```

---

## 🚀 Usage

Follow these steps to clone and run the app locally.

### 🔧 Initial Setup

Run the following commands in your terminal:

```bash
make install
make db-reset
make start
```

Then open your browser and go to:
🔗 `http://localhost:8080`

---

## 👨🏻‍💼 Dummy Data

The project comes with pre-seeded users for testing and demonstration:

| Role  | Username | Password   |
| ----- | -------- | ---------- |
| Admin | joe      | Ab\_123456 |
| User  | hiten    | Ab\_123456 |
| User  | josheen  | Ab\_123456 |
| User  | liri     | Ab\_123456 |

Use these credentials to explore both user and admin functionality.

---

## ✨ Features

* 🎯 Personalized movie discovery
* 🏠 Homepage with live trending and top-rated movies
* 📋 Personal movie tracking (ratings + watch status)
* 📄 User-friendly information for each title
* 👤 User accounts (sign-up / log-in)
* 🛠️ Admin dashboard for managing content
* 🎛️ Movie filtering, sorting, and rating system
* 🔗 TMDB API & OMDB API integration
* 🌗 Dark / Light mode support

---

## 🔒 Security Notes

* 🔐 Passwords are hashed using **bcrypt** with secure `SALT_ROUNDS`
* 🛡️ **SQL Injection** is prevented using **prepared statements / parameterized queries**
* ✅ All user input is **validated and sanitized** using **express-validator**
* 🚫 Cross-site scripting (**XSS**) is mitigated via **xss-clean** middleware
* 🧠 Session security:

  * Stored using `express-session` with MySQL store (`express-mysql-session`)
  * Secure session cookies
  * Middleware protection (`isAuthenticated`, `isAdmin`)

---

## 📦 Technologies Used

### 🧠 Backend

* **Node.js**, **Express.js**
* **MySQL**, **express-session**, **express-mysql-session**
* **bcrypt**, **express-validator**, **xss-clean**
* **passport.js**, **dotenv**
* **Makefile** and **nodemon** for CLI-based development and database management
* **Vue.js**, **HTML5**, **CSS3**, **Vanilla JavaScript**
* **Axios**

