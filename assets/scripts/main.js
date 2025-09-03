class Game {
    constructor(canvas, context){
        this.canvas = canvas;
        this.ctx = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.baseHeight = 720;
        this.ratio = this.height / this.baseHeight;
        this.background = new Background(this);
        this.player = new Player(this);
        this.sound = new AudioControl();
        this.obstacles = [];
        this.powerUps = [];
        this.particles = [];
        this.visualEffects = [];
        this.numberOfObstacles = 2000;
        this.gravity;
        this.speed;
        this.minSpeed;
        this.maxSpeed;
        this.score;
        this.highScore = localStorage.getItem('flappyHighScore') ? parseInt(localStorage.getItem('flappyHighScore')) : 0;
        this.finalScore;
        this.gameOver;
        this.bottomMargin;
        this.timer;
        this.message1;
        this.message2;
        this.smallFont;
        this.largeFont;
        this.eventTimer = 0;
        this.eventInterval = 150;
        this.eventUpdate = false;
        this.touchStartX;
        this.swipeDistance = 50;
        this.debug = false;
        this.gamePaused = false;
        this.difficultyLevel = localStorage.getItem('flappyDifficulty') ? parseInt(localStorage.getItem('flappyDifficulty')) : 1; // 1=Easy, 2=Medium, 3=Hard
        this.powerUpTimer = 0;
        this.powerUpInterval = 10000; // Power-up every 10 seconds
        this.timeSlowActive = false;
        this.timeSlowTimer = 0;
        this.originalSpeed = 0;
        this.restartButton = document.getElementById('restartButton');
        this.fullScreenButton = document.getElementById('fullScreenButton');
        this.debugButton = document.getElementById('debugButton');
        this.pauseButton = document.getElementById('pauseButton') || this.createPauseButton();


        this.resize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', e => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
        });

        // buttons
        this.restartButton.addEventListener('click', e => {
            this.resize(window.innerWidth, window.innerHeight);
        });
        this.fullScreenButton.addEventListener('click', e => {
            this.toggleFullScreen();
        });
        this.debugButton.addEventListener('click', e => {
            this.debug = !this.debug;
        });
        if (this.pauseButton) {
            this.pauseButton.addEventListener('click', e => {
                this.togglePause();
            });
        }

        // mouse
        this.canvas.addEventListener('mousedown', e => {
            if (!this.gamePaused) {
                this.player.flap();
            } else {
                // Check if click is on the difficulty buttons
                this.handleDifficultyClick(e.offsetX, e.offsetY);
            }
        });
        this.canvas.addEventListener('mouseup', e => {
            setTimeout(() => {
                this.player.wingsUp();
            }, 50);
        });

        // keyboard
        window.addEventListener('keydown', e => {
            if ((e.key===' ' || e.key==='Enter') && !this.gamePaused){
                this.player.flap();
            }
            if ((e.key === 'Shift' || e.key.toLowerCase() === 'c') && !this.gamePaused){
                this.player.startCharge();
            }
            if (e.key.toLowerCase() === 'r') this.resize(window.innerWidth, window.innerHeight);
            if (e.key.toLowerCase() === 'f') this.toggleFullScreen();
            if (e.key.toLowerCase() === 'd') this.debug = !this.debug;
            if (e.key.toLowerCase() === 'p') this.togglePause();
            
            // Difficulty selection with number keys (1-3)
            if (this.gamePaused && e.key >= '1' && e.key <= '3') {
                this.setDifficulty(parseInt(e.key));
                this.togglePause();
            }
        });
        window.addEventListener('keyup', e => {
            this.player.wingsUp();
        });

        // touch
        this.canvas.addEventListener('touchstart', e => {
            this.player.flap();
            this.touchStartX = e.changedTouches[0].pageX;
        });
        this.canvas.addEventListener('touchmove', e => {
            e.preventDefault();
        });
        this.canvas.addEventListener('touchend', e => {
            if(e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance){
                this.player.startCharge();
            } else {
                this.player.flap();
            }
        });

    }
    createPauseButton() {
        const pauseButton = document.createElement('button');
        pauseButton.id = 'pauseButton';
        pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        document.querySelector('.controls').appendChild(pauseButton);
        return pauseButton;
    }
    
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.textAlign = 'right';
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'white';
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ratio = this.height / this.baseHeight;

        this.bottomMargin = Math.floor(50 * this.ratio);
        this.smallFont = Math.ceil(20 * this.ratio);
        this.largeFont = Math.ceil(45 * this.ratio);
        this.ctx.font = this.smallFont+'px Bungee';
        
        // Apply difficulty settings
        this.applyDifficultySettings();
        
        this.background.resize();
        this.player.resize();
        this.createObstacles();
        this.obstacles.forEach(obstacle => {
            obstacle.resize();
        });
        
        // Reset game state
        this.powerUps = [];
        this.particles = [];
        this.visualEffects = [];
        this.powerUpTimer = 0;
        this.timeSlowActive = false;
        this.timeSlowTimer = 0;
        this.score = 0;
        this.gameOver = false;
        this.gamePaused = false;
        this.timer = 0;
    }
    
    applyDifficultySettings() {
        switch(this.difficultyLevel) {
            case 1: // Easy
                this.gravity = 0.12 * this.ratio;
                this.speed = 1.8 * this.ratio;
                this.powerUpInterval = 8000; // More frequent power-ups
                break;
            case 2: // Medium (default)
                this.gravity = 0.15 * this.ratio;
                this.speed = 2 * this.ratio;
                this.powerUpInterval = 10000;
                break;
            case 3: // Hard
                this.gravity = 0.18 * this.ratio;
                this.speed = 2.5 * this.ratio;
                this.powerUpInterval = 15000; // Less frequent power-ups
                break;
        }
        this.minSpeed = this.speed;
        this.maxSpeed = this.speed * 5;
    }
    
    setDifficulty(level) {
        if (level >= 1 && level <= 3) {
            this.difficultyLevel = level;
            localStorage.setItem('flappyDifficulty', level.toString());
            this.applyDifficultySettings();
        }
    }
    render(deltaTime){
        if(!this.gameOver && !this.gamePaused) {
            this.timer += deltaTime;
            this.handlePeriodicEvents(deltaTime);
            this.handlePowerUpGeneration(deltaTime);
            this.handleTimeSlowEffect(deltaTime);
            
            this.background.update();
            this.player.update(deltaTime);
            
            // Update obstacles
            this.obstacles.forEach(obstacle => {
                obstacle.update();
            });
            
            // Update power-ups
            this.powerUps.forEach(powerUp => {
                powerUp.update();
            });
            this.powerUps = this.powerUps.filter(powerUp => !powerUp.markedForDeletion);
            
            // Update particles
            this.particles.forEach(particle => {
                particle.update(deltaTime);
            });
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            
            // Update visual effects (floating text)
            this.visualEffects.forEach(effect => {
                effect.update(deltaTime);
            });
            this.visualEffects = this.visualEffects.filter(effect => !effect.markedForDeletion);
        }
        
        // Always draw even when paused
        this.background.draw();
        
        this.obstacles.forEach(obstacle => {
            obstacle.draw();
        });
        
        this.powerUps.forEach(powerUp => {
            powerUp.draw();
        });
        
        this.particles.forEach(particle => {
            particle.draw();
        });
        
        this.player.draw();
        
        this.visualEffects.forEach(effect => {
            effect.draw();
        });
        
        this.drawStatusText();
        
        if (this.gamePaused && !this.gameOver) {
            this.drawPauseMenu();
        }
    }
    
    handlePowerUpGeneration(deltaTime) {
        // Generate power-ups periodically
        if (this.powerUpTimer < this.powerUpInterval) {
            this.powerUpTimer += deltaTime;
        } else {
            this.powerUpTimer = 0;
            
            // Only generate if there aren't too many on screen
            if (this.powerUps.length < 3) {
                const powerUpX = this.width + Math.random() * this.width * 0.5;
                this.powerUps.push(new PowerUp(this, powerUpX));
            }
        }
    }
    
    handleTimeSlowEffect(deltaTime) {
        if (this.timeSlowActive) {
            this.timeSlowTimer -= deltaTime;
            
            if (this.timeSlowTimer <= 0) {
                this.timeSlowActive = false;
                this.speed = this.originalSpeed;
                this.createFloatingText(this.player.collisionX, this.player.collisionY, "SPEED NORMAL", "purple");
            }
        }
    }
    createObstacles(){
        this.obstacles = [];
        const firstX = this.baseHeight * this.ratio;
        const obstacleSpacing = 600 * this.ratio;
        for(let i = 0; i < this.numberOfObstacles; i++){
            this.obstacles.push(new Obstacle(
                this, firstX + i * obstacleSpacing
            ));
        }
    }
    checkCollision(a,b) {
        const dx = a.collisionX - b.collisionX;
        const dy = a.collisionY - b.collisionY;
        const distance = Math.hypot(dx, dy);
        const sumOfRadii = a.collisionRadius + b.collisionRadius;
        return distance < sumOfRadii;

    }
    formatTimer(){
        return (this.timer * 0.001).toFixed(1);
    }
    handlePeriodicEvents(deltaTime){
        if(this.eventTimer < this.eventInterval){
            this.eventTimer += deltaTime;
            this.eventUpdate = false;
        } else {
            this.eventTimer = this.eventTimer % this.eventInterval;
            this.eventUpdate = true;
        }
    }
    triggerGameOver(){
        if (!this.gameOver) {
            this.gameOver = true;
            this.finalScore = this.score;
            
            // Check for high score
            if (this.finalScore > this.highScore) {
                this.highScore = this.finalScore;
                localStorage.setItem('flappyHighScore', this.highScore.toString());
                this.message1 = "NEW HIGH SCORE!";
            } else {
                if(this.obstacles.length <= 0){
                    this.sound.play(this.sound.win);
                    this.message1 = "Nailed it!";
                    this.message2 = "Can you do it faster than " + this.formatTimer() + " seconds?";
                } else {
                    this.sound.play(this.sound.lose);
                    this.message1 = "Getting rusty?";
                    this.message2 = "Collision time " + this.formatTimer() + " seconds!";
                    
                    // Create explosion particles
                    this.createExplosion(this.player.collisionX, this.player.collisionY, 20, 'orange');
                }
            }
        }
    }
    
    createFloatingText(x, y, text, color) {
        this.visualEffects.push(new VisualEffect(this, x, y, text, color));
    }
    
    createExplosion(x, y, amount, color) {
        for (let i = 0; i < amount; i++) {
            this.particles.push(new Particle(this, x, y, color));
        }
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        if (this.pauseButton) {
            this.pauseButton.innerHTML = this.gamePaused ? 
                '<i class="fas fa-play"></i>' : 
                '<i class="fas fa-pause"></i>';
        }
    }
    
    drawPauseMenu() {
        // Draw semi-transparent overlay
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw pause menu text
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'white';
        
        this.ctx.font = this.largeFont + 'px Bungee';
        this.ctx.fillText('GAME PAUSED', this.width * 0.5, this.height * 0.3);
        
        this.ctx.font = this.smallFont + 'px Bungee';
        this.ctx.fillText('Press P to resume', this.width * 0.5, this.height * 0.4);
        
        // Draw difficulty selection
        this.ctx.fillText('SELECT DIFFICULTY:', this.width * 0.5, this.height * 0.55);
        
        // Draw difficulty buttons
        const buttonWidth = this.width * 0.2;
        const buttonHeight = this.height * 0.07;
        const buttonY = this.height * 0.65;
        const buttonSpacing = this.width * 0.02;
        
        const difficultyLabels = ['EASY', 'MEDIUM', 'HARD'];
        const buttonColors = ['#44cc44', '#cccc44', '#cc4444'];
        
        for (let i = 0; i < 3; i++) {
            const buttonX = this.width * 0.5 - buttonWidth * 1.5 - buttonSpacing + (buttonWidth + buttonSpacing) * i;
            
            // Draw button background (highlight current difficulty)
            this.ctx.fillStyle = buttonColors[i];
            if (this.difficultyLevel === i + 1) {
                this.ctx.globalAlpha = 1;
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
            } else {
                this.ctx.globalAlpha = 0.7;
            }
            
            this.ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
            
            // Draw button text
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(difficultyLabels[i], buttonX + buttonWidth * 0.5, buttonY + buttonHeight * 0.65);
            
            // Store button positions for click detection
            this['difficultyButton' + (i+1)] = {
                x: buttonX,
                y: buttonY,
                width: buttonWidth,
                height: buttonHeight
            };
        }
        
        this.ctx.restore();
    }
    
    handleDifficultyClick(x, y) {
        for (let i = 1; i <= 3; i++) {
            const button = this['difficultyButton' + i];
            if (button && 
                x >= button.x && x <= button.x + button.width &&
                y >= button.y && y <= button.y + button.height) {
                this.setDifficulty(i);
                this.togglePause();
                return true;
            }
        }
        return false;
    }
    drawStatusText() {
        this.ctx.save();
        
        // Score and High Score
        this.ctx.fillText("Score: " + (this.gameOver ? this.finalScore : this.score), this.width - 10 - this.smallFont, this.largeFont);
        this.ctx.fillText("Best: " + this.highScore, this.width - 10 - this.smallFont, this.largeFont * 2);
        
        // Timer and difficulty
        this.ctx.textAlign = 'left';
        this.ctx.fillText("Timer: " + this.formatTimer(), this.smallFont, this.largeFont);
        
        const diffLabels = ['EASY', 'MEDIUM', 'HARD'];
        this.ctx.fillText("Difficulty: " + diffLabels[this.difficultyLevel - 1], this.smallFont, this.largeFont * 2);

        // Game over screen
        if (this.gameOver) {
            this.ctx.textAlign = 'center';
            this.ctx.font = this.largeFont + 'px Bungee';
            this.ctx.fillText(this.message1, this.width * 0.5, this.height * 0.5 - this.largeFont, this.width);
            this.ctx.font = this.smallFont + 'px Bungee';
            this.ctx.fillText(this.message2, this.width * 0.5, this.height * 0.5 - this.smallFont, this.width);
            this.ctx.fillText("Press 'R' to try again", this.width * 0.5, this.height * 0.5, this.width);
        }

        // Energy bar
        let shouldFlash = this.player.energy <= this.player.minEnergy && Math.floor(Date.now() / 300) % 2 === 0;

        for (let i = 0; i < this.player.energy; i++) {
            let energyRatio = this.player.energy / this.player.maxEnergy;
            let red = Math.floor(255 * (1 - energyRatio));
            let green = Math.floor(100 * energyRatio);
            let color = `rgb(${255}, ${green}, ${red})`;

            this.ctx.fillStyle = shouldFlash ? 'darkred' : color;
            this.ctx.fillRect(10, this.height - 10 - this.player.barSize * i, this.player.barSize * 5, this.player.barSize);
        }

        // Energy bar outline
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(8, this.height - 10 - this.player.barSize * this.player.maxEnergy, this.player.barSize * 5 + 4, this.player.barSize * this.player.maxEnergy + 4);
        
        // Active power-up indicators
        let powerUpY = this.height - 10 - this.player.barSize * this.player.maxEnergy - 30 * this.ratio;
        
        // Shield indicator
        if (this.player.shieldActive) {
            this.ctx.fillStyle = 'rgba(30, 144, 255, 0.8)';
            this.ctx.fillRect(10, powerUpY, this.player.barSize * 5, 20 * this.ratio);
            this.ctx.fillStyle = 'white';
            this.ctx.font = (this.smallFont * 0.8) + 'px Bungee';
            this.ctx.fillText("SHIELD", 12, powerUpY + 15 * this.ratio);
            powerUpY -= 25 * this.ratio;
        }
        
        // Slow time indicator
        if (this.timeSlowActive) {
            this.ctx.fillStyle = 'rgba(128, 0, 128, 0.8)';
            this.ctx.fillRect(10, powerUpY, this.player.barSize * 5, 20 * this.ratio);
            this.ctx.fillStyle = 'white';
            this.ctx.font = (this.smallFont * 0.8) + 'px Bungee';
            this.ctx.fillText("SLOW", 12, powerUpY + 15 * this.ratio);
        }

        this.ctx.restore();
    }



    toggleFullScreen() {
        if(document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }
}

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 720;
    canvas.height = 720;

    const game = new Game(canvas, ctx);

    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(deltaTime);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});
