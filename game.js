// =========================
// IMAGE ASSETS
// =========================

const logoImg = new Image();
logoImg.src = "assets/logo.png";

const playerImg = new Image();
playerImg.src = "assets/player.png";

const coinImg = new Image();
coinImg.src = "assets/coin.png";

const fiveCoinImg = new Image();
fiveCoinImg.src = "assets/fivecoin.png";

const binanceCoinImg = new Image();
binanceCoinImg.src = "assets/binancecoin.png";

const superchargeImg = new Image();
superchargeImg.src = "assets/supercharge.png";

const punkImg = new Image();
punkImg.src = "assets/punk.png";

const obstacleImages = [];
const obstacleAssetNumbers = [1, 2, 3, 4, 5, 7, 8, 9];

obstacleAssetNumbers.forEach(num => {
  const img = new Image();
  img.src = `assets/obstacle${num}.png`;
  obstacleImages.push(img);
});


// =========================
// SOUND ASSETS
// =========================

const coinSound = new Audio("assets/coin.mp3");
coinSound.volume = 0.4;

const jumpSound = new Audio("assets/jump.mp3");
jumpSound.volume = 0.5;

const crashSound = new Audio("assets/crash.mp3");
crashSound.volume = 0.6;

const superchargeSound = new Audio("assets/supercharge.mp3");
superchargeSound.volume = 0.6;

const levelUpSound = new Audio("assets/levelup.mp3");
levelUpSound.volume = 0.6;

const footstepSound = new Audio("assets/footsteps.mp3");
footstepSound.loop = true;
footstepSound.volume = 0.2;

const music = new Audio("assets/music.mp3");
music.loop = true;
music.volume = 0.22;

const menuMusic = new Audio("assets/menu-music.mp3");
menuMusic.loop = true;
menuMusic.volume = 0.35;

let musicStarted = false;
let menuMusicStarted = false;


// =========================
// CANVAS
// =========================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const BASE_WIDTH = 800;
const BASE_HEIGHT = 360;

function resizeCanvas() {
  const aspectRatio = BASE_WIDTH / BASE_HEIGHT;

  let newWidth = window.innerWidth;
  let newHeight = window.innerHeight;

  if (newWidth / newHeight > aspectRatio) {
    newWidth = newHeight * aspectRatio;
  } else {
    newHeight = newWidth / aspectRatio;
  }

  canvas.width = BASE_WIDTH;
  canvas.height = BASE_HEIGHT;

  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
  canvas.style.position = "fixed";
  canvas.style.left = "50%";
  canvas.style.top = "50%";
  canvas.style.transform = "translate(-50%, -50%)";

  ctx.imageSmoothingEnabled = false;
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);

resizeCanvas();


// =========================
// START MENU DOM OVERLAY
// =========================

let gameStarted = false;
let showHtmlLeaderboard = false;

function startMenuMusic() {
  if (!menuMusicStarted) {
    menuMusic.play().catch(() => {});
    menuMusicStarted = true;
  }
}

function stopMenuMusic() {
  menuMusic.pause();
  menuMusic.currentTime = 0;
  menuMusicStarted = false;
}

