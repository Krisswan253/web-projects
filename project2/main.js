function setThemeByHour(hours){
  // Day: 6:00–17:59, Night: 18:00–5:59
  const isDay = hours >= 6 && hours < 18;
  // const isDay = false;
  document.body.classList.toggle('theme-day', isDay);
  document.body.classList.toggle('theme-night', !isDay);
}

function updateClock(){
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  let displayHour = h % 12; if (displayHour === 0) displayHour = 12;

  document.getElementById("timeText").textContent =
    `${String(displayHour).padStart(2, "0")}:${m}:${s}`;
  document.getElementById("ampmText").textContent = ampm;

  setThemeByHour(h);
}


updateClock();
setInterval(updateClock, 1000);
document.addEventListener('DOMContentLoaded', () => setThemeByHour(new Date().getHours()));
