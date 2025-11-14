<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Undertale Card Duel</title>
<style>
  :root{
    --bg1:#0b1020; --bg2:#121a35; --panel:#0f172a; --border:#1f2937; --muted:#94a3b8; --text:#e5e7eb;
    --green:#22c55e; --blue:#3b82f6; --gold:#f59e0b; --red:#ef4444; --gray:#334155; --accent:#a78bfa;
    --rainbow: linear-gradient(90deg,#ef4444,#f59e0b,#22c55e,#3b82f6,#a78bfa);
  }
  body{ margin:0; font-family:system-ui, Arial, sans-serif; background:linear-gradient(180deg,var(--bg1),var(--bg2)); color:var(--text); }
  header{ display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--border); }
  .title{ font-weight:800; letter-spacing:0.6px; }
  .controls{ display:flex; gap:8px; align-items:center; }
  select,button{ background:#182238; color:var(--text); border:1px solid var(--gray); padding:8px 10px; border-radius:8px; }
  button:hover{ background:#22304c; }
  main{ display:grid; grid-template-columns: 1fr 360px; gap:12px; padding:12px; }
  .board{ display:grid; gap:12px; }
  .hand{ display:flex; flex-wrap:wrap; gap:10px; min-height:160px; padding:10px; border:1px solid var(--border); border-radius:12px; background:var(--panel); }
  .pile-area{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .deck{ width:110px; height:150px; border-radius:12px; background:#111827; border:2px solid var(--gray); display:flex; align-items:center; justify-content:center; color:var(--muted); }
  .card{
    width:96px; height:140px; border-radius:12px; background:#0b1224; border:2px solid var(--gray); color:var(--text);
    display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding:8px; user-select:none; position:relative;
    transition:transform 120ms ease, box-shadow 120ms ease;
  }
  .card .name{ font-size:13px; text-align:center; font-weight:700; }
  .card .desc{ font-size:11px; color:#cbd5e1; text-align:center; min-height:32px; }
  .tag{ position:absolute; top:6px; left:6px; font-size:11px; padding:2px 6px; border-radius:999px; border:1px solid var(--gray); background:#111827; color:#cbd5e1; }
  .cost{ position:absolute; bottom:6px; right:6px; font-size:11px; padding:2px 6px; border-radius:999px; border:1px solid var(--gray); background:#111827; color:#cbd5e1; }
  .items{ border-color: var(--green); box-shadow:0 0 0 2px #166534 inset; }
  .options{ border-color: var(--gold); box-shadow:0 0 0 2px #78350f inset; }
  .magic{ border-color: var(--blue); box-shadow:0 0 0 2px #1e3a8a inset; }
  .rare{ border-image: var(--rainbow) 1; border-width:2px; border-style:solid; box-shadow:0 0 0 2px #94a3b8 inset; }
  .card.playable{ box-shadow: 0 0 12px 2px var(--accent); transform: translateY(-2px); }
  .card.illegal{ animation: shake 180ms linear 2; }
  @keyframes shake{ 0%{transform:translateX(0)}25%{transform:translateX(-2px)}50%{transform:translateX(2px)}75%{transform:translateX(-2px)}100%{transform:translateX(0)} }

  aside.panel{ border-left:1px solid var(--border); padding-left:12px; }
  .char{ background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:12px; margin-bottom:12px; }
  .char h3{ margin:0 0 6px 0; font-size:16px; }
  .bar{ height:16px; background:#0b1224; border:1px solid var(--border); border-radius:8px; overflow:hidden; margin:6px 0 8px 0; }
  .hp{ background:linear-gradient(90deg,#ef4444,#f87171); }
  .st{ background:linear-gradient(90deg,#22c55e,#86efac); }
  .row{ display:flex; gap:8px; align-items:center; font-size:13px; color:var(--muted); }
  .badge{ display:inline-block; padding:2px 8px; border-radius:999px; font-size:12px; border:1px solid var(--gray); background:#111827; color:#cbd5e1; }
  .log{ background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:10px; height:220px; overflow:auto; font-size:13px; }
  .tip{ color:#cbd5e1; font-size:13px; }
  .footer{ display:flex; align-items:center; gap:8px; color:#cbd5e1; font-size:13px; }
  .pill{ padding:2px 8px; border:1px solid var(--gray); border-radius:999px; background:#111827; }
</style>
</head>
<body>
<header>
  <div class="title">Undertale Card Duel</div>
  <div class="controls">
    <label>Route:</label>
    <select id="routeSelect">
      <option value="NEUTRAL">NEUTRAL</option>
      <option value="PACIFIST">PACIFIST</option>
      <option value="TRUE_PACIFIST">TRUE PACIFIST</option>
      <option value="GENOCIDE">GENOCIDE</option>
    </select>
    <button id="newMatchBtn">New match</button>
    <span class="badge" id="turnBadge">Your turn</span>
  </div>
</header>

<main>
  <section class="board">
    <div class="pile-area" id="pileArea">
      <div class="deck" id="drawDeck">Draw</div>
      <div class="footer">
        <span class="tip">Drag a glowing card to the board to play. Double-click works too.</span>
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
      <div class="row"><span class="badge">LOVE/EXP:</span> <span id="playerLoveText">LV 1 / 0 EXP</span></div>
      <div class="row"><span class="badge">Route:</span> <span id="playerRouteText">NEUTRAL</span></div>
    </div>

    <div class="char" id="opponentPanel">
      <h3 id="opponentName">Sans — 1 HP</h3>
      <div class="row"><span class="badge">Role:</span> <span id="opponentRole">Sans</span></div>
      <div class="bar"><div class="hp" id="opponentHPBar" style="width:100%"></div></div>
      <div class="row"><span class="badge">HP:</span> <span id="opponentHPText">1/1</span></div>
      <div class="bar"><div class="st" id="opponentSTBar" style="width:100%"></div></div>
      <div class="row"><span class="badge">Stamina:</span> <span id="opponentSTText">100/100</span></div>
      <div class="row"><span class="badge">Passive:</span> <span>Dodges attacks while stamina ≥ 10 (cost 10 per attack instance). +2 stamina each turn.</span></div>
    </div>

    <div class="log" id="log"></div>
  </aside>
</main>

<script>
(function(){
  // Persistent progression (localStorage)
  const SAVE_KEY = "undertale_card_progress";
  const defaultProgress = { love:1, exp:0 };
  const progress = loadProgress();

  const ROUTES = ["NEUTRAL","PACIFIST","TRUE_PACIFIST","GENOCIDE"];
  const CATEGORY = { ITEMS:"ITEMS", OPTIONS:"OPTIONS", MAGIC:"MAGIC" };

  // LOVE table
  const LOVE_TABLE = [
    { lv:1, total:0, next:10, hp:20, atk:0, def:0, weapon:"Stick (1 atk)" },
    { lv:2, total:10, next:20, hp:24, atk:2, def:0 },
    { lv:3, total:30, next:40, hp:28, atk:4, def:0 },
    { lv:4, total:70, next:50, hp:32, atk:6, def:1, weapon:"Toy Knife (4 atk)" },
    { lv:5, total:120, next:80, hp:36, atk:8, def:1 },
    { lv:6, total:200, next:100, hp:40, atk:10, def:1 },
    { lv:7, total:300, next:200, hp:44, atk:12, def:1 },
    { lv:8, total:500, next:300, hp:48, atk:14, def:2, weapon:"Tough Glove (5 atk)" },
    { lv:9, total:800, next:400, hp:52, atk:16, def:2 },
    { lv:10, total:1200, next:500, hp:56, atk:18, def:2 },
    { lv:11, total:1700, next:800, hp:60, atk:20, def:2 },
    { lv:12, total:2500, next:1000, hp:64, atk:22, def:3, weapon:"Ballet Shoes (7 atk)" },
    { lv:13, total:3500, next:1500, hp:68, atk:24, def:3, weapon:"Torn Notebook (2 atk multi-hit)" },
    { lv:14, total:5000, next:5000, hp:72, atk:26, def:3 },
    { lv:15, total:10000, next:0, hp:76, atk:28, def:3, weapon:"Burnt Pan (10 atk)" },
    { lv:16, total:10000, next:40000, hp:80, atk:30, def:4, weapon:"Empty Gun (12 atk)" },
    { lv:17, total:50000, next:0, hp:84, atk:32, def:4 },
    { lv:18, total:50000, next:0, hp:88, atk:34, def:4 },
    { lv:19, total:50000, next:49999, hp:92, atk:38, def:4, weapon:"Worn Dagger (18 atk)" },
    { lv:20, total:99999, next:null, hp:99, atk:99, def:99, weapon:"Real Knife (99 atk)" },
  ];

  // Match state
  let state = {
    route:"NEUTRAL",
    playerRole:null, // "Frisk" or "Sans"
    opponentRole:null,
    player:{ hp:20, maxHP:20, st:0, maxST:0, atk:0, def:0, love:1, exp:0, weapon:"Stick (1 atk)" },
    opponent:{ hp:1, maxHP:1, st:100, maxST:100, atk:0, def:0 },
    deck:[],
    playerHand:[],
    opponentHand:[],
    turn:"player",
    locked:false,
    flags:{
      pieUsed:false,
      snowmanPiecesUsed:0,
      legendaryBias:false,
      lostSoul:null, // { name, hp }
    }
  };

  // Cards definition helpers
  const makeCard = (name, cat, owner, effect, desc, opts={})=>{
    return {
      id: crypto.randomUUID(),
      name, cat, owner, effect, desc,
      rarity: opts.rarity||null,
      cost: opts.cost||0, // stamina cost (mostly for Sans on his own cards)
      uses: opts.uses||null // for tracking limited uses in-hand (optional)
    };
  };

  // Build decks by role and route
  const buildDeck = ()=>{
    const deck = [];
    const route = state.route;
    const loveInfo = getLoveInfo(progress.love);

    // Frisk cards
    const friskItems = [
      makeCard("Monster Candy", CATEGORY.ITEMS, "Frisk", { heal:10 }, "+10 HP"),
      makeCard("Spider Donut", CATEGORY.ITEMS, "Frisk", { heal:12 }, "+12 HP"),
      makeCard("Spider Cider", CATEGORY.ITEMS, "Frisk", { heal:24 }, "+24 HP"),
      makeCard("Butterscotch Pie", CATEGORY.ITEMS, "Frisk", { healFull:true }, "Full heal (once per match)"),
      makeCard("Snowman Piece", CATEGORY.ITEMS, "Frisk", { heal:45 }, "+45 HP (max 4 per match)"),
      makeCard("Instant Noodles", CATEGORY.ITEMS, "Frisk", { heal:90 }, "+90 HP"),
      makeCard("Legendary Hero", CATEGORY.ITEMS, "Frisk", { heal:40, atkBuff:1 }, "+40 HP, slight ATK buff"),
      makeCard("Astronaut Food", CATEGORY.ITEMS, "Frisk", { heal:21 }, "+21 HP"),
      makeCard("Hot Dog...?", CATEGORY.ITEMS, "Frisk", { heal:20 }, "+20 HP"),
    ];

    const friskOptions = [
      makeCard("FIGHT", CATEGORY.OPTIONS, "Frisk", { attackByWeapon:true }, "Attack based on weapon and ATK"),
      makeCard("ACT", CATEGORY.OPTIONS, "Frisk", { act:true }, "Contextual actions (flirt, joke, check...)"),
      makeCard("MERCY", CATEGORY.OPTIONS, "Frisk", { mercy:true }, "Spare or Flee"),
    ];

    const friskTruePacifistOnly = [
      makeCard("SAVE", CATEGORY.OPTIONS, "Frisk", { save:true }, "Summon a lost soul ally (4 HP)", { rarity:"rare" })
    ];

    // Sans cards
    const sansItems = [
      makeCard("Hot Dog...?", CATEGORY.ITEMS, "Sans", { heal:20, stGain:15 }, "+20 HP, +15 ST"),
      makeCard("Hot Cat", CATEGORY.ITEMS, "Sans", { heal:21, stGain:10 }, "+21 HP, +10 ST"),
      makeCard("Ketchup", CATEGORY.ITEMS, "Sans", { heal:8, stGain:25 }, "+8 HP, +25 ST"),
      makeCard("Burger", CATEGORY.ITEMS, "Sans", { heal:12, stGain:20 }, "+12 HP, +20 ST"),
    ];

    const sansOptions = [
      makeCard("ACT (Nap)", CATEGORY.OPTIONS, "Sans", { nap:true }, "Nap: skip 2-3 of your turns, then full heal"),
      makeCard("MERCY", CATEGORY.OPTIONS, "Sans", { mercy:true }, "Spare or Flee"),
    ];

    const sansMagic = [
      makeCard("Bone Throw", CATEGORY.MAGIC, "Sans", { hits:3, dmgPerHit:1 }, "3x1 damage"),
      makeCard("Bone Jumps", CATEGORY.MAGIC, "Sans", { hits:5, dmgPerHit:1 }, "5x1 damage"),
      makeCard("Gaster Blaster", CATEGORY.MAGIC, "Sans", { hits:10, dmgPerHit:1 }, "10x1 damage"),
    ];

    // Route-based filters and biases
    let playerPool = [];
    let opponentPool = [];

    const legendaryBias = progress.love >= 18; // bias Legendary Hero for Frisk above LV18
    state.flags.legendaryBias = legendaryBias;

    // Player and opponent decks based on their roles
    if(state.playerRole === "Frisk"){
      // Route restrictions for Frisk items
      const fItems = friskItems.filter(c=>{
        if(c.name === "Hot Dog...?" || c.name === "Astronaut Food"){
          return route !== "GENOCIDE"; // cannot get in GENOCIDE
        }
        return true;
      });

      // Legendary Hero bias
      const fItemsBiased = fItems.flatMap(c=>{
        if(c.name === "Legendary Hero" && legendaryBias) return [c,c]; // double chance
        return [c];
      });

      playerPool.push(...fItemsBiased, ...friskOptions);
      if(route === "TRUE_PACIFIST"){
        // Remove FIGHT, add SAVE, boost spare chance later
        playerPool = playerPool.filter(c=>c.name !== "FIGHT");
        playerPool.push(...friskTruePacifistOnly);
      }
    } else {
      // Sans player
      const sItems = sansItems.filter(c=>{
        // No restriction in your specs except GENOCIDE list for Frisk — Sans can use his items
        return true;
      });
      playerPool.push(...sItems, ...sansOptions, ...sansMagic);
    }

    if(state.opponentRole === "Frisk"){
      // AI Frisk deck
      let oItems = friskItems.filter(c=>{
        if(c.name === "Hot Dog...?" || c.name === "Astronaut Food"){
          return route !== "GENOCIDE";
        }
        return true;
      });
      if(progress.love >= 18){
        oItems = oItems.flatMap(c=> (c.name==="Legendary Hero") ? [c,c] : [c]);
      }
      opponentPool.push(...oItems, ...friskOptions);
      if(route === "TRUE_PACIFIST"){
        opponentPool = opponentPool.filter(c=>c.name !== "FIGHT");
        opponentPool.push(...friskTruePacifistOnly);
      }
    } else {
      // AI Sans deck
      opponentPool.push(...sansItems, ...sansOptions, ...sansMagic);
    }

    // Build randomized draw decks
    const playerDeck = shuffle(playerPool.slice());
    const opponentDeck = shuffle(opponentPool.slice());

    return { playerDeck, opponentDeck };
  };

  // Game flow
  const newMatch = ()=>{
    state.route = document.getElementById("routeSelect").value;
    // Randomly assign roles
    if(Math.random() < 0.5){
      state.playerRole = "Frisk"; state.opponentRole = "Sans";
    } else {
      state.playerRole = "Sans"; state.opponentRole = "Frisk";
    }

    // Initialize stats
    if(state.playerRole === "Frisk"){
      const loveInfo = getLoveInfo(progress.love);
      state.player = { hp:loveInfo.hp, maxHP:loveInfo.hp, st:0, maxST:0, atk:loveInfo.atk, def:loveInfo.def, love:progress.love, exp:progress.exp, weapon:loveInfo.weapon||"Stick (1 atk)" };
    } else {
      state.player = { hp:1, maxHP:1, st:100, maxST:100, atk:0, def:0 };
    }
    if(state.opponentRole === "Frisk"){
      const enemyLove = Math.max(1, Math.min(18, progress.love)); // AI Frisk scales loosely up to 18
      const loveInfo = getLoveInfo(enemyLove);
      state.opponent = { hp:loveInfo.hp, maxHP:loveInfo.hp, st:0, maxST:0, atk:loveInfo.atk, def:loveInfo.def, love:enemyLove, exp:0, weapon:loveInfo.weapon||"Stick (1 atk)" };
    } else {
      state.opponent = { hp:1, maxHP:1, st:100, maxST:100, atk:0, def:0 };
    }

    state.turn = "player";
    state.locked = false;
    state.flags.pieUsed = false;
    state.flags.snowmanPiecesUsed = 0;
    state.flags.lostSoul = null;

    const { playerDeck, opponentDeck } = buildDeck();
    state.deck = { player: playerDeck, opponent: opponentDeck };
    state.playerHand = [];
    state.opponentHand = [];

    // Initial draws
    drawCards("player", 5);
    drawCards("opponent", 5);

    document.getElementById("log").innerHTML = "";
    log(`A new match begins. You are ${state.playerRole}. Route: ${state.route}.`);
    renderAll();
    updateTurnBadge();
    if(state.turn === "opponent"){
      aiTurn();
    }
  };

  // Utility helpers
  const shuffle = (arr)=> {
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  function getLoveInfo(lv){
    const entry = LOVE_TABLE.find(e=>e.lv===lv) || LOVE_TABLE[0];
    return entry;
  }

  function loadProgress(){
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      if(!raw) return { ...defaultProgress };
      const p = JSON.parse(raw);
      return { love: p.love||1, exp: p.exp||0 };
    } catch(e){
      return { ...defaultProgress };
    }
  }

  function saveProgress(){
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
  }

  function checkLevelUp(){
    // Update LOVE based on EXP
    let current = progress.love;
    let changed = false;
    while(true){
      const info = getLoveInfo(current);
      if(info.next === null || progress.exp < info.total + (info.next||0)) break;
      current++;
      changed = true;
    }
    if(changed){
      progress.love = Math.min(20, current);
      log(`LOVE increased to LV ${progress.love}.`);
      saveProgress();
    }
  }

  // Drawing cards
  function drawCards(who, count){
    const d = state.deck[who];
    for(let i=0;i<count;i++){
      if(d.length===0) break;
      const c = d.pop();
      state[who+"Hand"].push(c);
    }
    renderHands();
  }

  // Damage application with Sans dodge logic
  function applyAttack(targetRole, hits, dmgPerHit, attacker){
    const target = targetRole==="player" ? state.player : state.opponent;
    const targetIsSans = (targetRole==="player" && state.playerRole==="Sans") || (targetRole==="opponent" && state.opponentRole==="Sans");

    let totalDamage = 0;
    for(let h=0; h<hits; h++){
      if(targetIsSans && target.st >= 10){
        target.st -= 10;
        log(`Sans dodged the attack (−10 ST).`);
      } else {
        target.hp = Math.max(0, target.hp - dmgPerHit);
        totalDamage += dmgPerHit;
      }
    }
    if(totalDamage>0){
      log(`${attacker} dealt ${totalDamage} damage.`);
    }
    renderBars();
    checkWin();
  }

  // Card play
  async function playCardFromHand(who, cardId){
    if(state.locked) return;
    if(state.turn !== who) return;

    const hand = state[who+"Hand"];
    const idx = hand.findIndex(c=>c.id===cardId);
    if(idx===-1) return;
    const card = hand[idx];

    // Ownership restriction: only the character intended can use their cards
    const role = state[who+"Role"];
    if(card.owner !== role){
      flashIllegal(cardId);
      return;
    }

    // Category restriction: Frisk cannot use MAGIC
    if(role === "Frisk" && card.cat === CATEGORY.MAGIC){
      log("Frisk cannot use MAGIC.");
      flashIllegal(cardId);
      return;
    }

    // Cost check (used for Sans’ own stamina costs if any)
    if(card.cost && state[who].st < card.cost){
      log(`${role} lacks stamina (${card.cost}).`);
      flashIllegal(cardId);
      return;
    }

    // Limited items: Pie once per match, Snowman Piece up to 4
    if(role==="Frisk" && card.name==="Butterscotch Pie" && state.flags.pieUsed){
      log("Pie can be used only once per match.");
      flashIllegal(cardId); return;
    }
    if(role==="Frisk" && card.name==="Snowman Piece" && state.flags.snowmanPiecesUsed>=4){
      log("Snowman Piece limit reached (4 per match).");
      flashIllegal(cardId); return;
    }

    // Consume cost
    if(card.cost){ state[who].st -= card.cost; }

    // Remove from hand
    hand.splice(idx,1);
    renderHands();

    // Resolve effect
    await resolveEffect(who, card);

    // Advance turn
    endTurn(who);
  }

  async function resolveEffect(who, card){
    const me = state[who];
    const oppRole = who==="player" ? "opponent" : "player";
    const opp = state[oppRole];
    const meRoleName = state[who+"Role"];
    const oppRoleName = state[oppRole+"Role"];
    const actor = (who==="player") ? "You" : "AI";

    if(card.cat === CATEGORY.ITEMS){
      // Healing items
      if(card.effect.healFull){
        const before = me.hp;
        me.hp = me.maxHP;
        log(`${actor} used ${card.name} and fully healed (${before}→${me.hp}).`);
        if(meRoleName==="Frisk") state.flags.pieUsed = true;
      } else if(card.effect.heal){
        const heal = card.effect.heal;
        const before = me.hp;
        me.hp = Math.min(me.maxHP, me.hp + heal);
        log(`${actor} used ${card.name} (+${me.hp-before} HP).`);
        if(meRoleName==="Frisk" && card.name==="Snowman Piece") state.flags.snowmanPiecesUsed++;
      }
      // Stamina gains (Sans)
      if(card.effect.stGain){
        const gained = card.effect.stGain;
        oppRoleName; // eslint
        me.st = Math.min(me.maxST, me.st + gained);
        log(`${actor} recovered ${gained} stamina.`);
      }
      // Legendary Hero: slight ATK buff
      if(card.effect.atkBuff){
        me.atk += card.effect.atkBuff;
        log(`${actor} feels stronger (+${card.effect.atkBuff} ATK).`);
      }
    } else if(card.cat === CATEGORY.OPTIONS){
      if(card.effect.attackByWeapon){
        // Frisk FIGHT: damage based on weapon and ATK
        const loveInfo = (meRoleName==="Frisk") ? getLoveInfo(me.love||progress.love) : { atk:0 };
        const weaponAtk = parseWeaponAtk(me.weapon);
        const base = (loveInfo.atk||0) + weaponAtk;
        const dmg = Math.max(0, base - (opp.def||0));
        const hits = (me.weapon && me.weapon.includes("Torn Notebook")) ? randInt(3,4) : 1;
        log(`${actor} used FIGHT (${hits} hit${hits>1?"s":""}, ${dmg} each).`);
        applyAttack(oppRole, hits, dmg, actor);
      }
      if(card.effect.act){
        // Non-damaging; apply route-friendly chances (buff spare odds)
        const flavor = ["Check","Flirt","Threaten","Pet","Joke"];
        const actUsed = flavor[Math.floor(Math.random()*flavor.length)];
        log(`${actor} used ACT: ${actUsed}. The foe seems affected.`);
        // Small debuff to opponent DEF to simulate ACT effect
        opp.def = Math.max(0, (opp.def||0) - 1);
      }
      if(card.effect.mercy){
        // MERCY: choose Spare or Flee (AI: simple heuristic)
        if(who==="player"){
          const choice = await chooseMercy();
          if(choice==="spare"){
            const spared = trySpare(oppRoleName);
            if(spared){
              log("You spared the opponent. Match ends in mercy.");
              endGame("draw_mercy");
              return;
            } else {
              log("Spare failed. Turn ends.");
            }
          } else if(choice==="flee"){
            const fled = tryFlee();
            if(fled){
              log("You fled. Match ends in a draw.");
              endGame("draw_flee");
              return;
            } else {
              log("Could not flee. Turn ends.");
            }
          }
        } else {
          // AI mercy: tries spare if player HP low and route pacifist-ish
          const willSpare = (state.route==="PACIFIST" || state.route==="TRUE_PACIFIST") && state.player.hp <= Math.ceil(state.player.maxHP*0.25);
          if(willSpare){
            log("AI attempted to spare you. Mercy granted.");
            endGame("draw_mercy");
            return;
          } else {
            log("AI considered mercy but passed.");
          }
        }
      }
      if(card.effect.save){
        // TRUE PACIFIST: summon lost soul ally (4 HP)
        if(state.flags.lostSoul){
          log("A lost soul is already helping.");
        } else {
          state.flags.lostSoul = { name: pickLostSoul(), hp:4 };
          log(`Lost Soul (${state.flags.lostSoul.name}) appears with 4 HP to aid you.`);
        }
      }
      if(card.effect.nap){
        // Sans Nap: skip own next 2–3 turns, then full heal
        const skipCount = randInt(2,3);
        me.napTurns = skipCount;
        log(`${actor} starts a nap (will skip ${skipCount} turns).`);
      }
    } else if(card.cat === CATEGORY.MAGIC){
      // Sans attack spells: multiple 1-damage hits
      const hits = card.effect.hits || 1;
      const dmg = card.effect.dmgPerHit || 1;
      log(`${actor} cast ${card.name} (${hits} hit${hits>1?"s":""}).`);
      applyAttack(oppRole, hits, dmg, actor);
    }
  }

  function parseWeaponAtk(weaponName){
    if(!weaponName) return 0;
    const m = weaponName.match(/(\d+)\s*atk/i);
    return m ? parseInt(m[1],10) : 0;
  }

  function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  // Mercy helpers
  async function chooseMercy(){
    return new Promise(resolve=>{
      const choice = window.prompt("MERCY: type 'spare' or 'flee'");
      if(!choice){ resolve(null); return; }
      const c = choice.toLowerCase();
      if(c==="spare" || c==="flee"){ resolve(c); } else { resolve(null); }
    });
  }

  function spareChance(){
    // Base chances per route; ACT improves chances slightly via DEF debuff and route signal
    switch(state.route){
      case "TRUE_PACIFIST": return 0.75;
      case "PACIFIST": return 0.45;
      case "NEUTRAL": return 0.25;
      case "GENOCIDE": return 0.0;
      default: return 0.25;
    }
  }

  function trySpare(targetRoleName){
    const chance = spareChance();
    const roll = Math.random();
    return roll < chance;
  }

  function tryFlee(){
    // Flee fails in GENOCIDE against powerful foes; otherwise modest chance
    if(state.route==="GENOCIDE") return false;
    return Math.random() < 0.5;
  }

  function pickLostSoul(){
    const pool = ["Sans","Papyrus","Undyne","Toriel","Alphys","Asgore"];
    return pool[Math.floor(Math.random()*pool.length)];
  }

  // End turn, regen and lost soul assist
  function endTurn(who){
    // Lost soul small assist on player's side
    if(state.flags.lostSoul){
      const ally = state.flags.lostSoul;
      if(ally.hp>0){
        // 50% chance to chip opponent by 1
        if(Math.random()<0.5){
          const targetRole = (who==="player") ? "opponent" : "player"; // ally helps current actor’s side
          applyAttack(targetRole, 1, 1, "Lost Soul");
          log(`Lost Soul (${ally.name}) helps with 1 damage.`);
        }
        // Ally can be randomly targeted by AI spells later (simple: 10% chance they take 1 damage each turn)
        if(Math.random()<0.1){
          ally.hp = Math.max(0, ally.hp-1);
          log(`Lost Soul (${ally.name}) was hurt (−1 HP).`);
        }
      }
    }

    // Turn swap and Sans stamina regen
    if(who==="player"){
      state.turn = "opponent";
      // Opponent pre-turn effects
      if(state.opponentRole==="Sans"){
        state.opponent.st = Math.min(state.opponent.maxST, state.opponent.st + 2);
      }
    } else {
      state.turn = "player";
      if(state.playerRole==="Sans"){
        state.player.st = Math.min(state.player.maxST, state.player.st + 2);
      }
    }
    updateTurnBadge();
    renderBars();

    // Nap skipping
    const actorRole = state.turn==="player" ? "player" : "opponent";
    const actor = state[actorRole];
    if(actor.napTurns && actor.napTurns>0){
      actor.napTurns--;
      log(`${state[actorRole+"Role"]} is napping. Turn skipped.`);
      // If nap just ended, full heal
      if(actor.napTurns===0){
        actor.hp = actor.maxHP;
        log(`${state[actorRole+"Role"]} wakes up fully healed.`);
      }
      // Advance again
      endTurn(state.turn);
      return;
    }

    // AI if opponent turn
    if(state.turn==="opponent"){
      aiTurn();
    }
  }

  // Win conditions and EXP
  function checkWin(){
    if(state.opponent.hp<=0){
      // If player killed opponent, award EXP only if player is Frisk
      if(state.playerRole==="Frisk"){
        const expGain = expForKill();
        progress.exp += expGain;
        log(`You gained ${expGain} EXP.`);
        checkLevelUp();
      }
      endGame("player_win");
      return true;
    }
    if(state.player.hp<=0){
      // AI Frisk gets no EXP in persistent save; Sans no EXP either
      endGame("opponent_win");
      return true;
    }
    return false;
  }

  function expForKill(){
    // Simple scaling by opponent maxHP
    const maxHP = state.opponent.maxHP;
    if(maxHP<=1) return 10; // killing Sans still grants base EXP
    return Math.min(500, Math.max(10, Math.floor(maxHP * 0.8)));
  }

  function endGame(result){
    state.locked = true;
    let badge = document.getElementById("turnBadge");
    if(result==="player_win") badge.textContent = "You win";
    else if(result==="opponent_win") badge.textContent = "You lose";
    else if(result==="draw_mercy") badge.textContent = "Mercy";
    else if(result==="draw_flee") badge.textContent = "Draw";
    log(`Match ended: ${badge.textContent}.`);
    renderBars();
    // Update Frisk LV panel after EXP changes
    if(state.playerRole==="Frisk"){
      const l = getLoveInfo(progress.love);
      document.getElementById("playerName").textContent = `Frisk — LV ${progress.love}`;
    }
  }

  // Rendering
  function renderHands(){
    renderHand("player");
    renderHand("opponent");
  }

  function renderHand(who){
    const container = document.getElementById(who==="player"?"playerHand":"opponentHand");
    container.innerHTML = "";
    const hand = state[who+"Hand"];
    hand.forEach(card=>{
      const div = document.createElement("div");
      div.className = "card " + (card.cat===CATEGORY.ITEMS ? "items" : card.cat===CATEGORY.OPTIONS ? "options" : "magic");
      if(card.rarity==="rare") div.classList.add("rare");

      const tag = document.createElement("div"); tag.className="tag"; tag.textContent = card.cat;
      const name = document.createElement("div"); name.className="name"; name.textContent = card.name;
      const desc = document.createElement("div"); desc.className="desc"; desc.textContent = card.desc || "";
      const cost = document.createElement("div"); cost.className="cost"; cost.textContent = (card.cost?`ST ${card.cost}`:"");

      div.appendChild(tag); div.appendChild(name); div.appendChild(desc); div.appendChild(cost);

      if(who==="player"){
        div.setAttribute("draggable","true");
        // Playable highlight
        if(state.turn==="player" && !state.locked){ div.classList.add("playable"); }
        div.addEventListener("dragstart", (e)=>{
          if(state.turn!=="player" || state.locked){ e.preventDefault(); return; }
          e.dataTransfer.setData("text/plain", card.id);
        });
        div.addEventListener("dblclick", ()=> playCardFromHand("player", card.id));
      } else {
        // Opponent hand hidden — show name dimmed
        desc.textContent = "";
        name.textContent = "???";
      }

      div.dataset.id = card.id;
      container.appendChild(div);
    });
  }

  function renderBars(){
    const pHP = document.getElementById("playerHPBar");
    const pST = document.getElementById("playerSTBar");
    const oHP = document.getElementById("opponentHPBar");
    const oST = document.getElementById("opponentSTBar");

    const hpPctP = Math.round(100 * state.player.hp / state.player.maxHP);
    const stPctP = state.player.maxST>0 ? Math.round(100 * state.player.st / state.player.maxST) : 0;
    const hpPctO = Math.round(100 * state.opponent.hp / state.opponent.maxHP);
    const stPctO = state.opponent.maxST>0 ? Math.round(100 * state.opponent.st / state.opponent.maxST) : 0;

    pHP.style.width = hpPctP+"%"; oHP.style.width = hpPctO+"%";
    pST.style.width = stPctP+"%"; oST.style.width = stPctO+"%";

    document.getElementById("playerHPText").textContent = `${state.player.hp}/${state.player.maxHP}`;
    document.getElementById("playerSTText").textContent = `${state.player.st}/${state.player.maxST}`;
    document.getElementById("opponentHPText").textContent = `${state.opponent.hp}/${state.opponent.maxHP}`;
    document.getElementById("opponentSTText").textContent = `${state.opponent.st}/${state.opponent.maxST}`;

    // Role headings and stats
    document.getElementById("playerRole").textContent = state.playerRole;
    document.getElementById("opponentRole").textContent = state.opponentRole;
    document.getElementById("playerRouteText").textContent = state.route;

    if(state.playerRole==="Frisk"){
      const info = getLoveInfo(progress.love);
      document.getElementById("playerName").textContent = `Frisk — LV ${progress.love}`;
      document.getElementById("playerStatsText").textContent = `${state.player.atk} / ${state.player.def}`;
      document.getElementById("playerWeaponText").textContent = info.weapon || state.player.weapon || "Stick (1 atk)";
      document.getElementById("opponentName").textContent = state.opponentRole==="Sans" ? "Sans — 1 HP" : `Frisk — LV ${state.opponent.love||1}`;
    } else {
      document.getElementById("playerName").textContent = "Sans — 1 HP";
      document.getElementById("playerStatsText").textContent = `${state.player.atk||0} / ${state.player.def||0}`;
      document.getElementById("playerWeaponText").textContent = `—`;
      document.getElementById("opponentName").textContent = state.opponentRole==="Sans" ? "Sans — 1 HP" : `Frisk — LV ${state.opponent.love||1}`;
    }

    document.getElementById("playerLoveText").textContent =
      (state.playerRole==="Frisk") ? `LV ${progress.love} / ${progress.exp} EXP` : `—`;
  }

  function renderAll(){
    renderHands();
    renderBars();
  }

  function updateTurnBadge(){
    const badge = document.getElementById("turnBadge");
    badge.textContent = state.turn==="player" ? "Your turn" : "Opponent turn";
  }

  function flashIllegal(cardId){
    const el = document.querySelector(`.card[data-id="${cardId}"]`);
    if(el){ el.classList.add("illegal"); setTimeout(()=> el.classList.remove("illegal"), 300); }
  }

  function log(msg){
    const el = document.getElementById("log");
    const p = document.createElement("p");
    p.textContent = msg;
    el.appendChild(p);
    el.scrollTop = el.scrollHeight;
  }

  // Drag target
  const pileArea = document.getElementById("pileArea");
  pileArea.addEventListener("dragover", e=> e.preventDefault());
  pileArea.addEventListener("drop", e=>{
    e.preventDefault();
    if(state.turn!=="player" || state.locked) return;
    const id = e.dataTransfer.getData("text/plain");
    playCardFromHand("player", id);
  });

  // Draw behavior: draw 1 card from your deck
  document.getElementById("drawDeck").addEventListener("click", ()=>{
    if(state.turn!=="player" || state.locked) return;
    drawCards("player", 1);
  });

  // AI logic
  async function aiTurn(){
    state.locked = true;
    renderBars();
    await sleep(600);

    const hand = state.opponentHand;
    // Choose card: priority — MAGIC (if Sans), FIGHT (if Frisk), then ITEMS if low, then MERCY if pacifist route and player low
    let choice = null;

    if(state.opponentRole==="Sans"){
      // If player hp low, try Gaster; else Bone Jumps; else Bone Throw
      const magicPrefs = ["Gaster Blaster","Bone Jumps","Bone Throw"];
      choice = hand.find(c=> c.cat===CATEGORY.MAGIC && magicPrefs.includes(c.name)) ||
               hand.find(c=> c.cat===CATEGORY.MAGIC);
      // If badly hurt (<50% ST), use Ketchup/Burger/Hot Cat/Hot Dog
      if(!choice && state.opponent.st < 30){
        choice = hand.find(c=> c.cat===CATEGORY.ITEMS);
      }
    } else {
      // AI Frisk: use FIGHT if available
      choice = hand.find(c=> c.name==="FIGHT");
      // If low HP, use best heal
      if(!choice && state.opponent.hp < Math.ceil(state.opponent.maxHP*0.5)){
        const heals = hand.filter(c=> c.cat===CATEGORY.ITEMS);
        // Prefer bigger heals
        choice = heals.sort((a,b)=> (valueHeal(b)-valueHeal(a)))[0] || null;
      }
      // Pacifist routes may attempt MERCY if player low
      if(!choice && (state.route==="PACIFIST" || state.route==="TRUE_PACIFIST")){
        choice = hand.find(c=> c.name==="MERCY");
      }
    }

    if(!choice){
      // Draw a card
      drawCards("opponent", 1);
      log("Opponent draws a card.");
      await sleep(400);
      choice = state.opponentHand[0] || null;
      if(!choice){
        log("Opponent passes.");
        state.locked = false;
        endTurn("opponent");
        return;
      }
    }

    await playCardFromHand("opponent", choice.id);
    state.locked = false;
    renderAll();
  }

  function valueHeal(card){
    if(card.effect.healFull) return 999;
    return card.effect.heal||0;
  }

  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

  // UI: New match
  document.getElementById("newMatchBtn").addEventListener("click", newMatch);

  // Init first match
  newMatch();
})();
</script>
</body>
</html>
