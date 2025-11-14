<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SOULS & Actions — Undertale Card Game</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      --bg: #0b0b10;
      --panel: #15151f;
      --accent: #ffd86b;
      --text: #e9e9f2;
      --muted: #9aa0a6;
      --red: #ff4d5a;   /* Determination */
      --blue: #4da1ff;  /* Integrity */
      --green: #49d17a; /* Kindness */
      --yellow: #ffd86b;/* Justice */
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: radial-gradient(1200px 800px at 50% 20%, #11121b 0%, var(--bg) 60%);
      color: var(--text);
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    }
    header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; background: #0f1018; border-bottom: 1px solid #23243a;
      position: sticky; top: 0; z-index: 10;
    }
    header h1 { font-size: 18px; margin: 0; letter-spacing: 0.5px; }
    header .controls { display:flex; gap:8px; align-items:center; }
    button, select {
      background: var(--panel); color: var(--text);
      border: 1px solid #2b2c40; padding: 8px 10px; border-radius: 8px;
      font-weight: 600; cursor: pointer;
    }
    button:hover { border-color: #3d3f5e; }
    main { display: grid; grid-template-columns: 280px 1fr 280px; gap: 12px; padding: 12px; }
    .sidebar, .center, .log {
      background: var(--panel); border: 1px solid #23243a; border-radius: 12px; padding: 12px;
    }
    .center { display: grid; grid-template-rows: auto 1fr auto; gap: 12px; }
    .status { display:flex; justify-content: space-between; align-items:center; gap:12px; }
    .pile { display:flex; align-items:center; justify-content:center; gap: 20px; padding: 8px 0; }
    .pile .card { transform: rotate(-2deg); }
    .deck { width: 92px; height: 130px; border-radius: 12px; border: 2px dashed #3d3f5e;
            display:flex; align-items:center; justify-content:center; color: var(--muted);
            font-weight:700; letter-spacing:1px; }
    .hand { display:flex; flex-wrap: wrap; gap: 8px; align-items:flex-start; }
    .player {
      border: 1px solid #2b2c40; border-radius: 10px; padding: 8px; margin-bottom: 8px;
      background: #11121b;
    }
    .player.active { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(255,216,107,0.15) inset; }
    .meter {
      height: 8px; border-radius: 6px; background: #1b1c2a; overflow:hidden; border:1px solid #2b2c40;
    }
    .meter > div { height: 100%; background: linear-gradient(90deg, var(--yellow), var(--red)); width: 0%; transition: width 260ms ease; }
    .log-entries { height: 380px; overflow: auto; scroll-behavior: smooth; font-size: 14px; }
    .log-entries p { margin: 6px 0; color: #c7c9d6; }
    .card {
      width: 92px; height: 130px; border-radius: 12px; position: relative;
      display:flex; align-items:center; justify-content:center; flex-direction: column;
      color: #0b0b10; font-weight: 800; user-select: none;
      border: 2px solid #0b0b10; cursor: pointer; transition: transform 140ms ease, box-shadow 140ms ease;
    }
    .card:hover { transform: translateY(-3px); box-shadow: 0 8px 18px rgba(0,0,0,0.35); }
    .card.disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
    .card .top, .card .bot {
      position: absolute; font-size: 14px; color: #0b0b10; opacity: 0.7;
    }
    .card .top { top: 8px; left: 10px; }
    .card .bot { bottom: 8px; right: 10px; }
    .soul-red { background: radial-gradient(circle at 30% 30%, #ff9aa3 0%, var(--red) 50%, #bf1f2b 100%); }
    .soul-blue { background: radial-gradient(circle at 30% 30%, #9ccaff 0%, var(--blue) 50%, #215fb8 100%); }
    .soul-green { background: radial-gradient(circle at 30% 30%, #aef2c7 0%, var(--green) 50%, #1c8b5b 100%); }
    .soul-yellow { background: radial-gradient(circle at 30% 30%, #ffe9ac 0%, var(--yellow) 50%, #b4821f 100%); }
    .wild { background: conic-gradient(from 45deg, var(--red) 0 25%, var(--blue) 25% 50%, var(--green) 50% 75%, var(--yellow) 75% 100%); color: #11121b; }
    .symbol { font-size: 40px; text-shadow: 0 1px 0 rgba(0,0,0,0.2); }
    .choose-color { display:flex; gap:8px; }
    .chip { padding: 6px 10px; border-radius: 8px; border:1px solid #2b2c40; cursor:pointer; font-weight:700; }
    .chip.red { background: var(--red); color: #0b0b10; }
    .chip.blue { background: var(--blue); color: #0b0b10; }
    .chip.green { background: var(--green); color: #0b0b10; }
    .chip.yellow { background: var(--yellow); color: #0b0b10; }

    /* Responsive */
    @media (max-width: 980px) {
      main { grid-template-columns: 1fr; }
      .log-entries { height: 200px; }
    }
  </style>
</head>
<body>
<header>
  <h1>SOULS & Actions</h1>
  <div class="controls">
    <label for="playerCount">Players</label>
    <select id="playerCount">
      <option value="2">2</option>
      <option value="3" selected>3</option>
      <option value="4">4</option>
    </select>
    <button id="newGame">New game</button>
    <button id="toggleAI">Toggle AI smartness</button>
  </div>
</header>

<main>
  <section class="sidebar">
    <h3>Players</h3>
    <div id="players"></div>
    <h4 style="margin-top:12px;">Judgment meter</h4>
    <div class="meter"><div id="meterFill"></div></div>
  </section>

  <section class="center">
    <div class="status">
      <div><strong>Turn:</strong> <span id="turnName"></span></div>
      <div><strong>Current SOUL:</strong> <span id="currentSoul">—</span></div>
      <div><strong>Top card:</strong> <span id="topCardLabel">—</span></div>
      <div class="choose-color" id="colorChooser" style="display:none;">
        <span><strong>Choose SOUL:</strong></span>
        <div class="chip red" data-soul="red">Red</div>
        <div class="chip blue" data-soul="blue">Blue</div>
        <div class="chip green" data-soul="green">Green</div>
        <div class="chip yellow" data-soul="yellow">Yellow</div>
      </div>
    </div>
    <div class="pile">
      <div class="deck" id="deck">DRAW</div>
      <div id="discard"></div>
    </div>
    <div class="hand" id="hand"></div>
  </section>

  <section class="log">
    <h3>Battle log</h3>
    <div class="log-entries" id="log"></div>
  </section>
</main>

<script>
/* =========================
   SOULS & Actions — Engine
   ========================= */
const SOULS = ['red','blue','green','yellow'];
const NUMBERS = Array.from({length:10}, (_,i)=>String(i));
const ACTIONS = ['Attack','Mercy','Reverse','Wild','WildAttack','Spare'];

const COLORS = {
  red: { name:'Determination', css:'soul-red' },
  blue:{ name:'Integrity', css:'soul-blue' },
  green:{ name:'Kindness', css:'soul-green' },
  yellow:{ name:'Justice', css:'soul-yellow' },
};

const SYMBOLS = {
  Attack: '⚔️', Mercy: '💫', Reverse: '↔️',
  Wild: '★', WildAttack: '⭐⚔️', Spare: '❤'
};

let state = {
  players: [],
  deck: [],
  discard: [],
  currentSoul: null,
  turnIndex: 0,
  direction: 1, // 1=forward, -1=reverse
  pendingDraw: 0,
  chooseColorPending: false,
  aiSmart: true,
  meter: 0, // judgment meter (streaks)
};

function log(msg) {
  const el = document.getElementById('log');
  const p = document.createElement('p');
  p.textContent = msg;
  el.appendChild(p);
  el.scrollTop = el.scrollHeight;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function createDeck() {
  const deck = [];
  // Number cards: two of each 1–9 per color, one 0 per color
  for (const s of SOULS) {
    deck.push(cardNum(s,'0'));
    for (let n=1; n<=9; n++) {
      deck.push(cardNum(s,String(n)));
      deck.push(cardNum(s,String(n)));
    }
    // Action cards: two per color
    ['Attack','Mercy','Reverse','Spare'].forEach(act => {
      deck.push(cardAction(s,act));
      deck.push(cardAction(s,act));
    });
  }
  // Wilds: 4 Wild, 4 WildAttack
  for (let i=0;i<4;i++) deck.push(cardWild('Wild'));
  for (let i=0;i<4;i++) deck.push(cardWild('WildAttack'));
  shuffle(deck);
  return deck;
}

function cardNum(soul, num) {
  return { type:'num', soul, value:num, label:num, css: COLORS[soul].css };
}
function cardAction(soul, action) {
  return { type:'action', soul, action, label: action, css: COLORS[soul].css };
}
function cardWild(action) {
  return { type:'wild', soul:null, action, label: action, css:'wild' };
}

function deal(players) {
  for (let r=0;r<7;r++) {
    for (const p of players) {
      p.hand.push(state.deck.pop());
    }
  }
  // Flip first non-wild to start
  let first = state.deck.pop();
  while (first.type==='wild') { state.deck.unshift(first); first = state.deck.pop(); }
  state.discard.push(first);
  state.currentSoul = first.soul;
  applyTopCardLabel();
}

function canPlay(card, top) {
  if (state.chooseColorPending) return false; // must pick color first
  if (!top) return true;
  return card.type==='wild'
    || card.soul===state.currentSoul
    || (card.type==='num' && top.type==='num' && card.value===top.value)
    || (card.type==='action' && top.type==='action' && card.action===top.action);
}

function nextTurn(skipped=false) {
  const n = state.players.length;
  state.turnIndex = (state.turnIndex + state.direction + n) % n;
  updateUI();
  if (!skipped) state.meter = Math.max(0, state.meter - 4); // meter cools a bit
  updateMeter();
  runAITurnIfNeeded();
}

function drawCard(player, count=1) {
  for (let i=0;i<count;i++) {
    if (state.deck.length===0) {
      // reshuffle discard (keep top)
      const top = state.discard.pop();
      const rest = state.discard;
      state.discard = [top];
      shuffle(rest);
      state.deck.push(...rest);
    }
    player.hand.push(state.deck.pop());
  }
}

function playCard(player, card, idx) {
  const top = state.discard[state.discard.length-1];
  if (!canPlay(card, top)) return false;

  // Handle pending draws from chain attacks
  if (state.pendingDraw > 0 && card.action !== 'Attack' && card.action !== 'WildAttack') {
    // player must resolve draw unless they stack attack
    drawCard(player, state.pendingDraw);
    log(`${player.name} takes ${state.pendingDraw} from chain attacks.`);
    state.pendingDraw = 0;
  }

  // Place card
  player.hand.splice(idx,1);
  state.discard.push(card);

  // Update soul if not wild
  if (card.type !== 'wild') {
    state.currentSoul = card.soul;
  }

  // Effects
  switch (card.type) {
    case 'num': {
      state.meter = Math.min(100, state.meter + 3);
      log(`${player.name} plays ${card.value} of ${COLORS[state.currentSoul].name}.`);
      break;
    }
    case 'action': {
      log(`${player.name} plays ${card.action} (${COLORS[state.currentSoul].name}).`);
      resolveAction(card, player);
      break;
    }
    case 'wild': {
      log(`${player.name} plays ${card.action} (Wild).`);
      if (card.action === 'WildAttack') {
        state.pendingDraw += 4;
      }
      state.chooseColorPending = true;
      showColorChooser(player);
      break;
    }
  }

  applyTopCardLabel();

  // Win check: empty hand
  if (player.hand.length === 0) {
    log(`🎉 ${player.name} wins the round!`);
    disableAllInteractions();
    return true;
  }
  return true;
}

function resolveAction(card, player) {
  if (card.action === 'Attack') {
    state.pendingDraw += 2;
  }
  if (card.action === 'Mercy') {
    log(`Next player is skipped (Mercy).`);
    nextTurn(true); // skip: effectively extra move for current player after stack checks
  }
  if (card.action === 'Reverse') {
    state.direction *= -1;
    log(`Turn order reversed.`);
  }
  if (card.action === 'Spare') {
    // Conditional win attempt: player can only SPARE if previous two cards match in value OR player has <=2 cards
    const len = state.discard.length;
    const cond = player.hand.length <= 2 || (len>=3 && state.discard[len-2].type==='num' && state.discard[len-3].type==='num' && state.discard[len-2].value===state.discard[len-3].value);
    if (cond) {
      const chance = Math.min(85, 35 + state.meter * 0.5); // meter increases chance
      const roll = Math.random()*100;
      if (roll < chance) {
        log(`SPARE succeeds. ${player.name} ends the battle peacefully.`);
        disableAllInteractions();
        return;
      } else {
        log(`SPARE fails. ${player.name} draws 2 as consequence.`);
        drawCard(player, 2);
      }
    } else {
      log(`SPARE attempt denied: conditions not met.`);
      drawCard(player, 1);
    }
  }
}

function applyTopCardLabel() {
  const top = state.discard[state.discard.length-1];
  const label = top.type==='num' ? top.value
               : top.type==='action' ? top.action
               : top.action;
  document.getElementById('topCardLabel').textContent = label;
  document.getElementById('currentSoul').textContent = top.type==='wild' && state.currentSoul ? COLORS[state.currentSoul].name : COLORS[state.currentSoul]?.name || '—';
  renderDiscard(top);
}

function disableAllInteractions() {
  state.turnIndex = -1;
  updateUI();
}

function showColorChooser(player) {
  const chooser = document.getElementById('colorChooser');
  chooser.style.display = 'flex';
  chooser.querySelectorAll('.chip').forEach(chip => {
    chip.onclick = () => {
      const soul = chip.getAttribute('data-soul');
      state.currentSoul = soul;
      log(`${player.name} sets SOUL to ${COLORS[soul].name}.`);
      state.chooseColorPending = false;
      chooser.style.display = 'none';
      updateUI();
      runAITurnIfNeeded(); // continue AI if necessary
    };
  });
}

/* =========================
   UI
   ========================= */
function renderPlayers() {
  const container = document.getElementById('players');
  container.innerHTML = '';
  state.players.forEach((p, idx) => {
    const div = document.createElement('div');
    div.className = 'player' + (idx===state.turnIndex ? ' active' : '');
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>${p.name}</strong>
        <span>${p.hand.length} cards</span>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderDiscard(card) {
  const d = document.getElementById('discard');
  d.innerHTML = '';
  d.appendChild(cardElement(card, false));
}

function cardElement(card, interactive=true, idx=null) {
  const div = document.createElement('div');
  div.className = `card ${card.type==='wild' ? 'wild' : COLORS[card.soul].css}`;
  const symbol = card.type==='num' ? card.value : SYMBOLS[card.action] || card.action;
  div.innerHTML = `
    <div class="top">${card.type==='wild' ? 'WILD' : COLORS[card.soul].name}</div>
    <div class="symbol">${symbol}</div>
    <div class="bot">${card.type==='num' ? card.value : card.action}</div>
  `;
  if (interactive) {
    const top = state.discard[state.discard.length-1];
    if (!canPlay(card, top)) div.classList.add('disabled');
    div.onclick = () => {
      if (state.turnIndex < 0) return;
      const current = state.players[state.turnIndex];
      const ok = playCard(current, card, idx);
      if (ok && !state.chooseColorPending && state.turnIndex >= 0) {
        nextTurn();
      }
      updateUI();
    };
  }
  return div;
}

function renderHand() {
  const hand = document.getElementById('hand');
  hand.innerHTML = '';
  const player = state.turnIndex>=0 ? state.players[state.turnIndex] : state.players[0];
  player.hand.forEach((c, i) => {
    hand.appendChild(cardElement(c, true, i));
  });
}

function updateMeter() {
  document.getElementById('meterFill').style.width = `${state.meter}%`;
}

function updateUI() {
  renderPlayers();
  renderHand();
  const turnName = state.turnIndex>=0 ? state.players[state.turnIndex].name : '—';
  document.getElementById('turnName').textContent = turnName;
}

/* =========================
   AI (simple and smart)
   ========================= */
function runAITurnIfNeeded() {
  const p = state.players[state.turnIndex];
  if (!p || !p.ai || state.chooseColorPending) return;

  setTimeout(() => {
    const top = state.discard[state.discard.length-1];
    // Filter playable
    const playable = p.hand
      .map((c,i)=>({c,i}))
      .filter(({c}) => canPlay(c, top));

    if (playable.length === 0) {
      if (state.pendingDraw > 0) {
        drawCard(p, state.pendingDraw);
        log(`${p.name} takes ${state.pendingDraw} from chain attacks.`);
        state.pendingDraw = 0;
      } else {
        drawCard(p, 1);
        log(`${p.name} draws.`);
      }
      nextTurn();
      updateUI();
      return;
    }

    let choice;
    if (!state.aiSmart) {
      choice = playable[0];
    } else {
      // Smart: prefer stacking attacks if pending, else match color, else wild
      const att = playable.find(x => x.c.action==='Attack' || x.c.action==='WildAttack');
      if (state.pendingDraw>0 && att) choice = att;
      else {
        choice = playable.find(x => x.c.type!=='wild' && x.c.soul===state.currentSoul)
              || playable.find(x => x.c.type==='num')
              || playable.find(x => x.c.type==='action')
              || playable.find(x => x.c.type==='wild')
              || playable[0];
      }
    }

    playCard(p, choice.c, choice.i);
    if (!state.chooseColorPending && state.turnIndex >= 0) nextTurn();
    updateUI();
  }, 600);
}

/* =========================
   Game lifecycle
   ========================= */
function newGame() {
  state.deck = createDeck();
  state.discard = [];
  state.pendingDraw = 0;
  state.direction = 1;
  state.meter = 0;
  state.chooseColorPending = false;

  const count = parseInt(document.getElementById('playerCount').value, 10);
  state.players = [];
  for (let i=0;i<count;i++) {
    state.players.push({ name: i===0 ? 'You' : `AI ${i}`, hand: [], ai: i!==0 });
  }

  deal(state.players);
  state.turnIndex = 0;
  document.getElementById('log').innerHTML = '';
  log(`A new battle begins. Current SOUL: ${COLORS[state.currentSoul].name}.`);
  updateUI();
}

document.getElementById('newGame').onclick = newGame;
document.getElementById('toggleAI').onclick = () => {
  state.aiSmart = !state.aiSmart;
  log(`AI smartness: ${state.aiSmart ? 'ON' : 'OFF'}.`);
};
document.getElementById('deck').onclick = () => {
  if (state.turnIndex < 0 || state.chooseColorPending) return;
  const player = state.players[state.turnIndex];
  if (state.pendingDraw > 0) {
    drawCard(player, state.pendingDraw);
    log(`You take ${state.pendingDraw} from chain attacks.`);
    state.pendingDraw = 0;
  } else {
    drawCard(player, 1);
    log(`You draw.`);
  }
  nextTurn();
  updateUI();
};

newGame();
</script>
</body>
</html>
