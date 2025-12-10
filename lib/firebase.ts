import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu1FCrDFGh5pBgEz11_dHWTiLwFEuU9jo",
  authDomain: "pgstay-auth.firebaseapp.com",
  projectId: "pgstay-auth",
  storageBucket: "pgstay-auth.firebasestorage.app",
  messagingSenderId: "523423486564",
  appId: "1:523423486564:web:3ded9a41dd60283aca0571",
  measurementId: "G-MW7HVY58TX"
};

// --- FIX: Singleton Pattern ---
// Prevents reloading errors by checking if app exists first
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };