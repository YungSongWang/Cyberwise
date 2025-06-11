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
    console.log("=== Starting email login process ===");
    console.log("Logging in with email:", email);

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("=== Firebase login successful ===");
            console.log("Login successful:", userCredential.user);
            console.log("Preparing to redirect, no popups shown");

            // Ensure no popups
            // Remove popups, redirect directly
            // alert("✅ " + getText('loginSuccessful'));

            // Add delay and multiple redirect methods
            console.log("Preparing to redirect to dashboard...");

            setTimeout(() => {
                const dashboardUrl = window.location.origin + "/templates/dashboard.html";
                console.log("Redirect URL:", dashboardUrl);

                try {
                    // Method 1: Direct redirect
                    console.log("Executing redirect...");
                    window.location.href = dashboardUrl;

                    // Method 2: Backup redirect (if first method fails)
                    setTimeout(() => {
                        if (window.location.pathname !== "/templates/dashboard.html") {
                            console.log("First redirect method failed, trying second method");
                            window.location.replace(dashboardUrl);
                        }
                    }, 1000);

                    // Method 3: Final backup method
                    setTimeout(() => {
                        if (window.location.pathname !== "/templates/dashboard.html") {
                            console.log("First two redirect methods failed, trying third method");
                            window.open(dashboardUrl, '_self');
                        }
                    }, 2000);

                } catch (error) {
                    console.error("Redirect failed:", error);
                    alert("Login successful, but page redirect failed. Please manually access the dashboard page.");
                    // Show manual redirect button
                    if (typeof showManualJumpButton === 'function') {
                        showManualJumpButton();
                    }
                }
            }, 100); // Further reduce delay time
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
            alert("❌ Username not found. Please check if the username is correct, or try logging in with email.");
        }
    } catch (error) {
        console.error("Username lookup error:", error);

        // 如果是网络问题且还有重试次数，则重试
        if (retries > 0 && (error.code === 'unavailable' || error.message.includes('offline'))) {
            console.log(`Retrying username lookup... ${retries} attempts left`);
            setTimeout(() => loginWithUsername(username, password, retries - 1), 2000);
            return;
        }

        alert("❌ Error looking up username. Please try logging in with your email address.");
    }
}

function handleLoginError(error) {
    console.error("Login error details:", error);

    let errorMessage = "";
    switch (error.code) {
        case 'auth/invalid-login-credentials':
            errorMessage = "Invalid login credentials. Please check if your email and password are correct.";
            break;
        case 'auth/user-not-found':
            errorMessage = "No account found for this email. Please check if the email is correct or register first.";
            break;
        case 'auth/wrong-password':
            errorMessage = "Incorrect password. Please check if the password is correct.";
            break;
        case 'auth/invalid-email':
            errorMessage = "Invalid email format. Please enter a valid email address.";
            break;
        case 'auth/user-disabled':
            errorMessage = "This account has been disabled. Please contact administrator.";
            break;
        case 'auth/too-many-requests':
            errorMessage = "Too many login attempts. Please try again later.";
            break;
        case 'auth/network-request-failed':
            errorMessage = "Network connection failed. Please check your connection and try again.";
            break;
        default:
            errorMessage = `${error.message}`;
    }

    alert("❌ " + errorMessage);

    // 提供帮助建议
    if (error.code === 'auth/invalid-login-credentials') {
        setTimeout(() => {
            const suggestion = confirm("Login failed. Do you need to:\n\n1. Click OK to reset password\n2. Click Cancel to check your input");
            if (suggestion) {
                alert("Please go to the registration page to create a new account, or contact administrator to reset password.");
            }
        }, 1000);
    }
}

// Check if user is already logged in - Remove auto redirect to avoid conflicts
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User already logged in:", user);
        // Only auto redirect when not on login page
        if (window.location.pathname === "/templates/login.html") {
            console.log("User already logged in, but on login page, no auto redirect");
        }
    }
});

// Add manual redirect function
function goToDashboard() {
    const dashboardUrl = window.location.origin + "/templates/dashboard.html";
    console.log("Manual redirect to dashboard:", dashboardUrl);
    window.location.href = dashboardUrl;
}

// Add debug information
console.log("Login script loaded");
console.log("Firebase app:", firebase.app());
console.log("Firebase auth:", firebase.auth()); 