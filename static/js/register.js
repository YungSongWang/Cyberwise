function register() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    console.log("Registration attempt:", { username, email });

    // 基本验证
    if (!username || !email || !password) {
        alert("❗ " + getText('fillAllFields'));
        return;
    }

    // 用户名验证
    if (username.length < 3) {
        alert("❌ The username needs to be at least 3 characters.");
        return;
    }

    if (username.includes('@')) {
        alert("❌ Usernames cannot contain the @ symbol");
        return;
    }

    // 密码验证
    if (password.length < 6) {
        alert("❌ Passwords need to be at least 6 characters long");
        return;
    }

    // 邮箱验证
    if (!email.includes('@') || !email.includes('.')) {
        alert("❌ Please enter a valid e-mail address.");
        return;
    }

    // 注册流程
    registerUser(username, email, password);
}

async function registerUser(username, email, password, retries = 3) {
    try {
        console.log("Starting registration process...");

        // Create user account
        console.log("Creating Firebase user account...");
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log("Firebase user created successfully:", user.uid);

        // Update user display name
        console.log("Updating user display name...");
        await user.updateProfile({ displayName: username });
        console.log("User display name updated successfully");

        // Save user data to Firestore
        console.log("Saving user data to Firestore...");

        try {
            // Save username to email mapping
            console.log("Saving username mapping...");
            await db.collection("usernames").doc(username).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                userId: user.uid
            });
            console.log("Username mapping saved successfully");

            // Create user document
            console.log("Creating user document...");
            await db.collection("users").doc(user.uid).set({
                username: username,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                notesCount: 0
            });
            console.log("User document created successfully");

            console.log("All user data saved successfully");
        } catch (firestoreError) {
            console.error("Firestore save failed:", firestoreError);
            alert("⚠️ User account created, but data save failed. Please contact administrator. Error: " + firestoreError.message);
            // Even if Firestore save fails, user account is created, still consider registration successful
        }

        alert("✅ " + getText('registrationSuccessful'));
        console.log("Registration process completed, preparing to redirect to dashboard");
        window.location.href = window.location.origin + "/templates/dashboard.html";

    } catch (error) {
        console.error("Registration error:", error);

        // If network issue and retries remaining, retry
        if (retries > 0 && (error.code === 'unavailable' || error.message.includes('offline'))) {
            console.log(`Retrying registration... ${retries} attempts remaining`);
            setTimeout(() => registerUser(username, email, password, retries - 1), 2000);
            return;
        }

        let errorMessage = "";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "This email is already registered. Please use a different email or try logging in.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Invalid email format. Please enter a valid email address.";
                break;
            case 'auth/operation-not-allowed':
                errorMessage = "Email registration is not enabled. Please contact administrator.";
                break;
            case 'auth/weak-password':
                errorMessage = "Password is too weak. Please use at least 6 characters.";
                break;
            case 'unavailable':
                errorMessage = "Service temporarily unavailable. Please try again later.";
                break;
            default:
                errorMessage = `Registration failed: ${error.message}`;
        }
        alert("❌ " + errorMessage);
    }
}

// Check if user is already logged in
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User already logged in, redirecting to dashboard:", user);
        // User already logged in, redirect to dashboard
        window.location.href = window.location.origin + "/templates/dashboard.html";
    }
});

// Add debug information
console.log("Register script loaded");
console.log("Firebase app:", firebase.app());
console.log("Firestore:", db); 