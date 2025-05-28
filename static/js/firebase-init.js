const firebaseConfig = {
    apiKey: "AIzaSyCGREt1K2gg0K0l9NYwwkK7DrQuFYW6jp0",
    authDomain: "cyberwise-bcfff.firebaseapp.com",
    projectId: "cyberwise-bcfff",
    storageBucket: "cyberwise-bcfff.firebasestorage.app",
    messagingSenderId: "1014913384206",
    appId: "1:1014913384206:web:d3d4ece5fcb48b7333215f"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 简化Firestore设置，避免连接冲突
try {
    db.settings({
        experimentalForceLongPolling: true
    });
} catch (error) {
    console.log("Firestore settings already configured");
} 