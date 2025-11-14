<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Undertale Card Game</title>
  <style>
    body {
      background: black;
      font-family: 'Courier New', monospace;
      color: white;
      text-align: center;
    }

    .game-area {
      display: flex;
      justify-content: space-around;
      margin-top: 40px;
    }

    .card {
      background: #111;
      border: 4px solid white;
      padding: 20px;
      width: 200px;
      box-shadow: 0 0 10px white;
    }

    .card img {
      width: 100px;
      height: 100px;
      image-rendering: pixelated;
    }

    .card-title {
      font-size: 18px;
      margin-top: 10px;
      text-transform: uppercase;
    }

    .stats {
      margin-top: 10px;
      font-size: 14px;
      color: #ccc;
    }

    button {
      margin-top: 20px;
      padding: 10px 20px;
      font-family: inherit;
      background: #222;
      color: white;
      border: 2px solid white;
      cursor: pointer;
    }

    button:hover {
      background: #ff0000;
      border-color: #ff0000;
    }

    #result {
      margin-top: 30px;
      font-size: 20px;
      color: #ff0000;
    }
  </style>
</head>
<body>
  <h1>Undertale Card Battle</h1>
  <div class="game-area">
    <div id="player-card" class="card"></div>
    <div id="enemy-card" class="card"></div>
  </div>
  <button onclick="playRound()">Draw Cards</button>
  <div id="result"></div>

  <script>
    const deck = [
      { name: "Sans", img: "https://placekitten.com/100/100", atk: 7, def: 5 },
      { name: "Papyrus", img: "https://placebear.com/100/100", atk: 5, def: 8 },
      { name: "Flowey", img: "https://placebeard.it/100x100", atk: 9, def: 3 },
      { name: "Toriel", img: "https://placekitten.com/101/101", atk: 6, def: 7 },
      { name: "Undyne", img: "https://placebear.com/101/101", atk: 8, def: 6 }
    ];

    function drawCard() {
      return deck[Math.floor(Math.random() * deck.length)];
    }

    function renderCard(card, elementId) {
      document.getElementById(elementId).innerHTML = `
        <img src="${card.img}" alt="${card.name}">
        <div class="card-title">${card.name}</div>
        <div class="stats">ATK: ${card.atk} | DEF: ${card.def}</div>
      `;
    }

    function playRound() {
      const player = drawCard();
      const enemy = drawCard();
      renderCard(player, "player-card");
      renderCard(enemy, "enemy-card");

      let resultText = "";
      if (player.atk > enemy.def) {
        resultText = `${player.name} wins the round!`;
      } else if (enemy.atk > player.def) {
        resultText = `${enemy.name} wins the round!`;
      } else {
        resultText = "It's a tie!";
      }
      document.getElementById("result").textContent = resultText;
    }
  </script>
</body>
</html>
