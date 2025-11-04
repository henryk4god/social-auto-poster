function registerUser() {
  const email = document.getElementById("email").value;
  const scriptURL = "https://script.google.com/macros/s/AKfycbyuUa6jxe2v5WOGpWICnz26b9prEO_187IsRmOa3c55Tc_C67FcKlQey_AOFPvaDcNa/exec";
  const callbackName = "handleResponse";

  // Remove old script if exists
  const oldScript = document.getElementById("jsonpScript");
  if (oldScript) oldScript.remove();

  // Create new script tag
  const script = document.createElement("script");
  script.src = `${scriptURL}?action=register&email=${encodeURIComponent(email)}&callback=${callbackName}`;
  script.id = "jsonpScript";
  document.body.appendChild(script);
}

// JSONP callback function
function handleResponse(response) {
  alert(response.message);
}
