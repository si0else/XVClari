const eventDate = new Date("2026-11-21T21:00:00-03:00");
const opening = document.getElementById("opening");
const enterButton = document.getElementById("enterButton");
function updateCountdown() {
  const distance = Math.max(0, eventDate - new Date());
  const values = [Math.floor(distance / 86400000), Math.floor(distance / 3600000) % 24, Math.floor(distance / 60000) % 60, Math.floor(distance / 1000) % 60];
  document.getElementById("countdown").innerHTML = values.map((value, index) => `<div><strong>${String(value).padStart(2, "0")}</strong>${["DÍAS", "HORAS", "MINUTOS", "SEGUNDOS"][index]}</div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCountdown(); setInterval(updateCountdown, 1000);
  enterButton.addEventListener("click", () => { opening.classList.add("hidden"); document.body.classList.remove("is-locked"); document.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 90)); });
});