function injectStartMenuStyles() {
  const style = document.createElement("style");

  style.textContent = `
    * {
      box-sizing: border-box;
    }

    html,
    body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #050014;
      margin: 0;
      padding: 0;
      touch-action: manipulation;
    }

    #startMenuOverlay {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #050014;
      z-index: 9999;
    }

    #startMenuOverlay.hidden {
      display: none;
    }

    .menu-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      z-index: 1;
      user-select: none;
      -webkit-user-drag: none;
      pointer-events: none;
    }

    .menu-content {
      position: relative;
      z-index: 2;
      width: min(90vw, 760px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: translateY(-2vh);
      gap: 4px;
      pointer-events: auto;
    }

    .unicorn-placeholder {
      width: clamp(130px, 13vw, 170px);
      height: auto;
      margin-bottom: -150;
      filter: drop-shadow(0 0 22px #ff2bd6);
      animation: floatLogo 2.2s ease-in-out infinite;
      user-select: none;
      -webkit-user-drag: none;
      pointer-events: none;
    }

    .menu-title {
      width: clamp(300px, 30vw, 420px);
      height: auto;
      filter: drop-shadow(0 0 14px #ff2bd6);
      margin-bottom: -150px;
      user-select: none;
      -webkit-user-drag: none;
      pointer-events: none;
    }

    .press-start {
      width: clamp(150px, 14vw, 210px);
      height: auto;
      margin-bottom: -150px;
      animation: pulseText 1.1s ease-in-out infinite;
      filter: drop-shadow(0 0 8px #ffffff);
      cursor: pointer;
      user-select: none;
      -webkit-user-drag: none;
      transform-origin: center;
      transition: transform 0.12s ease, filter 0.12s ease;
      pointer-events: auto;
      touch-action: manipulation;
    }

    .press-start:hover {
      transform: scale(1.04);
      filter: brightness(1.2) drop-shadow(0 0 10px #ffffff);
    }

    .menu-button {
      width: clamp(260px, 25vw, 370px);
      height: auto;
      cursor: pointer;
      user-select: none;
      -webkit-user-drag: none;
      transform-origin: center;
      transition: transform 0.12s ease, filter 0.12s ease;
      pointer-events: auto;
      touch-action: manipulation;
    }

    .menu-button:hover {
      transform: scale(1.035);
      filter: brightness(1.15);
    }

    .menu-button:active {
      transform: scale(0.98);
    }

    .play-button {
      margin-bottom: -150px;
    }

    .leaderboard-button {
      margin-top: 0;
      margin-bottom: 0;
    }

    .leaderboard-panel-html {
      display: none;
      margin-top: -40px;
      width: min(90vw, 620px);
      background: rgba(0,0,0,0.78);
      border: 3px solid #00ffff;
      box-shadow: 0 0 18px #00ffff;
      padding: 20px;
      color: white;
      font-family: 'Press Start 2P', monospace;
      text-align: center;
      font-size: 11px;
    }

    .leaderboard-panel-html.active {
      display: block;
    }

    .leaderboard-panel-html h2 {
      font-size: 15px;
      margin-bottom: 10px;
    }

    .leaderboard-row-html {
      display: grid;
      grid-template-columns: 60px 1fr 90px;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(0,255,255,0.2);
    }

    @keyframes floatLogo {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes pulseText {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.55; transform: scale(1.03); }
    }

    @media (max-width: 600px) {
      #startMenuOverlay {
        align-items: flex-start;
        padding-top: 14vh;
      }

      .menu-content {
        width: 94vw;
        transform: translateY(0);
        gap: 8px;
      }

      .unicorn-placeholder {
        width: 90px;
        margin-bottom: 4px;
      }

      .menu-title {
        width: 310px;
        max-width: 82vw;
        margin-bottom: 8px;
      }

      .press-start {
        width: 190px;
        max-width: 56vw;
        margin-bottom: 14px;
      }

      .menu-button {
        width: 300px;
        max-width: 86vw;
        pointer-events: auto;
        touch-action: manipulation;
      }

      .play-button {
        margin-bottom: 12px;
      }

      .leaderboard-button {
        margin-top: 0;
      }

      .leaderboard-panel-html {
        margin-top: 8px;
        width: 86vw;
        max-height: 240px;
        overflow-y: auto;
        font-size: 9px;
      }

      .leaderboard-panel-html h2 {
        font-size: 11px;
      }

      .leaderboard-row-html {
        grid-template-columns: 40px 1fr 60px;
        font-size: 8px;
      }
    }
  `;

  document.head.appendChild(style);
}

function renderHtmlLeaderboard() {
  const panel = document.getElementById("htmlLeaderboardPanel");
  if (!panel) return;

  const savedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  if (savedLeaderboard.length === 0) {
    panel.innerHTML = `
      <h2>GLOBAL LEADERBOARD</h2>
      <div>NO SCORES YET</div>
    `;
    return;
  }

  let rows = "";

  savedLeaderboard.slice(0, 5).forEach((entry, index) => {
    rows += `
      <div class="leaderboard-row-html">
        <span>#${index + 1}</span>
        <span>${entry.handle || "player.com"}</span>
        <span>${entry.score || 0}</span>
      </div>
    `;
  });

  panel.innerHTML = `
    <h2>GLOBAL LEADERBOARD</h2>
    ${rows}
  `;
}

