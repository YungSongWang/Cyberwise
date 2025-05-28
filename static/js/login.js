function isEmail(input) {
    return /\S+@\S+\.\S+/.test(input);
}

function login() {
    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;

    if (!identifier || !password) {
        alert("❗ " + getText('fillAllFields'));
        return;
    }

    if (isEmail(identifier)) {
        // 使用邮箱登录
        loginWithEmail(identifier, password);
    } else {
        // 使用用户名登录，先查找对应邮箱
        loginWithUsername(identifier, password);
    }
}

function loginWithEmail(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("✅ " + getText('loginSuccessful'));
            window.location.href = "dashboard.html";
        })
        .catch(error => {
            console.error("Email login error:", error);
            handleLoginError(error);
        });
}

async function loginWithUsername(username, password, retries = 3) {
    try {
        const doc = await db.collection("usernames").doc(username).get();

        if (doc.exists) {
            const email = doc.data().email;
            loginWithEmail(email, password);
        } else {
            alert("❌ Username not found.");
        }
    } catch (error) {
        console.error("Username lookup error:", error);

        // 如果是网络问题且还有重试次数，则重试
        if (retries > 0 && (error.code === 'unavailable' || error.message.includes('offline'))) {
            console.log(`Retrying username lookup... ${retries} attempts left`);
            setTimeout(() => loginWithUsername(username, password, retries - 1), 2000);
            return;
        }

        alert("❌ Error looking up username. Please try using your email address instead.");
    }
}

function handleLoginError(error) {
    let errorMessage = getText('loginFailed') + " ";
    switch (error.code) {
        case 'auth/user-not-found':
            errorMessage += "No account found with this email.";
            break;
        case 'auth/wrong-password':
            errorMessage += "Incorrect password.";
            break;
        case 'auth/invalid-email':
            errorMessage += "Invalid email format.";
            break;
        case 'auth/user-disabled':
            errorMessage += "This account has been disabled.";
            break;
        case 'auth/too-many-requests':
            errorMessage += "Too many failed attempts. Please try again later.";
            break;
        default:
            errorMessage += error.message;
    }
    alert("❌ " + errorMessage);
}

// 检查用户是否已登录
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // 用户已登录，重定向到dashboard
        window.location.href = "dashboard.html";
    }
}); 