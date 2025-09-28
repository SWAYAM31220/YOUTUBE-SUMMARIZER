// Ultra-luxury animated background: Glowing, colliding squares (no mouse interaction)
const canvas = document.getElementById('luxury-bg');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const SQUARE_COUNT = 50;
const SQUARE_MIN = 36;
const SQUARE_MAX = 80;
const GLOW_COLORS = [
    'rgba(255, 215, 0, 0.85)',   // Gold
    'rgba(192, 192, 192, 0.7)',  // Platinum
    'rgba(255, 255, 255, 0.18)', // Champagne
    'rgba(0,255,255,0.22)',      // Neon Cyan
    'rgba(255, 255, 0, 0.22)',   // Neon Yellow
];

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

class Square {
    constructor() {
        this.size = randomBetween(SQUARE_MIN, SQUARE_MAX);
        this.x = randomBetween(this.size, width - this.size);
        this.y = randomBetween(this.size, height - this.size);
        this.vx = randomBetween(-1.2, 1.2);
        this.vy = randomBetween(-1.2, 1.2);
        this.color = GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)];
        this.baseColor = this.color;
        this.glow = 32 + randomBetween(16, 48);
    }
    update(squares) {
        // Move
        this.x += this.vx;
        this.y += this.vy;
        // Wall collision
        if (this.x < this.size/2) {
            this.x = this.size/2;
            this.vx *= -1;
        }
        if (this.x > width - this.size/2) {
            this.x = width - this.size/2;
            this.vx *= -1;
        }
        if (this.y < this.size/2) {
            this.y = this.size/2;
            this.vy *= -1;
        }
        if (this.y > height - this.size/2) {
            this.y = height - this.size/2;
            this.vy *= -1;
        }
        // Friction
        this.vx *= 0.985;
        this.vy *= 0.985;
        // Collision with other squares
        for (let other of squares) {
            if (other === this) continue;
            let dx = other.x - this.x;
            let dy = other.y - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            let minDist = (this.size + other.size) / 2;
            if (dist < minDist && dist > 0) {
                // Simple elastic collision
                let angle = Math.atan2(dy, dx);
                let overlap = minDist - dist;
                let totalMass = this.size + other.size;
                let thisPush = overlap * (other.size / totalMass);
                let otherPush = overlap * (this.size / totalMass);
                this.x -= Math.cos(angle) * thisPush;
                this.y -= Math.sin(angle) * thisPush;
                other.x += Math.cos(angle) * otherPush;
                other.y += Math.sin(angle) * otherPush;
                // Exchange velocities
                let tempVx = this.vx;
                let tempVy = this.vy;
                this.vx = other.vx;
                this.vy = other.vy;
                other.vx = tempVx;
                other.vy = tempVy;
            }
        }
    }
    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.glow;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.82;
        ctx.fill();
        // Inner glow
        ctx.shadowBlur = this.glow * 0.5;
        ctx.globalAlpha = 0.38;
        ctx.fill();
        ctx.restore();
        // Border for luxury effect
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.strokeStyle = 'rgba(255,255,255,0.13)';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.restore();
    }
}

const squares = [];
for (let i = 0; i < SQUARE_COUNT; i++) {
    squares.push(new Square());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    // Cinematic subtle vignette
    let grad = ctx.createRadialGradient(width/2, height/2, width*0.2, width/2, height/2, width*0.9);
    grad.addColorStop(0, 'rgba(255, 215, 0, 0.04)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    // Animate squares
    for (let sq of squares) {
        sq.update(squares);
        sq.draw();
    }
    requestAnimationFrame(animate);
}
animate();