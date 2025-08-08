// התחברות ורישום משתמשים באמצעות localStorage

const loginForm = document.getElementById("login-form");
const registerBtn = document.getElementById("register-btn");
const errorMsg = document.getElementById("error-message");

function getUsers() {
  let users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// התחברות
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = getUsers();
  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (foundUser) {
    errorMsg.textContent = "";

  // שמירת המשתמש הנוכחי
  localStorage.setItem("currentUser", username);

  // בדיקת הפניה שמורה
  const redirectUrl = localStorage.getItem("redirectAfterLogin") || "dashboard.html";
  localStorage.removeItem("redirectAfterLogin");

  // הפניה לעמוד המבוקש
  window.location.href = redirectUrl;
  } else {
    errorMsg.textContent = "Incorrect username or password.";
  }
});

// הרשמה
registerBtn.addEventListener("click", function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    errorMsg.textContent = "Please enter both username and password.";
    return;
  }

  const users = getUsers();
  const exists = users.some((u) => u.username === username);

  if (exists) {
    errorMsg.textContent = "Username already exists.";
  } else {
    users.push({ username, password });
    saveUsers(users);
    errorMsg.textContent = "Registered successfully. You can now log in.";
  }
});
