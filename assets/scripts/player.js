class Player {
    constructor(game){
        this.game = game;
        this.x = 20;
        this.y;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.width;
        this.height;
        this.speedY;
        this.flapSpeed;
        this.collisionX;
        this.collisionY;
        this.collisionRadius;
        this.collided;
        this.energy = 30;
        this.maxEnergy = this.energy * 2;
        this.minEnergy = 15;
        this.barSize;
        this.charging;
        this.image = document.getElementById('player_fish');
        this.frameY = 0;
        this.score = 0;
        this.shieldActive = false;
        this.shieldTimer = 0;
        this.shieldOpacity = 0.5;
        this.shieldPulse = 0.02;
        this.shieldPulseDirection = 1;
    }
    draw(){
        // Draw player
        this.game.ctx.drawImage(this.image, 0, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        
        // Draw shield if active
        if (this.shieldActive) {
            this.game.ctx.save();
            this.game.ctx.globalAlpha = this.shieldOpacity;
            this.game.ctx.strokeStyle = 'rgba(30, 144, 255, 0.8)';
            this.game.ctx.fillStyle = 'rgba(30, 144, 255, 0.3)';
            this.game.ctx.lineWidth = 3 * this.game.ratio;
            
            // Draw shield circle
            this.game.ctx.beginPath();
            this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius * 1.5, 0, Math.PI * 2);
            this.game.ctx.fill();
            this.game.ctx.stroke();
            
            this.game.ctx.restore();
        }
        
        // Draw collision circle in debug mode
        if(this.game.debug){
            this.game.ctx.beginPath();
            this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            this.game.ctx.stroke();
        }
    }
    update(deltaTime){
        this.handleEnergy();
        this.handleShield(deltaTime);
        
        if (this.speedY >= 0) this.wingsUp();
        this.y += this.speedY;
        this.collisionY = this.y + this.height * 0.5;
        
        if (!this.isTouchingBottom() && !this.charging){
            this.speedY += this.game.gravity;
        } else {
            this.speedY = 0;
        }
        
        if (this.isTouchingBottom()){
            this.y = this.game.height - this.height - this.game.bottomMargin;
            this.wingsIdle();
        }
    }
    
    handleShield(deltaTime) {
        if (this.shieldActive) {
            this.shieldTimer -= deltaTime;
            
            // Pulse shield effect
            this.shieldOpacity += this.shieldPulseDirection * this.shieldPulse;
            if (this.shieldOpacity >= 0.7) {
                this.shieldOpacity = 0.7;
                this.shieldPulseDirection = -1;
            } else if (this.shieldOpacity <= 0.3) {
                this.shieldOpacity = 0.3;
                this.shieldPulseDirection = 1;
            }
            
            // Shield time up
            if (this.shieldTimer <= 0) {
                this.shieldActive = false;
                this.game.createFloatingText(this.collisionX, this.collisionY, "SHIELD OFF", "blue");
            }
            
            // Shield almost over warning
            if (this.shieldTimer <= 1000 && Math.floor(this.shieldTimer / 200) % 2 === 0) {
                this.shieldOpacity = 0.2;
            }
        }
    resize(){
        this.width = this.spriteWidth * this.game.ratio;
        this.height = this.spriteHeight * this.game.ratio;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speedY = -8 * this.game.ratio;
        this.flapSpeed = 5 * this.game.ratio;
        this.collisionRadius = 40 * this.game.ratio;
        this.collisionX = this.x + this.width * 0.7;
        this.collided = false;
        this.barSize = Math.floor(5 * this.game.ratio);
        this.energy = 30;
        this.frameY = 0;
        this.charging = false;
    }
    startCharge(){
        if(this.energy >= this.minEnergy && !this.charging) {
            this.charging = true;
            this.game.speed = this.game.maxSpeed;
            this.wingsCharge();
            this.game.sound.play(this.game.sound.charge);
        } else {
            this.stopCharge();
        }
    }
    stopCharge(){
        this.charging = false;
        this.game.speed = this.game.minSpeed;
    }
    wingsIdle(){
        if (!this.charging) this.frameY = 0;
    }
    wingsDown(){
        if (!this.charging) this.frameY = 1;
    }
    wingsUp(){
        if (!this.charging) this.frameY = 2;
    }
    wingsCharge(){
        this.frameY = 3;
    }
    isTouchingTop(){
        return this.y <= 0;
    }
    isTouchingBottom(){
        return this.y >= this.game.height - this.height - this.game.bottomMargin;
    }
    handleEnergy(){
        if(this.game.eventUpdate){
            if(this.energy < this.maxEnergy){
                this.energy += 2;
            }
            if(this.charging){
                this.energy -= 5;
                if(this.energy <= 0){
                    this.energy = 0;
                    this.stopCharge();
                }
            }
        }
    }
    flap(){
        this.stopCharge();
        if(!this.isTouchingTop()){
            this.speedY = -this.flapSpeed;
            this.game.sound.play(this.game.sound.flapSounds[Math.floor(Math.random() * this.game.sound.flapSounds.length)]);
            this.wingsDown();
        }

    }
}
