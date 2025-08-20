document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("game-container");
  const player = document.getElementById("player");
  const enemy1 = document.getElementById("enemy-level1"); // Original enemy
  const healthBar = document.getElementById("health-bar");
  const doorway = document.getElementById("doorway");

  // Player variables
  let playerX = 100;
  let playerY = 480;
  const playerSpeed = 5;

  // Load coins from localStorage or start at 0
  let playerCoins = parseInt(localStorage.getItem("playerCoins") || "0", 10);

  // Create and add coin display element dynamically
  let coinDisplay = document.createElement("div");
  coinDisplay.id = "coin-display";
  coinDisplay.style.color = "gold";
  coinDisplay.style.fontWeight = "bold";
  coinDisplay.style.fontSize = "18px";
  coinDisplay.style.position = "absolute";
  coinDisplay.style.top = "10px";
  coinDisplay.style.right = "20px";
  coinDisplay.textContent = "Coins: " + playerCoins;
  container.appendChild(coinDisplay);

  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
    j: false,
  };

  // Enemy 1 variables (original enemy)
  let enemy1X = 300;
  let enemy1Y = 300;
  let enemy1Speed = 1.5;
  let enemy1Health = 50;

  // Health variables
  let playerHealth = 100;
  let lastDamageTime = 0;

  // Track if all enemies defeated
  let allEnemiesDefeated = false;

  // Key event listeners
  document.addEventListener("keydown", (e) => {
    if (e.key in keys) keys[e.key] = true;
  });

  document.addEventListener("keyup", (e) => {
    if (e.key in keys) keys[e.key] = false;
    console.log("key pressed", e.key);
  });

  function isColliding(rect1, rect2) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  function updateHealthBar() {
    const healthPercent = Math.max(0, Math.min(playerHealth, 100));
    healthBar.style.width = healthPercent + "%";

    if (healthPercent > 60) {
      healthBar.style.backgroundColor = "#4caf50"; // green
    } else if (healthPercent > 30) {
      healthBar.style.backgroundColor = "#ff9800"; // orange
    } else {
      healthBar.style.backgroundColor = "#f44336"; // red
    }

    if (playerHealth <= 0) {
      window.location.href = "you-died.html";
    }
  }

  // Update coin display text and save coins
  function updateCoinDisplay() {
    coinDisplay.textContent = "Coins: " + playerCoins;
    localStorage.setItem("playerCoins", playerCoins);
  }

  function checkAllEnemiesDefeated() {
    if (enemy1Health <= 0) {
      allEnemiesDefeated = true;
      if (doorway) {
        doorway.style.display = "block";
      }
    }
  }

  function checkPlayerDoorCollision() {
    if (!allEnemiesDefeated) return;

    const playerRect = player.getBoundingClientRect();
    const doorRect = doorway.getBoundingClientRect();

    if (isColliding(playerRect, doorRect)) {
      // Transition to next level
      window.location.href = "game-level-2.html"; // Update to next level file
      console.log("Loading next level...");
    }
  }

  function handleEnemy(enemy, enemyX, enemyY, enemySpeed, enemyHealth) {
    // Enemy follows player
    const dx = playerX - enemyX;
    const dy = playerY - enemyY;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const normX = dx / distance;
    const normY = dy / distance;

    enemyX += normX * enemySpeed;
    enemyY += normY * enemySpeed;

    enemy.style.left = enemyX + "px";
    enemy.style.top = enemyY + "px";

    // Attack with J key: close range punch with knockback
    if (keys.j && distance <= 50) {
      enemyHealth = Math.max(0, enemyHealth - 10);

      // Knockback direction (away from player)
      enemyX += normX * 90;
      enemyY += normY * 90;

      enemy.style.left = enemyX + "px";
      enemy.style.top = enemyY + "px";

      console.log("Enemy punched! Health:", enemyHealth);

      // Prevent continuous punching by resetting the key state
      keys.j = false;
    }

    return { enemyX, enemyY, enemyHealth };
  }

  function gameLoop() {
    // Player movement
    if (keys.ArrowUp || keys.w) playerY -= playerSpeed;
    if (keys.ArrowDown || keys.s) playerY += playerSpeed;
    if (keys.ArrowLeft || keys.a) playerX -= playerSpeed;
    if (keys.ArrowRight || keys.d) playerX += playerSpeed;

    // Clamp player inside container
    const maxX = container.clientWidth - player.clientWidth;
    const maxY = container.clientHeight - player.clientHeight;
    playerX = Math.max(0, Math.min(playerX, maxX));
    playerY = Math.max(0, Math.min(playerY, maxY));

    // Apply player position
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    // Handle enemy 1 if alive
    if (enemy1Health > 0) {
      const result = handleEnemy(enemy1, enemy1X, enemy1Y, enemy1Speed, enemy1Health);
      enemy1X = result.enemyX;
      enemy1Y = result.enemyY;
      enemy1Health = result.enemyHealth;

      if (enemy1Health <= 0) {
        enemy1.style.display = "none";
        console.log("Enemy 1 defeated!");

        // Reward player with coins for defeating enemy
        playerCoins += 10;  // Adjust coin amount as you like
        updateCoinDisplay();
        console.log("Player Now has", playerCoins, "coins")
        checkAllEnemiesDefeated();
      }

      // Collision damage to player from enemy1
      const playerRect = player.getBoundingClientRect();
      const enemy1Rect = enemy1.getBoundingClientRect();

      const now = Date.now();
      if (isColliding(playerRect, enemy1Rect) && now - lastDamageTime > 1000) {
        playerHealth = Math.max(0, playerHealth - 10);
        lastDamageTime = now;
        updateHealthBar();
        console.log("Player hit by enemy 1! Health:", playerHealth);

        // Knockback
        const dx = playerX - enemy1X;
        const dy = playerY - enemy1Y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const normX = dx / dist;
        const normY = dy / dist;

        playerX += normX * 70;
        playerY += normY * 70;

        playerX = Math.max(0, Math.min(playerX, maxX));
        playerY = Math.max(0, Math.min(playerY, maxY));

        player.style.left = playerX + "px";
        player.style.top = playerY + "px";
      }
    } else {
      enemy1.style.display = "none";
    }

    // Check if player touches doorway to go to next level
    if (allEnemiesDefeated && doorway) {
      checkPlayerDoorCollision();
    }

    requestAnimationFrame(gameLoop);
  }

  updateHealthBar();
  updateCoinDisplay();  // Show coins on load
  requestAnimationFrame(gameLoop);
});
