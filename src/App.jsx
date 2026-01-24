import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DisplayPage from './pages/DisplayPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

// רכיב שמגן על דף הניהול - אם לא התחברת, זורק אותך ללוגין
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin');
  return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
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