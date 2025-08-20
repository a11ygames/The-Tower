window.addEventListener("DOMContentLoaded", () => {
    const screenSize = localStorage.getItem("screenSize");
    const container = document.getElementById("game-container");
    const doorway = document.getElementById("doorway");
  
    if (!container || !screenSize) return;
  
    let size = {
      width: 1900,
      height: 899,
      doorway: { left: 1600, top: 400, width: 100, height: 100 }
    };
  
    switch (screenSize) {
      case "laptop":
        size = {
          width: 1280,
          height: 590,
          doorway: { left: 1078, top: 320, width: 67, height: 80 }
        };
        break;
      case "tablet":
        size = {
          width: 1024,
          height: 768,
          doorway: { left: 862, top: 341, width: 54, height: 85 }
        };
        break;
      case "pc":
      default:
        // Already set as default
        break;
    }
  
    container.style.width = `${size.width}px`;
    container.style.height = `${size.height}px`;
  
    if (doorway) {
      doorway.style.left = `${size.doorway.left}px`;
      doorway.style.top = `${size.doorway.top}px`;
      doorway.style.width = `${size.doorway.width}px`;
      doorway.style.height = `${size.doorway.height}px`;
    }
  
    console.log("Resizing screen to:", screenSize);
  });
  