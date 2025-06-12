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
        console.log("开始注册流程...");

        // 创建用户账户
        console.log("正在创建Firebase用户账户...");
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log("Firebase用户创建成功:", user.uid);

        // 更新用户显示名称
        console.log("正在更新用户显示名称...");
        await user.updateProfile({ displayName: username });
        console.log("用户显示名称更新成功");

        // 保存用户数据到Firestore
        console.log("正在保存用户数据到Firestore...");

        try {
            // 保存用户名到邮箱的映射
            console.log("保存用户名映射...");
            await db.collection("usernames").doc(username).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                userId: user.uid
            });
            console.log("用户名映射保存成功");

            // 创建用户文档
            console.log("创建用户文档...");
            await db.collection("users").doc(user.uid).set({
                username: username,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                notesCount: 0
            });
            console.log("用户文档创建成功");

            console.log("所有用户数据保存完成");
        } catch (firestoreError) {
            console.error("Firestore保存失败:", firestoreError);
            alert("⚠️ 用户账户已创建，但数据保存失败。请联系管理员。错误：" + firestoreError.message);
            // 即使Firestore保存失败，用户账户已创建，仍然算注册成功
        }

        alert("✅ " + getText('registrationSuccessful'));
        console.log("注册流程完成，准备跳转到dashboard");
        window.location.href = window.location.origin + "/templates/dashboard.html";

    } catch (error) {
        console.error("注册错误:", error);

        // 如果是网络问题且还有重试次数，则重试
        if (retries > 0 && (error.code === 'unavailable' || error.message.includes('offline'))) {
            console.log(`重试注册... 剩余${retries}次尝试`);
            setTimeout(() => registerUser(username, email, password, retries - 1), 2000);
            return;
        }

        let errorMessage = "";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "此邮箱已被注册。请使用其他邮箱或尝试登录。";
                break;
            case 'auth/invalid-email':
                errorMessage = "邮箱格式无效。请输入正确的邮箱地址。";
                break;
            case 'auth/operation-not-allowed':
                errorMessage = "邮箱注册功能未启用。请联系管理员。";
                break;
            case 'auth/weak-password':
                errorMessage = "密码强度不够。请使用至少6个字符的密码。";
                break;
            case 'unavailable':
                errorMessage = "服务暂时不可用。请稍后重试。";
                break;
            default:
                errorMessage = `注册失败：${error.message}`;
        }
        alert("❌ " + errorMessage);
    }
}

// 检查用户是否已登录
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("用户已登录，重定向到dashboard:", user);
        // 用户已登录，重定向到dashboard
        window.location.href = window.location.origin + "/templates/dashboard.html";
    }
});

// 添加调试信息
console.log("Register script loaded");
console.log("Firebase app:", firebase.app());
console.log("Firestore:", db); 