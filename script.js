/* REFERENCES */
const form = document.getElementById("resume-form");
const fields = Array.from(form.querySelectorAll("input, textarea"));

const nameEl = document.querySelector(".preview-name");
const titleEl = document.querySelector(".preview-title");
const blocks = document.querySelectorAll(".preview-block");

/* ENTER / SHIFT+ENTER */
fields.forEach((field, i) => {
  field.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      fields[i + 1]?.focus();
    }
  });
});

/* UPDATE PREVIEW */
function updatePreview() {
  blocks.forEach((block, i) => {
    const input = fields[i + 2];
    const text = input.value.trim();
    const content = block.querySelector(".content");

    if (!text) {
      block.style.display = "none";
      return;
    }

    block.style.display = "block";
    content.innerHTML = "";

    if (text.includes("\n")) {
      const ul = document.createElement("ul");
      text.split("\n").forEach(line => {
        if (line.trim()) {
          const li = document.createElement("li");
          li.textContent = line.trim();
          ul.appendChild(li);
        }
      });
      content.appendChild(ul);
    } else {
      content.textContent = text;
    }
  });
}

fields.forEach(f => f.addEventListener("input", updatePreview));

fields[0].addEventListener("input", () => {
  nameEl.textContent = fields[0].value || "Your Name";
});
fields[1].addEventListener("input", () => {
  titleEl.textContent = fields[1].value || "";
});

/* PDF */
document.getElementById("export-pdf-btn").addEventListener("click", () => {
  setTimeout(() => window.print(), 200);
});

/* =========================
   HORIZONTAL LANE BACKGROUND
========================= */

const canvas = document.getElementById("floating-bg");
const ctx = canvas.getContext("2d");

let width, height;

const COLORS = ["#ffb703", "#6fd6ff", "#ffafcc", "#cdb4db"];
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const LANES = 6;
const particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class LaneParticle {
  constructor(lane) {
    this.lane = lane;
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = (height / LANES) * this.lane + 10;
    this.speed =
      this.lane % 2 === 0
        ? Math.random() * 1.8 + 1.4   // FAST lanes
        : Math.random() * 0.4 + 0.25; // SLOW lanes

    this.char = CHARS[Math.floor(Math.random() * CHARS.length)];
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.opacity = this.lane === 2 ? 0.12 : 0.22; // softer near text
  }

  update() {
    this.x += this.speed;
    if (this.x > width + 20) {
      this.x = -20;
      this.char = CHARS[Math.floor(Math.random() * CHARS.length)];
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.font = "14px monospace";
    ctx.fillText(this.char, this.x, this.y);
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  particles.length = 0;
  for (let lane = 0; lane < LANES; lane++) {
    for (let i = 0; i < 40; i++) {
      particles.push(new LaneParticle(lane));
    }
  }
}
initParticles();

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

