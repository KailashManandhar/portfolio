const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");
        }

    });

}, {
    threshold: 0.2
});

sections.forEach(section => {

    section.classList.add("fade");
    observer.observe(section);

});

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

const mouse = {
    x: -1000,
    y: -1000
};

window.addEventListener("mousemove", e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {

    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = (Math.random() - .5) * 1;
        this.vy = (Math.random() - .5) * 1;

        this.size = 2;
    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < 120) {

            this.x += dx * .015;
            this.y += dy * .015;
        }
    }
}

const particles = [];

for (let i = 0; i < 90; i++) {
    particles.push(new Particle());
}

function connect() {

    for (let i = 0; i < particles.length; i++) {

        for (let j = i + 1; j < particles.length; j++) {

            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;

            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < 120) {

                ctx.globalAlpha = 1 - d / 120;

                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    ctx.globalAlpha = 1;
}

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => p.update());

    connect();

    requestAnimationFrame(animate);
}

animate();