function createStartMenuOverlay() {
  injectStartMenuStyles();

  const overlay = document.createElement("main");
  overlay.id = "startMenuOverlay";

  overlay.innerHTML = `
    <img class="menu-bg" src="assets/menu-bg.png" alt="uniRUN background" />

    <section class="menu-content">
      <img class="unicorn-placeholder" src="assets/logo.png" alt="Logo" />
      <img class="menu-title" src="assets/menu-title.png" alt="uniRUN" />
      <img id="pressStartBtn" class="press-start" src="assets/menu-press-start.png" alt="Press Start" />
      <img id="playBtn" class="menu-button play-button" src="assets/menu-play-button.png" alt="Play" />
      <img id="leaderboardBtn" class="menu-button leaderboard-button" src="assets/menu-leaderboard-button.png" alt="Leaderboard" />
      <div id="htmlLeaderboardPanel" class="leaderboard-panel-html"></div>
    </section>
  `;

  document.body.appendChild(overlay);

  const playBtn = document.getElementById("playBtn");
  const pressStartBtn = document.getElementById("pressStartBtn");
  const leaderboardBtn = document.getElementById("leaderboardBtn");
  const leaderboardPanel = document.getElementById("htmlLeaderboardPanel");

  playBtn.addEventListener("click", e => {
    e.stopPropagation();
    startGameFromMenu();
  });

  playBtn.addEventListener("touchstart", e => {
    e.stopPropagation();
    startGameFromMenu();
  }, { passive: true });

  pressStartBtn.addEventListener("click", e => {
    e.stopPropagation();
    startGameFromMenu();
  });

  pressStartBtn.addEventListener("touchstart", e => {
    e.stopPropagation();
    startGameFromMenu();
  }, { passive: true });

  leaderboardBtn.addEventListener("click", e => {
    e.stopPropagation();
    showHtmlLeaderboard = !showHtmlLeaderboard;
    renderHtmlLeaderboard();

    if (showHtmlLeaderboard) {
      leaderboardPanel.classList.add("active");
    } else {
      leaderboardPanel.classList.remove("active");
    }
  });

  leaderboardBtn.addEventListener("touchstart", e => {
    e.stopPropagation();
    showHtmlLeaderboard = !showHtmlLeaderboard;
    renderHtmlLeaderboard();

    if (showHtmlLeaderboard) {
      leaderboardPanel.classList.add("active");
    } else {
      leaderboardPanel.classList.remove("active");
    }
  }, { passive: true });

  startMenuMusic();

  document.body.addEventListener("click", () => {
    startMenuMusic();
  }, { once: true });

  document.body.addEventListener("touchstart", () => {
    startMenuMusic();
  }, { once: true, passive: true });
}

function startGameFromMenu() {
  if (gameStarted) return;

  gameStarted = true;

  stopMenuMusic();

  const overlay = document.getElementById("startMenuOverlay");
  if (overlay) {
    overlay.style.display = "none";
  }

  startMusic();
}

createStartMenuOverlay();


// =========================
// MOBILE PERFORMANCE
// =========================

const isMobile =
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  window.innerWidth < 768;

const STAR_COUNT = isMobile ? 25 : 45;
const TRAIL_SIZE = isMobile ? 8 : 16;
const TRAIL_LIFE = isMobile ? 8 : 18;
const SHADOW_LIGHT = isMobile ? 3 : 6;
const SHADOW_MEDIUM = isMobile ? 5 : 10;
const SHADOW_HEAVY = isMobile ? 4 : 12;


// =========================
// PLAYER
// =========================

let player = {
  x: 70,
  y: 160,
  width: 180,
  height: 150,
  velocityY: 0,
  jumping: false,
  ducking: false
};


// =========================
// ARRAYS
// =========================

let obstacles = [];
let coins = [];
let binanceCoins = [];
let coinPops = [];
let rainbowTrail = [];
let powerUps = [];
let stars = [];
let punks = [];
let gaps = [];


// =========================
// ANIMATION
// =========================

let frameX = 0;
let frameTimer = 0;
let frameInterval = 4;
let totalFrames = 4;


// =========================
// GAME STATE
// =========================

let gravity = 1.65;
let groundY = 310;

let floorOffset = 0;
let tileWidth = 55;

let speed = 4.5;

