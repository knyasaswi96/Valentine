const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");
const actions = document.getElementById("actions");

const result = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const replayBtn = document.getElementById("replayBtn");
const confetti = document.getElementById("confetti");

let noCount = 0;
let moved = false;

function showResult(title, text, icon="💝"){
  result.classList.remove("hidden");
  resultTitle.textContent = title;
  resultText.textContent = text;
  document.getElementById("resultIcon").textContent = icon;
  document.getElementById("stage").classList.add("hidden");
}

function reset(){
  noCount = 0;
  hint.textContent = "";
  result.classList.add("hidden");
  document.getElementById("stage").classList.remove("hidden");
  // reset "no" button positioning
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  moved = false;
  confetti.innerHTML = "";
}

function rand(min, max){
  return Math.random() * (max - min) + min;
}

function moveNoButton(){
  const rect = actions.getBoundingClientRect();

  // If buttons wrap on very small screens, keep movement subtle.
  const maxX = Math.max(0, rect.width - noBtn.offsetWidth - 18);
  const maxY = Math.max(0, rect.height - noBtn.offsetHeight - 18);

  const x = Math.floor(rand(8, maxX));
  const y = Math.floor(rand(8, maxY));

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  moved = true;
}

function heartConfetti(durationMs = 1200){
  confetti.innerHTML = "";
  const emojis = ["💖","💘","💝","💗","💞","💕"];
  const end = Date.now() + durationMs;

  function spawn(){
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const left = rand(0, 100);
    const size = rand(16, 26);
    const drift = rand(-25, 25);
    const spin = rand(0, 360);
    const dur = rand(0.9, 1.6);

    heart.style.left = `${left}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.transform = `translateX(${drift}px) rotate(${spin}deg)`;
    heart.style.animationDuration = `${dur}s`;

    confetti.appendChild(heart);

    // Remove when done
    setTimeout(() => heart.remove(), dur * 1000 + 300);
  }

  const timer = setInterval(() => {
    spawn();
    spawn();
    if (Date.now() > end) clearInterval(timer);
  }, 80);
}

yesBtn.addEventListener("click", () => {
  heartConfetti(1400);
  showResult(
    "YAY 💘",
    "Okay it’s official — Valentine’s locked in 😄\n\nText me what time you’re free?",
    "💖"
  );
});

noBtn.addEventListener("click", () => {
  noCount++;

  if (noCount === 1) hint.textContent = "Are you sure? 😅";
  else if (noCount === 2) hint.textContent = "Final answer? 👀";
  else {
    hint.textContent = "Okay but… you’ll have to catch the No button now 😄";
    moveNoButton();
  }
});

// Also move on hover (desktop), but only after they've tried "No" once
noBtn.addEventListener("mouseenter", () => {
  if (noCount >= 1 && !moved) moveNoButton();
});

replayBtn.addEventListener("click", reset);
