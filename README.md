<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
<title>Undertale Card Duel — Battlebox Edition (Fixed)</title>
<style>
  :root{
    --bg1:#0b1020; --bg2:#121a35; --panel:#0f172a; --border:#1f2937; --muted:#94a3b8; --text:#e5e7eb;
    --green:#22c55e; --blue:#3b82f6; --gold:#f59e0b; --red:#ef4444; --gray:#334155; --accent:#a78bfa;
    --rainbow: linear-gradient(90deg,#ef4444,#f59e0b,#22c55e,#3b82f6,#a78bfa);
  }
  *{ box-sizing:border-box; }
  body{ margin:0; font-family:system-ui, Arial, sans-serif; background:linear-gradient(180deg,var(--bg1),var(--bg2)); color:var(--text); }
  header{
    display:flex; align-items:center; justify-content:space-between; padding:12px 16px;
    border-bottom:1px solid var(--border); position:sticky; top:0; background:linear-gradient(180deg,#0b1020,#121a35); z-index:3;
  }
  .title{ font-weight:800; letter-spacing:0.6px; font-size:clamp(16px,3vw,20px); }
  .controls{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
  button{ background:#182238; color:var(--text); border:1px solid var(--gray); padding:10px 12px; border-radius:10px; font-size:clamp(12px,2.8vw,14px); }
  button:hover{ background:#22304c; }
  .badge{ display:inline-block; padding:6px 10px; border:1px solid var(--gray); border-radius:999px; background:#111827; color:#cbd5e1; font-size:clamp(12px,2.8vw,13px); }
  main{ display:grid; grid-template-columns: 1fr 380px; gap:12px; padding:12px; }
  @media (max-width: 880px){ main{ grid-template-columns: 1fr; } aside.panel{ order: -1; } }

  .board{ display:grid; gap:12px; }
  .hand{ display:flex; flex-wrap:wrap; gap:10px; min-height:160px; padding:10px; border:1px solid var(--border); border-radius:12px; background:var(--panel); }
  .hand h3{ margin:0 0 8px 0; font-size:clamp(14px,3vw,16px); }
  .pile-area{ display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .deck{ min-width:110px; height:150px; border-radius:12px; background:#111827; border:2px solid var(--gray); display:flex; align-items:center; justify-content:center; color:var(--muted); }
  .tip{ color:#cbd5e1; font-size:clamp(12px,2.8vw,13px); }

  .card{
    width:clamp(92px,24vw,120px); height:clamp(132px,36vw,160px);
    border-radius:12px; background:#0b1224; border:2px solid var(--gray); color:var(--text);
    display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding:8px; user-select:none; position:relative;
    transition:transform 120ms ease, box-shadow 120ms ease;
  }
  .card .name{ font-size:clamp(12px,3vw,13px); text-align:center; font-weight:700; }
  .card .desc{ font-size:clamp(10px,2.8vw,11px); color:#cbd5e1; text-align:center; min-height:32px; }
  .tag{ position:absolute; top:6px; left:6px; font-size:clamp(10px,2.6vw,11px); padding:2px 6px; border-radius:999px; border:1px solid var(--gray); background:#111827; color:#cbd5e1; }
  .cost{ position:absolute; bottom:6px; right:6px; font-size:clamp(10px,2.6vw,11px); padding:2px 6px; border-radius:999px; border:1px solid var(--gray); background:#111827; color:#cbd5e1; }
  .items{ border-color: var(--green); box-shadow:0 0 0 2px #166534 inset; }
  .options{ border-color: var(--gold); box-shadow:0 0 0 2px #78350f inset; }
  .magic{ border-color: var(--blue); box-shadow:0 0 0 2px #1e3a8a inset; }
  .rare{ border-image: var(--rainbow) 1; border-width:2px; border-style:solid; box-shadow:0 0 0 2px #94a3b8 inset; }
  .card.playable{ box-shadow: 0 0 12px 2px var(--accent); transform: translateY(-2px); }
  .card.illegal{ animation: shake 180ms linear 2; }
  @keyframes shake{ 0%{transform:translateX(0)}25%{transform:translateX(-2px)}50%{transform:translateX(2px)}75%{transform:translateX(-2px)}100%{transform:translateX(0)} }

  aside.panel{ border-left:1px solid var(--border); padding-left:12px; }
  .char{ background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:12px; margin-bottom:12px; }
  .char h3{ margin:0 0 6px 0; font-size:clamp(16px,3.4vw,18px); }
  .bar{ height:16px; background:#0b1224; border:1px solid var(--border); border-radius:8px; overflow:hidden; margin:6px 0 8px 0; }
  .hp{ background:linear-gradient(90deg,#ef4444,#f87171); }
  .st{ background:linear-gradient(90deg,#22c55e,#86efac); }
  .row{ display:flex; gap:8px; align-items:center; font-size:clamp(12px,2.8vw,13px); color:var(--muted); flex-wrap:wrap; }
  .log{ background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:10px; height:240px; overflow:auto; font-size:clamp(12px,2.8vw,13px); }
  .footer{ display:flex; align-items:center; gap:8px; color:#cbd5e1; font-size:clamp(12px,2.8vw,13px); flex-wrap:wrap; }

  /* Battlebox overlay */
  .overlay{
    position:fixed; inset:0; background:#0009; display:none; align-items:center; justify-content:center; z-index:10;
    padding: max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));
  }
  .battlebox{
    width:clamp(280px, 80vw, 560px);
    height:clamp(200px, 60vh, 420px);
    background:#000; border:3px solid #fff; position:relative; overflow:hidden; border-radius:12px;
  }
  .soul{ position:absolute; width:18px; height:18px; background:#ff0000; border-radius:4px; box-shadow:0 0 8px 2px #ff6b6b; }
  .proj{ position:absolute; background:#cccccc; }
  .beam{ position:absolute; background:#a7f3d0; opacity:0.9; }
  .hud{
    position:absolute; left:8px; top:8px; z-index:2; color:#fff; font-size:clamp(12px,3vw,14px); display:flex; gap:8px;
    background:#0008; padding:6px 8px; border-radius:8px; border:1px solid #fff3;
  }
  .mobile-controls{ display:none; position:absolute; right:8px; bottom:8px; z-index:2; gap:8px; }
  .mobile-controls button{
    width:56px; height:56px; border-radius:50%; background:#182238; border:1px solid var(--gray); color:#fff; font-weight:800;
  }
  @media (pointer:coarse){ .mobile-controls{ display:flex; } }
</style>
</head>
<body>
<header>
  <div class="title">Undertale Card Duel — Battlebox</div>
  <div class="controls">
    <button id="newMatchBtn">New match</button>
    <span class="badge" id="turnBadge">Your turn</span>
    <span class="badge" id="loveBadge">LOVE: 1 (EXP 0, Spared 0)</span>
  </div>
</header>

<main>
  <section class="board">
    <div class="pile-area" id="pileArea">
      <div class="deck" id="drawDeck">Draw</div>
      <span class="tip">Drag a glowing card to the board to play. Double-tap works on mobile.</span>
    </div>

    <div>
      <h3>Your hand</h3>
      <div class="hand" id="playerHand"></div>
    </div>

    <div>
      <h3>Opponent hand</h3>
      <div class="hand" id="opponentHand"></div>
    </div>
  </section>

  <aside class="panel">
    <div class="char" id="playerPanel">
      <h3 id="playerName">Frisk — LV 1</h3>
      <div class="row"><span class="badge">Role:</span> <span id="playerRole">Frisk</span></div>
      <div class="bar"><div class="hp" id="playerHPBar" style="width:100%"></div></div>
      <div class="row"><span class="badge">HP:</span> <span id="playerHPText">20/20</span></div>
      <div class="bar"><div class="st" id="playerSTBar" style="width:0%"></div></div>
      <div class="row"><span class="badge">Stamina:</span> <span id="playerSTText">0/0</span></div>
      <div class="row"><span class="badge">ATK/DEF:</span> <span id="playerStatsText">0 / 0</span></div>
      <div class="row"><span class="badge">Weapon:</span> <span id="playerWeaponText">Stick (1 atk)</span></div>
      <div class="row"><span class="badge">Route-like:</span> <span id="routeText">PACIFIST-ish</span></div>
    </div>

    <div class="char" id="opponentPanel">
      <h3 id="opponentName">Sans — 1 HP</h3>
      <div class="row"><span class="badge">Role:</span> <span id="opponentRole">Sans</span></div>
      <div class="bar"><div class="hp" id="opponentHPBar" style="width:100%"></div></div>
      <div class="row"><span class="badge">HP:</span> <span id="opponentHPText">1/1</span></div>
      <div class="bar"><div class="st" id="opponentSTBar" style="width:100%"></div></div>
      <div class="row"><span class="badge">Stamina:</span> <span id="opponentSTText">100/100</span></div>
      <div class="row"><span class="badge">Passive:</span> <span>Dodges non-FIGHT attacks at 10 ST each instance. +2 ST each turn.</span></div>
    </div>

    <div class="log" id="log"></div>
  </aside>
</main>

<!-- Battlebox overlay -->
<div class="overlay" id="overlay">
  <div class="battlebox" id="battlebox">
    <div class="hud"><span id="bbInfo">Bone Throw</span><span id="bbTimer">3.0s</span></div>
    <div class="mobile-controls">
      <button data-dir="up">↑</button>
      <button data-dir="left">←</button>
      <button data-dir="down">↓</button>
      <button data-dir="right">→</button>
    </div>
    <div class="soul" id="soul"></div>
  </div>
</div>

<script>
(function(){
  // Safe uuid
  function uuid(){
    const rnd = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : ('xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(ch){
      const r = Math.random()*16|0, v = ch==='x'?r:(r&0x3|0x8); return v.toString(16);
    }));
    return rnd;
  }

  // Persistent progression
  const SAVE_KEY = "undertale_card_progress_v3";
  const defaultProgress = { love:1, exp:0, spared:0 };
  const progress = loadProgress();

  // LOVE mapping
  const LOVE_TABLE = [
    { lv:1, total:0, next:10, hp:20, atk:0, def:0, weapon:"Stick (1 atk)", route:"PACIFIST-ish" },
    { lv:2, total:10, next:20, hp:24, atk:2, def:0, route:"NEUTRAL-ish" },
    { lv:3, total:30, next:40, hp:28, atk:4, def:0, route:"NEUTRAL-ish" },
    { lv:4, total:70, next:50, hp:32, atk:6, def:1, weapon:"Toy Knife (4 atk)", route:"NEUTRAL-ish" },
    { lv:5, total:120, next:80, hp:36, atk:8, def:1, route:"NEUTRAL-ish" },
    { lv:6, total:200, next:100, hp:40, atk:10, def:1, route:"NEUTRAL-ish" },
    { lv:7, total:300, next:200, hp:44, atk:12, def:1, route:"NEUTRAL-ish" },
    { lv:8, total:500, next:300, hp:48, atk:14, def:2, weapon:"Tough Glove (5 atk)", route:"NEUTRAL-ish" },
    { lv:9, total:800, next:400, hp:52, atk:16, def:2, route:"NEUTRAL-ish" },
    { lv:10, total:1200, next:500, hp:56, atk:18, def:2, route:"NEUTRAL-ish" },
    { lv:11, total:1700, next:800, hp:60, atk:20, def:2, route:"NEUTRAL-ish" },
    { lv:12, total:2500, next:1000, hp:64, atk:22, def:3, weapon:"Ballet Shoes (7 atk)", route:"NEUTRAL-ish" },
    { lv:13, total:3500, next:1500, hp:68, atk:24, def:3, weapon:"Torn Notebook (2 atk multi-hit)", route:"NEUTRAL-ish" },
    { lv:14, total:5000, next:5000, hp:72, atk:26, def:3, route:"NEUTRAL-ish" },
    { lv:15, total:10000, next:0, hp:76, atk:28, def:3, weapon:"Burnt Pan (10 atk)", route:"NEUTRAL-ish" },
    { lv:16, total:10000, next:40000, hp:80, atk:30, def:4, weapon:"Empty Gun (12 atk)", route:"NEUTRAL-ish" },
    { lv:17, total:50000, next:0, hp:84, atk:32, def:4, route:"NEUTRAL-ish" },
    { lv:18, total:50000, next:0, hp:88, atk:34, def:4, route:"NEUTRAL-ish (end)" },
    { lv:19, total:50000, next:49999, hp:92, atk:38, def:4, weapon:"Worn Dagger (18 atk)", route:"GENOCIDE-ish" },
    { lv:20, total:99999, next:null, hp:99, atk:99, def:99, weapon:"Real Knife (99 atk)", route:"GENOCIDE-max" },
  ];

  // Categories
  const CAT = { ITEMS:"ITEMS", OPTIONS:"OPTIONS", MAGIC:"MAGIC" };

  // State
  let state = {
    playerRole:null, opponentRole:null,
    player:{ hp:20, maxHP:20, st:0, maxST:0, atk:0, def:0, love:1, exp:0, weapon:"Stick (1 atk)" },
    opponent:{ hp:1, maxHP:1, st:100, maxST:100, atk:0, def:0 },
    deck:{ player:[], opponent:[] },
    playerHand:[], opponentHand:[],
    turn:"player", locked:false,
    flags:{ pieUsed:false, snowmanPiecesUsed:0, lostSoul:null }
  };

  // Card factory
  const makeCard = (name, cat, owner, effect, desc, opts={})=>({
    id: uuid(), name, cat, owner, effect, desc, rarity: opts.rarity||null, cost: opts.cost||0
  });

  // Frisk pools
  const friskItems = [
    makeCard("Monster Candy", CAT.ITEMS, "Frisk", { heal:10 }, "+10 HP"),
    makeCard("Spider Donut", CAT.ITEMS, "Frisk", { heal:12 }, "+12 HP"),
    makeCard("Spider Cider", CAT.ITEMS, "Frisk", { heal:24 }, "+24 HP"),
    makeCard("Butterscotch Pie", CAT.ITEMS, "Frisk", { healFull:true }, "Full heal (once per match)"),
    makeCard("Snowman Piece", CAT.ITEMS, "Frisk", { heal:45 }, "+45 HP (max 4 per match)"),
    makeCard("Instant Noodles", CAT.ITEMS, "Frisk", { heal:90 }, "+90 HP"),
    makeCard("Legendary Hero", CAT.ITEMS, "Frisk", { heal:40, atkBuff:1 }, "+40 HP, slight ATK buff"),
    makeCard("Astronaut Food", CAT.ITEMS, "Frisk", { heal:21 }, "+21 HP"),
    makeCard("Hot Dog...?", CAT.ITEMS, "Frisk", { heal:20 }, "+20 HP"),
  ];
  const friskOptions = [
    makeCard("FIGHT", CAT.OPTIONS, "Frisk", { fight:true }, "Attack with weapon+ATK"),
    makeCard("ACT", CAT.OPTIONS, "Frisk", { act:true }, "Check/Flirt/Joke variations"),
    makeCard("MERCY", CAT.OPTIONS, "Frisk", { mercy:true }, "Spare or Flee"),
  ];
  const friskTruePacifistOnly = [
    makeCard("SAVE", CAT.OPTIONS, "Frisk", { save:true }, "Summon Lost Soul ally (4 HP)", { rarity:"rare" }),
  ];

  // Sans pools
  const sansItems = [
    makeCard("Hot Dog...?", CAT.ITEMS, "Sans", { heal:20, stGain:15 }, "+20 HP, +15 ST"),
    makeCard("Hot Cat", CAT.ITEMS, "Sans", { heal:21, stGain:10 }, "+21 HP, +10 ST"),
    makeCard("Ketchup", CAT.ITEMS, "Sans", { heal:8, stGain:25 }, "+8 HP, +25 ST"),
    makeCard("Burger", CAT.ITEMS, "Sans", { heal:12, stGain:20 }, "+12 HP, +20 ST"),
  ];
  const sansOptions = [
    makeCard("ACT (Nap)", CAT.OPTIONS, "Sans", { nap:true }, "Nap: skip 2–3 turns, then full heal"),
    makeCard("MERCY", CAT.OPTIONS, "Sans", { mercy:true }, "Spare or Flee"),
  ];
  const sansMagic = [
    makeCard("Bone Throw", CAT.MAGIC, "Sans", { pattern:"bones", duration:3000 }, "Dodge scattered bones"),
    makeCard("Bone Jumps", CAT.MAGIC, "Sans", { pattern:"bars", duration:4000 }, "Dodge sweeping bars"),
    makeCard("Gaster Blaster", CAT.MAGIC, "Sans", { pattern:"blasters", duration:5000 }, "Dodge beam bursts"),
  ];

  // Build decks influenced by LOVE
  function buildDecks(){
    const playerPool = [];
    const opponentPool = [];
    const loveInfo = getLoveInfo(progress.love);
    const lv = loveInfo.lv;

    function ensureFight(pool){
      const hasFight = pool.some(c=>c.name==="FIGHT");
      if(!hasFight){ pool.push(friskOptions.find(c=>c.name==="FIGHT")); }
    }

    if(state.playerRole==="Frisk"){
      let pItems = friskItems.slice();
      if(lv>=19){ pItems = pItems.filter(c=> !["Hot Dog...?", "Astronaut Food"].includes(c.name)); }
      if(lv>=18){ const leg = friskItems.find(c=>c.name==="Legendary Hero"); if(leg) pItems.push(leg); }
      playerPool.push(...pItems, ...friskOptions);
      if(progress.love===1 && progress.spared>=50){
        const withoutFight = playerPool.filter(c=>c.name!=="FIGHT");
        playerPool.length=0; playerPool.push(...withoutFight, ...friskTruePacifistOnly);
      }
      if(lv>=19) ensureFight(playerPool);
    } else {
      playerPool.push(...sansItems, ...sansOptions, ...sansMagic);
    }

    if(state.opponentRole==="Frisk"){
      let oItems = friskItems.slice();
      const enemyLV = Math.min(18, Math.max(1, progress.love));
      if(enemyLV>=19){ oItems = oItems.filter(c=> !["Hot Dog...?", "Astronaut Food"].includes(c.name)); }
      if(enemyLV>=18){ const leg = friskItems.find(c=>c.name==="Legendary Hero"); if(leg) oItems.push(leg); }
      opponentPool.push(...oItems, ...friskOptions);
      if(progress.love===1 && progress.spared>=50){
        const withoutFight = opponentPool.filter(c=>c.name!=="FIGHT");
        opponentPool.length=0; opponentPool.push(...withoutFight, ...friskTruePacifistOnly);
      }
      if(enemyLV>=19) ensureFight(opponentPool);
    } else {
      opponentPool.push(...sansItems, ...sansOptions, ...sansMagic);
    }

    return { playerDeck: shuffle(playerPool), opponentDeck: shuffle(opponentPool) };
  }

  // New match
  function newMatch(){
    // Roles
    if(Math.random()<0.5){ state.playerRole="Frisk"; state.opponentRole="Sans"; }
    else { state.playerRole="Sans"; state.opponentRole="Frisk"; }

    // Stats
    if(state.playerRole==="Frisk"){
      const li = getLoveInfo(progress.love);
      state.player = { hp:li.hp, maxHP:li.hp, st:0, maxST:0, atk:li.atk, def:li.def, love:progress.love, exp:progress.exp, weapon:li.weapon||"Stick (1 atk)" };
    } else {
      state.player = { hp:1, maxHP:1, st:100, maxST:100, atk:0, def:0 };
    }
    if(state.opponentRole==="Frisk"){
      const enemyLV = Math.min(18, Math.max(1, progress.love));
      const li = getLoveInfo(enemyLV);
      state.opponent = { hp:li.hp, maxHP:li.hp, st:0, maxST:0, atk:li.atk, def:li.def, love:enemyLV, exp:0, weapon:li.weapon||"Stick (1 atk)" };
    } else {
      state.opponent = { hp:1, maxHP:1, st:100, maxST:100, atk:0, def:0 };
    }

    // Reset flags
    state.flags.pieUsed=false;
    state.flags.snowmanPiecesUsed=0;
    state.flags.lostSoul=null;
    state.turn="player";
    state.locked=false;

    const decks = buildDecks();
    state.deck.player = decks.playerDeck;
    state.deck.opponent = decks.opponentDeck;
    state.playerHand = []; state.opponentHand = [];
    drawCards("player", 5);
    drawCards("opponent", 5);

    clearLog(); log(`Match start. You are ${state.playerRole}.`);
    renderAll(); updateTurnBadge(); updateLoveBadge();
  }

  // Utilities
  function getLoveInfo(lv){ return LOVE_TABLE.find(e=>e.lv===lv) || LOVE_TABLE[0]; }
  function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
  function loadProgress(){
    try{ const raw=localStorage.getItem(SAVE_KEY); if(!raw) return {...defaultProgress};
      const p=JSON.parse(raw); return { love:p.love||1, exp:p.exp||0, spared:p.spared||0 };
    } catch(e){ return {...defaultProgress}; }
  }
  function saveProgress(){ localStorage.setItem(SAVE_KEY, JSON.stringify(progress)); }
  function checkLevelUp(){
    let lv = progress.love; let changed=false;
    while(true){
      const e=getLoveInfo(lv);
      if(e.next===null) break;
      const need = e.total + e.next;
      if(progress.exp>=need){ lv++; changed=true; } else break;
    }
    if(changed){ progress.love=Math.min(20, lv); log(`LOVE increased to LV ${progress.love}.`); saveProgress(); updateLoveBadge(); }
  }

  // Draw
  function drawCards(who, count){
    const d = state.deck[who];
    for(let i=0;i<count;i++){ if(d.length===0) break; state[who+"Hand"].push(d.pop()); }
    renderHands();
  }

  // Attack with Sans dodge rule (bypass for Frisk FIGHT)
  function applyAttack(targetSide, hits, dmgPerHit, source, opts={}){
    const target = state[targetSide];
    const targetIsSans = (targetSide==="player" && state.playerRole==="Sans") || (targetSide==="opponent" && state.opponentRole==="Sans");
    const bypassDodge = !!opts.bypassDodge;
    let totalDamage = 0;

    for(let h=0; h<hits; h++){
      if(targetIsSans && !bypassDodge){
        if(target.st>=10){
          target.st -= 10;
          log(`Sans dodged (−10 ST).`);
        } else {
          target.hp = Math.max(0, target.hp - dmgPerHit);
          totalDamage += dmgPerHit;
        }
      } else {
        target.hp = Math.max(0, target.hp - dmgPerHit);
        totalDamage += dmgPerHit;
      }
    }
    if(totalDamage>0) log(`${source} dealt ${totalDamage} damage.`);
    renderBars(); checkWin();
  }

  // Card play
  async function playCard(who, cardId){
    if(state.locked || state.turn!==who) return;

    const hand = state[who+"Hand"];
    const idx = hand.findIndex(c=>c.id===cardId);
    if(idx===-1) return;
    const card = hand[idx];
    const role = state[who+"Role"];

    if(card.owner !== role){ flashIllegal(cardId); return; }
    if(role==="Frisk" && card.cat===CAT.MAGIC){ log("Frisk cannot use MAGIC."); flashIllegal(cardId); return; }
    if(card.cost && state[who].st < card.cost){ log(`${role} lacks stamina (${card.cost}).`); flashIllegal(cardId); return; }
    if(role==="Frisk" && card.name==="Butterscotch Pie" && state.flags.pieUsed){ log("Pie can be used only once per match."); flashIllegal(cardId); return; }
    if(role==="Frisk" && card.name==="Snowman Piece" && state.flags.snowmanPiecesUsed>=4){ log("Snowman Piece limit reached (4 per match)."); flashIllegal(cardId); return; }

    hand.splice(idx,1);
    renderHands();
    await resolveCard(who, card);
    endTurn(who);
  }

  async function resolveCard(who, card){
    const me = state[who];
    const targetSide = (who==="player")?"opponent":"player";
    const target = state[targetSide];
    const actor = who==="player"?"You":"AI";
    const meRole = state[who+"Role"];

    // ITEMS
    if(card.cat===CAT.ITEMS){
      if(card.effect.healFull){
        const before = me.hp; me.hp=me.maxHP; log(`${actor} used ${card.name} and fully healed (${before}→${me.hp}).`);
        if(meRole==="Frisk") state.flags.pieUsed=true;
      } else if(card.effect.heal){
        const before=me.hp; me.hp=Math.min(me.maxHP, me.hp+card.effect.heal);
        log(`${actor} used ${card.name} (+${me.hp-before} HP).`);
        if(meRole==="Frisk" && card.name==="Snowman Piece") state.flags.snowmanPiecesUsed++;
      }
      if(card.effect.stGain){ me.st=Math.min(me.maxST, me.st+card.effect.stGain); log(`${actor} recovered ${card.effect.stGain} stamina.`); }
      if(card.effect.atkBuff){ me.atk+=card.effect.atkBuff; log(`${actor} feels stronger (+${card.effect.atkBuff} ATK).`); }
    }

    // OPTIONS
    if(card.cat===CAT.OPTIONS){
      if(card.effect.fight){
        const loveInfo = (meRole==="Frisk")? getLoveInfo(me.love||progress.love):{atk:0};
        const weaponAtk = parseWeaponAtk(me.weapon);
        const base = (loveInfo.atk||0) + weaponAtk;
        const hits = (me.weapon && me.weapon.includes("Torn Notebook")) ? randInt(3,4) : 1;
        const dmg = Math.max(0, base - (target.def||0));
        log(`${actor} used FIGHT (${hits}×${dmg}).`);
        applyAttack(targetSide, hits, dmg, actor, { bypassDodge:true });
      }
      if(card.effect.act){
        const flavor = ["Check","Flirt","Threaten","Pet","Joke"];
        const actUsed = flavor[Math.floor(Math.random()*flavor.length)];
        log(`${actor} used ACT: ${actUsed}. DEF falls by 1.`);
        target.def = Math.max(0, (target.def||0) - 1);
      }
      if(card.effect.mercy){
        if(who==="player"){
          const choice = await promptMercy();
          if(choice==="spare"){
            if(trySpare()){ log("You spared the opponent. Draw by mercy."); progress.spared++; saveProgress(); endGame("draw_mercy"); return; }
            else { log("Spare failed."); }
          } else if(choice==="flee"){
            if(tryFlee()){ log("You fled. Draw."); endGame("draw_flee"); return; }
            else { log("Could not flee."); }
          }
        } else {
          const willSpare = progress.love===1 && (state.player.hp <= Math.ceil(state.player.maxHP*0.25));
          if(willSpare){ log("AI spared you. Draw."); progress.spared++; saveProgress(); endGame("draw_mercy"); return; }
        }
      }
      if(card.effect.save){
        if(state.flags.lostSoul){ log("A Lost Soul is already helping."); }
        else { state.flags.lostSoul = { name: pickLostSoul(), hp:4 }; log(`Lost Soul (${state.flags.lostSoul.name}) joins with 4 HP.`); }
      }
      if(card.effect.nap){
        const skip = randInt(2,3); me.napTurns = skip; log(`${actor} starts a nap (skip ${skip} turns, then full heal).`);
      }
    }

    // MAGIC → Battlebox
    if(card.cat===CAT.MAGIC){
      const pattern = card.effect.pattern;
      const duration = card.effect.duration || 3000;
      const targetIsPlayer = (who==="opponent");
      await runBattlebox({ pattern, duration, targetSide: targetIsPlayer ? "player" : "opponent" });
    }
  }

  // Mercy helpers
  async function promptMercy(){
    return new Promise(resolve=>{
      const choice = window.prompt("MERCY: type 'spare' or 'flee'");
      const c = (choice||"").toLowerCase();
      resolve((c==="spare"||c==="flee")?c:null);
    });
  }
  function trySpare(){
    const lv = progress.love;
    const base = lv===1 ? 0.6 : lv<10 ? 0.3 : lv<18 ? 0.2 : 0.0;
    return Math.random() < base;
  }
  function tryFlee(){
    const lv = progress.love;
    if(lv>=19) return false;
    return Math.random() < 0.5;
  }
  function pickLostSoul(){ const pool=["Sans","Papyrus","Undyne","Toriel","Alphys","Asgore"]; return pool[Math.floor(Math.random()*pool.length)]; }

  // End turn
  function endTurn(who){
    if(state.flags.lostSoul && state.flags.lostSoul.hp>0){
      if(Math.random()<0.5){
        const targetSide = (who==="player")?"opponent":"player";
        applyAttack(targetSide, 1, 1, "Lost Soul");
        log(`Lost Soul (${state.flags.lostSoul.name}) chipped for 1.`);
      }
      if(Math.random()<0.1){
        state.flags.lostSoul.hp = Math.max(0, state.flags.lostSoul.hp-1);
        log(`Lost Soul (${state.flags.lostSoul.name}) took 1 damage.`);
      }
    }

    if(who==="player"){
      state.turn="opponent";
      if(state.opponentRole==="Sans"){ state.opponent.st=Math.min(state.opponent.maxST, state.opponent.st+2); }
    } else {
      state.turn="player";
      if(state.playerRole==="Sans"){ state.player.st=Math.min(state.player.maxST, state.player.st+2); }
    }
    updateTurnBadge(); renderBars();

    const actorKey = state.turn==="player" ? "player" : "opponent";
    const actor = state[actorKey];
    if(actor.napTurns && actor.napTurns>0){
      actor.napTurns--;
      log(`${state[actorKey+"Role"]} is napping. Turn skipped.`);
      if(actor.napTurns===0){ actor.hp=actor.maxHP; log(`${state[actorKey+"Role"]} wakes fully healed.`); renderBars(); }
      endTurn(state.turn); return;
    }

    if(state.turn==="opponent"){ aiTurn(); }
  }

  // Win + EXP
  function checkWin(){
    if(state.opponent.hp<=0){
      if(state.playerRole==="Frisk"){
        const expGain = expForKill(state.opponent.maxHP);
        progress.exp += expGain; log(`You gained ${expGain} EXP.`); saveProgress(); checkLevelUp();
      }
      endGame("player_win"); return true;
    }
    if(state.player.hp<=0){ endGame("opponent_win"); return true; }
    return false;
  }
  function expForKill(maxHP){ if(maxHP<=1) return 10; return Math.min(500, Math.max(10, Math.floor(maxHP*0.8))); }
  function endGame(result){
    state.locked=true;
    const badge = document.getElementById("turnBadge");
    badge.textContent = result==="player_win"?"You win": result==="opponent_win"?"You lose": result==="draw_mercy"?"Mercy": "Draw";
    log(`Match ended: ${badge.textContent}.`);
    renderBars(); updateLoveBadge();
  }

  // Render
  function renderHands(){ renderHand("player"); renderHand("opponent"); }
  function renderHand(who){
    const container = document.getElementById(who==="player"?"playerHand":"opponentHand");
    container.innerHTML = "";
    state[who+"Hand"].forEach(card=>{
      const div = document.createElement("div");
      div.className = "card " + (card.cat===CAT.ITEMS?"items": card.cat===CAT.OPTIONS?"options":"magic");
      if(card.rarity==="rare") div.classList.add("rare");
      const tag = document.createElement("div"); tag.className="tag"; tag.textContent=card.cat;
      const name = document.createElement("div"); name.className="name"; name.textContent=who==="player"?card.name:"???";
      const desc = document.createElement("div"); desc.className="desc"; desc.textContent=who==="player"?(card.desc||""):"";
      const cost = document.createElement("div"); cost.className="cost"; cost.textContent = (card.cost?`ST ${card.cost}`:"");
      div.append(tag,name,desc,cost);
      if(who==="player"){
        div.setAttribute("draggable","true");
        if(state.turn==="player" && !state.locked) div.classList.add("playable");
        div.addEventListener("dragstart", function(e){
          if(state.turn!=="player" || state.locked){ e.preventDefault(); return; }
          e.dataTransfer.setData("text/plain", card.id);
        });
        let taps=0; div.addEventListener("click", function(){
          taps++; setTimeout(()=>{ taps=0; }, 250);
          if(taps>=2) playCard("player", card.id);
        });
        div.addEventListener("dblclick", function(){ playCard("player", card.id); });
      }
      div.dataset.id = card.id;
      container.appendChild(div);
    });
  }
  function renderBars(){
    const pHPB=document.getElementById("playerHPBar"), oHPB=document.getElementById("opponentHPBar");
    const pSTB=document.getElementById("playerSTBar"), oSTB=document.getElementById("opponentSTBar");
    const p=state.player, o=state.opponent;
    const pct = (val,max)=> Math.round(100*val/Math.max(1,max));
    pHPB.style.width = pct(p.hp, p.maxHP)+"%";
    oHPB.style.width = pct(o.hp, o.maxHP)+"%";
    pSTB.style.width = p.maxST? pct(p.st, p.maxST)+"%":"0%";
    oSTB.style.width = o.maxST? pct(o.st, o.maxST)+"%":"0%";
    document.getElementById("playerHPText").textContent=`${p.hp}/${p.maxHP}`;
    document.getElementById("opponentHPText").textContent=`${o.hp}/${o.maxHP}`;
    document.getElementById("playerSTText").textContent=`${p.st}/${p.maxST}`;
    document.getElementById("opponentSTText").textContent=`${o.st}/${o.maxST}`;
    document.getElementById("playerRole").textContent = state.playerRole;
    document.getElementById("opponentRole").textContent = state.opponentRole;
    const li = (state.playerRole==="Frisk")? getLoveInfo(progress.love): null;
    document.getElementById("routeText").textContent = li? li.route : "—";
    if(state.playerRole==="Frisk"){
      document.getElementById("playerName").textContent = `Frisk — LV ${progress.love}`;
      document.getElementById("playerStatsText").textContent = `${p.atk} / ${p.def}`;
      document.getElementById("playerWeaponText").textContent = li.weapon || p.weapon || "Stick (1 atk)";
      document.getElementById("opponentName").textContent = state.opponentRole==="Sans"?"Sans — 1 HP":`Frisk — LV ${state.opponent.love||1}`;
    } else {
      document.getElementById("playerName").textContent = "Sans — 1 HP";
      document.getElementById("playerStatsText").textContent = `${p.atk||0} / ${p.def||0}`;
      document.getElementById("playerWeaponText").textContent = "—";
      document.getElementById("opponentName").textContent = state.opponentRole==="Sans"?"Sans — 1 HP":`Frisk — LV ${state.opponent.love||1}`;
    }
  }
  function renderAll(){ renderHands(); renderBars(); }
  function updateTurnBadge(){ document.getElementById("turnBadge").textContent = state.turn==="player"?"Your turn":"Opponent turn"; }
  function updateLoveBadge(){ document.getElementById("loveBadge").textContent = `LOVE: ${progress.love} (EXP ${progress.exp}, Spared ${progress.spared})`; }
  function clearLog(){ document.getElementById("log").innerHTML=""; }
  function log(msg){ const el=document.getElementById("log"); const p=document.createElement("p"); p.textContent=msg; el.appendChild(p); el.scrollTop=el.scrollHeight; }
  function flashIllegal(id){ const el=document.querySelector(`.card[data-id="${id}"]`); if(el){ el.classList.add("illegal"); setTimeout(()=>el.classList.remove("illegal"),300);} }
  function parseWeaponAtk(name){ const m=(name||"").match(/(\d+)\s*atk/i); return m?parseInt(m[1],10):0; }
  function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  // Drag target
  const pileArea=document.getElementById("pileArea");
  pileArea.addEventListener("dragover", function(e){ e.preventDefault(); });
  pileArea.addEventListener("drop", function(e){
    e.preventDefault();
    if(state.turn!=="player" || state.locked) return;
    const id=e.dataTransfer.getData("text/plain");
    playCard("player", id);
  });

  // Draw click
  document.getElementById("drawDeck").addEventListener("click", function(){
    if(state.turn!=="player" || state.locked) return;
    drawCards("player",1);
  });

  // AI
  async function aiTurn(){
    state.locked=true;
    await sleep(500);
    const hand=state.opponentHand;
    let choice=null;

    if(state.opponentRole==="Sans"){
      const order=["Gaster Blaster","Bone Jumps","Bone Throw"];
      choice = hand.find(c=> c.cat===CAT.MAGIC && order.includes(c.name)) || hand.find(c=>c.cat===CAT.MAGIC);
      if(!choice){
        if(state.opponent.st<30 || state.opponent.hp<state.opponent.maxHP*0.5) choice=hand.find(c=>c.cat===CAT.ITEMS);
      }
      if(!choice) choice = hand.find(c=> c.cat===CAT.OPTIONS && c.effect.nap) || hand[0];
    } else {
      choice = hand.find(c=> c.name==="FIGHT");
      if(!choice && state.opponent.hp < Math.ceil(state.opponent.maxHP*0.6)){
        const heals = hand.filter(c=>c.cat===CAT.ITEMS);
        if(heals.length){ heals.sort((a,b)=> (valueHeal(b)-valueHeal(a))); choice=heals[0]; }
      }
      if(!choice && progress.love===1){ choice = hand.find(c=> c.name==="MERCY") || hand[0]; }
      if(!choice) choice = hand[0];
    }

    if(choice){ await playCard("opponent", choice.id); } else { log("Opponent passes."); }
    state.locked=false; renderAll();
  }
  function valueHeal(card){ if(card.effect.healFull) return 999; return card.effect.heal||0; }
  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

  // Battlebox engine
  async function runBattlebox({ pattern, duration, targetSide }){
    const overlay = document.getElementById("overlay");
    const box = document.getElementById("battlebox");
    const soul = document.getElementById("soul");
    const info = document.getElementById("bbInfo");
    const timerEl = document.getElementById("bbTimer");
    overlay.style.display="flex";
    info.textContent = patternLabel(pattern);
    timerEl.textContent = (duration/1000).toFixed(1)+"s";

    // Center soul
    const boxRect = box.getBoundingClientRect();
    const soulState = { x: boxRect.width/2 - 9, y: boxRect.height/2 - 9, vx:0, vy:0, speed: 140 };
    placeSoul();

    const targetIsPlayer = (targetSide==="player");
    const keys = { up:false, down:false, left:false, right:false };
    function keyDownHandler(e){ setKey(e, true); }
    function keyUpHandler(e){ setKey(e, false); }
    function setKey(e, val){
      const k=e.key.toLowerCase();
      if(k==="arrowup"||k==="w") keys.up=val;
      if(k==="arrowdown"||k==="s") keys.down=val;
      if(k==="arrowleft"||k==="a") keys.left=val;
      if(k==="arrowright"||k==="d") keys.right=val;
    }
    if(targetIsPlayer){
      window.addEventListener("keydown", keyDownHandler);
      window.addEventListener("keyup", keyUpHandler);
    }

    // Mobile controls
    const mc = box.querySelector(".mobile-controls");
    const btns = mc.querySelectorAll("button");
    const touchState = { up:false,down:false,left:false,right:false };
    function touchStart(e){ e.preventDefault(); const dir=e.currentTarget.dataset.dir; touchState[dir]=true; }
    function touchEnd(e){ e.preventDefault(); const dir=e.currentTarget.dataset.dir; touchState[dir]=false; }
    btns.forEach(b=>{ b.addEventListener("touchstart", touchStart, {passive:false}); b.addEventListener("touchend", touchEnd, {passive:false}); });

    // Hazards
    const projs = []; const beams = [];
    spawnPattern(pattern, projs, beams, boxRect);

    let last = performance.now();
    let elapsed = 0;
    let running = true;

    await new Promise(resolve=>{
      function step(now){
        if(!running) return;
        const dt = Math.min(0.033, (now-last)/1000);
        last=now; elapsed += dt*1000;
        timerEl.textContent = (Math.max(0, duration - Math.floor(elapsed))/1000).toFixed(1)+"s";

        // Move soul
        if(targetIsPlayer){
          const up = keys.up || touchState.up;
          const down = keys.down || touchState.down;
          const left = keys.left || touchState.left;
          const right = keys.right || touchState.right;
          soulState.vx = (right?1:0) - (left?1:0);
          soulState.vy = (down?1:0) - (up?1:0);
        } else {
          const nearest = nearestHazard(soulState, projs, beams);
          if(nearest){
            const dx = soulState.x - nearest.x;
            const dy = soulState.y - nearest.y;
            const len = Math.max(1, Math.hypot(dx,dy));
            soulState.vx = dx/len; soulState.vy = dy/len;
          } else { soulState.vx=0; soulState.vy=0; }
        }
        soulState.x += soulState.vx * soulState.speed * dt;
        soulState.y += soulState.vy * soulState.speed * dt;
        clampSoul();

        // Move hazards
        projs.forEach(p=>{
          p.x += p.vx * dt; p.y += p.vy * dt;
          p.el.style.left = p.x + "px"; p.el.style.top = p.y + "px";
        });
        beams.forEach(b=>{
          b.t += dt; b.el.style.opacity = (Math.floor(b.t*2)%2===0)?0.9:0.2;
        });

        // Collision
        if(colliding(soulState, projs, beams)){
          const side = targetSide;
          state[side].hp = Math.max(0, state[side].hp - 1);
          renderBars();
          if(checkWin()){ running=false; cleanup(); resolve(); return; }
        }

        if(elapsed >= duration){ running=false; cleanup(); resolve(); return; }
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });

    function placeSoul(){ soul.style.left = soulState.x+"px"; soul.style.top = soulState.y+"px"; }
    function clampSoul(){
      const w = boxRect.width, h = boxRect.height;
      soulState.x = Math.max(0, Math.min(w-18, soulState.x));
      soulState.y = Math.max(0, Math.min(h-18, soulState.y));
      placeSoul();
    }
    function cleanup(){
      projs.forEach(p=> p.el.remove());
      beams.forEach(b=> b.el.remove());
      if(targetIsPlayer){
        window.removeEventListener("keydown", keyDownHandler);
        window.removeEventListener("keyup", keyUpHandler);
      }
      btns.forEach(b=>{
        b.removeEventListener("touchstart", touchStart);
        b.removeEventListener("touchend", touchEnd);
      });
      overlay.style.display="none";
    }
  }

  function patternLabel(p){ return p==="bones"?"Bone Throw": p==="bars"?"Bone Jumps":"Gaster Blaster"; }
  function spawnPattern(p, projs, beams, rect){
    const box = document.getElementById("battlebox");
    if(p==="bones"){
      for(let i=0;i<18;i++){
        const el=document.createElement("div");
        el.className="proj"; el.style.width="24px"; el.style.height="6px"; el.style.background="#ddd";
        const x=Math.random()*rect.width, y=Math.random()*rect.height;
        const vx=(Math.random()<0.5?-1:1)* (60+Math.random()*80);
        const vy=(Math.random()<0.5?-1:1)* (60+Math.random()*80);
        el.style.left=x+"px"; el.style.top=y+"px"; box.appendChild(el);
        projs.push({ el, x, y, vx, vy, w:24, h:6 });
      }
    } else if(p==="bars"){
      for(let i=0;i<6;i++){
        const vertical = i%2===0;
        const el=document.createElement("div");
        el.className="proj"; el.style.background="#bbb";
        if(vertical){ el.style.width="8px"; el.style.height=(rect.height*0.8)+"px"; }
        else { el.style.height="8px"; el.style.width=(rect.width*0.8)+"px"; }
        const speed = 80+Math.random()*80;
        const x = vertical? (Math.random()<0.5?0:rect.width-8) : Math.random()*rect.width*0.2;
        const y = vertical? Math.random()*rect.height*0.2 : (Math.random()<0.5?0:rect.height-8);
        const vx = vertical? (x===0? speed: -speed) : 0;
        const vy = vertical? 0 : (y===0? speed: -speed);
        el.style.left=x+"px"; el.style.top=y+"px"; box.appendChild(el);
        projs.push({ el, x, y, vx, vy, w: vertical?8:rect.width*0.8, h: vertical?rect.height*0.8:8 });
      }
    } else {
      for(let i=0;i<5;i++){
        const el=document.createElement("div");
        el.className="beam";
        const vertical = Math.random()<0.5;
        if(vertical){ el.style.width="10px"; el.style.height=rect.height+"px"; el.style.left=(Math.random()*rect.width)+"px"; el.style.top="0px"; }
        else { el.style.height="10px"; el.style.width=rect.width+"px"; el.style.top=(Math.random()*rect.height)+"px"; el.style.left="0px"; }
        box.appendChild(el);
        beams.push({ el, x: parseFloat(el.style.left)||rect.width/2, y: parseFloat(el.style.top)||rect.height/2, w: vertical?10:rect.width, h: vertical?rect.height:10, t:0 });
      }
      for(let i=0;i<10;i++){
        const el=document.createElement("div");
        el.className="proj"; el.style.width="18px"; el.style.height="6px"; el.style.background="#ddd";
        const x=Math.random()*rect.width, y=Math.random()*rect.height;
        const vx=(Math.random()<0.5?-1:1)* (50+Math.random()*70);
        const vy=(Math.random()<0.5?-1:1)* (50+Math.random()*70);
        el.style.left=x+"px"; el.style.top=y+"px"; box.appendChild(el);
        projs.push({ el, x, y, vx, vy, w:18, h:6 });
      }
    }
  }
  function nearestHazard(soul, projs, beams){
    let best=null, dmin=Infinity;
    for(const p of projs){
      const cx=p.x+p.w/2, cy=p.y+p.h/2;
      const d=Math.hypot(soul.x-cx, soul.y-cy);
      if(d<dmin){ dmin=d; best={ x:cx, y:cy }; }
    }
    for(const b of beams){
      const cx=b.x+b.w/2, cy=b.y+b.h/2;
      const d=Math.hypot(soul.x-cx, soul.y-cy);
      if(d<dmin){ dmin=d; best={ x:cx, y:cy }; }
    }
    return best;
  }
  function colliding(soul, projs, beams){
    const sx=soul.x, sy=soul.y, sw=18, sh=18;
    for(const p of projs){ if(rectsOverlap(sx,sy,sw,sh, p.x,p.y,p.w,p.h)) return true; }
    for(const b of beams){ if(rectsOverlap(sx,sy,sw,sh, b.x,b.y,b.w,b.h) && parseFloat(b.el.style.opacity)>0.5) return true; }
    return false;
  }
  function rectsOverlap(x1,y1,w1,h1, x2,y2,w2,h2){
    return !(x1+w1<x2 || x2+w2<x1 || y1+h1<y2 || y2+h2<y1);
  }

  // Events
  document.getElementById("newMatchBtn").addEventListener("click", newMatch);

  // Init
  newMatch();
})();
</script>
</body>
</html>