let score = 0;
let coinsCollected = 0;
let gameOver = false;

let level = 1;
let coinsNeededForNextLevel = 20;
let levelMessageTimer = 0;

let spawnTimer = 0;
let nextSpawnTime = 120;

let highValueCoinTimer = 0;
let highValueCoinInterval = 480;

let flickerTimer = 0;
let screenShake = 0;

let supercharged = false;
let superchargeTimer = 0;


// =========================
// LEADERBOARD
// =========================

let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let leaderboardSaved = false;

function saveScoreToLeaderboard() {
  if (leaderboardSaved) return;

  let handle = prompt("Enter your .com handle:") || "player.com";
  handle = handle.trim().toLowerCase();

  if (!handle.endsWith(".com")) {
    handle += ".com";
  }

  leaderboard.push({
    handle,
    score,
    coins: coinsCollected,
    level
  });

  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  leaderboardSaved = true;
}

function drawLeaderboard() {
  ctx.textAlign = "center";

  const panelWidth = isMobile ? 620 : 720;
  const panelHeight = isMobile ? 280 : 320;

  const panelX = (canvas.width - panelWidth) / 2;
  const panelY = (canvas.height - panelHeight) / 2;

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = isMobile ? 3 : 4;
  ctx.shadowColor = "#00ffff";
  ctx.shadowBlur = SHADOW_HEAVY;

  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
  ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

  ctx.restore();

  drawRetroText("GLOBAL LEADERBOARD", canvas.width / 2, panelY + 48, isMobile ? 16 : 24, true);

  if (leaderboard.length === 0) {
    drawRetroText("NO SCORES YET", canvas.width / 2, panelY + 130, 14, false);
    return;
  }

  drawRetroText("RANK", canvas.width / 2 - 220, panelY + 95, 10, true);
  drawRetroText("PLAYER", canvas.width / 2, panelY + 95, 10, true);
  drawRetroText("SCORE", canvas.width / 2 + 220, panelY + 95, 10, true);

  leaderboard.forEach((entry, index) => {
    const y = panelY + 140 + index * 32;

    drawRetroText(`#${index + 1}`, canvas.width / 2 - 220, y, 12, true);
    drawRetroText(entry.handle, canvas.width / 2, y, 12, false);
    drawRetroText(`${entry.score}`, canvas.width / 2 + 220, y, 12, true);
  });
}


// =========================
// BACKGROUND ELEMENTS
// =========================

for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * BASE_WIDTH,
    y: Math.random() * groundY,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 1.2 + 0.4
  });
}

for (let i = 0; i < 2; i++) {
  punks.push({
    x: Math.random() * BASE_WIDTH,
    y: 60 + Math.random() * 140,
    width: 56,
    height: 56,
    speed: 0.35 + Math.random() * 0.35,
    float: Math.random() * Math.PI * 2
  });
}


// =========================
// HELPERS
// =========================

function safeDrawImage(img, x, y, w, h, fallbackColor = "cyan") {
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(x, y, w, h);
  }
}

function triggerShake(amount) {
  if (!isMobile) {
    screenShake = Math.max(screenShake, amount);
  }
}

function startMusic() {
  if (!musicStarted) {
    music.play().catch(() => {});
    musicStarted = true;
  }
}

function playCoinSound() {
  coinSound.currentTime = 0;
  coinSound.play().catch(() => {});
}

function playJumpSound() {
  jumpSound.currentTime = 0;
  jumpSound.play().catch(() => {});
}

function playCrashSound() {
  crashSound.currentTime = 0;
  crashSound.play().catch(() => {});
}

function playSuperchargeSound() {
  superchargeSound.currentTime = 0;
  superchargeSound.play().catch(() => {});
}

function playLevelUpSound() {
  levelUpSound.currentTime = 0;
  levelUpSound.play().catch(() => {});
}

function startFootsteps() {
  if (!player.jumping && !gameOver && !player.ducking && gameStarted && footstepSound.paused) {
    footstepSound.play().catch(() => {});
  }
}

function stopFootsteps() {
  if (!footstepSound.paused) {
    footstepSound.pause();
    footstepSound.currentTime = 0;
  }
}

function getRandomObstacle() {
  return obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}


// =========================
// OBSTACLES
// =========================

