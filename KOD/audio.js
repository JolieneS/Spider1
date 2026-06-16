

const clickSound = document.getElementById('click-sound');
const winnerSound = document.getElementById('winner-sound');

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function playWinner() {
  winnerSound.currentTime = 0;
  winnerSound.play();
}