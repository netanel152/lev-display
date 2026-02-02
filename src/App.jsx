import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DisplayPage from './pages/DisplayPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { STORAGE_KEYS } from './constants';

// רכיב שמגן על דף הניהול - אם לא התחברת, זורק אותך ללוגין
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem(STORAGE_KEYS.IS_ADMIN);
  if (!isAdmin) {
      console.log("[ProtectedRoute] Access denied. Redirecting to login.");
  }
  return isAdmin ? children : <Navigate to="/" />; // Redirect to root (Login) if not authorized
};

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            fontFamily: '"Assistant", "Rubik", sans-serif',
            fontWeight: '600',
            fontSize: '1rem',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            direction: 'rtl',
          },
        }}
      />
      <Routes>
        {/* נתיב ראשי - דף התחברות */}
        <Route path="/" element={<LoginPage />} />

        {/* נתיב תצוגה - מסך הטאבלט/טלוויזיה (פתוח, אך הכניסה הראשית היא דרך הלוגין) */}
        <Route path="/display" element={<DisplayPage />} />

        {/* תאימות לאחור - אם מישהו מגיע ל /login, נציג לו את דף הבית */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* נתיב ניהול - מוגן בסיסמה */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
