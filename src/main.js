import './style.css'
// const APP_URL = import.meta.env.VITE_APP_URL;
const APP_URL = 'http://localhost:5173'

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("accessToken") !== null) {
    // window.location.href = "dashboard/dashboard.html";
    window.location.href = `${APP_URL}/dashboard/dashboard.html`;
  } else {
    // window.location.href = "login/login.html";
    window.location.href = `${APP_URL}/login/login.html`;
  }
})

