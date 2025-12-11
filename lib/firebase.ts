import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ YOUR ACTUAL KEYS (Restored)
const firebaseConfig = {
  apiKey: "AIzaSyAu1FCrDFGh5pBgEz11_dHWTiLwFEuU9jo",
  authDomain: "pgstay-auth.firebaseapp.com",
  projectId: "pgstay-auth",
  storageBucket: "pgstay-auth.firebasestorage.app",
  messagingSenderId: "523423486564",
  appId: "1:523423486564:web:3ded9a41dd60283aca0571",
  measurementId: "G-MW7HVY58TX"
};

// Singleton Pattern (Prevents crashes)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };