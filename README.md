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

    h1 { margin: 20px; }

    .battlefield {
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      width: 100%;
      margin-top: 20px;
    }

    .zone {
      width: 45%;
      min-height: 250px;
      border: 2px dashed #555;
      border-radius: 12px;
      padding: 10px;
    }

    .card {
      background: #111;
      border: 3px solid white;
      border-radius: 12px;
      padding: 10px;
      width: 150px;
      text-align: center;
      box-shadow: 0 0 10px white;
      margin: 10px auto;
      cursor: pointer;
    }

    .card-title { font-weight: bold; }
    .card-type { font-size: 12px; color: #aaa; }

    .hp-bar, .stamina-bar {
      height: 20px;
      background: #333;
      border: 2px solid #555;
      border-radius: 6px;
      margin: 5px 0;
      position: relative;
    }
    .hp-fill {
      background: red;
      height: 100%;
      width: 100%;
      transition: width 0.3s;
    }
    .stamina-fill {
      background: cyan;
      height: 100%;
      width: 100%;
      transition: width 0.3s;
    }

    button { margin: 15px; padding: 10px 20px; }
  </style>
</head>
<body>
  <h1>Undertale Card Battle</h1>

  <div class="battlefield">
    <div class="zone" id="player-zone">
      <h2>Player</h2>
      <div id="player-hp" class="hp-bar"><div class="hp-fill"></div></div>
      <div id="player-stamina" class="stamina-bar" style="display:none;"><div class="stamina-fill"></div></div>
      <div id="player-cards"></div>
    </div>

    <div class="zone" id="ai-zone">
      <h2>AI</h2>
      <div id="ai-hp" class="hp-bar"><div class="hp-fill"></div></div>
      <div id="ai-stamina" class="stamina-bar" style="display:none;"><div class="stamina-fill"></div></div>
      <div id="ai-cards"></div>
    </div>
  </div>

  <button id="play-turn">Play Turn</button>
  <div id="result"></div>

  <script>
    // Character definitions
    const characters = {
      FRISK: {
        hp: 20,
        stamina: null,
        deck: [
          { type: "ITEM", name: "Stick", effect: { dmg: 1 } },
          { type: "OPTION", name: "Act", effect: { dmg: 0 } }
        ]
      },
      SANS: {
        hp: 1,
        stamina: 5,
        deck: [
          { type: "MAGIC", name: "Bone", effect: { dmg: 1 } },
          { type: "OPTION", name: "Taunt", effect: { dmg: 0 } }
        ]
      }
    };

    // Randomly assign characters
    const playerChar = Math.random() < 0.5 ? "FRISK" : "SANS";
    const aiChar = playerChar === "FRISK" ? "SANS" : "FRISK";

    let player = JSON.parse(JSON.stringify(characters[playerChar]));
    let ai = JSON.parse(JSON.stringify(characters[aiChar]));

    // Setup UI
    document.querySelector("#player-zone h2").textContent = "Player: " + playerChar;
    document.querySelector("#ai-zone h2").textContent = "AI: " + aiChar;

    function updateBars() {
      document.querySelector("#player-hp .hp-fill").style.width = (player.hp / characters[playerChar].hp * 100) + "%";
      document.querySelector("#ai-hp .hp-fill").style.width = (ai.hp / characters[aiChar].hp * 100) + "%";

      if (player.stamina !== null) {
        document.getElementById("player-stamina").style.display = "block";
        document.querySelector("#player-stamina .stamina-fill").style.width = (player.stamina / characters[playerChar].stamina * 100) + "%";
      }
      if (ai.stamina !== null) {
        document.getElementById("ai-stamina").style.display = "block";
        document.querySelector("#ai-stamina .stamina-fill").style.width = (ai.stamina / characters[aiChar].stamina * 100) + "%";
      }
    }

    function renderDeck(zoneId, deck) {
      const zone = document.getElementById(zoneId);
      zone.innerHTML = "";
      deck.forEach((card, idx) => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `<div class="card-title">${card.name}</div><div class="card-type">${card.type}</div>`;
        div.onclick = () => zone.dataset.selected = idx;
        zone.appendChild(div);
      });
    }

    renderDeck("player-cards", player.deck);
    renderDeck("ai-cards", ai.deck);
    updateBars();

    // Turn logic
    document.getElementById("play-turn").addEventListener("click", () => {
      const playerChoice = player.deck[document.getElementById("player-cards").dataset.selected || 0];
      const aiChoice = ai.deck[Math.floor(Math.random() * ai.deck.length)];

      let log = `Player used ${playerChoice.name}. AI used ${aiChoice.name}. `;

      // Player attack
      if (playerChoice.effect.dmg > 0) {
        if (aiChar === "SANS" && ai.stamina > 0) {
          ai.stamina--;
          log += "Sans dodged! ";
        } else {
          ai.hp -= playerChoice.effect.dmg;
          log += `AI took ${playerChoice.effect.dmg} damage. `;
        }
      }

      // AI attack
      if (aiChoice.effect.dmg > 0) {
        if (playerChar === "SANS" && player.stamina > 0) {
          player.stamina--;
          log += "Player Sans dodged! ";
        } else {
          player.hp -= aiChoice.effect.dmg;
          log += `Player took ${aiChoice.effect.dmg} damage. `;
        }
      }

      updateBars();

      if (player.hp <= 0 && ai.hp <= 0) log += "It's a draw!";
      else if (player.hp <= 0) log += "AI wins!";
      else if (ai.hp <= 0) log += "Player wins!";

      document.getElementById("result").textContent = log;
    });
  </script>
</body>
</html>
