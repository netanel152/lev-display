import { useState, useEffect } from "react";
import { User, Lock, LayoutDashboard, MonitorPlay, LogIn, Loader2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login } from "../services/authService";
import { STORAGE_KEYS } from "../constants";
import logo from "../assets/original-logo.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Default destination is 'admin'
  const [destination, setDestination] = useState("admin");

  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem(STORAGE_KEYS.IS_ADMIN);
    if (isAdmin === "true") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(password);
      toast.success("התחברת בהצלחה");
      
      // Immediate redirection based on selection
      if (destination === 'admin') {
        navigate("/admin");
      } else {
        navigate("/display");
      }
    } catch (error) {
      toast.error("פרטי התחברות שגויים");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-admin relative overflow-hidden rtl" dir="rtl">
      {/* Background decoration - Simplified and cleaner */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(240,244,255,1)_0%,rgba(255,255,255,0)_100%)]"></div>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-lev-burgundy/5 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-xl shadow-gray-200/50 p-2 mb-6 flex items-center justify-center border border-gray-50">
              <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">ברוכים הבאים</h2>
            <p className="text-gray-400 font-medium mt-2">ניהול מערכת לב חב"ד</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Username Input */}
              <div className="relative group">
                <User className="absolute top-4 right-4 text-gray-300 group-focus-within:text-lev-blue transition-colors" size={24} />
                <input
                  type="text"
                  placeholder="שם משתמש"
                  className="w-full py-4 pr-14 pl-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-lev-blue/30 outline-none text-gray-900 transition-all font-medium text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <Lock className="absolute top-4 right-4 text-gray-300 group-focus-within:text-lev-blue transition-colors" size={24} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="סיסמה"
                  className="w-full py-4 pr-14 pl-14 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-lev-blue/30 outline-none text-gray-900 transition-all font-medium text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-4 left-4 text-gray-300 hover:text-lev-blue transition-colors focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>

              {/* Destination Selection (Radio/Toggle) */}
              <div className="pt-2">
                <label className="block text-sm font-bold text-gray-500 mb-2 mr-1">לאן תרצה להמשיך?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDestination("admin")}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all
                      ${destination === "admin" 
                        ? "bg-blue-50 border-lev-blue text-lev-blue shadow-sm" 
                        : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"}
                    `}
                  >
                    <LayoutDashboard size={24} className="mb-1" strokeWidth={destination === "admin" ? 2.5 : 2} />
                    <span className="text-sm font-bold">ניהול תוכן</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDestination("display")}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all
                      ${destination === "display" 
                        ? "bg-teal-50 border-teal-500 text-teal-600 shadow-sm" 
                        : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"}
                    `}
                  >
                    <MonitorPlay size={24} className="mb-1" strokeWidth={destination === "display" ? 2.5 : 2} />
                    <span className="text-sm font-bold">תצוגת מסך</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-lev-blue text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>כניסה למערכת</span>
                  <LogIn size={24} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
