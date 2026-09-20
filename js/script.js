const eventDate = new Date("2026-11-21T21:00:00-03:00");
const opening = document.getElementById("opening");
const enterButton = document.getElementById("enterButton");
const musicPlayer = document.getElementById("musicPlayer");
const musicButton = document.getElementById("musicButton");
const playerUrl = "https://www.youtube.com/embed/gl1aHhXnN1k?start=42&autoplay=1&enablejsapi=1&playsinline=1&rel=0";

let musicPlaying = false;
let musicCommandId = 0;

function sendPlayerCommand(func) {
  if (!musicPlayer.contentWindow) return;

  musicPlayer.contentWindow.postMessage(JSON.stringify({
    event: "command",
    func,
    args: []
  }), "*");
}

function setMusicState(isPlaying) {
  musicPlaying = isPlaying;
  musicButton.classList.toggle("playing", isPlaying);
  musicButton.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
  musicButton.setAttribute("aria-pressed", String(isPlaying));
  musicButton.textContent = isPlaying ? "Ⅱ" : "♫";
}

function queuePlayerCommand(func) {
  const commandId = ++musicCommandId;
  sendPlayerCommand(func);

  [300, 900, 1800].forEach(delay => {
    setTimeout(() => {
      if (commandId === musicCommandId) sendPlayerCommand(func);
    }, delay);
  });
}

function updateCountdown() {
  const distance = Math.max(0, eventDate - new Date());
  const values = [
    Math.floor(distance / 86400000),
    Math.floor(distance / 3600000) % 24,
    Math.floor(distance / 60000) % 60,
    Math.floor(distance / 1000) % 60
  ];
  const labels = ["DÍAS", "HORAS", "MINUTOS", "SEGUNDOS"];

  document.getElementById("countdown").innerHTML = values
    .map((value, index) => `<div><strong>${String(value).padStart(2, "0")}</strong>${labels[index]}</div>`)
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  setMusicState(false);

  enterButton.addEventListener("click", () => {
    opening.classList.add("hidden");
    document.body.classList.remove("is-locked");

    // enablejsapi=1 is required for the music button to control YouTube.
    musicPlayer.src = playerUrl;
    setMusicState(true);
    queuePlayerCommand("playVideo");
  });

  musicPlayer.addEventListener("load", () => {
    queuePlayerCommand(musicPlaying ? "playVideo" : "pauseVideo");
  });

  musicButton.addEventListener("click", () => {
    const shouldPlay = !musicPlaying;
    setMusicState(shouldPlay);
    queuePlayerCommand(shouldPlay ? "playVideo" : "pauseVideo");
  });

  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => observer.observe(element));
});
