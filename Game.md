<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Undertale Card Game</title>
  <meta charset="UTF-8" />
  <title>Undertale Card Battle</title>
  <style>
    /* Layout and theme */
    body {
      background: black;
      font-family: 'Courier New', monospace;
@@ -15,192 +16,647 @@
      margin: 0;
    }

    .card-container {
    h1 { margin: 16px 0 8px; }

    .subtitle {
      color: #ccc;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .top-bar {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin: 20px;
      gap: 24px;
      align-items: center;
      margin-bottom: 12px;
    }

    .char-badge {
      background: #111;
      border: 2px solid #fff;
      border-radius: 10px;
      padding: 8px 12px;
      box-shadow: 0 0 10px #fff;
    }

    .battlefield {
      display: flex;
      justify-content: space-around;
      align-items: center;
      align-items: flex-start;
      width: 100%;
      margin-top: 30px;
      max-width: 980px;
      gap: 20px;
      margin-top: 10px;
    }

    .zone {
      width: 45%;
      height: 200px;
      flex: 1;
      border: 2px dashed #555;
      border-radius: 12px;
      padding: 12px;
      color: #777;
      background: #0b0b0b;
    }

    .zone-title {
      color: #ddd;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .meters {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 10px;
    }

    .bar-label {
      font-size: 12px;
      color: #aaa;
      margin-bottom: 4px;
    }

    .hp-bar, .stamina-bar {
      width: 100%;
      height: 18px;
      background: #222;
      border: 2px solid #fff;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    .hp-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff2a2a, #d10000);
      border-radius: 8px;
      width: 100%;
      transition: width 0.25s ease-in-out;
    }

    .stamina-fill {
      height: 100%;
      background: linear-gradient(90deg, #00ffff, #00a3a3);
      border-radius: 8px;
      width: 100%;
      transition: width 0.25s ease-in-out;
    }

    .card-play-area {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 8px;
      min-height: 120px;
    }

    .slot {
      border: 2px solid #444;
      border-radius: 10px;
      height: 110px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #777;
      justify-content: center;
      color: #666;
      background: #121212;
    }

    /* Hand and cards */
    .hand-wrapper {
      width: 100%;
      max-width: 980px;
      margin-top: 20px;
    }

    .hand-title {
      font-weight: bold;
      color: #ddd;
      margin: 4px 0 8px;
    }

    .card-container {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .card {
      background: #111;
      border: 4px solid white;
      border-radius: 12px;
      padding: 15px;
      padding: 12px;
      width: 180px;
      text-align: center;
      box-shadow: 0 0 10px white;
      transition: transform 0.3s, box-shadow 0.3s;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      cursor: grab;
      position: relative;
      user-select: none;
    }

    .card:hover {
      transform: rotateY(10deg) scale(1.05);
      box-shadow: 0 0 25px #ff0000;
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 0 18px #ff0000;
      border-color: #ff0000;
    }

    .card img {
      width: 100px;
      height: 100px;
      image-rendering: pixelated;
      border: 2px solid #fff;
      border-radius: 8px;
      margin-bottom: 10px;
    .card-type {
      font-size: 12px;
      color: #aaa;
      margin-bottom: 6px;
    }

    .card-title {
      font-size: 18px;
      text-transform: uppercase;
      font-weight: bold;
      color: #fff;
    }

    .card-desc {
      font-size: 14px;
      margin-top: 5px;
      margin-top: 6px;
      color: #ccc;
    }

    .card-stats {
      margin-top: 10px;
    .rare { border-color: gold; box-shadow: 0 0 15px gold; }
    .epic { border-color: purple; box-shadow: 0 0 15px purple; }
    .common { border-color: gray; box-shadow: 0 0 12px #aaa; }

    /* Controls and status */
    .controls {
      display: flex;
      justify-content: space-around;
      font-size: 14px;
      gap: 10px;
      margin-top: 16px;
      align-items: center;
    }

    .stat {
      background: #222;
      padding: 5px 8px;
      border-radius: 6px;
      border: 1px solid #555;
    button {
      background: #111;
      color: #fff;
      border: 2px solid #fff;
      border-radius: 10px;
      padding: 8px 12px;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.2s, border-color 0.2s;
    }

    .rare { border-color: gold; box-shadow: 0 0 15px gold; }
    .epic { border-color: purple; box-shadow: 0 0 15px purple; }
    .common { border-color: gray; }
    button:hover {
      transform: translateY(-2px);
      border-color: #ff0000;
      box-shadow: 0 0 12px #ff0000;
    }

    #result {
      margin-top: 10px;
      min-height: 24px;
      color: #ddd;
    }

    .log {
      margin-top: 8px;
      font-size: 12px;
      color: #aaa;
      max-width: 980px;
      white-space: pre-wrap;
    }

    /* Drop highlight */
    .slot.drop-target {
      border-color: #ff0000;
      box-shadow: 0 0 10px #ff0000 inset;
      color: #ddd;
    }
  </style>
</head>
<body>
  <h1>Undertale Card Battle</h1>
  <div class="subtitle">Characters, Magic, Items, and Options — with HP bars and Sans’s stamina dodge.</div>

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
  <div class="top-bar">
    <div class="char-badge" id="player-character">Player: —</div>
    <div class="char-badge" id="ai-character">AI: —</div>
  </div>

    <div class="card epic" draggable="true" data-atk="7" data-def="6">
      <img src="https://placebear.com/100/100" alt="Character">
      <div class="card-title">Papyrus</div>
      <div class="card-desc">Energetic skeleton who loves spaghetti.</div>
      <div class="card-stats">
        <div class="stat">ATK: 7</div>
        <div class="stat">DEF: 6</div>
  <div class="battlefield">
    <!-- Player Zone -->
    <div class="zone" id="player-zone">
      <div class="zone-title">Player Zone</div>
      <div class="meters">
        <div class="bar-label">HP</div>
        <div class="hp-bar"><div class="hp-fill" id="player-hp"></div></div>
        <div class="bar-label" id="player-stamina-label" style="display:none;">Stamina</div>
        <div class="stamina-bar" id="player-stamina-bar" style="display:none;">
          <div class="stamina-fill" id="player-stamina"></div>
        </div>
      </div>
      <div class="card-play-area" id="player-slots">
        <div class="slot" data-slot="p-1">Drop card here</div>
        <div class="slot" data-slot="p-2">Drop card here</div>
        <div class="slot" data-slot="p-3">Drop card here</div>
      </div>
    </div>

    <div class="card common" draggable="true" data-atk="4" data-def="2">
      <img src="https://placebeard.it/100x100" alt="Character">
      <div class="card-title">Flowey</div>
      <div class="card-desc">A flower with a sinister smile.</div>
      <div class="card-stats">
        <div class="stat">ATK: 4</div>
        <div class="stat">DEF: 2</div>
    <!-- AI Zone -->
    <div class="zone" id="ai-zone">
      <div class="zone-title">AI Zone</div>
      <div class="meters">
        <div class="bar-label">HP</div>
        <div class="hp-bar"><div class="hp-fill" id="ai-hp"></div></div>
        <div class="bar-label" id="ai-stamina-label" style="display:none;">Stamina</div>
        <div class="stamina-bar" id="ai-stamina-bar" style="display:none;">
          <div class="stamina-fill" id="ai-stamina"></div>
        </div>
      </div>
      <div class="card-play-area" id="ai-slots">
        <div class="slot" data-slot="a-1">AI will play here</div>
        <div class="slot" data-slot="a-2">AI will play here</div>
        <div class="slot" data-slot="a-3">AI will play here</div>
      </div>
    </div>
  </div>

  <div class="battlefield">
    <div class="zone" id="player-zone">Player Zone</div>
    <div class="zone" id="ai-zone">AI Zone</div>
  <div class="hand-wrapper">
    <div class="hand-title">Your Hand</div>
    <div class="card-container" id="player-hand"></div>
  </div>

  <div class="controls">
    <button id="end-turn">End Turn</button>
    <button id="ai-play">AI Play</button>
    <button id="reset">Reset Game</button>
  </div>

  <button id="ai-play">AI Play</button>
  <div id="result"></div>
  <div class="log" id="log"></div>

  <script>
    const playerZone = document.getElementById('player-zone');
    const aiZone = document.getElementById('ai-zone');
    const result = document.getElementById('result');

    // Drag & Drop
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.outerHTML);
        e.target.style.opacity = '0.5';
    // Character definitions and legality
    const characters = {
      Frisk: {
        hp: 20,
        stamina: null,
        allowed: ["Item", "Option"], // cannot use Magic
      },
      Sans: {
        hp: 1,
        stamina: 6, // stamina gates dodges
        allowed: ["Magic", "Option"], // heavily restricted items
      },
      Papyrus: {
        hp: 12,
        stamina: null,
        allowed: ["Item", "Magic", "Option"], // for variety
      }
    };

    // Per-character decks (owned, only they can use)
    const decks = {
      Frisk: [
        {rarity:"common", type:"Item", name:"Stick", desc:"Deals 1 damage.", dmg:1},
        {rarity:"rare", type:"Item", name:"Bandage", desc:"Heal 2 HP.", heal:2},
        {rarity:"common", type:"Option", name:"Mercy", desc:"Skip attack. Heal 1 HP.", heal:1},
        {rarity:"epic", type:"Item", name:"Pie", desc:"Heal 4 HP.", heal:4},
      ],
      Sans: [
        {rarity:"common", type:"Magic", name:"Bone", desc:"Deals 1 damage.", dmg:1},
        {rarity:"rare", type:"Magic", name:"Blue Attack", desc:"Deals 2 damage.", dmg:2},
        {rarity:"common", type:"Option", name:"Taunt", desc:"No damage. Reduce enemy stamina by 1.", staminaDown:1},
        {rarity:"epic", type:"Magic", name:"Gaster Blaster", desc:"Deals 3 damage.", dmg:3},
      ],
      Papyrus: [
        {rarity:"common", type:"Item", name:"Spaghetti", desc:"Heal 2 HP.", heal:2},
        {rarity:"rare", type:"Magic", name:"Bone Toss", desc:"Deals 2 damage.", dmg:2},
        {rarity:"common", type:"Option", name:"Cool Pose", desc:"No damage. Gain 1 HP.", heal:1},
        {rarity:"epic", type:"Magic", name:"Royal Guard Style", desc:"Deals 3 damage.", dmg:3},
      ],
    };

    // Randomly assign player and AI characters (player getting FRISK or SANS as requested vibe)
    const playerCharacterName = Math.random() < 0.5 ? "Frisk" : "Sans";
    const aiCharacterName = (() => {
      // Ensure AI is different for dynamics
      const pool = ["Frisk","Sans","Papyrus"].filter(n => n !== playerCharacterName);
      return pool[Math.floor(Math.random()*pool.length)];
    })();

    const playerChar = structuredClone(characters[playerCharacterName]);
    const aiChar = structuredClone(characters[aiCharacterName]);

    // State
    let playerHP = playerChar.hp;
    let aiHP = aiChar.hp;
    let playerStamina = playerChar.stamina;
    let aiStamina = aiChar.stamina;

    // UI init
    const playerCharacterEl = document.getElementById("player-character");
    const aiCharacterEl = document.getElementById("ai-character");
    const playerHPFill = document.getElementById("player-hp");
    const aiHPFill = document.getElementById("ai-hp");
    const playerStaminaBar = document.getElementById("player-stamina-bar");
    const playerStaminaLabel = document.getElementById("player-stamina-label");
    const aiStaminaBar = document.getElementById("ai-stamina-bar");
    const aiStaminaLabel = document.getElementById("ai-stamina-label");
    const playerStaminaFill = document.getElementById("player-stamina");
    const aiStaminaFill = document.getElementById("ai-stamina");
    const playerHand = document.getElementById("player-hand");
    const playerSlots = document.getElementById("player-slots");
    const aiSlots = document.getElementById("ai-slots");
    const result = document.getElementById("result");
    const logEl = document.getElementById("log");

    playerCharacterEl.textContent = `Player: ${playerCharacterName}`;
    aiCharacterEl.textContent = `AI: ${aiCharacterName}`;

    // Meters
    function setHPBar(fillEl, hp, maxhp) {
      const pct = Math.max(0, Math.min(100, (hp / maxhp) * 100));
      fillEl.style.width = pct + "%";
    }
    function setStaminaBar(fillEl, stamina, max) {
      const pct = Math.max(0, Math.min(100, (stamina / max) * 100));
      fillEl.style.width = pct + "%";
    }

    function renderMeters() {
      setHPBar(playerHPFill, playerHP, playerChar.hp);
      setHPBar(aiHPFill, aiHP, aiChar.hp);

      if (playerChar.stamina != null) {
        playerStaminaBar.style.display = "block";
        playerStaminaLabel.style.display = "block";
        setStaminaBar(playerStaminaFill, playerStamina, playerChar.stamina);
      } else {
        playerStaminaBar.style.display = "none";
        playerStaminaLabel.style.display = "none";
      }

      if (aiChar.stamina != null) {
        aiStaminaBar.style.display = "block";
        aiStaminaLabel.style.display = "block";
        setStaminaBar(aiStaminaFill, aiStamina, aiChar.stamina);
      } else {
        aiStaminaBar.style.display = "none";
        aiStaminaLabel.style.display = "none";
      }
    }

    renderMeters();

    // Create player hand from their character deck
    function createCardEl(card) {
      const div = document.createElement("div");
      div.className = `card ${card.rarity || "common"}`;
      div.draggable = true;
      div.dataset.type = card.type;
      div.dataset.name = card.name;
      div.dataset.desc = card.desc;
      if (card.dmg) div.dataset.dmg = String(card.dmg);
      if (card.heal) div.dataset.heal = String(card.heal);
      if (card.staminaDown) div.dataset.staminaDown = String(card.staminaDown);

      div.innerHTML = `
        <div class="card-type">${card.type}</div>
        <div class="card-title">${card.name}</div>
        <div class="card-desc">${card.desc}</div>
      `;
      return div;
    }

    function drawInitialHand() {
      const deck = decks[playerCharacterName];
      // Simple: show all owned cards (you can later randomize N draws)
      deck.forEach(card => {
        const el = createCardEl(card);
        playerHand.appendChild(el);
      });
      card.addEventListener('dragend', e => {
        e.target.style.opacity = '1';
    }

    drawInitialHand();

    // Drag & drop logic for player slots
    function enableDragAndDrop() {
      function onDragStart(e) {
        const cardEl = e.currentTarget;
        e.dataTransfer.setData("text/plain", JSON.stringify({
          rarity: cardEl.className,
          type: cardEl.dataset.type,
          name: cardEl.dataset.name,
          desc: cardEl.dataset.desc,
          dmg: cardEl.dataset.dmg || null,
          heal: cardEl.dataset.heal || null,
          staminaDown: cardEl.dataset.staminaDown || null
        }));
        cardEl.style.opacity = "0.6";
      }
      function onDragEnd(e) {
        e.currentTarget.style.opacity = "1";
      }

      playerHand.querySelectorAll(".card").forEach(card => {
        card.addEventListener("dragstart", onDragStart);
        card.addEventListener("dragend", onDragEnd);
      });
    });

    playerZone.addEventListener('dragover', e => e.preventDefault());
    playerZone.addEventListener('drop', e => {
      e.preventDefault();
      const data = e.dataTransfer.getData('text/plain');
      playerZone.innerHTML = data;
    });
      // Slot events
      playerSlots.querySelectorAll(".slot").forEach(slot => {
        slot.addEventListener("dragover", e => {
          e.preventDefault();
          slot.classList.add("drop-target");
        });
        slot.addEventListener("dragleave", () => slot.classList.remove("drop-target"));
        slot.addEventListener("drop", e => {
          e.preventDefault();
          const data = e.dataTransfer.getData("text/plain");
          slot.classList.remove("drop-target");
          if (!data) return;
          const payload = JSON.parse(data);

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
          // Place a visual copy into the slot (without draggable)
          slot.innerHTML = `
            <div class="card ${payload.rarity}">
              <div class="card-type">${payload.type}</div>
              <div class="card-title">${payload.name}</div>
              <div class="card-desc">${payload.desc}</div>
            </div>
          `;
          slot.dataset.card = JSON.stringify(payload);

          // Remove original card from hand (simulate playing it)
          const toRemove = [...playerHand.querySelectorAll(".card")].find(c =>
            c.dataset.name === payload.name && c.dataset.type === payload.type
          );
          if (toRemove) toRemove.remove();

          log(`Player prepared: ${payload.name} [${payload.type}]`);
        });
      });
    }

    enableDragAndDrop();

    // AI chooses a card and places it in a random empty slot
    function aiChooseAndPlace() {
      const aiDeck = decks[aiCharacterName];
      const legalForAI = aiDeck.filter(c => characters[aiCharacterName].allowed.includes(c.type));
      const choice = legalForAI[Math.floor(Math.random() * legalForAI.length)];
      const emptySlots = [...aiSlots.querySelectorAll(".slot")].filter(s => !s.dataset.card);
      if (emptySlots.length === 0) return;
      const slot = emptySlots[Math.floor(Math.random() * emptySlots.length)];

      slot.innerHTML = `
        <div class="card ${choice.rarity}">
          <div class="card-type">${choice.type}</div>
          <div class="card-title">${choice.name}</div>
          <div class="card-stats">
            <div class="stat">ATK: ${choice.atk}</div>
            <div class="stat">DEF: ${choice.def}</div>
          </div>
          <div class="card-desc">${choice.desc}</div>
        </div>
      `;
      slot.dataset.card = JSON.stringify(choice);
      log(`AI prepared: ${choice.name} [${choice.type}]`);
    }

    // Turn resolution: resolve one pair of cards (first occupied slot pair)
    function resolveTurn() {
      const pSlots = [...playerSlots.querySelectorAll(".slot")];
      const aSlots = [...aiSlots.querySelectorAll(".slot")];

      // Find first pair where both have a card
      let pairIndex = -1;
      for (let i = 0; i < 3; i++) {
        if (pSlots[i].dataset.card && aSlots[i].dataset.card) {
          pairIndex = i;
          break;
        }
      }

      // Compare stats
      const playerCard = playerZone.querySelector('.card');
      if (!playerCard) {
        result.textContent = "You must place a card first!";
      if (pairIndex === -1) {
        result.textContent = "Both sides need a card in the same column to resolve.";
        return;
      }
      const playerAtk = parseInt(playerCard.dataset.atk);
      const playerDef = parseInt(playerCard.dataset.def);

      if (playerAtk > choice.def) {
      const pCard = JSON.parse(pSlots[pairIndex].dataset.card);
      const aCard = JSON.parse(aSlots[pairIndex].dataset.card);

      // Legality checks
      if (!characters[playerCharacterName].allowed.includes(pCard.type)) {
        result.textContent = `Illegal move: ${playerCharacterName} cannot use ${pCard.type}.`;
        return;
      }
      if (!characters[aiCharacterName].allowed.includes(aCard.type)) {
        // For fairness, if AI picked an illegal card (shouldn't, but guard anyway)
        log(`AI attempted illegal ${aCard.type}. Ignored.`);
        // Remove AI card to avoid lock
        aSlots[pairIndex].innerHTML = "AI played illegal card";
        delete aSlots[pairIndex].dataset.card;
        return;
      }

      // Apply effects: Player to AI first (Undertale vibe: Sans dodges until stamina drains)
      const playerDeals = pCard.dmg ? Number(pCard.dmg) : 0;
      const playerHeals = pCard.heal ? Number(pCard.heal) : 0;
      const playerStaminaDown = pCard.staminaDown ? Number(pCard.staminaDown) : 0;

      const aiDeals = aCard.dmg ? Number(aCard.dmg) : 0;
      const aiHeals = aCard.heal ? Number(aCard.heal) : 0;
      const aiStaminaDown = aCard.staminaDown ? Number(aCard.staminaDown) : 0;

      // Player heal or stamina manipulation
      if (playerHeals > 0) {
        playerHP = Math.min(playerChar.hp, playerHP + playerHeals);
        log(`${playerCharacterName} heals ${playerHeals}.`);
      }
      if (playerStaminaDown > 0) {
        if (aiChar.stamina != null && aiStamina > 0) {
          aiStamina = Math.max(0, aiStamina - playerStaminaDown);
          log(`${playerCharacterName} reduces ${aiCharacterName}'s stamina by ${playerStaminaDown}.`);
        } else {
          log(`${playerCharacterName} tried to reduce stamina, but ${aiCharacterName} has none.`);
        }
      }

      // AI heal or stamina manipulation
      if (aiHeals > 0) {
        aiHP = Math.min(aiChar.hp, aiHP + aiHeals);
        log(`${aiCharacterName} heals ${aiHeals}.`);
      }
      if (aiStaminaDown > 0) {
        if (playerChar.stamina != null && playerStamina > 0) {
          playerStamina = Math.max(0, playerStamina - aiStaminaDown);
          log(`${aiCharacterName} reduces ${playerCharacterName}'s stamina by ${aiStaminaDown}.`);
        } else {
          log(`${aiCharacterName} tried to reduce stamina, but ${playerCharacterName} has none.`);
        }
      }

      // Damage application with Sans dodge logic
      // Player hits AI
      if (playerDeals > 0) {
        if (aiChar.stamina != null && aiStamina > 0) {
          aiStamina = Math.max(0, aiStamina - 1); // dodge consumes stamina
          log(`${aiCharacterName} dodges! Stamina -1.`);
        } else {
          aiHP = Math.max(0, aiHP - playerDeals);
          log(`${playerCharacterName} deals ${playerDeals} damage to ${aiCharacterName}.`);
        }
      }

      // AI hits Player
      if (aiDeals > 0) {
        if (playerChar.stamina != null && playerStamina > 0) {
          playerStamina = Math.max(0, playerStamina - 1); // dodge consumes stamina
          log(`${playerCharacterName} dodges! Stamina -1.`);
        } else {
          playerHP = Math.max(0, playerHP - aiDeals);
          log(`${aiCharacterName} deals ${aiDeals} damage to ${playerCharacterName}.`);
        }
      }

      renderMeters();

      // Clear resolved cards from that column
      pSlots[pairIndex].innerHTML = "Drop card here";
      aSlots[pairIndex].innerHTML = "AI will play here";
      delete pSlots[pairIndex].dataset.card;
      delete aSlots[pairIndex].dataset.card;

      // Win/Loss/Draw checks
      if (playerHP <= 0 && aiHP <= 0) {
        result.textContent = "It's a draw!";
      } else if (aiHP <= 0) {
        result.textContent = "Player wins!";
      } else if (choice.atk > playerDef) {
      } else if (playerHP <= 0) {
        result.textContent = "AI wins!";
      } else {
        result.textContent = "It's a draw!";
        result.textContent = "Turn resolved.";
      }
    }

    // Logging
    function log(msg) {
      logEl.textContent += (logEl.textContent ? "\n" : "") + msg;
      logEl.scrollTop = logEl.scrollHeight;
    }

    // Controls
    document.getElementById("ai-play").addEventListener("click", () => {
      aiChooseAndPlace();
    });

    document.getElementById("end-turn").addEventListener("click", () => {
      resolveTurn();
    });

    document.getElementById("reset").addEventListener("click", () => {
      // Full reset by reloading (simple and clean for prototype)
      location.reload();
    });

    // Initial log
    log(`Player is ${playerCharacterName} (HP ${playerChar.hp}${playerChar.stamina!=null?`, Stamina ${playerChar.stamina}`:""})`);
    log(`AI is ${aiCharacterName} (HP ${aiChar.hp}${aiChar.stamina!=null?`, Stamina ${aiChar.stamina}`:""})`);
    log(`Drag a card into any Player slot, click "AI Play", then "End Turn" to resolve.`);
  </script>
</body>
</html>
