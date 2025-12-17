# GYMGEM - Ultimate Fitness & Gym Management Platform

**GYMGEM** is a comprehensive, multi-role web application designed to bridge the gap between fitness enthusiasts, professional trainers, gyms, and equipment vendors. It provides a unified ecosystem for managing workouts, courses, gym memberships, and fitness e-commerce.

## 🚀 Overview

GYMGEM serves four distinct user roles, each with a tailored dashboard and feature set:
1.  **Trainees**: Find trainers, join gyms, buy products, and track fitness progress.
2.  **Trainers**: Create and sell courses, manage clients, and track earnings.
3.  **Gyms**: Manage memberships, schedule classes/sessions, and showcase facilities.
4.  **Stores**: List and sell fitness products/supplements to the community.

## ✨ Key Features

### 👤 For Trainees
*   **Course Enrollment**: Browse and enroll in fitness courses with rich content (video lessons).
*   **Find Trainers**: Search and connect with professional trainers.
*   **Session Management**: Book and manage 1-on-1 sessions.
*   **Community**: Engage with the fitness community.
*   **Dashboard**: Track progress, favorite courses, and order history.
*   **E-commerce**: Shop for gym gear and supplements with a full cart & checkout flow.

### 🏋️ For Trainers
*   **Course Creator**: Advanced tools to build courses with sections and lessons (Video/Text).
*   **Client Management**: unique dashboard to track and manage client progress.
*   **Order Tracking**: Monitor course sales and revenue.
*   **Profile Customization**: Showcase specializations, experience, and certifications.

### 🏢 For Gyms
*   **Gym Dashboard**: robust management of gym members and staff.
*   **Class & Session Scheduling**: Organize and display gym classes and training sessions.
*   **Member Management**: Track active members and subscriptions.

### 🛍️ For Stores (Vendors)
*   **Product Management**: Add and manage fitness products.
*   **Order Management**: Process and track customer orders.
*   **Store Dashboard**: Analytics and sales overview.

## 🛠️ Tech Stack

This project is built with a modern, high-performance tech stack:

*   **Frontend Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Routing**: [React Router v7](https://reactrouter.com/)
*   **Icons**: [React Icons](https://react-icons.github.io/react-icons/) & [Lucide React](https://lucide.dev/) & [FontAwesome](https://fontawesome.com/)
*   **HTTP Client**: [Axios](https://axios-http.com/)
*   **State Management & Forms**: React Hook Form
*   **Media**: Cloudinary for image/video management (inferred from dependencies)

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
Create a `.env` file in the root directory (or rename `env.example` if available) and add necessary environment variables (e.g., API endpoints, Cloudinary keys).

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
├── context/        # Global state context providers
├── hooks/          # Custom React hooks
├── Layout/         # Layout wrappers (RootLayout, etc.)
├── pages/          # Full page components (Views)
│   ├── auth/       # Authentication pages (Login, Register)
│   └── ...         # Feature pages (Home, Courses, etc.)
├── utils/          # Helper functions and capabilities
├── App.jsx         # Main application component & Routing
└── main.jsx        # Entry point
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
