const baseImages = Array.from({ length: 18 }, (_, i) => `/game-photos/${i + 1}.avif`);
const images = [...baseImages, ...baseImages].sort(() => Math.random() - 0.5);

const heartLayout = [
  [null, null, 0, 1, null, 2, 3, null, null],
  [null, 4, 5, 6, 7, 8, 9, 10, null],
  [11, 12, 13, 14, 15, 16, 17, 18, 19],
  [null, 20, 21, 22, 23, 24, 25, 26, null],
  [null, null, 27, 28, 29, 30, 31, null, null],
  [null, null, null, 32, 33, 34, null, null, null],
  [null, null, null, null, 35, null, null, null, null],
];

const game = document.getElementById("game");
const proposalScreen = document.getElementById("proposalScreen");
const bgMusic = document.getElementById("bgMusic");

let selected = [];
let matched = [];

heartLayout.flat().forEach(index => {
  if (index === null) {
    const empty = document.createElement("div");
    empty.className = "hidden-slot";
    game.appendChild(empty);
    return;
  }

  const card = document.createElement("div");
  card.className = "card";
  card.dataset.index = index;

  card.innerHTML = `
    <div class="inner">
      <div class="back"></div>
      <div class="front">
        <img src="${images[index]}" />
      </div>
    </div>
  `;

  card.addEventListener("click", () => handleClick(card, index));
  game.appendChild(card);
});

function handleClick(card, index) {
  if (selected.length === 2 || matched.includes(index) || selected.includes(index)) return;

  bgMusic.play().catch(() => {});

  card.classList.add("flip");
  selected.push(index);

  if (selected.length === 2) {
    const [first, second] = selected;

    const firstCard = document.querySelector(`.card[data-index='${first}']`);
    const secondCard = document.querySelector(`.card[data-index='${second}']`);

    if (images[first] === images[second]) {
  matched.push(first, second);

  firstCard.classList.add("correct");
  secondCard.classList.add("correct");

  // Remove glow after 2 seconds
  setTimeout(() => {
    firstCard.classList.remove("correct");
    secondCard.classList.remove("correct");
  }, 2000);

  selected = [];

  if (matched.length === images.length) {
    setTimeout(showProposal, 1000);
  }
}
 else {
      firstCard.classList.add("wrong");
      secondCard.classList.add("wrong");

      setTimeout(() => {
        firstCard.classList.remove("flip", "wrong");
        secondCard.classList.remove("flip", "wrong");
        selected = [];
      }, 800);
    }
  }
}


function showProposal() {
  proposalScreen.style.display = "flex";
  startConfetti();
}

function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 6 + 2,
    d: Math.random() * 200,
    color: `hsl(${Math.random() * 360}, 100%, 70%)`,
    tilt: Math.random() * 10 - 10
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });
    update();
  }

  function update() {
    confetti.forEach(c => {
      c.y += Math.cos(c.d) + 2;
      c.x += Math.sin(c.d);

      if (c.y > canvas.height) {
        c.y = -10;
        c.x = Math.random() * canvas.width;
      }
    });
  }

  setInterval(draw, 20);
}

/* Landscape lock */
function checkOrientation() {
  const rotateMessage = document.getElementById("rotateMessage");
  if (window.innerHeight > window.innerWidth) {
    rotateMessage.style.display = "flex";
  } else {
    rotateMessage.style.display = "none";
  }
}

window.addEventListener("resize", checkOrientation);
checkOrientation();
