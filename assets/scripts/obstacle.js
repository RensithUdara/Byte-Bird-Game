class Obstacle {
    constructor(game, x) {
        this.game = game;
        this.spriteWidth = 120;
        this.spriteHeight = 120;
        this.scaleWidth = this.spriteWidth * this.game.ratio;
        this.scaleHeight = this.spriteHeight * this.game.ratio;
        this.x = x;
        this.y = Math.random() * (this.game.height - this.scaleHeight);
        this.collisionX;
        this.collisionY;
        this.collisionRadius;
        
        // More obstacle variety based on difficulty
        let speedMultiplier = 1;
        if (this.game.difficultyLevel === 2) speedMultiplier = 1.2;
        if (this.game.difficultyLevel === 3) speedMultiplier = 1.5;
        
        this.speedY = Math.random() < 0.5 ?
            -1 * this.game.ratio * speedMultiplier : 
            1 * this.game.ratio * speedMultiplier;
        
        // Add some horizontal speed variation for harder difficulty
        this.speedX = 0;
        if (this.game.difficultyLevel === 3 && Math.random() < 0.3) {
            this.speedX = (Math.random() * 0.5 - 0.25) * this.game.ratio;
        }
        
        // Add rotation for more dynamic obstacles
        this.rotation = 0;
        this.rotationSpeed = (Math.random() * 0.02 - 0.01) * this.game.ratio;
        
        this.markedForDeletion = false;
        this.image = document.getElementById('smallGears');
        this.frameX = Math.floor(Math.random() * 4);
        
        // Add size variation
        if (this.game.difficultyLevel > 1) {
            const sizeVariation = Math.random() * 0.4 + 0.8; // 0.8 to 1.2 size
            this.scaleWidth *= sizeVariation;
            this.scaleHeight *= sizeVariation;
        }
    }

    update() {
        this.x -= this.game.speed;
        this.x += this.speedX;  // Add horizontal movement
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;  // Add rotation
        
        this.collisionX = this.x + this.scaleWidth * 0.5;
        this.collisionY = this.y + this.scaleHeight * 0.5;
        
        if (!this.game.gameOver){
            if (this.y <= 0 || this.y >= this.game.height - this.scaleHeight) {
                this.speedY *= -1;
                
                // Occasionally reverse horizontal direction on bounce for higher difficulties
                if (this.game.difficultyLevel >= 2 && Math.random() < 0.3) {
                    this.speedX *= -0.8;
                }
            }
            
            // Keep obstacles from going too far right
            if (this.x > this.game.width) {
                this.speedX = -Math.abs(this.speedX);
            }
        } else {
            this.speedY += 0.1;
        }
        if(this.isOffScreen()){
            this.markedForDeletion = true;
            this.game.obstacles =  this.game.obstacles.filter(
                obstacle => !obstacle.markedForDeletion);

            this.game.score++;
            if(this.game.obstacles.length <= 0) {
                this.game.triggerGameOver();
            }
        }
        if(this.game.checkCollision(this, this.game.player)){
            // Check if player has shield active
            if (this.game.player.shieldActive) {
                this.game.player.shieldActive = false;
                this.markedForDeletion = true;
                this.game.createFloatingText(this.collisionX, this.collisionY, "SHIELD BROKEN!", "blue");
                this.game.createExplosion(this.collisionX, this.collisionY, 10, "blue");
            } else {
                this.game.player.collided = true;
                this.game.player.stopCharge();
                this.game.triggerGameOver();
            }
        }
    }
    draw() {
        this.game.ctx.save();
        
        // Apply rotation if needed
        if (this.rotation !== 0) {
            this.game.ctx.translate(this.x + this.scaleWidth * 0.5, this.y + this.scaleHeight * 0.5);
            this.game.ctx.rotate(this.rotation);
            this.game.ctx.drawImage(
                this.image, 
                this.frameX * this.spriteWidth, 
                0, 
                this.spriteWidth, 
                this.spriteHeight, 
                -this.scaleWidth * 0.5, 
                -this.scaleHeight * 0.5, 
                this.scaleWidth, 
                this.scaleHeight
            );
        } else {
            // Normal draw without rotation
            this.game.ctx.drawImage(
                this.image, 
                this.frameX * this.spriteWidth, 
                0, 
                this.spriteWidth, 
                this.spriteHeight, 
                this.x, 
                this.y, 
                this.scaleWidth, 
                this.scaleHeight
            );
        }
        
        // Draw debug collision circle
        if(this.game.debug) {
            this.game.ctx.beginPath();
            this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            this.game.ctx.stroke();
        }
        
        this.game.ctx.restore();
    }
    resize() {
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.collisionRadius = this.scaleWidth * 0.3;
    }
    isOffScreen() {
        return this.x < -this.scaleWidth || this.y > this.game.height;
    }
}
