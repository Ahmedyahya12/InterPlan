import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqeVrGP8nDHhQMSIsxlUvzFUEbWCHCHaw",
  authDomain: "interplan-92aec.firebaseapp.com",
  projectId: "interplan-92aec",
  storageBucket: "interplan-92aec.firebasestorage.app",
  messagingSenderId: "665961050836",
  appId: "1:665961050836:web:2d1ffb65c592592e060141",
  measurementId: "G-4H2THHFC6R",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
