const firebaseConfig = {
    apiKey: "AIzaSyB0GcHHgrheepuaXKfj8wQCSWXkRVBnycA",
    authDomain: "julian-the-super-genius.firebaseapp.com",
    projectId: "julian-the-super-genius",
    storageBucket: "julian-the-super-genius.firebasestorage.app",
    messagingSenderId: "279078990922",
    appId: "1:279078990922:web:ccc2dc8df17e47cf00e2b3",
    measurementId: "G-9YNLFQH4M9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
