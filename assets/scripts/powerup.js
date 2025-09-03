class PowerUp {
    constructor(game, x) {
        this.game = game;
        this.spriteWidth = 100;
        this.spriteHeight = 100;
        this.scaleWidth = this.spriteWidth * this.game.ratio;
        this.scaleHeight = this.spriteHeight * this.game.ratio;
        this.x = x;
        this.y = Math.random() * (this.game.height - this.scaleHeight - this.game.bottomMargin * 2) + this.game.bottomMargin;
        this.collisionX;
        this.collisionY;
        this.collisionRadius;
        this.speedY = Math.random() < 0.5 ? -0.5 * this.game.ratio : 0.5 * this.game.ratio;
        this.markedForDeletion = false;
        this.type = this.getRandomType();
        this.opacity = 1;
        this.pulseRate = 0.02;
        this.pulseDirection = 1;
        
        // Create canvas for drawing the power-up
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.spriteWidth;
        this.canvas.height = this.spriteHeight;
        this.ctx = this.canvas.getContext('2d');
        this.drawPowerUp();
    }

    getRandomType() {
        const types = ['energy', 'shield', 'slowTime'];
        return types[Math.floor(Math.random() * types.length)];
    }

    drawPowerUp() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw circle background
        this.ctx.fillStyle = this.getTypeColor();
        this.ctx.beginPath();
        this.ctx.arc(this.spriteWidth / 2, this.spriteHeight / 2, this.spriteWidth / 2.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw icon based on type
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 4;
        
        if (this.type === 'energy') {
            // Draw lightning bolt
            this.ctx.beginPath();
            this.ctx.moveTo(this.spriteWidth * 0.45, this.spriteHeight * 0.2);
            this.ctx.lineTo(this.spriteWidth * 0.25, this.spriteHeight * 0.55);
            this.ctx.lineTo(this.spriteWidth * 0.55, this.spriteHeight * 0.55);
            this.ctx.lineTo(this.spriteWidth * 0.35, this.spriteHeight * 0.8);
            this.ctx.lineTo(this.spriteWidth * 0.75, this.spriteHeight * 0.4);
            this.ctx.lineTo(this.spriteWidth * 0.45, this.spriteHeight * 0.4);
            this.ctx.lineTo(this.spriteWidth * 0.62, this.spriteHeight * 0.2);
            this.ctx.closePath();
            this.ctx.fill();
        } else if (this.type === 'shield') {
            // Draw shield
            this.ctx.beginPath();
            this.ctx.moveTo(this.spriteWidth * 0.5, this.spriteHeight * 0.2);
            this.ctx.lineTo(this.spriteWidth * 0.2, this.spriteHeight * 0.35);
            this.ctx.lineTo(this.spriteWidth * 0.2, this.spriteHeight * 0.65);
            this.ctx.lineTo(this.spriteWidth * 0.5, this.spriteHeight * 0.8);
            this.ctx.lineTo(this.spriteWidth * 0.8, this.spriteHeight * 0.65);
            this.ctx.lineTo(this.spriteWidth * 0.8, this.spriteHeight * 0.35);
            this.ctx.closePath();
            this.ctx.stroke();
            
            // Inner details
            this.ctx.beginPath();
            this.ctx.moveTo(this.spriteWidth * 0.5, this.spriteHeight * 0.3);
            this.ctx.lineTo(this.spriteWidth * 0.5, this.spriteHeight * 0.7);
            this.ctx.moveTo(this.spriteWidth * 0.35, this.spriteHeight * 0.5);
            this.ctx.lineTo(this.spriteWidth * 0.65, this.spriteHeight * 0.5);
            this.ctx.stroke();
        } else if (this.type === 'slowTime') {
            // Draw clock/hourglass
            this.ctx.beginPath();
            this.ctx.arc(this.spriteWidth * 0.5, this.spriteHeight * 0.5, this.spriteWidth * 0.25, 0, Math.PI * 2);
            this.ctx.moveTo(this.spriteWidth * 0.5, this.spriteHeight * 0.5);
            this.ctx.lineTo(this.spriteWidth * 0.5, this.spriteHeight * 0.35);
            this.ctx.moveTo(this.spriteWidth * 0.5, this.spriteHeight * 0.5);
            this.ctx.lineTo(this.spriteWidth * 0.65, this.spriteHeight * 0.6);
            this.ctx.stroke();
        }
    }

    getTypeColor() {
        switch (this.type) {
            case 'energy': return 'orange';
            case 'shield': return 'blue';
            case 'slowTime': return 'purple';
            default: return 'yellow';
        }
    }

    update() {
        this.x -= this.game.speed * 0.75; // Move slower than obstacles
        this.y += this.speedY;
        this.collisionX = this.x + this.scaleWidth * 0.5;
        this.collisionY = this.y + this.scaleHeight * 0.5;
        
        // Pulsing effect
        this.opacity += this.pulseDirection * this.pulseRate;
        if (this.opacity >= 1) {
            this.opacity = 1;
            this.pulseDirection = -1;
        } else if (this.opacity <= 0.5) {
            this.opacity = 0.5;
            this.pulseDirection = 1;
        }
        
        // Bounce off top and bottom
        if (this.y <= this.game.bottomMargin || this.y >= this.game.height - this.scaleHeight - this.game.bottomMargin) {
            this.speedY *= -1;
        }
        
        // Check for off screen
        if (this.x < -this.scaleWidth) {
            this.markedForDeletion = true;
        }
        
        // Check collision with player
        if (this.game.checkCollision(this, this.game.player)) {
            this.markedForDeletion = true;
            this.applyEffect();
            this.game.sound.play(this.game.sound.powerup);
        }
    }

    applyEffect() {
        switch (this.type) {
            case 'energy':
                this.game.player.energy = Math.min(this.game.player.maxEnergy, this.game.player.energy + 20);
                this.game.createFloatingText(this.collisionX, this.collisionY, "+ENERGY", "orange");
                break;
            case 'shield':
                this.game.player.shieldActive = true;
                this.game.player.shieldTimer = 5000; // 5 seconds shield
                this.game.createFloatingText(this.collisionX, this.collisionY, "SHIELD", "blue");
                break;
            case 'slowTime':
                this.game.timeSlowActive = true;
                this.game.timeSlowTimer = 3000; // 3 seconds slow time
                this.game.originalSpeed = this.game.speed;
                this.game.speed = this.game.speed * 0.5;
                this.game.createFloatingText(this.collisionX, this.collisionY, "SLOW TIME", "purple");
                break;
        }
    }

    draw() {
        this.game.ctx.save();
        this.game.ctx.globalAlpha = this.opacity;
        this.game.ctx.drawImage(this.canvas, 0, 0, this.spriteWidth, this.spriteHeight, 
                              this.x, this.y, this.scaleWidth, this.scaleHeight);
        this.game.ctx.restore();
        
        if (this.game.debug) {
            this.game.ctx.beginPath();
            this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            this.game.ctx.stroke();
        }
    }

    resize() {
        this.scaleWidth = this.spriteWidth * this.game.ratio;
        this.scaleHeight = this.spriteHeight * this.game.ratio;
        this.collisionRadius = this.scaleWidth * 0.4;
    }
}
