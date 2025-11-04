function registerUser() {
  const email = document.getElementById("email").value;
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  const scriptURL = "https://script.google.com/macros/s/AKfycbyuUa6jxe2v5WOGpWICnz26b9prEO_187IsRmOa3c55Tc_C67FcKlQey_AOFPvaDcNa/exec"; // Apps Script URL
  const callbackName = "handleResponse";

  // Remove any old JSONP script
  const oldScript = document.getElementById("jsonpScript");
  if (oldScript) oldScript.remove();

  // Create new script tag
  const script = document.createElement("script");
  script.src = `${scriptURL}?action=register&email=${encodeURIComponent(email)}&callback=${callbackName}`;
  script.id = "jsonpScript";
  document.body.appendChild(script);
}

// JSONP callback
function handleResponse(response) {
  alert(response.message);
  
  // Optional: show post creation section after free trial starts
  document.getElementById("userSection").style.display = "none";
  document.getElementById("postSection").style.display = "block";
}