const obstacleTypes = ["ground", "tall", "flying", "moving"];

function spawnObstacle() {
  const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

  let obstacle = {
    x: canvas.width + 50,
    type,
    image: getRandomObstacle(),
    direction: 1
  };

  if (type === "ground") {
    obstacle.y = 260;
    obstacle.width = 50;
    obstacle.height = 50;
  }

  if (type === "tall") {
    obstacle.y = 220;
    obstacle.width = 60;
    obstacle.height = 90;
  }

  if (type === "flying") {
    obstacle.y = 190;
    obstacle.width = 70;
    obstacle.height = 45;
  }

  if (type === "moving") {
    obstacle.y = 245;
    obstacle.width = 55;
    obstacle.height = 55;
  }

  obstacles.push(obstacle);

  const coinCount = isMobile
    ? 1 + Math.floor(Math.random() * 2)
    : 1 + Math.floor(Math.random() * 3);

  for (let i = 0; i < coinCount; i++) {
    coins.push({
      x: canvas.width + 120 + i * 55 + Math.random() * 40,
      y: 130 + Math.random() * 80,
      width: 75,
      height: 75,
      value: 1,
      collected: false,
      image: coinImg
    });
  }

  if (Math.random() < 0.18) {
    const startX = canvas.width + 300;

    binanceCoins.push({
      x: startX,
      y: 120 + Math.random() * 90,
      width: 70,
      height: 70,
      value: 3,
      floatAngle: Math.random() * Math.PI * 2,
      collected: false
    });
  }

  if (Math.random() < 0.22) {
    const baseY = 105 + Math.random() * 90;

    powerUps.push({
      x: canvas.width + 250,
      baseY,
      y: baseY,
      floatAngle: Math.random() * Math.PI * 2,
      width: 60,
      height: 60,
      collected: false
    });
  }

  if (Math.random() < 0.12 && level >= 3) {
    gaps.push({
      x: canvas.width + 260,
      width: 45 + Math.random() * 35
    });
  }

  nextSpawnTime = Math.max(75, 155 - level * 7 + Math.random() * 90);
}

function spawnHighValueCoin() {
  coins.push({
    x: canvas.width + 80,
    y: 110 + Math.random() * 110,
    width: 75,
    height: 75,
    value: 5,
    collected: false,
    highValue: true,
    image: fiveCoinImg
  });
}


// =========================
// LEVEL SYSTEM
// =========================

function levelUp() {
  level++;

  playLevelUpSound();

  coinsNeededForNextLevel += 20;
  speed += isMobile ? 0.6 : 0.8;

  levelMessageTimer = 120;

  triggerShake(8);

  obstacles = [];
  coins = [];
  binanceCoins = [];
  powerUps = [];
  gaps = [];
  spawnTimer = 0;
}


// =========================
// CONTROLS
// =========================

function jump() {
  if (!player.jumping && !gameOver && !player.ducking) {
    stopFootsteps();

    player.velocityY = -29;
    player.jumping = true;
    playJumpSound();
  }

  if (gameOver) {
    location.reload();
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    if (!gameStarted) {
      startGameFromMenu();
      return;
    }

    startMusic();
    startFootsteps();
    jump();
  }

  if (e.code === "ArrowDown" || e.code === "KeyS") {
    if (!gameStarted) return;

    player.ducking = true;
    stopFootsteps();
  }
});

document.addEventListener("keyup", e => {
  if (e.code === "ArrowDown" || e.code === "KeyS") {
    if (!gameStarted) return;

    player.ducking = false;
    startFootsteps();
  }
});

document.addEventListener("click", () => {
  if (!gameStarted) return;

  startMusic();
  startFootsteps();
  jump();
});

document.addEventListener(
  "touchstart",
  e => {
    if (!gameStarted) return;

    e.preventDefault();

    startMusic();
    startFootsteps();
    jump();
  },
  { passive: false }
);


// =========================
// UPDATE
// =========================

