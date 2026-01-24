# Lev Display - Digital Signage System

A dynamic digital display system built for "Lev Chabad" to show memorial, birthday, and healing dedications. This project uses **React 19**, **Vite**, and **Tailwind CSS 4**, featuring a flexible architecture that supports both local mock data and a live Firebase backend.

## 🚀 Features

-   **Dynamic Slideshow**: Automatically rotates through dedications with smooth fade transitions.
-   **Smart Scheduling**: Shows specific slides based on Gregorian or Hebrew dates.
-   **Themes**: Distinct visual themes for Memorial (Candle), Birthday (Balloons), and Healing (Pulse).
-   **Admin Interface**: Password-protected area to add, edit, and delete slides.
-   **Service Layer Pattern**: Seamlessly switch between local storage (Mock) and Firebase Firestore/Storage.
-   **Hebrew Date Integration**: Displays the current Hebrew date automatically.
-   **Wake Lock Support**: Prevents the screen from sleeping while in display mode.

## 🛠️ Tech Stack

-   **Framework**: React 19
-   **Build Tool**: Vite 7
-   **Styling**: Tailwind CSS 4
-   **Icons**: Lucide-React
-   **Backend**: Firebase (Firestore & Storage) or LocalStorage (Mock)

## ⚙️ Configuration & Backend

This project implements a **Service Layer** that allows you to toggle between a local development mode and a production-ready Firebase backend using environment variables.

### 1. Mock Mode (Default)
Uses `localStorage` to persist data in the browser. Images are converted to Base64. Ideal for local development without internet or backend setup.

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
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
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

## 🧪 Testing

This project uses **Vitest** for unit and integration testing.

To run the tests:
```bash
npm test
```

## 📱 Progressive Web App (PWA)

This application is configured as a PWA, meaning it can be installed on supported devices and work offline (depending on caching strategies).

-   **Manifest**: Configured in `vite.config.js` with name "Lev Display".
-   **Service Worker**: Auto-updates by default.

## 🧹 Linting

To ensure code quality and consistent formatting:

```bash
npm run lint
```

## 📂 Project Structure

```
src/
├── services/           # Data Service Layer
│   ├── dataService.js     # Switcher (Mock <-> Firebase)
│   ├── mockService.js     # LocalStorage implementation
│   └── firebaseService.js # Firebase implementation
├── lib/
│   └── firebase.js     # Firebase initialization
├── pages/
│   ├── DisplayPage.jsx # Main slideshow display
│   ├── AdminPage.jsx   # Management interface
│   └── LoginPage.jsx   # Admin authentication
├── utils/
│   └── hebrewDate.js   # Hebrew date logic
└── constants.js        # Global configs & Mock Data
```