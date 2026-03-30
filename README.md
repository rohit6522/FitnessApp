# 🏋️ Fitness Training Portal

A full-stack fitness web application that allows users to create personalized workout plans, track progress, and explore exercises.

---

## 🚀 Features

### 🔐 Authentication
- User Signup & Login
- JWT-based Authentication
- Protected Routes
- Forgot Password (OTP via Email)

### 📊 Dashboard
- Personalized welcome
- Workout stats (cards UI)
- Clean modern interface

### 📅 My Plan
- Day-wise workout planner
- Add / Edit / Delete workouts
- Add multiple exercises (sets, reps, time)
- Fully dynamic CRUD system

### 🔍 Explore (Exercise Library)
- Search exercises
- Filter by muscle group
- Fitness tips section
- Clean UI with badges

### 👤 Profile Page
- User details (age, weight, height, goals)
- Stored in MongoDB

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Other Tools
- JWT (Authentication)
- Nodemailer (OTP email)
- Axios (API calls)

---


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/FitnessApp.git
cd FitnessApp

2️⃣ Backend Setup
cd backend
npm install

Create .env file:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL=your_email
PASSWORD=your_email_password


Run backend:
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev






## 📁 Folder Structure
