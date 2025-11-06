// Importa las funciones necesarias de los SDKs de Firebase
import { initializeApp } from "firebase/app";
// Importa los servicios que usaremos: Autenticación y Base de Datos (Firestore)
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase leída desde las variables de entorno (.env)
// Es crucial que estas variables estén definidas en un archivo .env en el proyecto
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Exporta las instancias de los servicios para usarlas en el resto de la aplicación
export const db = getFirestore(app); // Inicializa y exporta Firestore (Base de Datos)
export const auth = getAuth(app);    // Inicializa y exporta Auth (Autenticación)