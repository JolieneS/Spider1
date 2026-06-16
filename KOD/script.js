let playerLives = 3;
let botLives = 3;
let round = 1;




function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}


function startGame() {
  playerLives = 3;
  botLives = 3;
  round = 1;
  renderHearts();
  document.getElementById('round-number').textContent = round;
  document.getElementById('result-area').classList.add('hidden');
  document.getElementById('input-area').classList.remove('hidden');
  document.getElementById('player-input').value = '';
  document.getElementById('submit-btn').disabled = false;
  showScreen('game-screen');
}


function renderHearts() {
  document.getElementById('player-hearts').textContent = '❤️'.repeat(playerLives);
  document.getElementById('bot-hearts').textContent = '❤️'.repeat(botLives);
}


function submitNumber() {
  const input = document.getElementById('player-input');
  const playerNum = parseInt(input.value);

  if (isNaN(playerNum) || playerNum < 0 || playerNum > 100) {
    alert('Please enter a number between 0 and 100');
    return;
  }

  const botNum = Math.floor(Math.random() * 101);
  const average = (playerNum + botNum) / 2;
  const spiderNum = average * 0.8;

  const playerDiff = Math.abs(playerNum - spiderNum);
  const botDiff = Math.abs(botNum - spiderNum);

  let winnerMsg = '';
  if (playerDiff < botDiff) {
    winnerMsg = ' You win this round!';
    botLives--;
  } else if (botDiff < playerDiff) {
    winnerMsg = ' Bot wins this round!';
    playerLives--;
  } else {
    winnerMsg = " It's a tie!";
  }

  
  playerLives = Math.max(0, playerLives);
  botLives = Math.max(0, botLives);

  renderHearts();

  document.getElementById('show-player-num').textContent = playerNum;
  document.getElementById('show-bot-num').textContent = botNum;
  document.getElementById('show-spider').textContent = spiderNum.toFixed(2);
  document.getElementById('round-winner-msg').textContent = winnerMsg;

  document.getElementById('input-area').classList.add('hidden');
  document.getElementById('result-area').classList.remove('hidden');

  playWinner();

  if (playerLives === 0 || botLives === 0) {
    setTimeout(checkEndGame, 1400);
  }
}

  renderHearts();

  document.getElementById('show-player-num').textContent = playerNum;
  document.getElementById('show-bot-num').textContent = botNum;
  document.getElementById('show-spider').textContent = spiderNum.toFixed(2);
  document.getElementById('round-winner-msg').textContent = winnerMsg;

  
  document.getElementById('input-area').classList.add('hidden');
  document.getElementById('result-area').classList.remove('hidden');

  
  playWinner();

  if (playerLives === 0 || botLives === 0) {
    setTimeout(checkEndGame, 1400);
  }



function nextRound() {
  round++;
  document.getElementById('round-number').textContent = round;
  document.getElementById('player-input').value = '';
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('result-area').classList.add('hidden');
  document.getElementById('input-area').classList.remove('hidden');
  
}


function checkEndGame() {
  const title = document.getElementById('end-title');
  const msg = document.getElementById('end-message');

  if (playerLives === 0 && botLives === 0) {
    title.textContent = '🤝 Draw!';
    msg.textContent = 'Both players ran out of hearts.';
  } else if (botLives === 0) {
    title.textContent = '🏆 You Win!';
    msg.textContent = 'The bot ran out of hearts. Well played!';
  } else {
    title.textContent = '💀 Game Over';
    msg.textContent = 'You ran out of hearts. Better luck next time.';
  }

  showScreen('end-screen');
}


function resetGame() {
  showScreen('intro-screen');
}