import '../scss/styles.scss';

window.goToContactContainer = () => {
    document.getElementById('contact').scrollIntoView({behavior: "smooth"});
}

window.animateScrollToTop = (duration) => {
    // cancel if already on top
    if (document.scrollingElement.scrollTop === 0) {
        return;
    }

    const cosParameter = document.scrollingElement.scrollTop / 2;
    let scrollCount = 0, oldTimestamp = null;

    function step(newTimestamp) {
        if (oldTimestamp !== null) {
            // if duration is 0 scrollCount will be Infinity
            scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration;
            if (scrollCount >= Math.PI) {
                return document.scrollingElement.scrollTop = 0;
            }
            document.scrollingElement.scrollTop = cosParameter + cosParameter * Math.cos(scrollCount);
        }
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
}

var particleAlphabet = {
    Particle: function(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 3.5;
        this.draw = function(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, this.radius, this.radius);
            ctx.restore();
        };
    },
    writeWords: function(textArray){
        particleAlphabet.changeLetter(textArray);
        particleAlphabet.getPixels(particleAlphabet.tmpCanvas, particleAlphabet.tmpCtx);
    },
    init: function(textArray) {
        particleAlphabet.canvas = document.querySelector('canvas');
        particleAlphabet.ctx = particleAlphabet.canvas.getContext('2d');
        particleAlphabet.W = 700;
        particleAlphabet.H = 100;
        particleAlphabet.particlePositions = [];
        particleAlphabet.particles = [];
        particleAlphabet.tmpCanvas = document.createElement('canvas');
        particleAlphabet.tmpCtx = particleAlphabet.tmpCanvas.getContext('2d');

        particleAlphabet.canvas.width = particleAlphabet.W;
        particleAlphabet.canvas.height = particleAlphabet.H;
        particleAlphabet.writeWords(textArray);
        setInterval(function(){
            particleAlphabet.writeWords(textArray);
        }, 2000);

        particleAlphabet.makeParticles(10000);
        particleAlphabet.animate();
    },
    currentPos: 0,
    changeLetter: function(textArray) {
        var letters = textArray
            //letters = letters.split('');
        particleAlphabet.time = letters[particleAlphabet.currentPos];
        particleAlphabet.currentPos++;
        if (particleAlphabet.currentPos >= letters.length) {
            particleAlphabet.currentPos = 0;
        }
    },
    makeParticles: function(num) {
        for (var i = 0; i <= num; i++) {
            particleAlphabet.particles.push(new particleAlphabet.Particle(particleAlphabet.W / 2 + Math.random() * 400 - 200, particleAlphabet.H / 2 + Math.random() * 400 -200));
        }
    },
    getPixels: function(canvas, ctx) {
        var keyword = particleAlphabet.time,
            gridX = 6,
            gridY = 6;
        canvas.width = 700;
        canvas.height = 100;
        ctx.fillStyle = 'red';
        ctx.font = 'italic bold 80px Noto Serif';
        ctx.fillText(keyword, 0,  25 + (ctx.measureText(keyword).fontBoundingBoxDescent + ctx.measureText(keyword).fontBoundingBoxAscent) / 2);
        var idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var buffer32 = new Uint32Array(idata.data.buffer);
        if (particleAlphabet.particlePositions.length > 0) particleAlphabet.particlePositions = [];
        for (var y = 0; y < canvas.height; y += gridY) {
            for (var x = 0; x < canvas.width; x += gridX) {
                if (buffer32[y * canvas.width + x]) {
                    particleAlphabet.particlePositions.push({x: x, y: y});
                }
            }
        }
    },
    animateParticles: function() {
        var p, pPos;
        for (var i = 0, num = particleAlphabet.particles.length; i < num; i++) {
            p = particleAlphabet.particles[i];
            pPos = particleAlphabet.particlePositions[i];
            if (particleAlphabet.particles.indexOf(p) === particleAlphabet.particlePositions.indexOf(pPos)) {
                p.x += (pPos.x - p.x) * .3;
                p.y += (pPos.y - p.y) * .3;
                p.draw(particleAlphabet.ctx);
            }
        }
    },
    animate: function() {
        requestAnimationFrame(particleAlphabet.animate);
        particleAlphabet.ctx.fillStyle = '#1C1C1C';
        particleAlphabet.ctx.fillRect(0, 0, particleAlphabet.W, particleAlphabet.H);
        particleAlphabet.animateParticles();
    }
};

window.onload = () => { particleAlphabet.init(['Timur Urazbakhtin', 'Frontend Developer']); }
