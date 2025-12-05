# 🚀 Minimalist Focus Hub & AI Task Generator - V2

A modern, minimalist todo web application powered by Google's Gemini AI for intelligent task generation and management. Built with a clean architecture featuring a React frontend and Node.js backend.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://todo-webapp-gemini-v2.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ Features

- **AI-Powered Task Generation**: Leverage Google's Gemini AI to automatically generate task lists based on your goals
- **Minimalist Design**: Clean, distraction-free interface for maximum productivity
- **Real-time Updates**: Seamless task management with instant feedback
- **Responsive UI**: Works perfectly across desktop, tablet, and mobile devices
- **Full CRUD Operations**: Create, read, update, and delete tasks effortlessly
- **Focus Mode**: Dedicated interface to help you concentrate on what matters

## 🛠️ Tech Stack

### Frontend
- **React.js**: Component-based UI library
- **Modern JavaScript (ES6+)**: Latest JavaScript features
- **CSS3**: Responsive and modern styling
- **Vercel**: Deployment platform

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Google Gemini AI API**: AI-powered task generation
- **RESTful API**: Clean API architecture

## 📁 Project Structure

```
todo-webapp-geminiV2/
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS stylesheets
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── backend/               # Node.js backend server
│   ├── routes/           # API routes
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   └── package.json      # Backend dependencies
│
├── vercel.json           # Vercel deployment configuration
└── LICENSE               # MIT License
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FsocietyVoid/todo-webapp-geminiV2.git
   cd todo-webapp-geminiV2
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```

4. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure Frontend Environment**
   
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the Application**
   
   Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage

1. **Add Tasks Manually**: Click the add button to create new tasks
2. **AI Task Generation**: Use the AI feature to generate tasks based on your goals or project description
3. **Manage Tasks**: Mark tasks as complete, edit, or delete them as needed
4. **Focus Mode**: Enter focus mode to concentrate on your current task list

## 🚢 Deployment

This project is configured for easy deployment on Vercel:

1. Fork or clone this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Add your environment variables in Vercel's dashboard
5. Deploy!

The application will automatically deploy both frontend and backend using the `vercel.json` configuration.

## 🔑 Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Yash Bhujbal** - [@FsocietyVoid](https://github.com/FsocietyVoid)

## 🙏 Acknowledgments

- Google Gemini AI for powering intelligent task generation
- The React community for excellent documentation
- Vercel for seamless deployment

## 📧 Contact

For questions or support, please open an issue in the GitHub repository.

---

⭐ If you find this project helpful, please consider giving it a star!