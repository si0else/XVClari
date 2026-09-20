const eventDate = new Date("2026-11-21T21:00:00-03:00");
const opening = document.getElementById("opening");
const enterButton = document.getElementById("enterButton");
const musicPlayer = document.getElementById("musicPlayer");
const musicButton = document.getElementById("musicButton");

function sendPlayerCommand(func) {
  musicPlayer.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
}

function setMusicState(isPlaying) {
  musicButton.classList.toggle("playing", isPlaying);
  musicButton.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
  musicButton.textContent = isPlaying ? "Ⅱ" : "♫";
}

function queuePlayerCommand(func) {
  sendPlayerCommand(func);
  [300, 900, 1800].forEach(delay => setTimeout(() => sendPlayerCommand(func), delay));
}

function updateCountdown() {
  const distance = Math.max(0, eventDate - new Date());
  const values = [Math.floor(distance / 86400000), Math.floor(distance / 3600000) % 24, Math.floor(distance / 60000) % 60, Math.floor(distance / 1000) % 60];
  document.getElementById("countdown").innerHTML = values.map((value, index) => `<div><strong>${String(value).padStart(2, "0")}</strong>${["DÍAS", "HORAS", "MINUTOS", "SEGUNDOS"][index]}</div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCountdown(); setInterval(updateCountdown, 1000);
  enterButton.addEventListener("click", () => { opening.classList.add("hidden"); document.body.classList.remove("is-locked"); musicPlayer.src = "https://www.youtube.com/embed/gl1aHhXnN1k?start=42&autoplay=1&rel=0&playsinline=1&enablejsapi=1&origin=https%3A%2F%2Flatarjetadigital.com.ar&widgetid=1&forigin=https%3A%2F%2Flatarjetadigital.com.ar%2Fm15s-luchi%2F&aoriginsup=1&vf=1"; setMusicState(true); queuePlayerCommand("playVideo"); document.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 90)); });
  musicButton.addEventListener("click", () => { const shouldPlay = !musicButton.classList.contains("playing"); setMusicState(shouldPlay); queuePlayerCommand(shouldPlay ? "playVideo" : "pauseVideo"); });
});
