const eventDate = new Date("2026-11-21T21:00:00-03:00");
const opening = document.getElementById("opening");
const enterButton = document.getElementById("enterButton");
const musicPlayer = document.getElementById("musicPlayer");

function sendPlayerCommand(func) {
  musicPlayer.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
}

function updateCountdown() {
  const distance = Math.max(0, eventDate - new Date());
  const values = [Math.floor(distance / 86400000), Math.floor(distance / 3600000) % 24, Math.floor(distance / 60000) % 60, Math.floor(distance / 1000) % 60];
  document.getElementById("countdown").innerHTML = values.map((value, index) => `<div><strong>${String(value).padStart(2, "0")}</strong>${["DÍAS", "HORAS", "MINUTOS", "SEGUNDOS"][index]}</div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCountdown(); setInterval(updateCountdown, 1000);
  enterButton.addEventListener("click", () => { opening.classList.add("hidden"); document.body.classList.remove("is-locked"); musicPlayer.src = "https://www.youtube.com/embed/gl1aHhXnN1k?start=42&autoplay=0&rel=0&playsinline=1&enablejsapi=1&origin=https%3A%2F%2Flatarjetadigital.com.ar&widgetid=1&forigin=https%3A%2F%2Flatarjetadigital.com.ar%2Fm15s-luchi%2F&aoriginsup=1&vf=1"; [500, 1200, 2500].forEach(delay => setTimeout(() => sendPlayerCommand("playVideo"), delay)); document.getElementById("musicButton").classList.add("playing"); document.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 90)); });
  document.getElementById("musicButton").addEventListener("click", event => { const isPlaying = event.currentTarget.classList.toggle("playing"); sendPlayerCommand(isPlaying ? "playVideo" : "pauseVideo"); });
});
