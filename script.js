function registerUser() {
  const email = document.getElementById("email").value;
  const scriptURL = "YOUR_DEPLOYED_WEBAPP_URL_HERE";
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
