function registerUser() {
  const email = document.getElementById("email").value;
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  const scriptURL = "https://script.google.com/macros/s/AKfycbwVyx6HptgpLZn3epitjc6-2_VnxQ2uCkB95LFxhGQe4YkW3sWhsu-NFMO-6G8hxCCE/exec"; // <-- replace with new URL
  const callbackName = "handleResponse";

  // Remove old JSONP script
  const oldScript = document.getElementById("jsonpScript");
  if (oldScript) oldScript.remove();

  // Create new script tag for JSONP
  const script = document.createElement("script");
  script.src = `${scriptURL}?action=register&email=${encodeURIComponent(email)}&callback=${callbackName}`;
  script.id = "jsonpScript";
  document.body.appendChild(script);
}

// JSONP callback
function handleResponse(response) {
  alert(response.message);
  // Optionally hide form or redirect
  document.getElementById('trialSection').style.display = 'none';
  document.querySelector('.plans').style.display = 'flex';
}
