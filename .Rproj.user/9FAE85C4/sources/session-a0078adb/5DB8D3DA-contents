// script.js
const heartSquares = document.getElementsByClassName("heart-square");

for (let i = 0; i < heartSquares.length; i++) {
  const heartSquare = heartSquares[i];

  heartSquare.addEventListener("animationend", (_event) => {
    heartSquare.classList.remove("animated");
  });

  heartSquare.addEventListener("mouseover", (_event) => {
    heartSquare.classList.add("animated");
  });
}