function update() {
  if (!gameStarted) {
    return;
  }

  if (gameOver) {
    flickerTimer++;
    stopFootsteps();
    return;
  }

  flickerTimer++;

  const currentSpeed = supercharged ? speed * 1.6 : speed;

  footstepSound.playbackRate = supercharged ? 2 : 1;

  if (!player.jumping && !player.ducking) {
    startFootsteps();
  } else {
    stopFootsteps();
  }

  if (coinsCollected >= coinsNeededForNextLevel) {
    levelUp();
  }

  if (levelMessageTimer > 0) {
    levelMessageTimer--;
  }

  if (supercharged) {
    superchargeTimer--;

    if (superchargeTimer <= 0) {
      supercharged = false;
      rainbowTrail = [];
    }
  }

  frameTimer++;

  if (frameTimer >= frameInterval) {
    frameX = (frameX + 1) % totalFrames;
    frameTimer = 0;
  }

  punks.forEach(p => {
    p.x -= p.speed;
    p.float += 0.03;
    p.y += Math.sin(p.float) * 0.18;

    if (p.x + p.width < 0) {
      p.x = canvas.width + Math.random() * 400;
      p.y = 60 + Math.random() * 140;
    }
  });

  gaps.forEach(g => {
    g.x -= currentSpeed;
  });

  gaps = gaps.filter(g => g.x + g.width > 0);

  player.velocityY += gravity;
  player.y += player.velocityY;

  const footOffset = 35;
  const playerFeet = player.y + player.height - footOffset;

  let overGap = false;

  gaps.forEach(g => {
    if (
      player.x + 120 > g.x &&
      player.x + 90 < g.x + g.width &&
      playerFeet >= groundY - 8
    ) {
      overGap = true;
    }
  });

  if (playerFeet >= groundY && !overGap) {
    if (player.jumping) triggerShake(3);

    player.y = groundY - player.height + footOffset;
    player.velocityY = 0;
    player.jumping = false;

    startFootsteps();
  }

  if (overGap && playerFeet >= groundY - 5) {
    player.jumping = true;
  }

  if (player.y > canvas.height) {
    gameOver = true;
    music.pause();
    stopFootsteps();
    playCrashSound();
    saveScoreToLeaderboard();
  }

  if (supercharged) {
    rainbowTrail.push({
      x: player.x + 40,
      y: player.y + 85,
      size: TRAIL_SIZE,
      life: TRAIL_LIFE,
      hue: Math.random() * 360
    });
  }

  rainbowTrail.forEach(t => {
    t.x -= currentSpeed;
    t.size *= 0.94;
    t.life--;
  });

  rainbowTrail = rainbowTrail.filter(t => t.life > 0);

  spawnTimer++;

  if (spawnTimer >= nextSpawnTime) {
    spawnObstacle();
    spawnTimer = 0;
  }

  highValueCoinTimer++;

  if (highValueCoinTimer >= highValueCoinInterval) {
    spawnHighValueCoin();
    highValueCoinTimer = 0;
  }

  obstacles.forEach(o => {
    o.x -= currentSpeed;

    if (o.type === "moving") {
      o.y += o.direction * 1.3;

      if (o.y > 275 || o.y < 215) {
        o.direction *= -1;
      }
    }
  });

  coins.forEach(c => {
    c.x -= currentSpeed;
  });

  binanceCoins.forEach(c => {
    c.x -= currentSpeed;
    c.floatAngle += 0.05;
    c.y += Math.sin(c.floatAngle) * 0.7;
    c.x += Math.cos(c.floatAngle) * 0.6;
  });

  powerUps.forEach(p => {
    p.x -= currentSpeed;
    p.floatAngle += 0.08;
    p.y = p.baseY + Math.sin(p.floatAngle) * 14;
  });

  obstacles = obstacles.filter(o => {
    if (o.x + o.width < 0) {
      score++;
      return false;
    }

    return true;
  });

  coins = coins.filter(c => c.x + c.width > 0 && !c.collected);
  binanceCoins = binanceCoins.filter(c => c.x + c.width > 0 && !c.collected);
  powerUps = powerUps.filter(p => p.x + p.width > 0 && !p.collected);

  floorOffset -= currentSpeed;

  if (floorOffset <= -tileWidth) {
    floorOffset = 0;
  }

  stars.forEach(star => {
    star.x -= star.speed + level * 0.08;

    if (star.x < 0) {
      star.x = canvas.width;
      star.y = Math.random() * groundY;
    }
  });

  obstacles.forEach(o => {
    const playerHitbox = player.ducking
      ? {
          x: player.x + 105,
          y: player.y + 130,
          width: 50,
          height: 22
        }
      : {
          x: player.x + 108,
          y: player.y + 100,
          width: 42,
          height: 32
        };

    const obstacleHitbox = {
      x: o.x + 12,
      y: o.y + 12,
      width: o.width - 24,
      height: o.height - 24
    };

    if (isColliding(playerHitbox, obstacleHitbox)) {
      gameOver = true;
      triggerShake(15);
      music.pause();
      stopFootsteps();
      playCrashSound();
      saveScoreToLeaderboard();
    }
  });

  coins.forEach(c => {
    const playerCoinHitbox = {
      x: player.x + 65,
      y: player.y + 50,
      width: 105,
      height: 105
    };

    if (isColliding(playerCoinHitbox, c)) {
      const value = c.value || 1;

      c.collected = true;
      coinsCollected += value;
      score += value * 5;

      playCoinSound();

      coinPops.push({
        x: c.x + 20,
        y: c.y,
        size: c.highValue ? 16 : 11,
        life: 20,
        text: "+" + value
      });
    }
  });

  binanceCoins.forEach(c => {
    const playerCoinHitbox = {
      x: player.x + 65,
      y: player.y + 50,
      width: 105,
      height: 105
    };

    if (isColliding(playerCoinHitbox, c)) {
      c.collected = true;

      coinsCollected += 3;
      score += 15;

      playCoinSound();
      triggerShake(4);

      coinPops.push({
        x: c.x + 20,
        y: c.y,
        size: 14,
        life: 24,
        text: "+3 BNB"
      });
    }
  });

  powerUps.forEach(p => {
    const playerPowerHitbox = {
      x: player.x + 65,
      y: player.y + 50,
      width: 105,
      height: 105
    };

    if (isColliding(playerPowerHitbox, p)) {
      p.collected = true;

      supercharged = true;
      superchargeTimer = isMobile ? 180 : 260;

      playSuperchargeSound();

      score += 20;
      coinsCollected += 2;

      triggerShake(6);

      coinPops.push({
        x: p.x + 20,
        y: p.y,
        size: 13,
        life: 24,
        text: "+2 BOOST!"
      });
    }
  });

  coinPops.forEach(p => {
    p.y -= 1.2;
    p.size += 0.35;
    p.life--;
  });

  coinPops = coinPops.filter(p => p.life > 0);
}


