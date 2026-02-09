# Lev Display - Digital Signage System

A dynamic digital display system built for "Lev Chabad" to show memorial, birthday, and healing dedications. This project uses **React 19**, **Vite 7**, and **Tailwind CSS 4**, featuring a flexible architecture that supports both local mock data and a live Firebase backend.

## 🚀 Features

-   **Dynamic Slideshow**: Automatically rotates through dedications with smooth fade transitions.
-   **Smart Scheduling**: Shows specific slides based on Gregorian or Hebrew dates.
-   **Themes**: Distinct visual themes for Memorial, Birthday, Healing, Success, and Holidays with unique icons and color schemes.
-   **Admin Interface**: Password-protected area to add, edit, and delete slides.
-   **Customizable Default Slide**: Configure the welcome screen (title, name, description) directly from the admin settings when no dedications are scheduled.
-   **Live Preview**: Instantly preview how a dedication will look on the display before saving.
-   **High-Performance Image Compression**: Automatic client-side compression (1024px, 90% quality) with PNG transparency support to ensure Firestore document stability.
-   **Kiosk Stability**: Built-in Error Boundary that automatically reloads the page after a crash to ensure 24/7 operation.
-   **Offline Monitoring**: Real-time connectivity tracking with a discrete status indicator in the header.
-   **Service Layer Pattern**: Seamlessly switch between local storage (Mock) and Firebase Firestore/Storage.
-   **Hebrew Date Integration**: Displays the current Hebrew date automatically using `@hebcal/core`.
-   **Responsive Layout**: Optimized for fixed screens with vertical centering and safe scrolling.
-   **Wake Lock Support**: Prevents the screen from sleeping while in display mode.
-   **Accessibility & UX**: Includes clear category headers, intuitive controls, and smart image management in the admin panel.

## 🛠️ Tech Stack

-   **Framework**: React 19
-   **Routing**: React Router 7
-   **Build Tool**: Vite 7
-   **Styling**: Tailwind CSS 4
-   **Icons**: Lucide-React
-   **QR Codes**: React QR Code
-   **Notifications**: React Hot Toast
-   **Backend**: Firebase (Firestore & Storage) or LocalStorage (Mock)

## ⚙️ Configuration & Backend

This project implements a **Service Layer** that allows you to toggle between a local development mode and a production-ready Firebase backend using environment variables.

### 1. Mock Mode (Default)
Uses `localStorage` to persist data in the browser. Images are stored as Base64 strings. Ideal for local development or offline use.

**Setup**:
Ensure your `.env` file contains:
```env
VITE_USE_MOCK=true
```

### 2. Firebase Mode
Uses **Cloud Firestore** for data and **Firebase Storage** for images.

**Setup**:
1.  Create a project in the [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Firestore Database** and **Storage**.
3.  Create a `.env` file in the root directory (if not exists) and set `VITE_USE_MOCK=false`.
4.  Add your Firebase configuration keys:

```env
VITE_USE_MOCK=false

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📦 Installation & Running

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/lev-display.git
    cd lev-display
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run locally**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## 📱 Progressive Web App (PWA)

This application is configured as a PWA, meaning it can be installed on supported devices and work offline.

-   **Manifest**: Configured in `vite.config.js` with the name "Lev Display".
-   **Service Worker**: Uses `vite-plugin-pwa` with `autoUpdate` strategy.

## 🧹 Linting

To ensure code quality and consistent formatting:

```bash
npm run lint
```

## 🛣️ Routing

The application uses **React Router 7** for navigation:

-   `/`: **LoginPage** - The entry point for administrators.
-   `/display`: **DisplayPage** - The main slideshow for public screens.
-   `/admin`: **AdminPage** - Protected dashboard for managing dedications.
-   `/login`: Redirects to the root (`/`).

## 📂 Project Structure

```
src/
├── assets/             # Static assets (logos, icons)
├── components/         # Reusable UI components
│   ├── AdminItemForm.jsx  # Form with image compression
│   ├── ConfirmModal.jsx   # Generic confirmation dialog
│   ├── ErrorBoundary.jsx  # Auto-reload stability wrapper
│   ├── PreviewModal.jsx   # Live preview of a slide
│   └── SlideCard.jsx      # The visual representation of a slide
├── lib/                # Library initializations (Firebase)
├── pages/              # Main route pages
│   ├── AdminPage.jsx      # Slide management dashboard
│   ├── DisplayPage.jsx    # The public slideshow
│   └── LoginPage.jsx      # Admin login
├── services/           # Data & Auth Service Layer
│   ├── dataService.js     # Switcher (Mock <-> Firebase)
│   ├── mockService.js     # LocalStorage implementation
│   ├── firebaseService.js # Firebase implementation
│   └── authService.js     # Authentication logic
├── utils/              # Helper functions
│   ├── hebrewDate.js      # Hebrew calendar & holiday logic
│   ├── slideUtils.jsx     # Slide themes & font scaling logic
│   └── storage.js         # LocalStorage wrappers
├── constants.js        # Global configurations & Mock data
└── App.jsx             # Main application entry and routing
```
