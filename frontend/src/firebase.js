import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_iH1N-mPcilfScpftkEDzsS3RsGSrVxg",
  authDomain: "fitness-app-3fb0b.firebaseapp.com",
  projectId: "fitness-app-3fb0b",
  storageBucket: "fitness-app-3fb0b.firebasestorage.app",
  messagingSenderId: "287682287659",
  appId: "1:287682287659:web:5a7bddb0b768e06805b26e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();