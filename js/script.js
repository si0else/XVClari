const eventDate = new Date("2026-11-21T21:00:00-03:00");
const opening = document.getElementById("opening");
const enterButton = document.getElementById("enterButton");
const musicPlayer = document.getElementById("musicPlayer");
const musicButton = document.getElementById("musicButton");

let isPlaying = false; // Estado real de la música

function sendPlayerCommand(func) {
  musicPlayer.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
}

function startMusic() {
  musicPlayer.src = "https://www.youtube.com/embed/gl1aHhXnN1k?start=42&autoplay=1&rel=0&playsinline=1&enablejsapi=1&origin=https%3A%2F%2Flatarjetadigital.com.ar&widgetid=1&forigin=https%3A%2F%2Flatarjetadigital.com.ar%2Fm15s-luchi%2F&aoriginsup=1&vf=1";
}

function setMusicState(state) {
  isPlaying = state;
  musicButton.classList.toggle("playing", isPlaying);
  musicButton.textContent = isPlaying ? "Ⅱ" : "♫";
  musicButton.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
}

function updateCountdown() {
  const distance = Math.max(0, eventDate - new Date());
  const values = [Math.floor(distance / 86400000), Math.floor(distance / 3600000) % 24, Math.floor(distance / 60000) % 60, Math.floor(distance / 1000) % 60];
  document.getElementById("countdown").innerHTML = values.map((value, index) => `<div><strong>${String(value).padStart(2, "0")}</strong>${["DÍAS", "HORAS", "MINUTOS", "SEGUNDOS"][index]}</div>`).join("");
}

// Escuchar los eventos que manda el iframe de YouTube para sincronizar el estado real
window.addEventListener("message", (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.event === "onStateChange") {
      // 1 = Reproduciendo, 2 = Pausado
      if (data.info === 1) {
        setMusicState(true);
      } else if (data.info === 2 || data.info === 0) {
        setMusicState(false);
      }
    }
  } catch (e) {}
});

document.addEventListener("DOMContentLoaded", () => {
  updateCountdown(); 
  setInterval(updateCountdown, 1000);
  
  enterButton.addEventListener("click", () => { 
    opening.classList.add("hidden"); 
    document.body.classList.remove("is-locked"); 
    startMusic(); 
    document.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 90)); 
  });
  
  musicButton.addEventListener("click", () => { 
    if (isPlaying) {
      sendPlayerCommand("pauseVideo");
    } else {
      sendPlayerCommand("playVideo");
    }
  });
});
