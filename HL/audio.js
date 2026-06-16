
const diceSound = document.getElementById('dice-sound')
const tickSound = document.getElementById('tick-sound')
const introSound = document.getElementById('intro-sound')
const clickSound = document.getElementById('click-sound')



function playClick() {
  clickSound.currentTime = 0
  clickSound.play()
  
}


function playDice() {
  diceSound.currentTime = 0
  diceSound.play()
}


function startIntro() {
  introSound.currentTime = 0
  introSound.play()
  
}


function stopIntro() {
  introSound.pause()
  introSound.currentTime = 0
}


function startTick() {
  tickSound.currentTime = 0
  tickSound.play()
}


function stopTick() {
  tickSound.pause()
  tickSound.currentTime = 0
}