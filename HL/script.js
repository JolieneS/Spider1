let grid = [];
let playerRow = 4;
let playerCol = 0;
let playerHP = 75;
let vecnaHP = 0;
let diceRoll = null;
let timerStarted = false;
let vecnaInterval = null;
let rollUsed = false;
let psychicPowerCount = 1;
let flamethrowerCount = 1;
let activePowerUp = null; 


function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}


function initGame() {
  stopIntro();

  
  playerRow = 4;
  playerCol = 0;
  playerHP = 75;
  vecnaHP = 0;
  diceRoll = null;
  timerStarted = false;
  rollUsed = false;

  
  psychicPowerCount = 1;
  flamethrowerCount = 1;
  activePowerUp = null;

  if (vecnaInterval) {
    clearInterval(vecnaInterval);
    vecnaInterval = null;
  }
  stopTick();

  document.getElementById('player-hp').textContent = playerHP;
  document.getElementById('vecna-hp').textContent = vecnaHP;
  document.getElementById('dice-face').textContent = '?';
  document.getElementById('roll-btn').disabled = false;
  document.getElementById('roll-hint').textContent = '';

  updatePowerUpUI();
  buildGrid();
}


function buildGrid() {
  grid = [];

  
  const exitOptions = [3, 4, 8, 9];
  const exitIndex = exitOptions[Math.floor(Math.random() * exitOptions.length)];

  
  let pool = [];
  for (let i = 0; i < 25; i++) {
    if (i !== exitIndex && i !== 20 && i !== 21) {
      pool.push(i);
    }
  }
  
  pool.sort(() => Math.random() - 0.5);
  const demoIndex1 = pool[0];
  const demoIndex2 = pool[1];
  const mindFlayerIndex = pool[2];

  for (let i = 0; i < 25; i++) {
    const row = Math.floor(i / 5);
    const col = i % 5;
    let type;

    if (i === exitIndex) {
      type = 'exit';
    } else if (i === demoIndex1 || i === demoIndex2) {
      type = 'demogorgon';
    } else if (i === mindFlayerIndex) {
      type = 'mindflayer';
    } else {
      type = Math.random() < 0.5 ? 'real-world' : 'upside-down';
    }

    grid.push({
      row,
      col,
      type,
      requirement: Math.floor(Math.random() * 10) + 1,
      revealed: false,
      burned: false 
    });
  }

  
  grid[20].revealed = true;
  grid[20].type = 'real-world';
  grid[21].requirement = 1; 

  renderGrid();
}


function renderGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';

  grid.forEach((cell, index) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';

    
    let backContent = '';
    if (cell.type === 'real-world') backContent = 'Hawkins';
    if (cell.type === 'upside-down') backContent = ' Vines';
    if (cell.type === 'demogorgon') backContent = '<img src="img/HLdemogorgon.png" alt="Demogorgon">';
    if (cell.type === 'mindflayer') backContent = '<img src="img/HLmindflyer.png" alt="Mind Flayer">';
    if (cell.type === 'exit') backContent = 'GATEWAY';

    cellEl.innerHTML = `
      <div class="cell-inner">
        <div class="cell-front">${cell.burned ? 'BURNED' : cell.requirement}</div>
        <div class="cell-back">${backContent}</div>
      </div>
    `;

    if (cell.revealed) {
      cellEl.classList.add(cell.type);
      cellEl.classList.add('flipped');
    }

    if (cell.row === playerRow && cell.col === playerCol) {
      cellEl.classList.add('player');
    }

    
    cellEl.addEventListener('click', () => handleCellClick(index));

    gridEl.appendChild(cellEl);
  });
}


function rollDice() {
  if (rollUsed || activePowerUp !== null) return;

  playDice();
  const diceFace = document.getElementById('dice-face');
  diceFace.classList.add('rolling');

  
  let counter = 0;
  let rollingInterval = setInterval(() => {
    diceFace.textContent = Math.floor(Math.random() * 10) + 1;
    counter++;
    if (counter > 6) {
      clearInterval(rollingInterval);
      
      
      diceRoll = Math.floor(Math.random() * 10) + 1;
      diceFace.textContent = diceRoll;
      diceFace.classList.remove('rolling');
      document.getElementById('roll-btn').disabled = true;
      
      highlightCells();
    }
  }, 70);
}


function highlightCells() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cellEl, index) => {
    cellEl.classList.remove('reachable', 'unreachable', 'burned-target');
    const cell = grid[index];

    
    if (activePowerUp === null && diceRoll !== null) {
      if (isAdjacent(cell.row, cell.col) && !cell.revealed) {
        if (cell.burned || diceRoll >= cell.requirement) {
          cellEl.classList.add('reachable');
        } else {
          cellEl.classList.add('unreachable');
        }
      }
    }
    
    else if (activePowerUp === 'flamethrower') {
      if (isAdjacent(cell.row, cell.col) && !cell.revealed) {
        cellEl.classList.add('burned-target');
      }
    }
  });
}

function isAdjacent(row, col) {
  const rowDiff = Math.abs(row - playerRow);
  const colDiff = Math.abs(col - playerCol);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}


function handleCellClick(index) {
  if (activePowerUp === 'flamethrower') {
    useFlamethrowerAbility(index);
  } else {
    tryMove(index);
  }
}


