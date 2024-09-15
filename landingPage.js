const characterSelection = document.getElementById("character-selection");
const startButton = document.getElementById("start-button");
let chosenCharacter = null;

characterSelection.addEventListener("click", (event) => {
  const clickedElement = event.target;
  if (clickedElement.classList.contains("character")) {
    console.log(clickedElement);
    chosenCharacter = clickedElement.dataset.character;
    characterSelection
      .querySelectorAll(".character")
      .forEach((character) => character.classList.remove("selected"));
    clickedElement.classList.add("selected"); // Visually indicate selected character
  }
});

startButton.addEventListener("click", () => {
  if (chosenCharacter) {
    window.location.href = `index.html?character=${chosenCharacter}`;
  } else {
    alert("Please choose a character!");
  }
});
