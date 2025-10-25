import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9JBmwKUqof-jb2Lpisw95YQIH9rotlq8",
  authDomain: "hack-cac7a.firebaseapp.com",
  projectId: "hack-cac7a",
  storageBucket: "hack-cac7a.firebasestorage.app",
  messagingSenderId: "390377411771",
  appId: "1:390377411771:web:72e3f6fe0ee41ee827059e",
  measurementId: "G-TNWCE5659J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

// File upload function
export const uploadFile = async (file: File) => {
  try {
    const storageRef = ref(storage, `complaints/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Submit complaint function
export const submitComplaint = async (complaint: {
  userId: string;
  type: string;
  description: string;
  location: string;
  files: string[];
}) => {
  try {
    const docRef = await addDoc(collection(db, "complaints"), {
      ...complaint,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting complaint:", error);
    throw error;
  }
};

// Get user complaints
export const getUserComplaints = async (userId: string) => {
  try {
    const q = query(
      collection(db, "complaints"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting complaints:", error);
    throw error;
  }
};

// Get all complaints (for admin)
export const getAllComplaints = async () => {
  try {
    const q = query(
      collection(db, "complaints"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all complaints:", error);
    throw error;
  }
};

// Authentication functions
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export { app, db, auth, storage };