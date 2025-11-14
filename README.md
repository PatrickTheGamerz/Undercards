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
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }

    .card-container {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin: 20px;
    }

    .battlefield {
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      width: 100%;
      margin-top: 30px;
    }

    .zone {
      width: 45%;
      min-height: 220px;
      border: 2px dashed #555;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      color: #777;
      padding: 10px;
    }

    .hp-bar, .stamina-bar {
      width: 80%;
      height: 20px;
      background: #333;
      border: 2px solid white;
      border-radius: 8px;
      margin: 5px 0;
      position: relative;
    }

    .hp-fill {
      background: red;
      height: 100%;
      border-radius: 6px;
      width: 100%;
    }

    .stamina-fill {
      background: cyan;
      height: 100%;
      border-radius: 6px;
      width: 100%;
    }

    .card {
      background: #111;
      border: 4px solid white;
      border-radius: 12px;
      padding: 15px;
      width: 180px;
      text-align: center;
      box-shadow: 0 0 10px white;
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: grab;
      position: relative;
    }

    .card:hover {
      transform: rotateY(10deg) scale(1.05);
      box-shadow: 0 0 25px #ff0000;
      border-color: #ff0000;
    }

    .card-title {
      font-size: 18px;
      text-transform: uppercase;
      font-weight: bold;
    }

    .card-desc {
      font-size: 14px;
      margin-top: 5px;
      color: #ccc;
    }

    .rare { border-color: gold; box-shadow: 0 0 15px gold; }
    .epic { border-color: purple; box-shadow: 0 0 15px purple; }
    .common { border-color: gray; }
  </style>
</head>
<body>
  <h1>Undertale Card Battle</h1>

  <div id="player-info"></div>
  <div id="ai-info"></div>

  <div class="card-container" id="player-hand"></div>

  <div class="battlefield">
    <div class="zone" id="player-zone">Player Zone</div>
    <div class="zone" id="ai-zone">AI Zone</div>
  </div>

  <button id="ai-play">AI Play</button>
  <div id="result"></div>

  <script>
    const playerZone = document.getElementById('player-zone');
    const aiZone = document.getElementById('ai-zone');
    const result = document.getElementById('result');
    const playerHand = document.getElementById('player-hand');

    // Characters
    const characters = [
      { name: "FRISK", hp: 20, stamina: 0, restrictions: ["MAGIC"] },
      { name: "SANS", hp: 1, stamina: 5, restrictions: ["ITEM"] }
    ];

    // Cards
    const cardPool = {
      FRISK: [
        { type: "ITEM", name: "Stick", desc: "Deals 1 damage", effect: (target) => target.hp -= 1 }
      ],
      SANS: [
        { type: "MAGIC", name: "Bone", desc: "Deals 1 damage", effect: (target) => target.hp -= 1 }
      ]
    };

    // Assign random characters
    const playerChar = characters[Math.floor(Math.random() * characters.length)];
    const aiChar = characters[Math.floor(Math.random() * characters.length)];

    // Display info
    function renderInfo() {
      document.getElementById('player-info').innerHTML = `
        <h2>Player: ${playerChar.name}</h2>
        <div class="hp-bar"><div class="hp-fill" style="width:${(playerChar.hp/20)*100}%"></div></div>
        ${playerChar.name === "SANS" ? `<div class="stamina-bar"><div class="stamina-fill" style="width:${(playerChar.stamina/5)*100}%"></div></div>` : ""}
      `;
      document.getElementById('ai-info').innerHTML = `
        <h2>AI: ${aiChar.name}</h2>
        <div class="hp-bar"><div class="hp-fill" style="width:${(aiChar.hp/20)*100}%"></div></div>
        ${aiChar.name === "SANS" ? `<div class="stamina-bar"><div class="stamina-fill" style="width:${(aiChar.stamina/5)*100}%"></div></div>` : ""}
      `;
    }

    renderInfo();

    // Generate player hand based on character
    cardPool[playerChar.name].forEach(c => {
      const card = document.createElement('div');
      card.className = "card common";
      card.draggable = true;
      card.dataset.type = c.type;
      card.dataset.name = c.name;
      card.innerHTML = `
        <div class="card-title">${c.name}</div>
        <div class="card-desc">${c.desc}</div>
      `;
      playerHand.appendChild(card);

      card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.outerHTML);
        e.target.style.opacity = '0.5';
      });
      card.addEventListener('dragend', e => {
        e.target.style.opacity = '1';
      });
    });

    playerZone.addEventListener('dragover', e => e.preventDefault());
    playerZone.addEventListener('drop', e => {
      e.preventDefault();
      const data = e.dataTransfer.getData('text/plain');
      playerZone.innerHTML = data;
    });

    // AI plays
    document.getElementById('ai-play').addEventListener('click', () => {
      const aiCards = cardPool[aiChar.name];
      const choice = aiCards[Math.floor(Math.random() * aiCards.length)];
      aiZone.innerHTML = `
        <div class="card epic">
          <div class="card-title">${choice.name}</div>
          <div class="card-desc">${choice.desc}</div>
        </div>
      `;

      // Resolve battle
      const playerCard = playerZone.querySelector('.card');
      if (!playerCard) {
        result.textContent = "You must place a card first!";
        return;
      }

      // Player attacks AI
      const playerCardName = playerCard.dataset.name;
      const playerCardObj = cardPool[playerChar.name].find(c => c.name === playerCardName);
      if (playerCardObj) {
        if (aiChar.name === "SANS" && aiChar.stamina > 0) {
          aiChar.stamina -= 1; // Sans dodges
          result.textContent = "Sans dodged!";
        } else {
          playerCardObj.effect(aiChar);
        }
      }

      // AI attacks Player
      if (choice) {
        if (playerChar.name === "SANS" && playerChar.stamina > 0) {
          playerChar.stamina -= 1;
          result.textContent += " Player Sans dodged!";
        } else {
          choice.effect(playerChar);
        }
      }

      renderInfo();

      if (playerChar.hp <= 0) result.textContent = "AI wins!";
      else if (aiChar.hp <= 0) result.textContent = "Player wins!";
    });
  </script>
</body>
</html>
