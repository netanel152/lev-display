import { useState } from "react";
import { Heart, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // בדיקה פשוטה כרגע - בהמשך נחבר ל-Firebase Auth
    if (password === "123456") {
      localStorage.setItem("isAdmin", "true"); // שמירת מצב התחברות
      navigate("/admin");
    } else {
      alert("סיסמה שגויה");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-admin">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Heart className="text-lev-burgundy w-12 h-12" fill="#7A1429" />
        </div>
        <h2 className="text-2xl font-bold text-lev-burgundy mb-6">
          כניסה למערכת ניהול
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Lock className="absolute top-3 right-3 text-gray-600 w-5 h-5" />
            <input
              type="password"
              placeholder="סיסמת מנהל"
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lev-blue outline-none text-gray-900 placeholder:text-gray-500 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-lev-blue text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
          >
            התחבר
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
