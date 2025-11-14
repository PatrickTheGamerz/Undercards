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
      align-items: center;
      width: 100%;
      margin-top: 30px;
    }

    .zone {
      width: 45%;
      height: 200px;
      border: 2px dashed #555;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #777;
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

    .card img {
      width: 100px;
      height: 100px;
      image-rendering: pixelated;
      border: 2px solid #fff;
      border-radius: 8px;
      margin-bottom: 10px;
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

    .card-stats {
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
      font-size: 14px;
    }

    .stat {
      background: #222;
      padding: 5px 8px;
      border-radius: 6px;
      border: 1px solid #555;
    }

    .rare { border-color: gold; box-shadow: 0 0 15px gold; }
    .epic { border-color: purple; box-shadow: 0 0 15px purple; }
    .common { border-color: gray; }
  </style>
</head>
<body>
  <h1>Undertale Card Battle</h1>

  <div class="card-container" id="player-hand">
    <div class="card rare" draggable="true" data-atk="5" data-def="3">
      <img src="https://placekitten.com/100/100" alt="Character">
      <div class="card-title">Sans</div>
      <div class="card-desc">Lazy skeleton with bad puns.</div>
      <div class="card-stats">
        <div class="stat">ATK: 5</div>
        <div class="stat">DEF: 3</div>
      </div>
    </div>

    <div class="card epic" draggable="true" data-atk="7" data-def="6">
      <img src="https://placebear.com/100/100" alt="Character">
      <div class="card-title">Papyrus</div>
      <div class="card-desc">Energetic skeleton who loves spaghetti.</div>
      <div class="card-stats">
        <div class="stat">ATK: 7</div>
        <div class="stat">DEF: 6</div>
      </div>
    </div>

    <div class="card common" draggable="true" data-atk="4" data-def="2">
      <img src="https://placebeard.it/100x100" alt="Character">
      <div class="card-title">Flowey</div>
      <div class="card-desc">A flower with a sinister smile.</div>
      <div class="card-stats">
        <div class="stat">ATK: 4</div>
        <div class="stat">DEF: 2</div>
      </div>
    </div>
  </div>

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

    // Drag & Drop
    document.querySelectorAll('.card').forEach(card => {
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

    // AI plays randomly
    document.getElementById('ai-play').addEventListener('click', () => {
      const aiCards = [
        { name: "Undyne", atk: 6, def: 5 },
        { name: "Toriel", atk: 5, def: 7 },
        { name: "Mettaton", atk: 8, def: 4 }
      ];
      const choice = aiCards[Math.floor(Math.random() * aiCards.length)];
      aiZone.innerHTML = `
        <div class="card epic">
          <div class="card-title">${choice.name}</div>
          <div class="card-stats">
            <div class="stat">ATK: ${choice.atk}</div>
            <div class="stat">DEF: ${choice.def}</div>
          </div>
        </div>
      `;

      // Compare stats
      const playerCard = playerZone.querySelector('.card');
      if (!playerCard) {
        result.textContent = "You must place a card first!";
        return;
      }
      const playerAtk = parseInt(playerCard.dataset.atk);
      const playerDef = parseInt(playerCard.dataset.def);

      if (playerAtk > choice.def) {
        result.textContent = "Player wins!";
      } else if (choice.atk > playerDef) {
        result.textContent = "AI wins!";
      } else {
        result.textContent = "It's a draw!";
      }
    });
  </script>
</body>
</html>
