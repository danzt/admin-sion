import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig: Record<string, unknown> = {
  apiKey: "AIzaSyCRdZho0SssBTDzWjCjHzPfwruJU_e-Xpw",
  authDomain: "sion-admin.firebaseapp.com",
  projectId: "sion-admin",
  storageBucket: "sion-admin.firebasestorage.app",
  messagingSenderId: "842641090021",
  appId: "1:842641090021:web:4ab43bb7acec3041df3b0c",
  measurementId: "G-C0SZM2E8ZP",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
