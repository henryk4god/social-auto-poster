// Replace this with your Apps Script Web App URL
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzRPDXX6Mx4datl3Du9cAULEsKGIsO2hWm-ieVvxo44RQEM7NOEOvNz3rB6KIWGRSnP/exec";

function startFreeTrial() {
  document.getElementById("trialSection").style.display = "block";
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function registerUser() {
  const email = document.getElementById("email").value.trim();
  if(!email) return alert("Please enter your email.");
  
  fetch(`${BACKEND_URL}?action=register&email=${encodeURIComponent(email)}`)
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Trial started successfully!");
      document.getElementById("trialSection").style.display = "none";
    })
    .catch(err => {
      console.error(err);
      alert("Failed to connect to backend. Please check your Apps Script URL.");
    });
}

function upgradeNow() {
  window.open("https://wa.me/YOUR_PHONE_NUMBER?text=Hi Henry, I want to upgrade my plan!", "_blank");
}
