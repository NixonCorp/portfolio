import "../scss/styles.scss";
import "./swipingCards";

window.goToContactContainer = () => {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
};

window.animateScrollToTop = (duration) => {
  // cancel if already on top
  if (document.scrollingElement.scrollTop === 0) {
    return;
  }

  const cosParameter = document.scrollingElement.scrollTop / 2;
  let scrollCount = 0,
    oldTimestamp = null;

  function step(newTimestamp) {
    if (oldTimestamp !== null) {
      // if duration is 0 scrollCount will be Infinity
      scrollCount += (Math.PI * (newTimestamp - oldTimestamp)) / duration;
      if (scrollCount >= Math.PI) {
        return (document.scrollingElement.scrollTop = 0);
      }
      document.scrollingElement.scrollTop =
        cosParameter + cosParameter * Math.cos(scrollCount);
    }
    oldTimestamp = newTimestamp;
    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
};

let particleWords = {
  Particle: function (x, y) {
    this.x = x;
    this.y = y;
    this.radius = 3.5;
    this.draw = function (ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, this.radius, this.radius);
      ctx.restore();
    };
  },
  writeWords: function (textArray) {
    particleWords.changeLetter(textArray);
    particleWords.getPixels(particleWords.tmpCanvas, particleWords.tmpCtx);
  },
  init: function (textArray) {
    particleWords.canvas = document.querySelector("canvas");
    particleWords.ctx = particleWords.canvas.getContext("2d");
    particleWords.W = 700;
    particleWords.H = 100;
    particleWords.particlePositions = [];
    particleWords.particles = [];
    particleWords.tmpCanvas = document.createElement("canvas");
    particleWords.tmpCtx = particleWords.tmpCanvas.getContext("2d");

    particleWords.canvas.width = particleWords.W;
    particleWords.canvas.height = particleWords.H;
    particleWords.writeWords(textArray);
    setInterval(function () {
      particleWords.writeWords(textArray);
    }, 2000);

    particleWords.makeParticles(10000);
    particleWords.animate();
  },
  currentPos: 0,
  changeLetter: function (textArray) {
    let letters = textArray;
    //letters = letters.split('');
    particleWords.time = letters[particleWords.currentPos];
    particleWords.currentPos++;
    if (particleWords.currentPos >= letters.length) {
      particleWords.currentPos = 0;
    }
  },
  makeParticles: function (num) {
    for (let i = 0; i <= num; i++) {
      particleWords.particles.push(
        new particleWords.Particle(
          particleWords.W / 2 + Math.random() * 400 - 200,
          particleWords.H / 2 + Math.random() * 400 - 200
        )
      );
    }
  },
  getPixels: function (canvas, ctx) {
    let keyword = particleWords.time,
      gridX = 6,
      gridY = 6;
    canvas.width = 700;
    canvas.height = 100;
    ctx.fillStyle = "red";
    ctx.font = "italic bold 80px Noto Serif";
    ctx.fillText(
      keyword,
      0,
      25 +
        (ctx.measureText(keyword).fontBoundingBoxDescent +
          ctx.measureText(keyword).fontBoundingBoxAscent) /
          2
    );
    let idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let buffer32 = new Uint32Array(idata.data.buffer);
    if (particleWords.particlePositions.length > 0)
      particleWords.particlePositions = [];
    for (let y = 0; y < canvas.height; y += gridY) {
      for (let x = 0; x < canvas.width; x += gridX) {
        if (buffer32[y * canvas.width + x]) {
          particleWords.particlePositions.push({ x: x, y: y });
        }
      }
    }
  },
  animateParticles: function () {
    let p, pPos;
    for (let i = 0, num = particleWords.particles.length; i < num; i++) {
      p = particleWords.particles[i];
      pPos = particleWords.particlePositions[i];
      if (
        particleWords.particles.indexOf(p) ===
        particleWords.particlePositions.indexOf(pPos)
      ) {
        p.x += (pPos.x - p.x) * 0.3;
        p.y += (pPos.y - p.y) * 0.3;
        p.draw(particleWords.ctx);
      }
    }
  },
  animate: function () {
    requestAnimationFrame(particleWords.animate);
    particleWords.ctx.fillStyle = "#1C1C1C";
    particleWords.ctx.fillRect(0, 0, particleWords.W, particleWords.H);
    particleWords.animateParticles();
  },
};

window.openProject = (e, name) => {
  const classList = Array.from(e.classList);
  if (classList.indexOf("swiped") !== -1 || classList.indexOf("active") === -1)
    return;
  if (name === "Musician hub") {
    window.open("http://app.542073-cn93172.tmweb.ru/", "_blank");
  }
  if (name === "Max Bot") {
    window.open("http://max-bot.netlify.app/", "_blank");
  }
};

window.onload = () => {
  particleWords.init(["Timur Urazbakhtin", "Frontend Developer"]);
};