// =========================
// RETRO TEXT
// =========================

function drawRetroText(text, x, y, size = 14, flicker = false) {
  const alpha = flicker ? 0.82 + Math.random() * 0.18 : 1;

  ctx.save();

  ctx.globalAlpha = alpha;
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = flicker ? SHADOW_LIGHT : 2;
  ctx.fillStyle = "#ffffff";
  ctx.font = `${size}px 'Press Start 2P', monospace`;

  ctx.fillText(text, x, y);

  ctx.restore();
}


// =========================
// DRAW
// =========================

function draw() {
  if (!gameStarted) {
    return;
  }

  ctx.save();

  if (screenShake > 0) {
    const shakeX = (Math.random() - 0.5) * screenShake;
    const shakeY = (Math.random() - 0.5) * screenShake;

    ctx.translate(shakeX, shakeY);

    screenShake *= 0.9;

    if (screenShake < 0.5) {
      screenShake = 0;
    }
  }

  if (level === 1) {
    ctx.fillStyle = "#050014";
  } else if (level === 2) {
    ctx.fillStyle = "#57c7ff";
  } else if (level === 3) {
    ctx.fillStyle = "#ff914d";
  } else if (level === 4) {
    ctx.fillStyle = "#6e0000";
  } else if (level === 5) {
    ctx.fillStyle = "#3d0066";
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(0.4, "#140028");
    gradient.addColorStop(1, "#000814");

    ctx.fillStyle = gradient;
  }

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  stars.forEach(s => {
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  punks.forEach(p => {
    ctx.save();
    ctx.globalAlpha = 0.14;

    safeDrawImage(
      punkImg,
      p.x,
      p.y,
      p.width,
      p.height,
      "#222"
    );

    ctx.restore();
  });

  ctx.save();
  ctx.shadowColor = "#ff00aa";
  ctx.shadowBlur = SHADOW_MEDIUM;
  ctx.fillStyle = "#ff00aa";
  ctx.fillRect(0, groundY, canvas.width, 50);
  ctx.restore();

  ctx.strokeStyle = supercharged ? "#ffffff" : "#ffd6f5";
  ctx.lineWidth = isMobile ? 2 : 3;
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = SHADOW_LIGHT;

  for (let x = floorOffset; x < canvas.width; x += tileWidth) {
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  gaps.forEach(g => {
    ctx.clearRect(g.x, groundY - 2, g.width, 80);

    ctx.save();

    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = SHADOW_MEDIUM;
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 2;

    ctx.strokeRect(g.x, groundY - 2, g.width, 80);

    ctx.restore();
  });

  ctx.shadowBlur = 0;

  rainbowTrail.forEach(t => {
    ctx.save();

    ctx.globalAlpha = t.life / TRAIL_LIFE;
    ctx.fillStyle = `hsl(${t.hue},100%,60%)`;
    ctx.shadowColor = `hsl(${t.hue},100%,60%)`;
    ctx.shadowBlur = SHADOW_LIGHT;

    ctx.beginPath();
    ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });

  powerUps.forEach(p => {
    ctx.save();

    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = SHADOW_LIGHT;

    safeDrawImage(
      superchargeImg,
      p.x,
      p.y,
      p.width,
      p.height,
      "#00ffff"
    );

    ctx.restore();
  });

  if (playerImg.complete && playerImg.naturalWidth > 0) {
    const spriteWidth = playerImg.width / totalFrames;

    ctx.drawImage(
      playerImg,
      frameX * spriteWidth,
      0,
      spriteWidth,
      playerImg.height,
      player.x,
      player.y,
      player.width,
      player.height
    );
  }

  obstacles.forEach(o => {
    safeDrawImage(o.image, o.x, o.y, o.width, o.height, "red");
  });

  coins.forEach(c => {
    const img = c.image || coinImg;

    if (c.highValue) {
      ctx.save();
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = SHADOW_LIGHT;
      safeDrawImage(img, c.x, c.y, c.width, c.height, "yellow");
      ctx.restore();
    } else {
      safeDrawImage(img, c.x, c.y, c.width, c.height, "yellow");
    }
  });

  binanceCoins.forEach(c => {
    ctx.save();

    ctx.shadowColor = "#F3BA2F";
    ctx.shadowBlur = SHADOW_MEDIUM;

    safeDrawImage(
      binanceCoinImg,
      c.x,
      c.y,
      c.width,
      c.height,
      "#F3BA2F"
    );

    ctx.restore();
  });

  coinPops.forEach(p => {
    drawRetroText(p.text || "+1", p.x, p.y, p.size, true);
  });

  drawRetroText("SCORE: " + score, 20, 35, 12, true);
  drawRetroText("COINS: " + coinsCollected, 20, 62, 12, true);
  drawRetroText("LEVEL: " + level, 20, 89, 12, true);
  drawRetroText("NEXT: " + coinsNeededForNextLevel, 20, 116, 12, true);

  if (supercharged) {
    drawRetroText("SUPERCHARGED!", 20, 145, 12, true);
  }

  if (levelMessageTimer > 0) {
    ctx.textAlign = "center";
    drawRetroText("LEVEL " + level, canvas.width / 2, 155, 28, true);
    drawRetroText("SPEED UP!", canvas.width / 2, 195, 16, true);
    ctx.textAlign = "left";
  }

  if (gameOver) {
    const centerX = canvas.width / 2;

    ctx.textAlign = "center";

    drawRetroText("GAME OVER", centerX, 75, 28, true);

    if (Math.floor(flickerTimer / 30) % 2 === 0) {
      drawRetroText("PRESS START", centerX, 115, 15, true);
    }

    drawRetroText("TAP OR SPACE TO RESTART", centerX, 145, 9, false);

    drawLeaderboard();

    ctx.textAlign = "left";
  }

  const logoSize = isMobile ? 55 : 80;

  safeDrawImage(
    logoImg,
    canvas.width - logoSize - 16,
    16,
    logoSize,
    logoSize,
    "white"
  );

  ctx.restore();
}


// =========================
// GAME LOOP
// =========================

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
