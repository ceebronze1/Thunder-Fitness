// ===== UTIL =====
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ===== SIGNUP =====
function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;
  const age = document.getElementById("signup-age").value;
  const gender = document.getElementById("signup-gender").value;

  if (!username || !password || !age || !gender) {
    alert("Please fill all fields!");
    return;
  }
  if (localStorage.getItem(username)) {
    alert("Username already exists. Choose another.");
    return;
  }

  const user = {
    username,
    password,
    age,
    gender,
    logs: [],              // {exercise, duration}
    waterByDate: {}        // { "YYYY-MM-DD": number }
  };
  localStorage.setItem(username, JSON.stringify(user));
  alert("Signup successful! Please log in.");
  window.location.href = "index.html";
}

// ===== LOGIN =====
function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const userData = localStorage.getItem(username);
  if (!userData) {
    alert("User not found. Please sign up.");
    return;
  }

  const user = JSON.parse(userData);
  if (user.password !== password) {
    alert("Incorrect password.");
    return;
  }

  localStorage.setItem("currentUser", username);
  window.location.href = "dashboard.html";
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ===== DASHBOARD INIT =====
window.onload = function() {
  if (document.title.includes("Dashboard")) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      alert("Please log in first!");
      window.location.href = "index.html";
      return;
    }

    const user = JSON.parse(localStorage.getItem(currentUser));

    // Show welcome + user info
    document.getElementById("welcome").innerText = `Welcome, ${user.username}!`;
    document.getElementById("user-info").innerText = `Age: ${user.age}, Gender: ${user.gender}`;

    // Load logs + water
    displayLogs(user);
    displayWater(user);

    // Show random motivation
    showMotivation();

    // Generate initial workout
    generateWorkout();
  }
};

// ===== MOTIVATION =====
function showMotivation() {
  const quotes = [
    "Push harder than yesterday if you want a different tomorrow.",
    "Your body can stand almost anything. It’s your mind you have to convince.",
    "Success starts with self-discipline.",
    "Train insane or remain the same.",
    "Don’t wish for a good body, work for it!"
  ];
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("motivation").innerText = random;
}

// ===== FITNESS LOG =====
function addLog() {
  const exercise = document.getElementById("exercise").value.trim();
  const duration = document.getElementById("duration").value;

  if (!exercise || !duration) {
    alert("Enter exercise and duration!");
    return;
  }

  const currentUser = localStorage.getItem("currentUser");
  const user = JSON.parse(localStorage.getItem(currentUser));

  user.logs.push({ exercise, duration, date: todayKey() });
  localStorage.setItem(currentUser, JSON.stringify(user));

  document.getElementById("exercise").value = "";
  document.getElementById("duration").value = "";

  displayLogs(user);
}

function displayLogs(user) {
  const logsDiv = document.getElementById("logs");
  logsDiv.innerHTML = "";
  if (user.logs.length === 0) {
    logsDiv.innerHTML = "<p>No logs yet.</p>";
    return;
  }

  user.logs.slice(-5).forEach(log => {
    const p = document.createElement("p");
    p.innerText = `${log.date} - ${log.exercise} for ${log.duration} mins`;
    logsDiv.appendChild(p);
  });
}

// ===== BMI CALCULATOR =====
function calculateBMI() {
  const weight = document.getElementById("weight").value;
  const height = document.getElementById("height").value / 100;

  if (!weight || !height) {
    alert("Enter both weight and height!");
    return;
  }

  const bmi = (weight / (height * height)).toFixed(2);
  let status = "";
  let badgeClass = "";

  if (bmi < 18.5) { status = "Underweight"; badgeClass = "badge-warn"; }
  else if (bmi < 24.9) { status = "Healthy"; badgeClass = "badge-good"; }
  else if (bmi < 29.9) { status = "Overweight"; badgeClass = "badge-warn"; }
  else { status = "Obese"; badgeClass = "badge-risk"; }

  document.getElementById("bmi-result").innerHTML =
    `Your BMI is ${bmi} <span class="badge ${badgeClass}">${status}</span>`;
}

// ===== WATER TRACKER =====
function addWater() {
  const currentUser = localStorage.getItem("currentUser");
  const user = JSON.parse(localStorage.getItem(currentUser));
  const today = todayKey();

  if (!user.waterByDate[today]) user.waterByDate[today] = 0;
  user.waterByDate[today]++;

  localStorage.setItem(currentUser, JSON.stringify(user));
  displayWater(user);
}

function displayWater(user) {
  const today = todayKey();
  const glasses = user.waterByDate[today] || 0;
  document.getElementById("water-tracker").innerText = `Glasses Today: ${glasses}`;
}

// ===== WORKOUT GENERATOR =====
function generateWorkout() {
  const workouts = [
    "20 Pushups + 20 Squats",
    "15 Burpees + 30s Plank",
    "10 Lunges per leg + 25 Jumping Jacks",
    "3x30s Wall Sit + 10 Pushups",
    "5 min Jog + 20 Sit-ups"
  ];
  const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)];
  document.getElementById("workout").innerText = randomWorkout;
}
