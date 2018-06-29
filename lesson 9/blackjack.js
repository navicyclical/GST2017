//pluralsight JS blackjack game

//card vars
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
let values = ["Ace", "King", "Queen", "Jack", "Ten", "Nine", "Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];

//DOM vars to let the game interact with the JS code
let gameText = document.getElementById("gameText");
let newGameButton = document.getElementById("newGameButton");
let hitButton = document.getElementById("hitButton");
let stayButton = document.getElementById("stayButton");

//game vars
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

//hide the hit/stay buttons until game has started
hitButton.style.display = "none";
stayButton.style.display = "none";

//logic for new game, hit and stay buttons
newGameButton.addEventListener("click", function(){
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  deck = createDeck();
  shuffleDeck(deck);
  newGameButton.style.display = "none";
  hitButton.style.display = "inline";
  stayButton.style.display = "inline";
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];
  gameStatus();
});

hitButton.addEventListener("click", function(){
  playerCards.push(getNextCard());
  checkForEndOfGame();
  gameStatus();
});

stayButton.addEventListener("click", function(){
  gameOver = true;
  checkForEndOfGame();
  gameStatus();
});

//function to create deck
function createDeck(){
  let deck = [];
  for (let i = 0; i < suits.length; i++){
    for (let j = 0; j < values.length; j++){
      let card = {
        suit: suits[i],
        value: values[j]
      };
      deck.push(card);
    }
  }
  return deck;
}

//shuffles the deck
function shuffleDeck(deck){
  for (let i = 0; i < deck.length; i++){
    let swapIndex = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIndex];
    deck[swapIndex] = deck[i];
    deck[i] = tmp;
  }
}

//gets individual card names
function getCardString(card){
  return card.value + " " + card.suit;
}

//gets the next card off the desk
function getNextCard(){
  return deck.shift();
}

//used to get numeric value of each card
function getCardNumericValue(card){
  switch(card.value){
    case "Ace":
    return 1;
    case "Two":
    return 2;
    case "Three":
    return 3;
    case "Four":
    return 4;
    case "Five":
    return 5;
    case "Six":
    return 6;
    case "Seven":
    return 7;
    case "Eight":
    return 8;
    case "Nine":
    return 9;
    default:
    return 10;
  }
}

//contains the scoring logic
function getScore(cards){
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cards.length; i++){
    let card = cards[i];
    score += getCardNumericValue(card);
    if (card.value === "Ace"){
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21){
    return score + 10;
  }
  return score;
}

//updates both the plater and dealer scores
function updateScores(){
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

//checks to see if the game ended and will let the dealer hit the deck until he busts
function checkForEndOfGame(){
  updateScores();
  if (gameOver){
    //let the dealer keep on hitting
    while (dealerScore < playerScore
      && playerScore <=21
      && dealerScore <=21){
      dealerCards.push(getNextCard());
      updateScores();
    }
  }
  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  } else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  } else if (gameOver) {
    if (playerScore > dealerScore){
      playerWon = true;
    } else {
      playerWon = false;
    }
  }
}
//main game function
function gameStatus(){
  if (!gameStarted){
    gameText.innerText = "Welcome to Blackjack, you may:";
    return;
  }
  let dealerCardString = "";
  for (var i = 0; i < dealerCards.length; i++){
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }
  let playerCardString = "";
  for (var i = 0; i < playerCards.length; i++){
    playerCardString += getCardString(playerCards[i]) + '\n';
  }
  updateScores();
  gameText.innerText =
  "dealer has:\n" + dealerCardString + "(score: " + dealerScore + ")\n\n\n" +
  "player has:\n" + playerCardString + "(score: " + playerScore + ")\n\n";
  if (gameOver){
    if (playerWon){
      gameText.innerText = "You won";
    }
    else {
      gameText.innerText = "you lost";
    }
    newGameButton.style.display = "inline";
    hitButton.style.display = "none";
    stayButton.style.display = "none";
  }
}
