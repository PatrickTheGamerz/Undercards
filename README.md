<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Undertale Card Battle</title>
  <style>
    body {
      background: black;
      font-family: 'Courier New', monospace;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    .zone {
      border: 2px dashed #555;
      padding: 20px;
      margin: 10px;
      min-height: 150px;
      width: 80%;
      display: flex;
      justify-content: center;
      gap: 20px;
    }

    .card {
      background: #111;
      border: 3px solid white;
      border-radius: 10px;
      padding: 10px;
      width: 120px;
      text-align: center;
      box-shadow: 0 0 10px white;
      cursor: grab;
    }

    .card img {
      width: 80px;
      height: 80px;
      image-rendering: pixelated;
      border: 2px solid #fff;
      border-radius: 6px;
    }

    .card-title {
      font-weight: bold;
      margin-top: 5px;
    }

    .card-stats {
      font-size: 14px;
      margin-top: 5px;
    }

    #battle-log {
      margin-top: 20px;
      background: #222;
      padding: 10px;
      width: 80%;
      min-height: 80px;
      border: 2px solid #555;
    }
  </style>
</head>
<body>
  <h1>Undertale Card Battle</h1>

  <!-- Player hand -->
  <div class="zone" id="player-hand"></div>

  <!-- Battlefield -->
  <div class="zone" id="battlefield"></div>

  <!-- AI hand -->
  <div class="zone" id="ai-hand"></div>

  <div id="battle-log">Battle log will appear here...</div>

  <script>
    // Example deck
    const deck = [
      { name: "Sans", atk: 5, def: 3, img: "https://placekitten.com/100/100" },
      { name: "Papyrus", atk: 7, def: 6, img: "https://placebear.com/100/100" },
      { name: "Flowey", atk: 4, def: 2, img: "https://placebeard.it/100x100" }
    ];

    const playerHand = document.getElementById("player-hand");
    const aiHand = document.getElementById("ai-hand");
    const battlefield = document.getElementById("battlefield");
    const log = document.getElementById("battle-log");

    // Deal cards
    function dealCards() {
      deck.forEach(card => {
        const cardEl = createCardElement(card);
        cardEl.draggable = true;
        cardEl.addEventListener("dragstart", e => {
          e.dataTransfer.setData("text/plain", JSON.stringify(card));
        });
        playerHand.appendChild(cardEl);
      });

      // AI gets random cards
      deck.forEach(card => {
        const cardEl = createCardElement(card);
        aiHand.appendChild(cardEl);
      });
    }

    // Create card DOM
    function createCardElement(card) {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `
        <img src="${card.img}" alt="${card.name}">
        <div class="card-title">${card.name}</div>
        <div class="card-stats">ATK: ${card.atk} | DEF: ${card.def}</div>
      `;
      return el;
    }

    // Battlefield drop
    battlefield.addEventListener("dragover", e => e.preventDefault());
    battlefield.addEventListener("drop", e => {
      e.preventDefault();
      const card = JSON.parse(e.dataTransfer.getData("text/plain"));
      playCard(card);
    });

    function playCard(playerCard) {
      battlefield.innerHTML = ""; // clear
      battlefield.appendChild(createCardElement(playerCard));

      // AI plays random card
      const aiCard = deck[Math.floor(Math.random() * deck.length)];
      battlefield.appendChild(createCardElement(aiCard));

      // Resolve battle
      if (playerCard.atk > aiCard.def) {
        log.innerText = `${playerCard.name} defeats ${aiCard.name}!`;
      } else if (aiCard.atk > playerCard.def) {
        log.innerText = `${aiCard.name} defeats ${playerCard.name}!`;
      } else {
        log.innerText = `It's a draw between ${playerCard.name} and ${aiCard.name}.`;
      }
    }

    dealCards();
  </script>
</body>
</html>
