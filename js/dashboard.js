document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Clock
  initClock();



});

function initClock() {
  const timeElement = document.getElementById('current-time');
  if (!timeElement) return;

  const updateClock = () => {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();
    timeElement.textContent = `${date}, ${time}`;
  };

  updateClock();
  setInterval(updateClock, 1000);
}




