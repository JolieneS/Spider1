# 🔦 Hawkins Labyrinth

A browser-based survival game set in the Stranger Things universe. Navigate a 5×5 grid between the Real World and the Upside Down, use psychic inventory power-ups, find the Exit, and escape before Vecna grows too powerful. Built with pure HTML, CSS, and JavaScript.

## 🎮 Game Concept
You are trapped in a shifting 5×5 labyrinth that blurs the line between our world and the Upside Down. Your only hope is to navigate the grid, survive the toxic environment, and find the exit gate. But be warned — Vecna is gathering strength. The longer you stay, the more powerful he becomes. Reach the exit with more HP than Vecna to close the gate forever.

## 🕹️ How to Play
* You start at the bottom-left cell of a 5×5 grid with **75 HP**.
* Every turn, roll the dice (generates a number 1–10).
* Click an adjacent cell (up, down, left, right — no diagonals).
* Each hidden cell has a secret requirement number (1–10).
* If your roll ≥ requirement, you enter the cell and it flips to reveal its type.
* If your roll is too low, your turn ends — try again.
* On your first move, Vecna wakes up at 5 HP and gains +1 HP every second.
* You can use your limited inventory power-ups to survive:
  * **Psychic Power:** Bypasses a cell requirement check to let you move instantly.
  * **Flamethrower:** Burns away and destroys a toxic cell directly ahead of your path.
* Cells are either:
  * 🟢 **Real World:** Safe, no HP loss.
  * 🔴 **Upside Down:** Toxic, lose 5 HP.
  * 🔵 **Exit:** Escape point, triggers final comparison.
* Reach the Exit with Player HP strictly greater than Vecna HP to win.

## ⚔️ Win Condition
* Player HP > Vecna HP → You Win → Gate is closed
* Player HP ≤ Vecna HP → Vecna Wins → Hawkins is lost

## 🖥️ Screens
* **Intro:** Full screen image featuring a lowered, transparent menu activation button.
* **Rules:** Complete rules list, Start button.
* **Game:** Split layout — dice & power-up inventory on the left, grid on the right, HP counters in the corners.
* **End:** Win or loss result with replay button.

## 🎥 Gameplay Demo Video
---

## 📸 Screenshots
### Intro Screen
<img width="929" height="478" alt="image" src="https://github.com/user-attachments/assets/1fa04bb2-295f-48ef-987f-e89437a37ca4" />

### Rules Screen
<img width="521" height="408" alt="image" src="https://github.com/user-attachments/assets/62a6a5b6-3ed2-4d96-95a4-522206c120ad" />

### Game Screen
<img width="940" height="457" alt="image" src="https://github.com/user-attachments/assets/718d12e9-9adc-4572-98fd-cf4d831afc17" />

### End Screen

<img width="635" height="222" alt="image" src="https://github.com/user-attachments/assets/8469d5d4-4d03-4bce-b1b9-c9ce5151dfdf" />


## 🗂️ Project Structure
```text
hawkins-labyrinth/
├── index.html        # All screen markup and UI structures
├── style.css         # Styling, transparent buttons, red borders, grid animations
├── script.js         # Full game state logic, player health tracking
├── audio.js          # All sound functions
├── intro.png         # Main splash screen artwork
├── game.png          # Primary battle environment background
└── sound/
    ├── HLintro.wav   # Intro and rules screen music (loops)
    ├── dice.wav      # Dice roll sound
    ├── tick.wav      # Vecna ticking background (loops during game)
    └── click.wav     # Button click sound
