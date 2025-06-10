function isEmail(input) {
    return /\S+@\S+\.\S+/.test(input);
}

function login() {
    const identifier = document.getElementById("identifier").value.trim();
    const password = document.getElementById("password").value;

    console.log("Login attempt with identifier:", identifier);

    if (!identifier || !password) {
        alert("❗ " + getText('fillAllFields'));
        return;
    }

    if (isEmail(identifier)) {
        console.log("Attempting email login");
        // 使用邮箱登录
        loginWithEmail(identifier, password);
    } else {
        console.log("Attempting username login");
        // 使用用户名登录，先查找对应邮箱
        loginWithUsername(identifier, password);
    }
}

function loginWithEmail(email, password) {
    console.log("=== 开始邮箱登录流程 ===");
    console.log("Logging in with email:", email);

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("=== Firebase登录成功 ===");
            console.log("Login successful:", userCredential.user);
            console.log("准备跳转，不显示任何弹窗");

            // 确保没有任何弹窗
            // 移除弹窗，直接跳转
            // alert("✅ " + getText('loginSuccessful'));

            // 添加延迟和多种跳转方式
            console.log("准备跳转到dashboard...");

            setTimeout(() => {
                const dashboardUrl = window.location.origin + "/templates/dashboard.html";
                console.log("跳转URL:", dashboardUrl);

                try {
                    // 方法1: 直接跳转
                    console.log("执行跳转...");
                    window.location.href = dashboardUrl;

                    // 方法2: 备用跳转（如果第一种方法失败）
                    setTimeout(() => {
                        if (window.location.pathname !== "/templates/dashboard.html") {
                            console.log("第一种跳转方法失败，尝试第二种方法");
                            window.location.replace(dashboardUrl);
                        }
                    }, 1000);

                    // 方法3: 最后的备用方案
                    setTimeout(() => {
                        if (window.location.pathname !== "/templates/dashboard.html") {
                            console.log("前两种跳转方法都失败，尝试第三种方法");
                            window.open(dashboardUrl, '_self');
                        }
                    }, 2000);

                } catch (error) {
                    console.error("跳转失败:", error);
                    alert("登录成功，但页面跳转失败。请手动访问dashboard页面。");
                    // 显示手动跳转按钮
                    if (typeof showManualJumpButton === 'function') {
                        showManualJumpButton();
                    }
                }
            }, 100); // 进一步减少延迟时间
        })
        .catch(error => {
            console.error("Email login error:", error);
            handleLoginError(error);
        });
}

async function loginWithUsername(username, password, retries = 3) {
    try {
        console.log("Looking up username:", username);
        const doc = await db.collection("usernames").doc(username).get();

        if (doc.exists) {
            const email = doc.data().email;
            console.log("Found email for username:", email);
            loginWithEmail(email, password);
        } else {
            console.log("Username not found in database");
            alert("❌ 用户名不存在。请检查用户名是否正确，或尝试使用邮箱登录。");
        }
    } catch (error) {
        console.error("Username lookup error:", error);

        // 如果是网络问题且还有重试次数，则重试
        if (retries > 0 && (error.code === 'unavailable' || error.message.includes('offline'))) {
            console.log(`Retrying username lookup... ${retries} attempts left`);
            setTimeout(() => loginWithUsername(username, password, retries - 1), 2000);
            return;
        }

        alert("❌ 查找用户名时出错。请尝试使用邮箱地址登录。");
    }
}

function handleLoginError(error) {
    console.error("Login error details:", error);

    let errorMessage = "";
    switch (error.code) {
        case 'auth/invalid-login-credentials':
            errorMessage = "登录凭据无效。请检查邮箱和密码是否正确。";
            break;
        case 'auth/user-not-found':
            errorMessage = "未找到此邮箱对应的账户。请检查邮箱是否正确或先注册账户。";
            break;
        case 'auth/wrong-password':
            errorMessage = "密码错误。请检查密码是否正确。";
            break;
        case 'auth/invalid-email':
            errorMessage = "邮箱格式无效。请输入正确的邮箱地址。";
            break;
        case 'auth/user-disabled':
            errorMessage = "此账户已被禁用。请联系管理员。";
            break;
        case 'auth/too-many-requests':
            errorMessage = "登录尝试次数过多。请稍后再试。";
            break;
        case 'auth/network-request-failed':
            errorMessage = "网络连接失败。请检查网络连接后重试。";
            break;
        default:
            errorMessage = `${error.message}`;
    }

    alert("❌ " + errorMessage);

    // 提供帮助建议
    if (error.code === 'auth/invalid-login-credentials') {
        setTimeout(() => {
            const suggestion = confirm("登录失败。是否需要：\n\n1. 点击确定重置密码\n2. 点击取消检查输入信息");
            if (suggestion) {
                alert("请前往注册页面创建新账户，或联系管理员重置密码。");
            }
        }, 1000);
    }
}

// 检查用户是否已登录 - 移除自动重定向，避免冲突
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User already logged in:", user);
        // 只在非登录页面时才自动重定向
        if (window.location.pathname === "/templates/login.html") {
            console.log("用户已登录，但在登录页面，不自动重定向");
        }
    }
});

// 添加手动跳转函数
function goToDashboard() {
    const dashboardUrl = window.location.origin + "/templates/dashboard.html";
    console.log("手动跳转到dashboard:", dashboardUrl);
    window.location.href = dashboardUrl;
}

// 添加调试信息
console.log("Login script loaded");
console.log("Firebase app:", firebase.app());
console.log("Firebase auth:", firebase.auth()); 