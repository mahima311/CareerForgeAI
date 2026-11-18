# CareerForgeAI 🚀
### AI-Powered Career Guidance & Learning Platform

CareerForgeAI is an AI-powered career guidance platform designed to help students and job seekers discover suitable career paths, improve their skills, prepare for interviews, and explore job opportunities.

The platform provides personalized career recommendations, learning roadmaps, resume building, and interview preparation in one place.

## ✨ Features

- **User Authentication:** Secure signup and login using JWT authentication.
- **Personalized Dashboard:** Track career activities and overall learning progress.
- **AI Career Guidance:** Get career recommendations based on qualification, skills, and interests.
- **Skill Insights:** Explore the skills required for different career paths.
- **Learning Roadmaps:** Follow structured learning steps and track completed tasks.
- **Resume Builder:** Create and download professional resumes in PDF format.
- **Interview Preparation:** Practice technical MCQs and interview questions.
- **AI Interview Evaluation:** Get AI-powered feedback on interview answers.
- **Job Opportunities:** Explore job listings and save interesting opportunities.
- **Saved Career Plans:** Save career recommendations and track learning progress.
- **Responsive Design:** Access the platform across desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- React Router
- Lucide React

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcryptjs

**Database**
- MongoDB Atlas
- Mongoose

**AI Integration**
- Google Gemini API

## 📁 Project Structure

```text
CareerForgeAI/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mahima311/CareerForgeAI.git
cd CareerForgeAI
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure the environment variables required by the application.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

**Note:** Environment variable names and configuration should match the actual backend and frontend code. Never commit API keys, passwords, JWT secrets, or `.env` files.

## 🔐 Security

- JWT-based authentication.
- Password hashing using bcryptjs.
- Protected API routes.
- Environment variables for sensitive configuration.
- `.gitignore` to prevent uploading sensitive files.

## 🎯 Project Objective

The main objective of CareerForgeAI is to make career planning easier by combining AI-powered career recommendations, skill development, resume creation, interview preparation, and job discovery in a single platform.

## 👩‍💻 Developer

**Mahima Mishra**

Final-Year B.Tech Computer Science Student

GitHub: [@mahima311](https://github.com/mahima311)

---

⭐ If you find this project useful, consider giving it a star!
