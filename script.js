const screens = [...document.querySelectorAll(".screen")];
let selected = { choice: "", image: "assets/disneyland.jpg", theme: "disney" };

// After deploying the Google Apps Script web app, paste its URL ending in /exec here.
// Example: https://script.google.com/macros/s/DEPLOYMENT_ID/exec
const NOTIFY_ENDPOINT = "https://script.google.com/macros/s/AKfycbwqxPZYO9QUnm5hl8jCQYaOFK7qQM0narN09qA3WdwKRLdO7T-DGhNJZ-Q6OkFWN9Bg/exec";

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function sendSelectionNotification(choice) {
  // Notifications stay disabled until an Apps Script URL is configured.
  if (!NOTIFY_ENDPOINT || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(NOTIFY_ENDPOINT)) {
    return;
  }

  const payload = {
    choice,
    occurredAt: new Date().toISOString(),
    source: "anniversary-invitation"
  };

  // Apps Script ContentService redirects its response; no-cors is used because
  // this page is a static site on a different origin. Delivery must be verified
  // by checking the recipient inbox (the browser cannot read the response).
  fetch(NOTIFY_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(error => console.warn("通知リクエストを送信できませんでした。", error));
}

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.go));
});

document.querySelectorAll("[data-choice]").forEach(button => {
  button.addEventListener("click", () => {
    selected = {
      choice: button.dataset.choice,
      image: button.dataset.image,
      theme: button.dataset.theme
    };
    document.getElementById("ticketChoice").textContent = selected.choice;
    document.getElementById("ticketImage").src = selected.image;
    document.getElementById("ticketImage").alt = selected.choice + "のイメージ";
    document.getElementById("resultPhoto").style.backgroundImage = `url("${selected.image}")`;
    showScreen("result");
    sendSelectionNotification(selected.choice);
  });
});
