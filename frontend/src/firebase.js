import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBen_clyZBToC7Houjs2ha2dA4H3bqaMwY",
  authDomain: "chatai2-5e217.firebaseapp.com",
  projectId: "chatai2-5e217",
  storageBucket: "chatai2-5e217.appspot.com", 
  messagingSenderId: "1056245947655",
  appId: "1:1056245947655:web:be06992fb34afca587f9a2",
  measurementId: "G-JTGC9KHD16"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword };
