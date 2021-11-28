let codepoint = 0
let clock = 0
const speedInput = document.getElementById("speed")
const textOutput = document.getElementById("unicodeoutput")
setInterval(() => {
  clock++
  if (clock === 100 - Number(speedInput.value)) {
    clock = 0
    textOutput.innerText += String.fromCharCode(codepoint++)
  }
}, 77)
