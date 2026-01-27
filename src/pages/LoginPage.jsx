import { useState } from "react";
import { Heart, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login } from "../services/authService";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(password);
      console.log("[LoginPage] Login successful");
      toast.success("התחברת בהצלחה");
      navigate("/admin");
    } catch (error) {
      console.warn("[LoginPage] Login failed:", error);
      toast.error("סיסמה שגויה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-admin">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md mx-auto text-center">
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
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lev-blue outline-none text-gray-900 placeholder:text-gray-500 font-medium min-h-[44px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-lev-blue text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "מתחבר..." : "התחבר"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;