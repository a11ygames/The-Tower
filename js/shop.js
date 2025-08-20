function buyItem(itemName) {
    if (itemName === "fist") {
      alert("You claimed the fist! Attack power increased.");
      
      // Optionally save this to localStorage for use in game
      localStorage.setItem("hasFist", "true");
    }
  }
  