function tryMove(index) {
  if (diceRoll === null) return;
  const cell = grid[index];

  if (!isAdjacent(cell.row, cell.col)) return;

  if (cell.revealed) {
    movePlayer(cell.row, cell.col);
    return;
  }

  
  if (!cell.burned && diceRoll < cell.requirement) {
    document.getElementById('roll-hint').textContent = `Need ${cell.requirement}, rolled ${diceRoll}. Can't enter!`;
    return;
  }

  cell.revealed = true;
  movePlayer(cell.row, cell.col);
  flipCell(index);
}

function movePlayer(row, col) {
  if (!timerStarted) {
    timerStarted = true;
    vecnaHP = 5;
    document.getElementById('vecna-hp').textContent = vecnaHP;
    startTick();

    vecnaInterval = setInterval(() => {
      vecnaHP++;
      const vecnaHPEl = document.getElementById('vecna-hp');
      vecnaHPEl.textContent = vecnaHP;
      
      // Dynamic Visual Pulse on health element syncopated to timer loop
      vecnaHPEl.parentElement.classList.add('pulse-vecna');
      setTimeout(() => {
        vecnaHPEl.parentElement.classList.remove('pulse-vecna');
      }, 300);

    }, 1000);
  }

  playerRow = row;
  playerCol = col;

  diceRoll = null;
  rollUsed = false;
  document.getElementById('roll-btn').disabled = false;
  document.getElementById('dice-face').textContent = '?';
  document.getElementById('roll-hint').textContent = '';

  renderGrid();

  updatePowerUpUI();
}


function triggerDamageEffects() {
  document.body.classList.add('damage-flash');
  document.getElementById('game-screen').classList.add('screen-shake');
  
  setTimeout(() => {
    document.body.classList.remove('damage-flash');
    document.getElementById('game-screen').classList.remove('screen-shake');
  }, 500);
}

function flipCell(index) {
  const cell = grid[index];
  renderGrid(); 

  setTimeout(() => {
    
    if (cell.type === 'upside-down') {
      playerHP -= 5; 
      triggerDamageEffects();
    } else if (cell.type === 'demogorgon') {
      playerHP -= 10; 
      triggerDamageEffects();
    } else if (cell.type === 'mindflayer') {
      playerHP -= 15; 
      triggerDamageEffects();
    }

    playerHP = Math.max(0, playerHP);
    document.getElementById('player-hp').textContent = playerHP;

    if (playerHP === 0) {
      endGame(false);
      return;
    }

    if (cell.type === 'exit') {
      clearInterval(vecnaInterval);
      stopTick();
      if (playerHP > vecnaHP) {
        endGame(true);
      } else {
        endGame(false);
      }
    }
  }, 500);
}


function selectPsychic() {
  if (psychicPowerCount <= 0 || timerStarted === false) return;
  
  
  if (activePowerUp === 'psychic') {
    activePowerUp = null;
    updatePowerUpUI();
    highlightCells();
    return;
  }
  
  activePowerUp = 'psychic';
  updatePowerUpUI();

  
  grid.forEach((cell, idx) => {
    if (isAdjacent(cell.row, cell.col) && !cell.revealed) {
      cell.revealed = true;
    }
  });

  psychicPowerCount--;
  activePowerUp = null; 
  updatePowerUpUI();
  renderGrid();
  highlightCells();
}

function selectFlamethrower() {
  if (flamethrowerCount <= 0 || timerStarted === false) return;
  
  if (activePowerUp === 'flamethrower') {
    activePowerUp = null;
  } else {
    activePowerUp = 'flamethrower';
  }
  updatePowerUpUI();
  highlightCells();
}

function useFlamethrowerAbility(targetIndex) {
  const cell = grid[targetIndex];
  if (!isAdjacent(cell.row, cell.col) || cell.revealed) return;

  
  cell.burned = true;
  flamethrowerCount--;
  activePowerUp = null;
  
  updatePowerUpUI();
  renderGrid();
  
  
  if (diceRoll !== null) {
    highlightCells();
  }
}

function updatePowerUpUI() {
  const pBtn = document.getElementById('btn-psychic');
  const fBtn = document.getElementById('btn-flamethrower');

  pBtn.querySelector('.count').textContent = psychicPowerCount;
  fBtn.querySelector('.count').textContent = flamethrowerCount;

  pBtn.classList.remove('active-power');
  fBtn.classList.remove('active-power');

  if (activePowerUp === 'psychic') pBtn.classList.add('active-power');
  if (activePowerUp === 'flamethrower') fBtn.classList.add('active-power');

  
  if (!timerStarted) {
    pBtn.disabled = true;
    fBtn.disabled = true;
  } else {
    pBtn.disabled = psychicPowerCount <= 0;
    fBtn.disabled = flamethrowerCount <= 0;
  }
}


function endGame(playerWon) {
  clearInterval(vecnaInterval);
  stopTick();

  const title = document.getElementById('end-title');
  const msg = document.getElementById('end-message');

  if (playerWon) {
    title.textContent = ' You saved the world';
    title.style.color = '#00f0ff';
    msg.textContent = `You had ${playerHP} HP. Vecna had ${vecnaHP} HP. The gate is closed.`;
  } else {
    title.textContent = ' Vecna captures the universe';
    title.style.color = '#e63946';
    msg.textContent = `You had ${playerHP} HP. Vecna had ${vecnaHP} HP. Hawkins is lost.`;
  }

  setTimeout(() => showScreen('end-screen'), 800);
  startIntro();
}
