const eventDate = new Date("2026-11-21T21:00:00-03:00");
const opening = document.getElementById("opening");
const enterButton = document.getElementById("enterButton");
const musicPlayer = document.getElementById("musicPlayer");
const musicButton = document.getElementById("musicButton");

let isPlaying = false; 

function sendPlayerCommand(func, args = []) {
  musicPlayer.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: args }), "*");
}

function startMusic() {
  const currentOrigin = window.location.origin;
  const videoId = "gl1aHhXnN1k";
  
  // Construimos la URL con el ORIGIN correcto y el LOOP habilitado
  // Nota: Para que el loop funcione en YouTube iframe, se requiere loop=1 y playlist=VIDEO_ID
  const newSrc = `https://www.youtube.com/embed/${videoId}?start=42&autoplay=1&rel=0&playsinline=1&enablejsapi=1&loop=1&playlist=${videoId}&origin=${encodeURIComponent(currentOrigin)}`;
  
  musicPlayer.src = newSrc;
  setMusicState(true);
}

function setMusicState(state) {
  isPlaying = state;
  musicButton.classList.toggle("playing", isPlaying);
  // Usamos el icono que prefieras, he mantenido los tuyos
  musicButton.textContent = isPlaying ? "Ⅱ" : "♫";
  musicButton.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
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
  
  const countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    countdownEl.innerHTML = values.map((value, index) => 
      `<div><strong>${String(value).padStart(2, "0")}</strong>${labels[index]}</div>`
    ).join("");
  }
}

// Sincronización con la API de YouTube
window.addEventListener("message", (event) => {
  try {
    const data = JSON.parse(event.data);
    // YouTube envía estados: 1 (playing), 2 (paused), 0 (ended)
    if (data.event === "onStateChange") {
      if (data.info === 1) {
        setMusicState(true);
      } else if (data.info === 2 || data.info === 0) {
        setMusicState(false);
      }
    }
  } catch (e) {
    // Silencioso para otros mensajes
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateCountdown(); 
  setInterval(updateCountdown, 1000);
  
  if (enterButton) {
    enterButton.addEventListener("click", () => { 
      opening.classList.add("hidden"); 
      document.body.classList.remove("is-locked"); 
      startMusic(); 
      
      // Pequeño delay para asegurar que el comando unMute entre después de cargar
      setTimeout(() => {
          sendPlayerCommand("unMute");
          sendPlayerCommand("setVolume", [100]);
      }, 1000);

      document.querySelectorAll(".reveal").forEach((el, i) => 
        setTimeout(() => el.classList.add("visible"), i * 90)
      ); 
    });
  }
  
  if (musicButton) {
    musicButton.addEventListener("click", () => { 
      if (isPlaying) {
        sendPlayerCommand("pauseVideo");
        setMusicState(false); // Forzamos estado visual
      } else {
        sendPlayerCommand("playVideo");
        sendPlayerCommand("unMute");
        setMusicState(true); // Forzamos estado visual
      }
    });
  }
});
