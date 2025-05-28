function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // 基本验证
    if (!username || !email || !password) {
        alert("❗ " + getText('fillAllFields'));
        return;
    }

    // 用户名验证
    if (username.length < 3) {
        alert("❌ Username must be at least 3 characters long.");
        return;
    }

    if (username.includes('@')) {
        alert("❌ Username cannot contain @ symbol.");
        return;
    }

    // 密码验证
    if (password.length < 6) {
        alert("❌ Password must be at least 6 characters long.");
        return;
    }

    // 邮箱验证
    if (!email.includes('@') || !email.includes('.')) {
        alert("❌ Please enter a valid email address.");
        return;
    }

    // 注册流程
    registerUser(username, email, password);
}

async function registerUser(username, email, password, retries = 3) {
    try {
        console.log("Starting registration process...");

        // 直接创建用户账户，不检查用户名是否存在（简化流程）
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log("User created successfully:", user.uid);

        // 更新用户显示名称
        await user.updateProfile({ displayName: username });
        console.log("User profile updated");

        // 尝试保存用户数据，如果失败也不影响注册成功
        try {
            // 保存用户名到邮箱的映射
            await db.collection("usernames").doc(username).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                userId: user.uid
            });

            // 创建用户文档
            await db.collection("users").doc(user.uid).set({
                username: username,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                notesCount: 0
            });

            console.log("User data saved to Firestore");
        } catch (firestoreError) {
            console.warn("Firestore save failed, but user account created:", firestoreError);
            // 即使Firestore保存失败，用户账户已创建，仍然算注册成功
        }

        alert("✅ " + getText('registrationSuccessful'));
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Registration error:", error);

        // 如果是网络问题且还有重试次数，则重试
        if (retries > 0 && (error.code === 'unavailable' || error.message.includes('offline'))) {
            console.log(`Retrying registration... ${retries} attempts left`);
            setTimeout(() => registerUser(username, email, password, retries - 1), 2000);
            return;
        }

        let errorMessage = getText('registrationFailed') + " ";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += "This email is already registered.";
                break;
            case 'auth/invalid-email':
                errorMessage += "Invalid email format.";
                break;
            case 'auth/operation-not-allowed':
                errorMessage += "Email registration is not enabled.";
                break;
            case 'auth/weak-password':
                errorMessage += "Password is too weak.";
                break;
            case 'unavailable':
                errorMessage += "Service temporarily unavailable. Please try again later.";
                break;
            default:
                errorMessage += error.message;
        }
        alert("❌ " + errorMessage);
    }
}

// 检查用户是否已登录
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // 用户已登录，重定向到dashboard
        window.location.href = "dashboard.html";
    }
}); 