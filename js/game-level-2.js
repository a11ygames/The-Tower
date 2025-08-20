document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("game-container");
  const player = document.getElementById("player");
  const enemyLevel2 = document.getElementById("enemy-level2");
  const enemyLevel1 = document.getElementById("enemy-level1");
  const healthBar = document.getElementById("health-bar");
  const doorway = document.getElementById("doorway");

  // Player variables
  let playerX = 100;
  let playerY = 480;
  const playerSpeed = 5;
  let playerCoins = 0;


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

  // Enemy level 2 variables
  let enemy2X = 300;
  let enemy2Y = 300;
  const enemy2Speed = 1.5;
  let enemy2Health = 50;
  let enemy2Defeated = false;

  // Enemy level 1 variables
  let enemy1X = 500;
  let enemy1Y = 200;
  const enemy1Speed = 1;
  let enemy1Health = 50;
  let enemy1Defeated = false;

  // Player health
  let playerHealth = 100;
  let lastDamageTime = 0;

  // Key listeners
  document.addEventListener("keydown", (e) => {
    if (e.key in keys) keys[e.key] = true;
  });

  document.addEventListener("keyup", (e) => {
    if (e.key in keys) keys[e.key] = false;
  });

  // Collision detection helper
  function isColliding(rect1, rect2) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  // Update player health bar
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

  // Enemy behavior: follows player, attacks, takes damage
  function handleEnemy(enemyElem, enemyX, enemyY, enemySpeed, enemyHealth, enemyDefeatedFlag) {
    if (enemyHealth > 0) {
      // Follow player
      const dx = playerX - enemyX;
      const dy = playerY - enemyY;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const normX = dx / distance;
      const normY = dy / distance;

      enemyX += normX * enemySpeed;
      enemyY += normY * enemySpeed;

      enemyElem.style.left = enemyX + "px";
      enemyElem.style.top = enemyY + "px";

      // Player attacks enemy with 'j' key if close
      if (keys.j && distance <= 50) {
        enemyHealth = Math.max(0, enemyHealth - 10);

        // Knockback enemy
        enemyX += normX * 90;
        enemyY += normY * 90;
        enemyElem.style.left = enemyX + "px";
        enemyElem.style.top = enemyY + "px";

        keys.j = false; // single punch per key press

        if (enemyHealth <= 0 && !enemyDefeatedFlag) {
          enemyElem.style.display = "none";
          enemyDefeatedFlag = true;
          console.log("Enemy defeated!");
        }
      }

      // Enemy damages player on collision, cooldown 1 sec
      const playerRect = player.getBoundingClientRect();
      const enemyRect = enemyElem.getBoundingClientRect();
      const now = Date.now();

      if (isColliding(playerRect, enemyRect) && now - lastDamageTime > 1000) {
        playerHealth = Math.max(0, playerHealth - 10);
        lastDamageTime = now;
        updateHealthBar();
        console.log("Player hit! Health:", playerHealth);

        // Knockback player
        playerX -= normX * 70;
        playerY -= normY * 70;

        // Clamp player inside container
        const maxX = container.clientWidth - player.clientWidth;
        const maxY = container.clientHeight - player.clientHeight;
        playerX = Math.max(0, Math.min(playerX, maxX));
        playerY = Math.max(0, Math.min(playerY, maxY));

        player.style.left = playerX + "px";
        player.style.top = playerY + "px";
      }
    }

    // Return updated enemy data
    return { enemyX, enemyY, enemyHealth, enemyDefeatedFlag };
  }

  // Check collision with doorway if enemies defeated
  function checkPlayerDoorCollision() {
    if (!(enemy1Defeated && enemy2Defeated)) return;

    const playerRect = player.getBoundingClientRect();
    const doorRect = doorway.getBoundingClientRect();

    if (isColliding(playerRect, doorRect)) {
      console.log("Loading next level...");
      window.location.href = "game-level-3.html"; // Update to your next level URL
    }
  }

  // Main game loop
  function gameLoop() {
    // Move player with keys
    if (keys.ArrowUp || keys.w) playerY -= playerSpeed;
    if (keys.ArrowDown || keys.s) playerY += playerSpeed;
    if (keys.ArrowLeft || keys.a) playerX -= playerSpeed;
    if (keys.ArrowRight || keys.d) playerX += playerSpeed;

    // Clamp player position
    const maxX = container.clientWidth - player.clientWidth;
    const maxY = container.clientHeight - player.clientHeight;
    playerX = Math.max(0, Math.min(playerX, maxX));
    playerY = Math.max(0, Math.min(playerY, maxY));

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    // Update enemies
    let res;

    res = handleEnemy(enemyLevel2, enemy2X, enemy2Y, enemy2Speed, enemy2Health, enemy2Defeated);
    enemy2X = res.enemyX;
    enemy2Y = res.enemyY;
    enemy2Health = res.enemyHealth;
    enemy2Defeated = res.enemyDefeatedFlag;

    res = handleEnemy(enemyLevel1, enemy1X, enemy1Y, enemy1Speed, enemy1Health, enemy1Defeated);
    enemy1X = res.enemyX;
    enemy1Y = res.enemyY;
    enemy1Health = res.enemyHealth;
    enemy1Defeated = res.enemyDefeatedFlag;

    // Show doorway if both enemies defeated
    if (enemy1Defeated && enemy2Defeated && doorway.style.display === "none") {
      doorway.style.display = "block";
    }

    // Check for player-door collision
    if (doorway.style.display === "block") {
      checkPlayerDoorCollision();
    }

    requestAnimationFrame(gameLoop);
  }

  updateHealthBar();
  requestAnimationFrame(gameLoop);
});
