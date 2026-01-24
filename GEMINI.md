# Lev Display - Project Context

## Project Overview
**Lev Display** is a digital signage system designed for "Lev Chabad" to display memorial, birthday, and healing dedications. It features a dynamic slideshow that rotates through dedications, smart scheduling based on Gregorian/Hebrew dates, and an admin interface for content management.

## Tech Stack
-   **Frontend**: React 19
-   **Build Tool**: Vite 7
-   **Styling**: Tailwind CSS 4
-   **Icons**: Lucide-React
-   **Backend**: Configurable Service Layer (Firebase vs. LocalStorage Mock)
-   **Testing**: Vitest + React Testing Library
-   **Date Logic**: `@hebcal/core` for Hebrew dates

## Architecture
The application is structured around a **Service Layer Pattern** to decouple the UI from the data source.

### Service Layer (`src/services/`)
-   **`dataService.js`**: The main entry point. It exports unified functions (`subscribeToItems`, `addItem`, etc.) that delegate to either `mockService.js` or `firebaseService.js` based on the `VITE_USE_MOCK` environment variable.
-   **`mockService.js`**: Uses `localStorage` to simulate a database. Ideal for offline development.
-   **`firebaseService.js`**: Connects to Firebase Firestore and Storage for production data.

### Routing (`src/App.jsx`)
-   `/`: **DisplayPage** - The main public slideshow for the tablet/screen.
-   `/login`: **LoginPage** - Admin authentication.
-   `/admin`: **AdminPage** - Protected route for managing slides (CRUD operations).

### Key Directories
-   `src/lib/`: External library initialization (e.g., `firebase.js`).
-   `src/utils/`: Helper functions (e.g., `hebrewDate.js` for date conversion).
-   `src/constants.js`: Global constants and mock data configuration.
-   `src/tests/`: Global test setup (e.g., `setup.js`).

## Configuration
The application behavior is controlled by `.env` variables.

### Environment Variables
| Variable | Description | Default/Example |
| :--- | :--- | :--- |
| `VITE_USE_MOCK` | Toggle between Mock and Firebase services | `true` or `false` |
| `VITE_FIREBASE_*` | Firebase configuration keys (only needed if `VITE_USE_MOCK=false`) | See `README.md` |

## Key Commands
| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run unit tests using Vitest |
| `npm run lint` | Run ESLint |

## Development Guidelines
1.  **Mock Mode**: Default to `VITE_USE_MOCK=true` for rapid UI development without needing Firebase credentials.
2.  **Styling**: Use Tailwind CSS utility classes.
3.  **Testing**: Write tests for new logic, especially utility functions and critical components. Run `npm run test` to verify.
4.  **Icons**: Use `lucide-react` for all icons.
