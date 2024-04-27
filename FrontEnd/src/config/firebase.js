// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZkFL1ZK4qs7QZiHS5AFCtZ3YsGfZZ-DU",
  authDomain: "lap-trinh-tich-hop-nang-45d37.firebaseapp.com",
  databaseURL:
    "https://lap-trinh-tich-hop-nang-45d37-default-rtdb.firebaseio.com",
  projectId: "lap-trinh-tich-hop-nang-45d37",
  storageBucket: "lap-trinh-tich-hop-nang-45d37.appspot.com",
  messagingSenderId: "549264553653",
  appId: "1:549264553653:web:77f945063e45f2958670fc",
  measurementId: "G-H4W050PLKK",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export default auth;
