<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Undertale Card Game</title>
  <style>
    /* Layout */
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

    h1 { margin: 16px 0 8px; }
    h2 { margin: 8px 0; font-size: 18px; }

    .top-bar {
      display: flex;
      gap: 20px;
      align-items: center;
      margin: 8px 0 16px;
    }

    .arena {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      width: 95%;
      max-width: 1100px;
      margin-bottom: 14px;
    }

    .side {
      border: 2px dashed #555;
      border-radius: 12px;
      padding: 12px;
    }

    .row {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .zone {
      flex: 1;
      min-height: 120px;
      border: 2px dashed #444;
      border-radius: 10px;
      padding: 8px;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-start;
    }

    .controls {
      display: flex;
      gap: 10px;
      align-items: center;
      margin: 10px 0;
    }

    /* Bars */
    .bar-label { font-size: 12px; color: #aaa; margin-bottom: 4px; }

    .hp-bar, .stamina-bar {
      height: 20px;
      background: #222;
      border: 2px solid #555;
      border-radius: 6px;
      position: relative;
      width: 240px;
      margin-right: 10px;
    }

    .hp-fill {
      background: #ff2b2b;
      height: 100%;
      width: 100%;
      transition: width 0.25s ease;
    }

    .stamina-fill {
      background: #00e0ff;
      height: 100%;
      width: 100%;
      transition: width 0.25s ease;
    }

    .name-tag {
      background: #111;
      border: 2px solid #666;
      border-radius: 8px;
      padding: 6px 10px;
      font-weight: bold;
    }

    /* Cards */
    .card {
      background: #111;
      border: 3px solid white;
      border-radius: 12px;
      padding: 10px;
      width: 170px;
      text-align: center;
      box-shadow: 0 0 10px white;
      cursor: grab;
      user-select: none;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 20px #ff0000;
      border-color: #ff0000;
    }

    .card.unusable {
      opacity: 0.45;
      cursor: not-allowed;
      border-color: #666;
      box-shadow: none;
    }

    .card-title { font-weight: bold; font-size: 16px; }
    .card-type { font-size: 12px; color: #aaa; margin-top: 4px; }
    .card-desc { font-size: 12px; color: #ccc; margin-top: 6px; }

    .hand {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      min-height: 140px;
      border: 2px dashed #444;
      border-radius: 10px;
      padding: 8px;
    }

    .slot {
      width: 180px;
      min-height: 120px;
      border: 2px dashed #333;
      border-radius: 10px;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #777;
    }

    .log {
      width: 95%;
      max-width: 1100px;
      border: 2px solid #333;
      border-radius: 12px;
      padding: 12px;
      background: #0b0b0b;
      min-height: 80px;
      white-space: pre-line;
    }

    button {
      padding: 8px 14px;
      border-radius: 8px;
      border: 2px solid #666;
      background: #111;
      color: white;
      cursor: pointer;
    }

    button:hover { border-color: #ff0000; }
    .disabled { opacity: 0.6; cursor: not-allowed; }
  </style>
</head>
<body>
  <h1>Undertale Card Battle</h1>

  <div class="top-bar">
    <div class="name-tag" id="player-name">Player: ?</div>
    <div class="name-tag" id="ai-name">AI: ?</div>
  </div>

  <div class="arena">
    <!-- Player side -->
    <div class="side">
      <h2>Player status</h2>
      <div class="row">
        <div>
          <div class="bar-label">HP</div>
          <div class="hp-bar" id="player-hp"><div class="hp-fill"></div></div>
        </div>
        <div id="player-stamina-wrap" style="display:none;">
          <div class="bar-label">Stamina</div>
          <div class="stamina-bar" id="player-stamina"><div class="stamina-fill"></div></div>
        </div>
      </div>

      <h2>Player hand</h2>
      <div class="hand" id="player-hand"></div>

      <h2>Player play zone</h2>
      <div class="zone" id="player-zone">
        <div class="slot" id="player-slot">Drop a card here</div>
      </div>
    </div>

    <!-- AI side -->
    <div class="side">
      <h2>AI status</h2>
      <div class="row">
        <div>
          <div class="bar-label">HP</div>
          <div class="hp-bar" id="ai-hp"><div class="hp-fill"></div></div>
        </div>
        <div id="ai-stamina-wrap" style="display:none;">
          <div class="bar-label">Stamina</div>
          <div class="stamina-bar" id="ai-stamina"><div class="stamina-fill"></div></div>
        </div>
      </div>

      <h2>AI hand</h2>
      <div class="hand" id="ai-hand"></div>

      <h2>AI play zone</h2>
      <div class="zone" id="ai-zone">
        <div class="slot" id="ai-slot">AI will play here</div>
      </div>
    </div>
  </div>

  <div class="controls">
    <button id="draw-player">Draw player card</button>
    <button id="play-turn">Resolve turn</button>
    <button id="reset">Reset</button>
  </div>

  <div class="log" id="log"></div>

  <script>
    // --- Data: Characters and card pools ---
    const CHARACTERS = {
      FRISK: {
        baseHP: 20,
        baseStamina: null,
        allow: { CHARACTER: true, ITEM: true, OPTION: true, MAGIC: false },
        deckPool: [
          { type: "CHARACTER", name: "FRISK", desc: "Determination.", dmg: 0 },
          { type: "ITEM", name: "Stick", desc: "Deals 1 damage.", dmg: 1 },
          { type: "ITEM", name: "Bandage", desc: "Heal 1 HP.", heal: 1 },
          { type: "OPTION", name: "Act", desc: "No damage. Sets up flavor.", dmg: 0 },
          { type: "OPTION", name: "Mercy", desc: "Skip attack this turn.", skip: true }
        ]
      },
      SANS: {
        baseHP: 1,
        baseStamina: 6, // Dodges until 0
        allow: { CHARACTER: true, ITEM: false, OPTION: true, MAGIC: true },
        deckPool: [
          { type: "CHARACTER", name: "SANS", desc: "hey there.", dmg: 0 },
          { type: "MAGIC", name: "Bone", desc: "Deals 1 damage.", dmg: 1 },
          { type: "MAGIC", name: "Blue Attack", desc: "Deals 2 damage.", dmg: 2 },
          { type: "OPTION", name: "Taunt", desc: "No damage. Reduces target focus.", dmg: 0 },
          { type: "OPTION", name: "Pause", desc: "Skip attack this turn.", skip: true }
        ]
      }
    };

    // --- Game state ---
    const state = {
      player: null,
      ai: null,
      playerHand: [],
      aiHand: [],
      playerPlay: null,
      aiPlay: null,
      turn: 1,
      ended: false
    };

    // --- Utility ---
    const logEl = document.getElementById("log");
    function log(msg) {
      logEl.textContent += msg + "\n";
      logEl.scrollTop = logEl.scrollHeight;
    }

    function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

    // --- Init characters ---
    function assignCharacters() {
      const options = ["FRISK", "SANS"];
      const playerChar = options[Math.floor(Math.random() * options.length)];
      const aiChar = playerChar === "FRISK" ? "SANS" : "FRISK";

      state.player = {
        id: playerChar,
        hp: CHARACTERS[playerChar].baseHP,
        maxHP: CHARACTERS[playerChar].baseHP,
        stamina: CHARACTERS[playerChar].baseStamina,
        maxStamina: CHARACTERS[playerChar].baseStamina,
        allow: deepClone(CHARACTERS[playerChar].allow),
        deckPool: deepClone(CHARACTERS[playerChar].deckPool)
      };

      state.ai = {
        id: aiChar,
        hp: CHARACTERS[aiChar].baseHP,
        maxHP: CHARACTERS[aiChar].baseHP,
        stamina: CHARACTERS[aiChar].baseStamina,
        maxStamina: CHARACTERS[aiChar].baseStamina,
        allow: deepClone(CHARACTERS[aiChar].allow),
        deckPool: deepClone(CHARACTERS[aiChar].deckPool)
      };

      document.getElementById("player-name").textContent = "Player: " + playerChar;
      document.getElementById("ai-name").textContent = "AI: " + aiChar;

      updateBars();
    }

    // --- Bars UI ---
    function updateBars() {
      const pHPpct = Math.max(0, (state.player.hp / state.player.maxHP) * 100);
      document.querySelector("#player-hp .hp-fill").style.width = pHPpct + "%";

      const aHPpct = Math.max(0, (state.ai.hp / state.ai.maxHP) * 100);
      document.querySelector("#ai-hp .hp-fill").style.width = aHPpct + "%";

      const pStWrap = document.getElementById("player-stamina-wrap");
      const aStWrap = document.getElementById("ai-stamina-wrap");
      pStWrap.style.display = state.player.maxStamina ? "block" : "none";
      aStWrap.style.display = state.ai.maxStamina ? "block" : "none";

      if (state.player.maxStamina) {
        const pSTpct = Math.max(0, (state.player.stamina / state.player.maxStamina) * 100);
        document.querySelector("#player-stamina .stamina-fill").style.width = pSTpct + "%";
      }
      if (state.ai.maxStamina) {
        const aSTpct = Math.max(0, (state.ai.stamina / state.ai.maxStamina) * 100);
        document.querySelector("#ai-stamina .stamina-fill").style.width = aSTpct + "%";
      }
    }

    // --- Card creation ---
    function createCardEl(card, owner) {
      const el = document.createElement("div");
      el.className = "card";
      el.draggable = true;
      el.dataset.type = card.type;
      el.dataset.name = card.name;
      el.dataset.owner = owner;

      el.innerHTML = `
        <div class="card-title">${card.name}</div>
        <div class="card-type">${card.type}</div>
        <div class="card-desc">${card.desc || ""}</div>
      `;

      const allow = owner === "player" ? state.player.allow : state.ai.allow;
      if (!allow[card.type]) {
        el.classList.add("unusable");
        el.draggable = false;
      }

      // Drag behavior
      el.addEventListener("dragstart", (e) => {
        if (el.classList.contains("unusable")) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", JSON.stringify(card));
      });

      return el;
    }

    // --- Hand rendering ---
    function renderHands() {
      const pHand = document.getElementById("player-hand");
      const aHand = document.getElementById("ai-hand");
      pHand.innerHTML = "";
      aHand.innerHTML = "";

      state.playerHand.forEach(card => pHand.appendChild(createCardEl(card, "player")));
      state.aiHand.forEach(card => aHand.appendChild(createCardEl(card, "ai")));
    }

    // --- Draw card respecting character rules ---
    function drawCard(who = "player") {
      const actor = who === "player" ? state.player : state.ai;
      const pool = actor.deckPool;

      // Filter allowed types
      const allowedPool = pool.filter(c => actor.allow[c.type]);
      if (allowedPool.length === 0) return null;

      const card = deepClone(allowedPool[Math.floor(Math.random() * allowedPool.length)]);
      if (who === "player") state.playerHand.push(card);
      else state.aiHand.push(card);

      renderHands();
      return card;
    }

    // --- Zones: drop to play ---
    const playerZone = document.getElementById("player-zone");
    const playerSlot = document.getElementById("player-slot");
    playerZone.addEventListener("dragover", (e) => e.preventDefault());
    playerZone.addEventListener("drop", (e) => {
      e.preventDefault();
      if (state.ended) return;

      const data = e.dataTransfer.getData("text/plain");
      if (!data) return;
      const card = JSON.parse(data);

      // Verify that card exists in hand and is allowed
      const idx = state.playerHand.findIndex(c => c.name === card.name && c.type === card.type);
      const allowed = state.player.allow[card.type];
      if (idx === -1 || !allowed) return;

      state.playerPlay = state.playerHand.splice(idx, 1)[0];
      renderHands();
      playerSlot.textContent = "";
      const playEl = createCardEl(state.playerPlay, "player");
      playEl.draggable = false;
      playerZone.innerHTML = "";
      playerZone.appendChild(playEl);
      log(`Player queued: ${state.playerPlay.name} (${state.playerPlay.type})`);
    });

    // --- AI play: picks a playable card at resolve time ---
    function aiChoosePlay() {
      // Prefer a dmg card if available, else any allowed
      const dmgCards = state.aiHand.filter(c => state.ai.allow[c.type] && (c.dmg || c.heal || c.skip));
      const playable = dmgCards.length ? dmgCards : state.aiHand.filter(c => state.ai.allow[c.type]);

      if (!playable.length) return null;
      const choice = playable[Math.floor(Math.random() * playable.length)];
      const idx = state.aiHand.findIndex(c => c.name === choice.name && c.type === choice.type);
      state.aiPlay = state.aiHand.splice(idx, 1)[0];

      const aiSlot = document.getElementById("ai-zone");
      aiSlot.innerHTML = "";
      const playEl = createCardEl(state.aiPlay, "ai");
      playEl.draggable = false;
      aiSlot.appendChild(playEl);
      log(`AI queued: ${state.aiPlay.name} (${state.aiPlay.type})`);
      return state.aiPlay;
    }

    // --- Combat resolution with Sans dodge and effects ---
    function resolveTurn() {
      if (state.ended) return;

      // Require player to queue a card
      if (!state.playerPlay) {
        log("You must play a card (drag from your hand into your zone).");
        return;
      }

      // AI picks a card
      const aiCard = aiChoosePlay();
      if (!aiCard) log("AI had no playable card.");

      const pCard = state.playerPlay;
      const aCard = aiCard;

      // Apply player card
      if (pCard.skip) {
        log("Player skipped their attack.");
      } else if (pCard.heal) {
        const before = state.player.hp;
        state.player.hp = Math.min(state.player.maxHP, state.player.hp + pCard.heal);
        log(`Player healed ${state.player.hp - before} HP.`);
      } else {
        const dmg = pCard.dmg || 0;
        if (state.ai.id === "SANS" && state.ai.stamina > 0 && dmg > 0) {
          state.ai.stamina -= 1;
          log("AI Sans dodged the attack! (-1 stamina)");
        } else {
          state.ai.hp -= dmg;
          log(`AI took ${dmg} damage.`);
        }
      }

      // Apply AI card
      if (aCard) {
        if (aCard.skip) {
          log("AI skipped their attack.");
        } else if (aCard.heal) {
          const before = state.ai.hp;
          state.ai.hp = Math.min(state.ai.maxHP, state.ai.hp + aCard.heal);
          log(`AI healed ${state.ai.hp - before} HP.`);
        } else {
          const dmg = aCard.dmg || 0;
          if (state.player.id === "SANS" && state.player.stamina > 0 && dmg > 0) {
            state.player.stamina -= 1;
            log("Player Sans dodged the attack! (-1 stamina)");
          } else {
            state.player.hp -= dmg;
            log(`Player took ${dmg} damage.`);
          }
        }
      }

      // Clear play slots
      state.playerPlay = null;
      state.aiPlay = null;
      document.getElementById("player-zone").innerHTML = '<div class="slot" id="player-slot">Drop a card here</div>';
      document.getElementById("ai-zone").innerHTML = '<div class="slot" id="ai-slot">AI will play here</div>';

      // Draw new cards for next turn
      drawCard("player");
      drawCard("ai");

      // Update bars and check end
      updateBars();
      state.turn += 1;

      if (state.player.hp <= 0 && state.ai.hp <= 0) {
        endGame("Draw! Both fell.");
      } else if (state.player.hp <= 0) {
        endGame("AI wins!");
      } else if (state.ai.hp <= 0) {
        endGame("Player wins!");
      }
    }

    function endGame(message) {
      state.ended = true;
      log("— " + message + " —");
      document.getElementById("play-turn").classList.add("disabled");
      document.getElementById("draw-player").classList.add("disabled");
    }

    // --- Controls ---
    document.getElementById("draw-player").addEventListener("click", () => {
      if (state.ended) return;
      const card = drawCard("player");
      if (card) log(`Player drew: ${card.name} (${card.type})`);
      else log("No allowed cards to draw.");
    });

    document.getElementById("play-turn").addEventListener("click", () => {
      if (state.ended) return;
      resolveTurn();
    });

    document.getElementById("reset").addEventListener("click", () => {
      // Reset state
      state.playerHand = [];
      state.aiHand = [];
      state.playerPlay = null;
      state.aiPlay = null;
      state.turn = 1;
      state.ended = false;

      // Clear UI
      document.getElementById("player-zone").innerHTML = '<div class="slot" id="player-slot">Drop a card here</div>';
      document.getElementById("ai-zone").innerHTML = '<div class="slot" id="ai-slot">AI will play here</div>';
      document.getElementById("play-turn").classList.remove("disabled");
      document.getElementById("draw-player").classList.remove("disabled");
      logEl.textContent = "";

      // Reassign chars and start fresh hands
      assignCharacters();

      // Opening draws: each side gets 3 cards
      for (let i = 0; i < 3; i++) drawCard("player");
      for (let i = 0; i < 3; i++) drawCard("ai");

      log(`New game! Player: ${state.player.id} | AI: ${state.ai.id}`);
      log("Drag a card from your hand into your play zone, then press Resolve turn.");
    });

    // --- Bootstrap ---
    (function start() {
      assignCharacters();
      // Opening draws: each side gets 3 cards
      for (let i = 0; i < 3; i++) drawCard("player");
      for (let i = 0; i < 3; i++) drawCard("ai");
      log(`Game start! Player: ${state.player.id} | AI: ${state.ai.id}`);
      log("Drag a card from your hand into your play zone, then press Resolve turn.");
    })();
  </script>
</body>
</html>
