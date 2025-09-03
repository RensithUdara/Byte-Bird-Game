# Byte Bird Game

A modern and enhanced version of the classic Flappy Bird game, featuring multiple power-ups, difficulty levels, and visual effects.

## 🎮 Play Now

Open `index.html` in your browser to start playing immediately, or set up a local server for the best experience.

## 📝 Table of Contents
- [Features](#features)
- [How to Play](#how-to-play)
- [Controls](#controls)
- [Power-ups](#power-ups)
- [Difficulty Levels](#difficulty-levels)
- [Installation](#installation)
- [Development](#development)
- [Credits](#credits)

## ✨ Features

### Core Gameplay
- Classic Flappy Bird-style gameplay with modern enhancements
- Smooth animations and physics
- Responsive design that works on both desktop and mobile devices
- Persistent high score system

### Advanced Features
- **Power-up System**: Collect special items to gain advantages
- **Multiple Difficulty Levels**: Choose between Easy, Medium, and Hard
- **Visual Effects**: Particle explosions, floating text, and animations
- **Energy Management**: Strategic energy usage for special abilities
- **Shield System**: Protection from obstacles
- **Time Manipulation**: Slow down the game speed temporarily

## 🕹️ How to Play

The objective is simple: fly through the level avoiding obstacles for as long as possible. Each obstacle you pass increases your score.

### Controls

#### Desktop Controls:
- **Space / Mouse Click**: Flap wings
- **Shift / C key**: Activate charge mode (uses energy)
- **P key**: Pause game
- **R key**: Restart game
- **F key**: Toggle fullscreen
- **D key**: Toggle debug mode

#### Mobile Controls:
- **Tap**: Flap wings
- **Swipe right**: Activate charge mode
- **Touch buttons**: Restart, pause, fullscreen, and debug

### Power-ups

During gameplay, collect power-ups to gain special abilities:

| Power-up | Color | Effect |
|----------|-------|--------|
| Energy | Orange | Restores energy for charge ability |
| Shield | Blue | Protects from one collision |
| Slow Time | Purple | Reduces game speed temporarily |

### Difficulty Levels

| Level | Description |
|-------|-------------|
| Easy | Lower gravity, slower obstacles, more frequent power-ups |
| Medium | Balanced difficulty with standard physics |
| Hard | Higher gravity, faster and more varied obstacles, less frequent power-ups |

## 🚀 Installation

### Method 1: Direct Download
1. Download the repository
2. Extract all files
3. Open `index.html` in your web browser

### Method 2: Using a local server (recommended)
1. Download the repository
2. Extract all files
3. In the project directory, run a local server:
   ```
   # If you have Python installed:
   python -m http.server 8000
   
   # If you have Node.js installed:
   npx http-server
   ```
4. Open your browser and navigate to `http://localhost:8000`

## 🧠 Development

The game is built using vanilla JavaScript with HTML5 Canvas and follows an object-oriented architecture:

```
├── assets/
│   ├── images/      # Game sprites and images
│   ├── scripts/     # JavaScript files
│   │   ├── audio.js         # Audio control system
│   │   ├── background.js    # Scrolling background
│   │   ├── effects.js       # Visual effects (particles, text)
│   │   ├── main.js          # Main game loop and logic
│   │   ├── obstacle.js      # Obstacle generation and behavior
│   │   ├── player.js        # Player character control
│   │   └── powerup.js       # Power-up system
│   └── sounds/      # Game audio files
├── index.html       # Main HTML file
├── style.css        # Styling
└── README.md        # This file
```

### Key Classes:
- `Game`: Main game controller
- `Player`: Player character with physics and controls
- `Obstacle`: Obstacle generation and behavior
- `PowerUp`: Power-up system with different effects
- `Background`: Parallax scrolling background
- `AudioControl`: Sound management
- `VisualEffect`: Text and visual indicators
- `Particle`: Particle effects system

## 🌟 Future Enhancements
- Additional character skins
- More power-up types
- Online leaderboard
- Achievement system
- Level progression

## 🙏 Credits

- Game developed by [Your Name/Team]
- Font: Bungee from Google Fonts
- Icons: Font Awesome
- Sound effects: Original creation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Enjoy playing Byte Bird Game! If you have any feedback or suggestions, please create an issue on our GitHub repository.
