import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDu6vCA9Ov5LZvfOhDvWNzCFPwwo5b8dqc",
  authDomain: "hanamels-expenses-tracer.firebaseapp.com",
  projectId: "hanamels-expenses-tracer",
  storageBucket: "hanamels-expenses-tracer.appspot.com",
  messagingSenderId: "885856572058",
  appId: "1:885856572058:web:32e7c0a4c6c32db61b4523"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 