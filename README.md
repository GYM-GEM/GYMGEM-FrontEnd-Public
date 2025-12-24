# GYMGEM - Ultimate AI-Powered Fitness & Gym Management Platform

**GYMGEM** is a cutting-edge, multi-role web application that revolutionizes the fitness industry. It bridges the gap between fitness enthusiasts, professional trainers, gyms, and equipment vendors (Stores). Powered by **Google Gemini AI** and **Computer Vision**, GYMGEM acts as a smart partner, offering real-time form correction, nutritional analysis, and a comprehensive ecosystem for all fitness needs.

## 🚀 Overview

GYMGEM serves four distinct user roles, each with a tailored dashboard and feature set:

1.  **Trainees**: Access AI-powered tools, find trainers, join gyms, buy products, and track fitness progress with precision.
2.  **Trainers**: Create and sell courses, manage clients, and track earnings with advanced analytics.
3.  **Gyms**: Manage memberships, schedule classes/sessions, and showcase facilities to a broader audience.
4.  **Stores**: List and sell fitness products/supplements to a targeted community.

## 🤖 AI Smart Features

### 🏋️ AI Personal Trainer (Computer Vision)
Transform your webcam into a professional coach.
*   **Real-time Form Correction**: Uses **MediaPipe** to track exercise form and provide instant feedback (e.g., "Keep your back straight", "Go lower").
*   **Smart Rep Counting**: Automatically counts reps only when the form is correct.
*   **Tempo Tracking**: Monitors the speed of your movements to ensure optimal muscle engagement.
*   **Interactive Feedback**: Visual skeleton overlays and directional cues guide you through every rep.

### 🍎 AI Food Analyzer
Nutrition tracking made effortless.
*   **Snap & Analyze**: Upload a photo of your meal to get an instant breakdown.
*   **Gemini Vision Integration**: Powered by Google's Gemini API to identify food items and estimate calories, proteins, carbs, and fats.
*   **Contextual Advice**: Receive health tips and alternative suggestions based on your meal's nutritional value.

## ✨ Key Features

### 👤 For Trainees
*   **💎 Gems Reward System**: Earn "Gems" for completing workouts and challenges, redeemable for discounts and features.
*   **Course Enrollment**: Browse and enroll in fitness courses with rich video content.
*   **Find Trainers & Gyms**: Search and connect with top-rated professionals and facilities nearby.
*   **Progress Tracking**: Detailed history of workouts, measurements, and nutrition.
*   **Video Community**: Engage with short-form fitness content and community challenges.
*   **E-commerce**: Integrated shopping cart and checkout for gym gear and supplements.

### 🏋️ For Trainers
*   **Advanced Course Creator**: Build multi-module courses with text and video lessons.
*   **Client Management Dashboard**: Track client progress, assign workouts, and chat directly.
*   **Revenue Tracking**: Monitor sales, subscriptions, and payouts.
*   **Professional Profile**: Showcase certifications, specializations, and portfolio.

### 🏢 For Gyms
*   **Member Management**: Digital streamlined system for tracking active members and subscriptions.
*   **Class Scheduling**: Create and manage timetables for group classes and personal training.
*   **Facility Showcase**: Highlight amenities and services to attract new members.

### 🛍️ For Stores (Vendors)
*   **Product Management**: Inventory system for fitness equipment and supplements.
*   **Order Fulfillment**: Track statuses from "Placed" to "Delivered".
*   **Sales Analytics**: Insights into top-selling products and revenue trends.

## 🛠️ Tech Stack

This project is built with a modern, high-performance tech stack designed for scalability and user experience.

*   **Frontend Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **AI & ML**:
    *   [Google Gemini API](https://ai.google.dev/) (Vision & Text)
    *   [MediaPipe](https://developers.google.com/mediapipe) (Pose Detection)
    *   [TensorFlow.js](https://www.tensorflow.org/js)
*   **Routing**: [React Router v7](https://reactrouter.com/)
*   **State Management**: React Context API & React Hook Form
*   **Icons**: React Icons, Lucide React, FontAwesome
*   **Media**: Cloudinary (Image/Video Optimization)

## 📦 Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GYMGEM-FrontEnd-Public
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your API keys:
```env
# Example Variables
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4. Run Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### 5. Production Build
To create a production-ready build:
```bash
npm run build
```

## 📂 Project Structure

```
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components
│   ├── ai/         # AI Trainer & Computer Vision components
│   ├── AiFood/     # Food Analyzer components
│   ├── Dashboard/  # Role-specific dashboards (Trainer, Trainee, Gym, Store)
│   └── ...
├── logic/          # Core algorithms (Rep counting, Angle math, State machine)
├── mediapipe/      # Computer Vision configuration and drawing utilities
├── pages/          # Full page views
├── context/        # Global state providers
├── hooks/          # Custom hooks (usePoseTracker, etc.)
├── utils/          # Helper functions and API configs
└── App.jsx         # Main application routing
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---
*Built with ❤️ for the Fitness Community.*
