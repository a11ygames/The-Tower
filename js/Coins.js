// Coin system
function getCoins() {
    return parseInt(localStorage.getItem("coins") || "0");
  }
  
  function setCoins(amount) {
    localStorage.setItem("coins", amount);
    updateCoinDisplay();
  }
  
  function addCoins(amount) {
    const current = getCoins();
    setCoins(current + amount);
  }
  
  function updateCoinDisplay() {
    const coinElements = document.querySelectorAll(".coin-display");
    coinElements.forEach(el => el.innerText = `Coins: ${getCoins()}`);
  }
  