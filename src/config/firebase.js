import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBog59AEjY0KITeFxrfx-AJ26H5U1WAsz0",
  authDomain: "",
  projectId: "vtconnectoverseasapp",
  storageBucket: "gs://vtconnectoverseasapp.appspot.com",
  messagingSenderId: "428217317426",
  appId: "1:428217317426:android:7449558868bcf17e46642b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app); 