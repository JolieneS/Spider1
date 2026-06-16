# 🕷️ Spider Number Game

A browser-based psychological numbers game inspired by the Keynesian Beauty Contest from the manga/anime *Liar Game*. Built entirely with pure HTML5, CSS3, and Vanilla JavaScript—no frameworks, no external libraries.

---

## 📖 What is the Keynesian Beauty Contest?

In this game, players don't try to pick the "best" number—they try to predict what everyone else will pick. The target is always **80% of the average** of all submitted numbers. 

Rational players keep second-guessing each other, driving the target number closer and closer down toward zero. The ultimate twist: thinking too hard or over-strategizing can hurt you if your opponent plays simple.

---

## 🎮 How to Play

1. You and the Bot each secretly choose a number between **0 and 100**.
2. The average of both numbers is calculated.
3. That average is multiplied by **0.8** to determine the **Spider Number**.
4. Whoever is closest to the Spider Number wins the round.
5. The loser of the round loses a heart (`❤️`).
6. Each player starts with **3 lives**. The first player to lose all 3 lives loses the game!

---

## 🖥️ Screen Layouts

*   **Intro Screen:** Full-screen stylized image layout with a single, clear "Play" action button.
*   **Rules Screen:** Outlines the core Keynesian math logic with a "Start Game" action trigger.
*   **Game Screen:** Contains dynamic numeric inputs, a real-time hearts tracker, and an animated round outcomes panel.
*   **End Screen:** Displays the final win/loss match status alongside a quick replay trigger.

### 📸 Screenshots
*(Place your screenshots inside the root repository directory using these exact file names to display them automatically below)*

#### Intro Screen
<img width="891" height="452" alt="image" src="https://github.com/user-attachments/assets/e16061ed-fa34-44ba-8f1d-fe92cda28419" />


#### Rules Screen
<img width="563" height="461" alt="image" src="https://github.com/user-attachments/assets/371869d4-bf7a-4b53-9640-5d88232dd990" />


#### Game Screen
<img width="940" height="443" alt="image" src="https://github.com/user-attachments/assets/6758f63c-275d-45de-91ee-896ac7d81e29" />


#### End Screen
<img width="615" height="374" alt="image" src="https://github.com/user-attachments/assets/8ae536cc-9a20-4e39-b996-9663afd1b38d" />


---

## 🗂️ Project Structure

```text
spider-game/
├── index.html       # Unified semantic HTML5 screen structures
├── style.css        # Layouts, flexbox system, and micro-interactions
├── script.js        # Core game mechanics and mathematical rules engine
├── audio.js         # Web Audio handler isolation layer
├── kodintro.png     # Clean intro screen background graphic
├── kodgame.png      # Clean main game frame background graphic
└── sound/
    ├── click.wav    # Feedback sound for UI buttons
    └── winner.wav   # Round conclusion celebration sound
