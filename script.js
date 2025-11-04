// === SHOW FREE TRIAL FORM ===
function startFreeTrial() {
  document.querySelector('.plans').style.display = 'none';
  document.getElementById('trialSection').style.display = 'block';
}

// === UPGRADE NOW BUTTON ===
function upgradeNow() {
  // Replace this WhatsApp link with your real business number
  const whatsappNumber = "2348123456789"; // Example: +2348123456789
  const message = encodeURIComponent("Hello Henry, I want to upgrade my Social Auto-Poster plan.");
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}

// === SUBMIT EMAIL TO APPS SCRIPT (JSONP) ===
function registerUser() {
  const email = document.getElementById("email").value;
  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  const scriptURL = "https://script.google.com/macros/s/AKfycbyuUa6jxe2v5WOGpWICnz26b9prEO_187IsRmOa3c55Tc_C67FcKlQey_AOFPvaDcNa/exec"; // Replace with your Apps Script URL
  const callbackName = "handleResponse";

  // Remove old JSONP script if exists
  const oldScript = document.getElementById("jsonpScript");
  if (oldScript) oldScript.remove();

  // Create new script tag for JSONP request
  const script = document.createElement("script");
  script.src = `${scriptURL}?action=register&email=${encodeURIComponent(email)}&callback=${callbackName}`;
  script.id = "jsonpScript";
  document.body.appendChild(script);
}

// === HANDLE JSONP RESPONSE ===
function handleResponse(response) {
  alert(response.message);

  // Go back to main plans after registration
  document.querySelector('.plans').style.display = 'flex';
  document.getElementById('trialSection').style.display = 'none';
}
