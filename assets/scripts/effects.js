class VisualEffect {
    constructor(game, x, y, text, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.fontSize = Math.ceil(30 * this.game.ratio);
        this.lifespan = 1000; // milliseconds
        this.opacity = 1;
        this.markedForDeletion = false;
        this.speedY = -1 * this.game.ratio;
    }

    update(deltaTime) {
        this.lifespan -= deltaTime;
        if (this.lifespan <= 0) {
            this.markedForDeletion = true;
        }
        this.opacity = this.lifespan / 1000; // Fade out
        this.y += this.speedY;
    }

    draw() {
        this.game.ctx.save();
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.globalAlpha = this.opacity;
        this.game.ctx.font = `${this.fontSize}px Bungee`;
        this.game.ctx.textAlign = 'center';
        this.game.ctx.fillText(this.text, this.x, this.y);
        this.game.ctx.restore();
    }
}

class Particle {
    constructor(game, x, y, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 5 * this.game.ratio + 2 * this.game.ratio;
        this.speedX = Math.random() * 6 * this.game.ratio - 3 * this.game.ratio;
        this.speedY = Math.random() * 6 * this.game.ratio - 3 * this.game.ratio;
        this.gravity = 0.1 * this.game.ratio;
        this.lifespan = 1000; // milliseconds
        this.opacity = 1;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        this.lifespan -= deltaTime;
        if (this.lifespan <= 0) {
            this.markedForDeletion = true;
        }
        this.opacity = this.lifespan / 1000; // Fade out
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
    }

    draw() {
        this.game.ctx.save();
        this.game.ctx.fillStyle = this.color;
        this.game.ctx.globalAlpha = this.opacity;
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.game.ctx.fill();
        this.game.ctx.restore();
    }
}
