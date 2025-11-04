const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzRPDXX6Mx4datl3Du9cAULEsKGIsO2hWm-ieVvxo44RQEM7NOEOvNz3rB6KIWGRSnP/exec";

function registerUser(){
  const email = document.getElementById("email").value;
  fetch(`${BACKEND_URL}?action=register&email=${email}`)
  .then(res=>res.json())
  .then(data=>{
    alert(data.message);
    document.getElementById("userSection").style.display = "none";
    document.getElementById("postSection").style.display = "block";
  });
}

function createPost(){
  const email = document.getElementById("email").value;
  const platform = document.getElementById("platform").value;
  const message = document.getElementById("message").value;
  const media = document.getElementById("media").value;
  const schedule = document.getElementById("schedule").value;

  fetch(`${BACKEND_URL}?action=createPost`, {
    method: "POST",
    body: JSON.stringify({email, platform, message, media, schedule})
  })
  .then(res=>res.json())
  .then(data=>{
    alert(data.message);
    updateUsageStats(data.stats);
  });
}

function updateUsageStats(stats){
  document.getElementById("usageStats").innerHTML = 
    `📊 Posts used: ${stats.used}/${stats.limit}`;
}

function upgradeNow(){
  window.open("https://wa.me/YOUR_PHONE_NUMBER?text=Hi Henry, I want to upgrade my plan!", "_blank");
}
