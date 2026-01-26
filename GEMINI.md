# Lev Display - Project Context

## Project Overview
**Lev Display** is a dynamic digital signage system developed for "Lev Chabad". Its primary function is to display memorial, birthday, and healing dedications on a tablet or screen. The application is built as a Progressive Web App (PWA) to ensure reliability and offline capabilities.

## Tech Stack
-   **Frontend:** React 19
-   **Build Tool:** Vite 7
-   **Styling:** Tailwind CSS 4 (@tailwindcss/vite)
-   **Routing:** React Router 7
-   **Icons:** Lucide-React
-   **State Management:** React Hooks + Service Layer pattern
-   **Backend:** Configurable (Firebase Firestore/Storage OR LocalStorage Mock)
-   **Date Logic:** `@hebcal/core` for Hebrew calendar integration
-   **PWA:** `vite-plugin-pwa` for offline support and installation

## Architecture & Design Patterns
The application follows a **Service Layer Pattern** to decouple the UI from the underlying data source.

### 1. Service Layer (`src/services/`)
-   **`dataService.js`**: The abstraction layer. It exports unified functions (`subscribeToItems`, `addItem`, etc.) and delegates execution to the appropriate concrete service based on the `VITE_USE_MOCK` environment variable.
-   **`mockService.js`**: A local-only implementation using `localStorage`. Images are stored as Base64 strings.
-   **`firebaseService.js`**: The production implementation connecting to Firebase Firestore (database) and Storage (images).

### 2. Routing (`src/App.jsx`)
-   `/`: **DisplayPage** - The main public slideshow interface.
-   `/login`: **LoginPage** - Admin authentication page.
-   `/admin`: **AdminPage** - Protected route for content management (CRUD).

### 3. Component Structure (`src/components/`)
-   **`SlideCard.jsx`**: The core component for rendering individual slides.
-   **`AdminItemForm.jsx`**: Form for adding/editing slides, including logic for Hebrew date conversion.
-   **`AdminItemRow.jsx`**: A row component for the admin list view.
-   **`PreviewModal.jsx`**: Allows admins to preview a slide exactly as it will appear on the display.

## Configuration (.env)
The application behavior is controlled by environment variables.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_USE_MOCK` | Toggle between Mock (true) and Firebase (false) services. | `true` |
| `VITE_FIREBASE_*` | API keys and config for Firebase (required if `VITE_USE_MOCK=false`). | N/A |

## Key Commands

### Development
```bash
# Start local development server
npm run dev
```

### Production
```bash
# Build the project
npm run build

# Preview the production build locally
npm run preview
```

### Quality Control
```bash
# Run ESLint
npm run lint
```

## Development Conventions
-   **Styling:** Use Tailwind CSS utility classes directly in JSX.
-   **Icons:** Always use `lucide-react` for consistency.
-   **Data Access:** NEVER import `firebaseService` or `mockService` directly in components. Always use `dataService`.
-   **Mock Mode:** Use `VITE_USE_MOCK=true` for rapid UI development without needing Firebase credentials.
-   **Hebrew Dates:** Use `src/utils/hebrewDate.js` for all conversions to ensure consistency.

## Directory Structure
-   `src/assets/`: Static assets (logos, placeholders).
-   `src/components/`: Reusable UI components.
-   `src/lib/`: External library initializations (e.g., `firebase.js`).
-   `src/pages/`: Top-level route components.
-   `src/services/`: Data access layer.
-   `src/utils/`: Helper functions (dates, storage, logic).
-   `src/constants.js`: Global constants and mock data.
