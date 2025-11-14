<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Undertale Soul Showdown — UNO-like Card Battle</title>
<style>
  :root{
    --red:#ef4444; --blue:#3b82f6; --green:#22c55e; --yellow:#f59e0b; --dark:#0f172a; --light:#f8fafc;
    --accent:#a78bfa; --gray:#334155;
  }
  body{
    margin:0; font-family:system-ui, Arial, sans-serif; background:linear-gradient(180deg,#0b1020,#121a35);
    color:#e5e7eb;
  }
  header{
    padding:12px 16px; border-bottom:1px solid #1f2937; display:flex; align-items:center; justify-content:space-between;
  }
  header .title{ font-weight:700; letter-spacing:0.5px;}
  header .controls{ display:flex; gap:8px; align-items:center;}
  button{
    background:#1f2937; color:#e5e7eb; border:1px solid #334155; padding:8px 10px; border-radius:8px; cursor:pointer;
  }
  button:hover{ background:#253042; }
  main{ display:grid; grid-template-columns: 1fr 340px; gap:12px; padding:12px; }
  /* Right panel (status) */
  .panel{
    border-left:1px solid #1f2937; padding-left:12px;
  }
  .char{
    background:#0f172a; border:1px solid #1f2937; border-radius:12px; padding:12px; margin-bottom:12px;
  }
  .char h3{ margin:0 0 8px 0; font-size:16px; }
  .bar{
    height:16px; background:#0b1224; border:1px solid #1f2937; border-radius:8px; overflow:hidden; margin:4px 0 10px 0;
  }
  .hp{ background:linear-gradient(90deg,#ef4444,#f87171); }
  .st{ background:linear-gradient(90deg,#22c55e,#86efac); }
  .row{ display:flex; gap:8px; font-size:13px; color:#94a3b8; }
  .log{
    background:#0f172a; border:1px solid #1f2937; border-radius:12px; padding:10px; height:200px; overflow:auto; font-size:13px;
  }
  .log p{ margin:6px 0; }
  .badge{
    display:inline-block; padding:2px 8px; border-radius:999px; font-size:12px; border:1px solid #334155; background:#111827; color:#cbd5e1;
  }

  /* Board area */
  .board{
    display:grid; grid-template-rows: auto auto auto; gap:10px;
  }
  .pile-area{
    display:flex; align-items:center; justify-content:center; gap:24px; padding:16px; border:1px dashed #334155; border-radius:12px;
  }
  .pile{
    width:100px; height:140px; border-radius:12px; background:#0b1224; border:2px solid #334155;
    display:flex; align-items:center; justify-content:center; flex-direction:column; gap:6px;
  }
  .pile .symbol{ font-weight:700; font-size:20px; }
  .pile .color{
    width:18px; height:18px; border-radius:4px; border:1px solid #1f2937;
  }
  .deck{
    width:100px; height:140px; border-radius:12px; background:#111827; border:2px solid #334155;
    display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:12px;
  }

  /* Hands */
  .hand{
    display:flex; flex-wrap:wrap; gap:10px; min-height:160px; padding:10px; border:1px solid #1f2937; border-radius:12px;
    background:#0f172a;
  }
  .card{
    width:80px; height:120px; border-radius:10px; background:#0b1224; border:2px solid #334155;
    color:#e5e7eb; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:6px;
    user-select:none;
  }
  .card .top{ font-size:12px; color:#cbd5e1; }
  .card .big{ font-size:22px; font-weight:800; }
  .card .bot{ font-size:12px; color:#93c5fd; }
  .card.red{ border-color: var(--red); }
  .card.blue{ border-color: var(--blue); }
  .card.green{ border-color: var(--green); }
  .card.yellow{ border-color: var(--yellow); }
  .card.wild{ border-image: linear-gradient(45deg,var(--red),var(--yellow),var(--green),var(--blue)) 1; border-width:2px; border-style:solid; }
  .card[draggable="true"]{ cursor:grab; }
  .card.playable{ box-shadow: 0 0 0 2px #a78bfa; }
  .card.illegal{ animation: shake 180ms linear 2; }
  @keyframes shake{
    0%{ transform: translateX(0); }
    25%{ transform: translateX(-2px); }
    50%{ transform: translateX(2px); }
    75%{ transform: translateX(-2px); }
    100%{ transform: translateX(0); }
  }

  .footer{
    display:flex; align-items:center; gap:10px; color:#cbd5e1; font-size:13px;
  }

  /* Modal for wild color */
  .modal-backdrop{
    position:fixed; inset:0; background:#0008; display:none; align-items:center; justify-content:center;
  }
  .modal{
    background:#0f172a; border:1px solid #334155; border-radius:12px; padding:16px; width:320px;
  }
  .color-choices{ display:flex; gap:8px; margin-top:8px; }
  .color-btn{
    flex:1; padding:8px; border-radius:8px; border:1px solid #334155; cursor:pointer; color:#0f172a; font-weight:700;
  }
  .color-btn.red{ background: var(--red); }
  .color-btn.blue{ background: var(--blue); }
  .color-btn.green{ background: var(--green); }
  .color-btn.yellow{ background: var(--yellow); }
</style>
</head>
<body>
<header>
  <div class="title">Undertale Soul Showdown</div>
  <div class="controls">
    <button id="newGameBtn">New game</button>
    <span class="badge" id="turnBadge">Your turn</span>
  </div>
</header>

<main>
  <section class="board">
    <div class="pile-area" id="pileArea">
      <div class="deck" id="drawDeck">Draw</div>
      <div class="pile" id="pile">
        <div class="symbol">—</div>
        <div class="color" style="background:#334155"></div>
      </div>
    </div>

    <div>
      <h3>Your hand</h3>
      <div class="hand" id="playerHand"></div>
    </div>

    <div>
      <h3>Opponent hand</h3>
      <div class="hand" id="opponentHand"></div>
    </div>

    <div class="footer">
      <span>Tip: Drag a glowing card onto the pile to play. Click “Draw” to draw if stuck.</span>
    </div>
  </section>

  <aside class="panel">
    <div class="char" id="playerPanel">
      <h3>Frisk — Determination</h3>
      <div class="row"><span class="badge">Passive:</span> <span>+1 stamina when you play Wild.</span></div>
      <div class="bar"><div class="hp" id="playerHPBar" style="width:100%"></div></div>
      <div class="row"><span class="badge">HP:</span> <span id="playerHPText">30/30</span></div>
      <div class="bar"><div class="st" id="playerSTBar" style="width:100%"></div></div>
      <div class="row"><span class="badge">Stamina:</span> <span id="playerSTText">10/10</span></div>
    </div>

    <div class="char" id="opponentPanel">
      <h3>Sans — Blue soul tricks</h3>
      <div class="row"><span class="badge">Passive:</span> <span>+1 damage on Skip.</span></div>
      <div class="bar"><div class="hp" id="opponentHPBar" style="width:100%"></div></div>
      <div class="row"><span class="badge">HP:</span> <span id="opponentHPText">30/30</span></div>
      <div class="bar"><div class="st" id="opponentSTBar" style="width:100%"></div></div>
      <div class="row"><span class="badge">Stamina:</span> <span id="opponentSTText">10/10</span></div>
    </div>

    <div class="log" id="log"></div>
  </aside>
</main>

<div class="modal-backdrop" id="wildModal">
  <div class="modal">
    <div>Choose the next color:</div>
    <div class="color-choices">
      <button class="color-btn red" data-color="red">Red</button>
      <button class="color-btn blue" data-color="blue">Blue</button>
      <button class="color-btn green" data-color="green">Green</button>
      <button class="color-btn yellow" data-color="yellow">Yellow</button>
    </div>
  </div>
</div>

<script>
(function(){
  // Game state
  const COLORS = ["red","blue","green","yellow"];
  const SYMBOLS = ["0","1","2","3","4","5","6","7","8","9","Skip","Reverse","Draw 2","Wild","Wild Draw 4"];

  let state = {
    deck: [],
    discard: [],
    playerHand: [],
    opponentHand: [],
    turn: "player",  // "player" | "opponent"
    player: { hp:30, maxHP:30, st:10, maxST:10, name:"Frisk" },
    opponent: { hp:30, maxHP:30, st:10, maxST:10, name:"Sans" },
    locked: false, // to prevent input during AI
  };

  // Utilities
  const log = (msg)=> {
    const el = document.getElementById("log");
    const p = document.createElement("p");
    p.textContent = msg;
    el.appendChild(p);
    el.scrollTop = el.scrollHeight;
  };

  const shuffle = (arr)=> {
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const makeCard = (color, symbol)=> ({ id: crypto.randomUUID(), color, symbol });

  const buildDeck = ()=> {
    const deck = [];
    // Numbers: two of each 1-9 per color, one 0 per color
    COLORS.forEach(color=>{
      deck.push(makeCard(color,"0"));
      for(let n=1;n<=9;n++){
        deck.push(makeCard(color,String(n)));
        deck.push(makeCard(color,String(n)));
      }
      // Action cards: Skip, Reverse, Draw 2 (two each per color)
      ["Skip","Reverse","Draw 2"].forEach(sym=>{
        deck.push(makeCard(color,sym));
        deck.push(makeCard(color,sym));
      });
    });
    // Wilds: 4 Wild, 4 Wild Draw 4
    for(let i=0;i<4;i++){
      deck.push(makeCard("wild","Wild"));
      deck.push(makeCard("wild","Wild Draw 4"));
    }
    return shuffle(deck);
  };

  const drawCard = (who, count=1)=> {
    for(let i=0;i<count;i++){
      if(state.deck.length === 0){
        // recycle discard except top
        if(state.discard.length > 1){
          const top = state.discard.pop();
          state.deck = shuffle(state.discard);
          state.discard = [top];
        } else {
          // no cards left
          break;
        }
      }
      const c = state.deck.pop();
      state[who+"Hand"].push(c);
    }
    render();
  };

  const topDiscard = ()=> state.discard[state.discard.length-1];

  const canPlay = (card)=> {
    const top = topDiscard();
    if(!top) return card.symbol !== "Wild" && card.symbol !== "Wild Draw 4" ? false : true; // only wilds at start
    if(card.symbol === "Wild" || card.symbol === "Wild Draw 4") return true;
    return card.color === top.color || card.symbol === top.symbol;
  };

  const staminaCost = (card)=> {
    if(card.symbol === "Wild") return 0;
    if(card.symbol === "Wild Draw 4") return 3;
    if(card.symbol === "Skip" || card.symbol === "Reverse" || card.symbol === "Draw 2") return 2;
    // numbers cost 1
    return 1;
  };

  const cardDamage = (card, who)=> {
    // Basic mapping for battle effects
    if(card.symbol === "Wild") return 0;
    if(card.symbol === "Wild Draw 4") return 5;
    if(card.symbol === "Draw 2") return 3;
    if(card.symbol === "Skip") return who === "opponent" ? 2 : 1; // Sans passive: +1 dmg on Skip
    if(card.symbol === "Reverse") return -3; // heal self
    // numbers: small attack 1-3 scaled by symbol
    const n = parseInt(card.symbol,10);
    return 1 + (n % 3);
  };

  const applyCardEffects = async (who, card)=> {
    const me = state[who];
    const opp = state[who==="player"?"opponent":"player"];
    const whoName = who==="player" ? "You" : "Sans";

    // stamina cost
    const cost = staminaCost(card);
    me.st = Math.max(0, me.st - cost);

    let dmg = cardDamage(card, who);
    if(dmg > 0){
      opp.hp = Math.max(0, opp.hp - dmg);
      log(`${whoName} hit for ${dmg} with ${card.symbol}.`);
    } else if(dmg < 0){
      const heal = -dmg;
      me.hp = Math.min(me.maxHP, me.hp + heal);
      log(`${whoName} healed ${heal} with ${card.symbol}.`);
    }

    // Special draw/skip handling
    if(card.symbol === "Draw 2"){
      drawCard(who==="player"?"opponent":"player", 2);
      log(`Opponent draws 2 cards.`);
    }
    if(card.symbol === "Wild Draw 4"){
      drawCard(who==="player"?"opponent":"player", 4);
      log(`Opponent draws 4 cards.`);
    }
    if(card.symbol === "Skip"){
      // mark a skip flag for the next turn of opponent
      state.skipNext = who==="player" ? "opponent" : "player";
      log(`Next ${state.skipNext === "opponent" ? "opponent" : "your"} turn is skipped.`);
    }
    if(card.symbol === "Reverse"){
      // In 1v1, use Reverse as a tempo shift: small stamina recover
      me.st = Math.min(me.maxST, me.st + 2);
    }
    if(card.symbol === "Wild"){
      if(who==="player"){
        await chooseWildColor();
        me.st = Math.min(me.maxST, me.st + 1); // Frisk passive
      } else {
        // AI chooses color it has the most of
        const color = aiChooseColor();
        setPileColor(color);
        log(`Sans set color to ${capitalize(color)}.`);
      }
    }
    if(card.symbol === "Wild Draw 4"){
      if(who==="player"){
        await chooseWildColor();
      } else {
        const color = aiChooseColor();
        setPileColor(color);
        log(`Sans set color to ${capitalize(color)}.`);
      }
    }

    checkWin();
    renderBars();
  };

  const checkWin = ()=> {
    if(state.opponent.hp <= 0 || state.opponentHand.length === 0){
      endGame("player");
    } else if(state.player.hp <= 0 || state.playerHand.length === 0){
      endGame("opponent");
    }
  };

  const endGame = (winner)=> {
    state.locked = true;
    document.getElementById("turnBadge").textContent = winner==="player" ? "You win!" : "Sans wins";
    log(winner==="player" ? "Victory! Determination prevails." : "Defeat. You can restart and try again.");
  };

  const playCardFromHand = async (who, cardId)=> {
    const hand = state[who+"Hand"];
    const idx = hand.findIndex(c=>c.id===cardId);
    if(idx === -1) return;
    const card = hand[idx];

    // legality
    if(!canPlay(card)) {
      flashIllegal(cardId);
      return;
    }
    // enough stamina?
    const need = staminaCost(card);
    if(state[who].st < need){
      log(`${who==="player"?"You":"Sans"} tried to play ${card.symbol} but lacked stamina (${need}).`);
      flashIllegal(cardId);
      return;
    }

    // place on discard
    hand.splice(idx,1);
    state.discard.push(card);
    setPileVisual(card);
    render();

    await applyCardEffects(who, card);

    // advance turn
    if(state.skipNext === (who==="player"?"opponent":"player")){
      // consume skip
      state.skipNext = null;
      // opponent turn is skipped
      log(`${who==="player"?"Sans":"You"}'s turn was skipped.`);
      state.turn = who; // you get another turn
      updateTurnBadge();
      return;
    }

    state.turn = who==="player" ? "opponent" : "player";
    updateTurnBadge();

    if(state.turn === "opponent"){
      aiTurn();
    }
  };

  const flashIllegal = (cardId)=> {
    const el = document.querySelector(`.card[data-id="${cardId}"]`);
    if(el){
      el.classList.add("illegal");
      setTimeout(()=> el.classList.remove("illegal"), 300);
    }
  };

  const updateTurnBadge = ()=> {
    const badge = document.getElementById("turnBadge");
    badge.textContent = state.turn === "player" ? "Your turn" : "Opponent turn";
  };

  const setPileVisual = (card)=> {
    const pile = document.getElementById("pile");
    pile.querySelector(".symbol").textContent = card.symbol;
    const colorBox = pile.querySelector(".color");
    colorBox.style.background = card.color === "red" ? "var(--red)"
      : card.color === "blue" ? "var(--blue)"
      : card.color === "green" ? "var(--green)"
      : card.color === "yellow" ? "var(--yellow)" : "linear-gradient(45deg,var(--red),var(--yellow),var(--green),var(--blue))";
  };

  const setPileColor = (color)=> {
    // change top discard "color" in-place to respect wild choice
    const top = topDiscard();
    if(top){
      top.color = color;
      setPileVisual(top);
    }
  };

  const capitalize = s=> s[0].toUpperCase()+s.slice(1);

  // Rendering
  const renderBars = ()=> {
    const pHP = document.getElementById("playerHPBar");
    const pST = document.getElementById("playerSTBar");
    const oHP = document.getElementById("opponentHPBar");
    const oST = document.getElementById("opponentSTBar");

    const hpPctP = Math.round(100 * state.player.hp / state.player.maxHP);
    const stPctP = Math.round(100 * state.player.st / state.player.maxST);
    const hpPctO = Math.round(100 * state.opponent.hp / state.opponent.maxHP);
    const stPctO = Math.round(100 * state.opponent.st / state.opponent.maxST);

    pHP.style.width = hpPctP+"%"; oHP.style.width = hpPctO+"%";
    pST.style.width = stPctP+"%"; oST.style.width = stPctO+"%";

    document.getElementById("playerHPText").textContent = `${state.player.hp}/${state.player.maxHP}`;
    document.getElementById("playerSTText").textContent = `${state.player.st}/${state.player.maxST}`;
    document.getElementById("opponentHPText").textContent = `${state.opponent.hp}/${state.opponent.maxHP}`;
    document.getElementById("opponentSTText").textContent = `${state.opponent.st}/${state.opponent.maxST}`;
  };

  const renderHand = (who)=> {
    const container = document.getElementById(who==="player"?"playerHand":"opponentHand");
    container.innerHTML = "";
    const hand = state[who+"Hand"];
    hand.forEach(card=>{
      const div = document.createElement("div");
      div.className = "card " + (card.color==="wild" ? "wild" : card.color);
      div.dataset.id = card.id;

      const top = document.createElement("div"); top.className = "top"; top.textContent = capitalize(card.color);
      const big = document.createElement("div"); big.className = "big"; big.textContent = card.symbol;
      const bot = document.createElement("div"); bot.className = "bot";
      bot.textContent = effectLabel(card);

      div.appendChild(top); div.appendChild(big); div.appendChild(bot);

      if(who==="player"){
        div.setAttribute("draggable","true");
        if(canPlay(card) && state.turn==="player" && !state.locked){
          div.classList.add("playable");
        }
        div.addEventListener("dragstart", (e)=>{
          if(state.turn!=="player" || state.locked) { e.preventDefault(); return; }
          e.dataTransfer.setData("text/plain", card.id);
        });
        div.addEventListener("dblclick", ()=>{
          if(state.turn!=="player" || state.locked) return;
          playCardFromHand("player", card.id);
        });
      } else {
        // Opponent cards face-down: hide symbol to simulate hand
        big.textContent = "??";
        bot.textContent = "";
        top.textContent = "Soul";
      }

      container.appendChild(div);
    });
  };

  const effectLabel = (card)=> {
    if(card.symbol === "Wild") return "Choose color, +St";
    if(card.symbol === "Wild Draw 4") return "Choose color, heavy hit";
    if(card.symbol === "Draw 2") return "Hit + draw2";
    if(card.symbol === "Skip") return "Skip turn, drain";
    if(card.symbol === "Reverse") return "Heal +St";
    const dmg = 1+(parseInt(card.symbol,10)%3);
    return `Attack ${dmg}, St-${staminaCost(card)}`;
  };

  const renderPile = ()=> {
    const top = topDiscard();
    if(top){
      setPileVisual(top);
    } else {
      const pile = document.getElementById("pile");
      pile.querySelector(".symbol").textContent = "—";
      pile.querySelector(".color").style.background = "#334155";
    }
  };

  const render = ()=> {
    renderHand("player");
    renderHand("opponent");
    renderPile();
    renderBars();
  };

  // Drag & Drop target
  const pileArea = document.getElementById("pileArea");
  pileArea.addEventListener("dragover", (e)=> {
    e.preventDefault();
  });
  pileArea.addEventListener("drop", (e)=> {
    e.preventDefault();
    if(state.turn!=="player" || state.locked) return;
    const id = e.dataTransfer.getData("text/plain");
    playCardFromHand("player", id);
  });

  // Draw from deck
  document.getElementById("drawDeck").addEventListener("click", ()=> {
    if(state.turn!=="player" || state.locked) return;
    drawCard("player", 1);
    // If newly drawn card playable, auto-highlight
    render();
  });

  // Wild color selection (player)
  const wildModal = document.getElementById("wildModal");
  const chooseWildColor = ()=> new Promise(resolve=>{
    wildModal.style.display = "flex";
    const handler = (e)=>{
      const color = e.target.dataset.color;
      if(!color) return;
      setPileColor(color);
      wildModal.style.display = "none";
      wildModal.removeEventListener("click", handler);
      log(`You set color to ${capitalize(color)}.`);
      resolve();
    };
    wildModal.addEventListener("click", handler);
  });

  // AI logic
  const aiChooseColor = ()=> {
    // Choose the color most present in AI's hand
    const counts = { red:0, blue:0, green:0, yellow:0 };
    state.opponentHand.forEach(c=>{ if(COLORS.includes(c.color)) counts[c.color]++; });
    let best = "red"; let max = -1;
    for(const c of COLORS){ if(counts[c]>max){ max=counts[c]; best=c; } }
    if(max===0){ // fallback: random
      best = COLORS[Math.floor(Math.random()*COLORS.length)];
    }
    return best;
  };

  const aiTurn = async ()=> {
    state.locked = true;
    updateTurnBadge();

    // Consider skipNext
    if(state.skipNext === "opponent"){
      state.skipNext = null;
      log("Sans's turn was skipped.");
      state.turn = "player";
      state.locked = false;
      updateTurnBadge();
      render();
      return;
    }

    await sleep(600);

    // Find playable card prioritizing damaging cards
    const playable = state.opponentHand.filter(canPlay);
    playable.sort((a,b)=>{
      const da = cardDamage(a,"opponent");
      const db = cardDamage(b,"opponent");
      // prefer higher damage, then Wild Draw 4, then Draw 2, then Skip, then numbers
      const rank = (c)=>{
        if(c.symbol === "Wild Draw 4") return 100 + cardDamage(c,"opponent");
        if(c.symbol === "Draw 2") return 80 + cardDamage(c,"opponent");
        if(c.symbol === "Skip") return 70 + cardDamage(c,"opponent");
        if(c.symbol === "Reverse") return 40; // occasional heal
        if(c.symbol === "Wild") return 30;
        const n = parseInt(c.symbol,10);
        return 10 + (n||0);
      };
      return rank(b) - rank(a);
    });

    // If none, draw one
    if(playable.length === 0){
      drawCard("opponent",1);
      log("Sans draws a card.");
      await sleep(500);
      // try again once
      const playable2 = state.opponentHand.filter(canPlay);
      if(playable2.length === 0){
        log("Sans passes.");
        state.turn = "player";
        state.locked = false;
        updateTurnBadge();
        render();
        return;
      } else {
        await playCardFromHand("opponent", playable2[0].id);
      }
    } else {
      await playCardFromHand("opponent", playable[0].id);
    }

    state.locked = false;
    render();
  };

  const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));

  // New game
  const newGame = ()=> {
    state.deck = buildDeck();
    state.discard = [];
    state.playerHand = [];
    state.opponentHand = [];
    state.turn = "player";
    state.locked = false;
    state.player = { hp:30, maxHP:30, st:10, maxST:10, name:"Frisk" };
    state.opponent = { hp:30, maxHP:30, st:10, maxST:10, name:"Sans" };
    state.skipNext = null;

    // initial draw
    drawCard("player",7);
    drawCard("opponent",7);

    // flip first card from deck as starting pile (avoid wild start)
    let first;
    while(true){
      first = state.deck.pop();
      if(first.symbol !== "Wild" && first.symbol !== "Wild Draw 4") break;
      // put wild back into deck bottom and continue
      state.deck.unshift(first);
    }
    state.discard.push(first);
    setPileVisual(first);
    updateTurnBadge();
    document.getElementById("log").innerHTML = "";
    log("A new battle begins!");
    render();
  };

  document.getElementById("newGameBtn").addEventListener("click", newGame);

  // Initialize
  newGame();
})();
</script>
</body>
</html>
