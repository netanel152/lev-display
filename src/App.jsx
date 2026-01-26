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
  return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            fontFamily: '"Assistant", "Rubik", sans-serif',
            fontWeight: '700',
            fontSize: '1.1rem',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
      />
      <Routes>
        {/* נתיב ראשי - מסך התצוגה של הטאבלט */}
        <Route path="/" element={<DisplayPage />} />

        {/* נתיב התחברות */}
        <Route path="/login" element={<LoginPage />} />

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