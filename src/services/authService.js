import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { STORAGE_KEYS } from "../constants";

const useMock = import.meta.env.VITE_USE_MOCK === "true";
const ADMIN_EMAIL = "admin@lev.com"; // Hardcoded email for simpler UI

// Mock Auth Service
const mockLogin = async (password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (password === "123456") {
        localStorage.setItem(STORAGE_KEYS.IS_ADMIN, "true");
        resolve({ user: { email: ADMIN_EMAIL } });
      } else {
        reject(new Error("סיסמה שגויה"));
      }
    }, 500);
  });
};

const mockLogout = async () => {
  localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
  return Promise.resolve();
};

// Firebase Auth Service
const firebaseLogin = async (password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, "true");
    return userCredential;
  } catch (error) {
    console.error("Firebase login error:", error);
    throw error;
  }
};

const firebaseLogout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
  } catch (error) {
    console.error("Firebase logout error:", error);
    throw error;
  }
};

export const login = useMock ? mockLogin : firebaseLogin;
export const logout = useMock ? mockLogout : firebaseLogout;
