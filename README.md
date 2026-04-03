
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<title>UNDERCARDS</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
  
  :root {
    --ut-black: #000000;
    --ut-white: #ffffff;
    --ut-red: #ff0000;
    --ut-yellow: #ffff00;
    --ut-green: #00ff00;
    --ut-blue: #00a2e8;
    --ut-soul-blue: #0033cc;
    --ut-gray: #aaaaaa;
  }
  
  body {
    margin: 0;
    background-color: var(--ut-black);
    color: var(--ut-white);
    font-family: 'VT323', 'Courier New', Courier, monospace;
    font-size: 28px;
    user-select: none;
    -webkit-touch-callout: none;
    overflow-x: hidden;
  }

  /* UT-style panels */
  .ut-panel {
    border: 4px solid var(--ut-white);
    background: var(--ut-black);
    padding: 16px;
    border-radius: 0px;
  }

  /* Menu Buttons */
  .ut-menu-btn {
    background: transparent;
    color: var(--ut-white);
    border: none;
    padding: 4px 12px;
    cursor: pointer;
    text-align: left;
    font-family: 'VT323', 'Courier New', monospace;
    font-size: 32px;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 36px;
  }
  .ut-menu-btn::before {
    content: "♥";
    color: transparent;
    position: absolute;
    left: 8px;
    font-size: 24px;
  }
  .ut-menu-btn:hover:not(:disabled)::before {
    color: var(--ut-red);
  }
  .ut-menu-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Standard Action Buttons */
  .ut-action-btn {
    border: 2px solid var(--ut-white);
    background: var(--ut-black);
    color: var(--ut-white);
    padding: 8px 16px;
    font-family: 'VT323', monospace;
    font-size: 24px;
    cursor: pointer;
    transition: background 0.1s;
  }
  .ut-action-btn:hover:not(:disabled) { background: var(--ut-white); color: var(--ut-black); }
  .ut-action-btn:disabled { border-color: #555; color: #555; cursor: not-allowed; }

  /* Cards */
  .card-container { perspective: 1000px; }
  .ut-card {
    width: 150px; height: 210px;
    border: 4px solid var(--ut-white);
    background: #000;
    display: flex; flex-direction: column; padding: 8px;
    cursor: pointer; transition: transform 0.1s, border-color 0.1s;
    position: relative; overflow: hidden;
  }
  .ut-card:hover { transform: translateY(-8px); border-color: var(--ut-yellow); }
  .ut-card.active-deck { border-color: var(--ut-green); }
  .ut-card.disabled { opacity: 0.4; pointer-events: none; }
  
  .card-cat-items { border-top-color: var(--ut-green); border-bottom-color: var(--ut-green); }
  .card-cat-options { border-top-color: var(--ut-yellow); border-bottom-color: var(--ut-yellow); }
  .card-cat-magic { border-top-color: var(--ut-blue); border-bottom-color: var(--ut-blue); }
  
  .card-title { font-size: 22px; font-weight: bold; text-align: center; margin-bottom: 4px; line-height: 1; }
  .card-desc { font-size: 18px; color: var(--ut-gray); text-align: center; flex-grow: 1; display: flex; align-items: center; justify-content: center; line-height: 1.1;}
  .card-cost { position: absolute; bottom: 4px; right: 6px; font-size: 20px; color: var(--ut-blue); }
  .card-tag { position: absolute; top: 4px; left: 4px; font-size: 16px; background: var(--ut-white); color: var(--ut-black); padding: 0 4px; }

  /* Bars */
  .bar-bg { width: 100%; height: 28px; background: #440000; border: none; }
  .bar-fill-hp { height: 100%; background: var(--ut-yellow); transition: width 0.3s; }
  .bar-fill-st { height: 100%; background: var(--ut-green); transition: width 0.3s; }

  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .blinking { animation: blink 0.5s infinite; }

  /* Minigames */
  .minigame-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 50;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  
  #battlebox {
    width: clamp(300px, 90vw, 550px);
    height: clamp(200px, 50vh, 350px);
    border: 4px solid white;
    position: relative;
    overflow: hidden;
    background: black;
  }
  
  .soul {
    position: absolute; width: 16px; height: 16px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 28s-12-9-12-16c0-4 4-7 8-7 2 0 4 2 4 2s2-2 4-2c4 0 8 3 8 7 0 7-12 16-12 16z" fill="red"/></svg>') no-repeat center;
    background-size: contain; z-index: 10;
  }
  .soul.blue {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 28s-12-9-12-16c0-4 4-7 8-7 2 0 4 2 4 2s2-2 4-2c4 0 8 3 8 7 0 7-12 16-12 16z" fill="%230033cc"/></svg>') no-repeat center;
  }
  
  /* Authentic Fight Bar */
  .fight-container {
    width: clamp(300px, 90vw, 600px);
    height: 140px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 140"><rect width="600" height="140" fill="black" stroke="white" stroke-width="8"/><path d="M 50 70 Q 300 10 550 70 Q 300 130 50 70 Z" fill="none" stroke="white" stroke-width="2"/><rect x="290" y="20" width="20" height="100" fill="none" stroke="%230f0" stroke-width="2"/></svg>') no-repeat center;
    background-size: 100% 100%;
    position: relative;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .fight-cursor {
    width: 8px; height: 130px; background: white; position: absolute; left: 0;
    box-shadow: 0 0 6px rgba(255,255,255,0.8);
  }

  /* Shop Layout */
  .shop-scene { display: flex; flex-direction: column; width: 100%; max-width: 800px; height: 100vh; max-height: 700px; margin: 0 auto; }
  .shop-bg { flex: 1; background: #222; display: flex; justify-content: center; align-items: flex-end; position: relative; border: 4px solid white; border-bottom: none; overflow: hidden; }
  .shop-counter { position: absolute; bottom: 0; width: 100%; height: 30px; background: #111; border-top: 4px solid white; }
  .shop-dialogue-box { height: 220px; display: flex; border: 4px solid white; background: black; }
  .shop-text-area { flex: 2; border-right: 4px solid white; padding: 20px; font-size: 32px; line-height: 1.2; position: relative; }
  .shop-text-area::before { content: "* "; }
  .shop-options-area { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 10px; }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: var(--ut-black); border-left: 2px solid #333; }
  ::-webkit-scrollbar-thumb { background: var(--ut-white); }

  .mobile-controls {
    display: none; position: absolute; bottom: 10px; right: 10px; z-index: 20;
    grid-template-columns: 50px 50px 50px; grid-template-rows: 50px 50px; gap: 5px;
  }
  .d-btn { background: rgba(255,255,255,0.2); border: 2px solid white; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; border-radius: 50%; user-select: none; }
  .d-up { grid-column: 2; grid-row: 1; }
  .d-left { grid-column: 1; grid-row: 2; }
  .d-down { grid-column: 2; grid-row: 2; }
  .d-right { grid-column: 3; grid-row: 2; }
  @media (pointer: coarse) { .mobile-controls { display: grid; } }
</style>
</head>
<body>
<div id="root"></div>

<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
  import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
  import { getFirestore, collection, doc, setDoc, onSnapshot, updateDoc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

  // --- GAME DATA & CARDS ---
  const CARDS = {
    // Options
    'f_fight': { id: 'f_fight', name: 'FIGHT', cat: 'OPTIONS', desc: 'Timing minigame for damage.', cost: 0, role: 'Frisk' },
    'f_act': { id: 'f_act', name: 'ACT', cat: 'OPTIONS', desc: 'Check or interact with enemy.', cost: 0, role: 'Frisk' },
    'f_mercy': { id: 'f_mercy', name: 'MERCY', cat: 'OPTIONS', desc: 'Spare enemy if weak enough.', cost: 0, role: 'Frisk' },
    's_nap': { id: 's_nap', name: 'Nap', cat: 'OPTIONS', desc: 'Skip 1 turn, full heal.', cost: 0, role: 'Sans', nap: true },
    's_mercy': { id: 's_mercy', name: 'MERCY', cat: 'OPTIONS', desc: 'Spare the human.', cost: 0, role: 'Sans' },
    // Frisk Items
    'f_candy': { id: 'f_candy', name: 'Monster Candy', cat: 'ITEMS', desc: 'Heal 15 HP.', cost: 0, role: 'Frisk', heal: 15 },
    'f_donut': { id: 'f_donut', name: 'Spider Donut', cat: 'ITEMS', desc: 'Heal 20 HP.', cost: 0, role: 'Frisk', heal: 20 },
    'f_pie': { id: 'f_pie', name: 'B.Scotch Pie', cat: 'ITEMS', desc: 'Full Heal.', cost: 0, role: 'Frisk', healFull: true, rarity: 'rare' },
    'f_noodles': { id: 'f_noodles', name: 'Insta-Noodles', cat: 'ITEMS', desc: 'Heal 40 HP.', cost: 0, role: 'Frisk', heal: 40 },
    'f_hero': { id: 'f_hero', name: 'Leg. Hero', cat: 'ITEMS', desc: '+30 HP, +1 ATK.', cost: 0, role: 'Frisk', heal: 30, atkBuff: 1, rarity: 'rare' },
    // Sans Items
    's_dog': { id: 's_dog', name: 'Hot Dog...?', cat: 'ITEMS', desc: 'Heal 20 HP, +15 ST.', cost: 0, role: 'Sans', heal: 20, st: 15 },
    's_cat': { id: 's_cat', name: 'Hot Cat', cat: 'ITEMS', desc: 'Heal 10 HP, +30 ST.', cost: 0, role: 'Sans', heal: 10, st: 30 },
    's_ketchup': { id: 's_ketchup', name: 'Ketchup', cat: 'ITEMS', desc: 'Full ST recover.', cost: 0, role: 'Sans', stFull: true, rarity: 'rare' },
    // Sans Magic
    's_bone1': { id: 's_bone1', name: 'Bone Throw', cat: 'MAGIC', desc: 'Basic sliding bones.', cost: 15, role: 'Sans', pattern: 'bones_easy' },
    's_bone2': { id: 's_bone2', name: 'Bone Jumps', cat: 'MAGIC', desc: 'Blue soul gravity test.', cost: 20, role: 'Sans', pattern: 'blue_bones' },
    's_blaster': { id: 's_blaster', name: 'G. Blaster', cat: 'MAGIC', desc: 'Massive beam blasts.', cost: 40, role: 'Sans', pattern: 'blasters', rarity: 'rare' },
  };

  const DEFAULT_DECK = {
    'Frisk': ['f_fight', 'f_act', 'f_mercy', 'f_candy', 'f_candy', 'f_donut'],
    'Sans': ['s_nap', 's_mercy', 's_dog', 's_dog', 's_bone1', 's_bone2']
  };

  const EXP_TABLE = [0, 10, 30, 70, 120, 200, 300, 500, 800, 1200, 1700, 2500, 3500, 5000, 10000];
  function getLevelInfo(exp) {
    let lv = 1; let next = EXP_TABLE[1];
    for(let i=0; i<EXP_TABLE.length; i++){ if(exp >= EXP_TABLE[i]) { lv = i+1; next = EXP_TABLE[i+1] || 'MAX'; } }
    return { lv, next };
  }
  function getStatsForLV(lv) { return { hp: 16 + (lv*4), atk: lv * 2, def: Math.floor(lv/3) }; }

  // --- REACT APP ---
  window.initReactApp = (firebaseConfigStr, appIdStr, initialTokenStr) => {
    const firebaseConfig = JSON.parse(firebaseConfigStr);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const appId = appIdStr || 'undertale-card-duel';

    const { useState, useEffect, useRef, useLayoutEffect } = React;

    // Hook for typewriter effect
    const useTypewriter = (text, speed = 30) => {
      const [displayed, setDisplayed] = useState('');
      useEffect(() => {
        setDisplayed('');
        let i = 0;
        const t = setInterval(() => {
          if(i < text.length) { setDisplayed(text.substring(0, i+1)); i++; }
          else clearInterval(t);
        }, speed);
        return () => clearInterval(t);
      }, [text]);
      return displayed;
    };

    // --- MINIGAMES ---
    const FightMinigame = ({ onComplete }) => {
      const cursorRef = useRef(null);
      const reqRef = useRef(null);
      const [done, setDone] = useState(false);

      useLayoutEffect(() => {
        if(done) return;
        let x = 0; let d = 1; const speed = 1.8;
        const loop = () => {
          x += d * speed;
          if (x >= 100) { x = 100; d = -1; }
          if (x <= 0) { x = 0; d = 1; }
          if (cursorRef.current) cursorRef.current.style.left = `${x}%`;
          reqRef.current = requestAnimationFrame(loop);
        };
        reqRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(reqRef.current);
      }, [done]);

      const handleStop = () => {
        if(done) return;
        setDone(true); cancelAnimationFrame(reqRef.current);
        const finalX = parseFloat(cursorRef.current.style.left);
        const dist = Math.abs(50 - finalX); // center is 50
        let multiplier = 0;
        if(dist < 3) multiplier = 2.0; // Perfect Crit
        else if(dist < 18) multiplier = 1.0; // Hit
        else if(dist < 35) multiplier = 0.5; // Weak
        setTimeout(() => onComplete(multiplier), 800);
      };

      useEffect(() => {
        const handleKeys = (e) => { if(['Enter','z','Z',' '].includes(e.key)) handleStop(); };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
      }, [done]);

      return React.createElement("div", { className: "minigame-overlay" },
        React.createElement("div", { className: "text-2xl mb-4 text-center blinking" }, done ? "* ATTACK LOCKED." : "* PRESS [Z] OR TAP"),
        React.createElement("div", { className: "fight-container", onClick: handleStop },
          React.createElement("div", { className: "fight-cursor", ref: cursorRef })
        )
      );
    };

    const DodgeMinigame = ({ pattern, targetIsAI, onComplete }) => {
      const boxRef = useRef(null); const soulRef = useRef(null);
      const [hits, setHits] = useState(0);
      const reqRef = useRef(null); const hitsRef = useRef(0);
      const isInvuln = useRef(false);

      useLayoutEffect(() => {
        const keys = { w:0, a:0, s:0, d:0, z:0 };
        const touch = { u:0, d:0, l:0, r:0, z:0 };
        
        const kd = (e) => {
          const k = e.key.toLowerCase();
          if(['arrowup','w'].includes(k)) keys.w=1;
          if(['arrowleft','a'].includes(k)) keys.a=1;
          if(['arrowdown','s'].includes(k)) keys.s=1;
          if(['arrowright','d'].includes(k)) keys.d=1;
          if(['z','enter',' '].includes(k)) keys.z=1;
        };
        const ku = (e) => {
          const k = e.key.toLowerCase();
          if(['arrowup','w'].includes(k)) keys.w=0;
          if(['arrowleft','a'].includes(k)) keys.a=0;
          if(['arrowdown','s'].includes(k)) keys.s=0;
          if(['arrowright','d'].includes(k)) keys.d=0;
          if(['z','enter',' '].includes(k)) keys.z=0;
        };
        window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
        window.utTouch = (dir, val) => touch[dir] = val;

        const box = boxRef.current;
        let sx = box.clientWidth/2; let sy = box.clientHeight/2;
        const speed = 250; 
        let lastTime = performance.now();
        const duration = pattern === 'blasters' ? 6000 : 5000;
        let elapsed = 0;

        // Physics for Blue Soul
        const isBlue = pattern === 'blue_bones';
        let vy = 0; const gravity = 1200; const jumpPower = -500;
        let isGrounded = false;
        if(isBlue) sy = box.clientHeight - 16;

        const projs = [];
        const createBone = (x, y, vx, vy, w, h) => {
          const el = document.createElement('div');
          el.style.position = 'absolute'; el.style.background = 'white'; el.style.borderRadius = '4px';
          el.style.width = w+'px'; el.style.height = h+'px';
          el.style.left = x+'px'; el.style.top = y+'px';
          box.appendChild(el);
          projs.push({ el, x, y, vx, vy, w, h, type: 'bone' });
        };
        const createBlaster = (x, y, w, h, delay) => {
          const el = document.createElement('div');
          el.style.position = 'absolute'; el.style.width = w+'px'; el.style.height = h+'px';
          el.style.left = x+'px'; el.style.top = y+'px';
          el.innerHTML = `<svg viewBox="0 0 100 100" style="width:50px; height:50px; margin-left:${w/2-25}px"><path d="M20 20 L80 20 L80 60 L60 80 L40 80 L20 60 Z" fill="white"/><circle cx="35" cy="40" r="8" fill="black"/><circle cx="65" cy="40" r="8" fill="black"/></svg>`;
          box.appendChild(el);
          projs.push({ el, x, y, vx:0, vy:0, w, h, type: 'blaster', delay, state: 0, time: 0 });
        };

        if (pattern === 'bones_easy') {
          for(let i=0; i<8; i++) createBone(box.clientWidth + i*90, box.clientHeight - 20 - Math.random()*50, -150 - Math.random()*50, 0, 16, 80);
        } else if (isBlue) {
          for(let i=0; i<12; i++) {
              const h = 20 + Math.random()*50;
              createBone(box.clientWidth + i*110, box.clientHeight - h, -220, 0, 16, h);
          }
        } else if (pattern === 'blasters') {
          for(let i=0; i<4; i++) createBlaster(0, Math.random()*(box.clientHeight-50), box.clientWidth, 60, i*1.2);
        }

        const rectOverlap = (x1,y1,w1,h1, x2,y2,w2,h2) => { return x1 < x2+w2 && x1+w1 > x2 && y1 < y2+h2 && y1+h1 > y2; };

        const takeHit = () => {
          if(isInvuln.current) return;
          hitsRef.current++; setHits(hitsRef.current); isInvuln.current = true;
          if(soulRef.current) soulRef.current.style.opacity = 0.5;
          setTimeout(() => { isInvuln.current = false; if(soulRef.current) soulRef.current.style.opacity = 1; }, 800);
        };

        const loop = (time) => {
          const dt = Math.min(0.05, (time - lastTime) / 1000);
          lastTime = time; elapsed += dt * 1000;

          const dx = (keys.d || touch.r) - (keys.a || touch.l);
          sx += dx * speed * dt;

          if (isBlue) {
              if (targetIsAI) {
                  const incoming = projs.find(p => p.type === 'bone' && p.x > sx && p.x - sx < 100);
                  if (incoming && isGrounded) { vy = jumpPower; isGrounded = false; }
              } else {
                  const wantJump = keys.w || keys.z || touch.u || touch.z;
                  if (wantJump && isGrounded) { vy = jumpPower; isGrounded = false; }
                  else if (!wantJump && vy < 0) { vy *= 0.5; } // Variable jump height mapping
              }
              sy += vy * dt; vy += gravity * dt;
              const floor = box.clientHeight - 16;
              if (sy >= floor) { sy = floor; vy = 0; isGrounded = true; }
          } else {
              const dy = (keys.s || touch.d) - (keys.w || touch.u);
              sy += dy * speed * dt;
              
              if(targetIsAI) {
                  // Smooth AI Dodge
                  const incoming = projs[0];
                  if(incoming) {
                      const targetY = (incoming.y > sy) ? 0 : box.clientHeight - 16;
                      sy += (targetY - sy) * 2 * dt; 
                  }
              }
          }

          sx = Math.max(0, Math.min(box.clientWidth - 16, sx));
          sy = Math.max(0, Math.min(box.clientHeight - 16, sy));
          if(soulRef.current) { soulRef.current.style.left = sx + 'px'; soulRef.current.style.top = sy + 'px'; }

          projs.forEach(p => {
            if (p.type === 'bone') {
              p.x += p.vx * dt; p.y += p.vy * dt;
              p.el.style.left = p.x + 'px'; p.el.style.top = p.y + 'px';
              if(rectOverlap(sx, sy, 12, 12, p.x+2, p.y+2, p.w-4, p.h-4)) takeHit();
            } else if (p.type === 'blaster') {
              p.time += dt;
              if (p.state === 0 && p.time > p.delay) { p.state = 1; p.el.style.opacity = 1; }
              else if (p.state === 1 && p.time > p.delay + 0.8) {
                p.state = 2;
                const beam = document.createElement('div');
                beam.style.position = 'absolute'; beam.style.top = '25px'; beam.style.height = '20px'; beam.style.width = '100%';
                beam.style.animation = 'fireBeam 0.5s ease-out';
                p.el.appendChild(beam);
              } else if (p.state === 2) {
                if (p.time < p.delay + 1.2 && rectOverlap(sx, sy, 16, 16, p.x, p.y+25, p.w, 20)) takeHit();
              }
            }
          });

          if (elapsed < duration) reqRef.current = requestAnimationFrame(loop);
          else { projs.forEach(p => p.el.remove()); onComplete(hitsRef.current); }
        };
        reqRef.current = requestAnimationFrame(loop);

        return () => {
          cancelAnimationFrame(reqRef.current);
          window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
          delete window.utTouch;
        };
      }, []);

      const TouchBtn = ({d, label, className}) => React.createElement("button", {
        className: `d-btn ${className}`,
        onTouchStart: (e) => { e.preventDefault(); window.utTouch && window.utTouch(d, 1); },
        onTouchEnd: (e) => { e.preventDefault(); window.utTouch && window.utTouch(d, 0); }
      }, label);

      return React.createElement("div", { className: "minigame-overlay" },
        React.createElement("div", { className: "text-red-500 text-3xl mb-4 font-bold" }, `HITS TAKEN: ${hits}`),
        React.createElement("div", { id: "battlebox", ref: boxRef },
          React.createElement("div", { className: `soul ${pattern==='blue_bones'?'blue':''}`, ref: soulRef }),
          !targetIsAI && React.createElement("div", { className: "mobile-controls" },
            React.createElement(TouchBtn, { d: 'u', label: '↑', className: 'd-up' }),
            React.createElement(TouchBtn, { d: 'l', label: '←', className: 'd-left' }),
            React.createElement(TouchBtn, { d: 'd', label: '↓', className: 'd-down' }),
            React.createElement(TouchBtn, { d: 'r', label: '→', className: 'd-right' }),
            pattern==='blue_bones' && React.createElement(TouchBtn, { d: 'z', label: 'JMP', className: 'absolute -left-16 top-0 w-12 h-12 rounded-full border-2 border-white text-sm bg-blue-900' })
          )
        )
      );
    };

    const Card = ({ cardId, onClick, disabled, isActiveInDeck }) => {
      const c = CARDS[cardId];
      if(!c) return null;
      let catClass = c.cat==='ITEMS' ? 'card-cat-items' : c.cat==='OPTIONS' ? 'card-cat-options' : 'card-cat-magic';
      let classes = `ut-card ${catClass} ${disabled ? 'disabled' : ''} ${isActiveInDeck ? 'active-deck' : ''}`;
      return React.createElement("div", { className: classes, onClick: disabled ? null : onClick },
        React.createElement("div", { className: "card-tag" }, c.cat),
        React.createElement("div", { className: "card-title mt-8" }, c.name),
        React.createElement("div", { className: "card-desc" }, c.desc),
        c.cost > 0 && React.createElement("div", { className: "card-cost" }, `ST ${c.cost}`),
        c.rarity === 'rare' && React.createElement("div", { className: "absolute top-1 right-1 text-yellow-400 text-sm" }, "★"),
        isActiveInDeck && React.createElement("div", { className: "absolute top-1 right-1 text-green-400 text-sm font-bold" }, "✔")
      );
    };

    // --- MAIN APP COMPONENT ---
    const App = () => {
      const [user, setUser] = useState(null);
      const [profile, setProfile] = useState(null);
      const [view, setView] = useState('menu'); 
      const [subView, setSubView] = useState(''); // for char select

      const [shopView, setShopView] = useState('main');
      const [shopRawDialogue, setShopRawDialogue] = useState("yeah.\nwhat d'ya wanna buy?");
      const shopDialogue = useTypewriter(shopRawDialogue, 40);
      
      const [match, setMatch] = useState(null); 
      const [actSubMenu, setActSubMenu] = useState(false);

      useEffect(() => {
        const initAuth = async () => {
          try {
            if (initialTokenStr) await signInWithCustomToken(auth, initialTokenStr);
            else await signInAnonymously(auth);
          } catch(e) { console.error("Auth err", e); }
        };
        initAuth();
        const unsub = onAuthStateChanged(auth, setUser);
        return () => unsub();
      }, []);

      useEffect(() => {
        if (!user) return;
        const ref = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
        const unsub = onSnapshot(ref, snap => {
          if (!snap.exists()) {
            const newProf = { exp: 0, coins: 150, inventory: [], deckFrisk: [...DEFAULT_DECK.Frisk], deckSans: [...DEFAULT_DECK.Sans] };
            setDoc(ref, newProf);
            setProfile(newProf);
          } else { setProfile(snap.data()); }
        });
        return () => unsub();
      }, [user]);

      const updateProfile = async (updates) => {
        if(!user) return;
        await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), updates);
      };

      // Draw exactly 3 cards, guarantee 1 OPTIONS
      const drawHand = (deck) => {
          const options = deck.filter(c => CARDS[c].cat === 'OPTIONS');
          const others = deck.filter(c => CARDS[c].cat !== 'OPTIONS').sort(()=>Math.random()-0.5);
          const hand = [];
          if(options.length > 0) hand.push(options[Math.floor(Math.random()*options.length)]);
          while(hand.length < 3 && others.length > 0) hand.push(others.pop());
          return hand.sort(()=>Math.random()-0.5); // Shuffle final 3
      };

      const startMatch = (playerRole) => {
        const aiRole = playerRole === 'Frisk' ? 'Sans' : 'Frisk';
        const info = getLevelInfo(profile.exp);
        
        const getPlayerState = (role, isBot) => {
            const deck = isBot ? DEFAULT_DECK[role] : profile[`deck${role}`];
            const stats = role === 'Frisk' ? getStatsForLV(isBot ? 5 : info.lv) : { hp: 1, maxHp: 1, atk: 1, def: 1 };
            return { uid: isBot ? 'ai' : user.uid, role, deck, hand: drawHand(deck), ...stats, st: role === 'Sans' ? 100 : 0, maxSt: role === 'Sans' ? 100 : 0 };
        };

        const p1 = getPlayerState(playerRole, false);
        const p2 = getPlayerState(aiRole, true);

        const m = {
          id: 'solo', isSolo: true, status: 'playing', turn: user.uid, round: 1, spareAttempts: 0,
          p1, p2, log: [`* Encountered ${aiRole}!`], minigame: null
        };
        setMatch(m); setView('battle'); setSubView('');
      };

      const handleGameEnd = async (didWin, expGain, coinsGain) => {
        if (!profile) return;
        const nExp = profile.exp + expGain;
        const nCoins = profile.coins + coinsGain;
        await updateProfile({ exp: nExp, coins: nCoins });
        alert(`Match Finished!\n${didWin ? 'YOU WON!' : 'YOU LOST.'}\n+${expGain} EXP\n+${coinsGain} G`);
        setView('menu'); setMatch(null);
      };

      const applyCard = (m, actorId, cardId, minigameResult = null, extraAction = null) => {
        const nm = JSON.parse(JSON.stringify(m));
        const c = CARDS[cardId];
        const isP1 = nm.p1.uid === actorId;
        const me = isP1 ? nm.p1 : nm.p2;
        const opp = isP1 ? nm.p2 : nm.p1;
        
        const idx = me.hand.indexOf(cardId);
        if(idx > -1) me.hand.splice(idx, 1);
        if(c.cost) me.st -= c.cost;

        nm.log.push(`* ${me.role} used ${c.name}.`);

        if(c.cat === 'ITEMS') {
          if(c.healFull) me.hp = me.maxHp;
          if(c.heal) me.hp = Math.min(me.maxHp, me.hp + c.heal);
          if(c.st) me.st = Math.min(me.maxSt, me.st + c.st);
          if(c.stFull) me.st = me.maxSt;
          if(c.atkBuff) me.atk += c.atkBuff;
        }

        if(c.cat === 'OPTIONS') {
          if(c.id === 'f_fight') {
             const mult = minigameResult !== null ? minigameResult : 1;
             if (mult > 0) {
                 const baseDmg = Math.max(1, me.atk - opp.def);
                 const dmg = Math.floor(baseDmg * mult);
                 opp.hp -= dmg; nm.log.push(`* Dealt ${dmg} damage!`);
             } else { nm.log.push("* Missed!"); }
          }
          if(c.id === 'f_act') { 
              if (extraAction === 'Check') { nm.log.push(`* ${opp.role}: ATK ${opp.atk} DEF ${opp.def}`); }
              else { opp.def = Math.max(0, opp.def - 1); nm.log.push("* Enemy DEF dropped by 1."); }
          }
          if(c.id === 'f_mercy' || c.id === 's_mercy') {
             nm.spareAttempts++;
             if(opp.hp <= Math.ceil(opp.maxHp*0.2) || nm.spareAttempts >= 3) { 
                 nm.status = 'finished'; nm.winner = actorId; nm.log.push("* Mercy accepted! You Spared them."); 
             } else { nm.log.push("* Mercy failed... try weakening them or persisting."); }
          }
          if(c.id === 's_nap') { me.hp = me.maxHp; nm.log.push("* Took a nap. HP restored."); }
        }

        if(c.cat === 'MAGIC') {
          nm.minigame = { target: opp.uid, type: 'dodge', pattern: c.pattern };
          return nm;
        }

        nm.turn = opp.uid; nm.round++;
        if(nm.turn === nm.p1.uid) { 
            nm.p1.st = Math.min(nm.p1.maxSt, nm.p1.st + 5);
            nm.p1.hand = drawHand(nm.p1.deck);
        } else { 
            nm.p2.st = Math.min(nm.p2.maxSt, nm.p2.st + 5); 
            nm.p2.hand = drawHand(nm.p2.deck);
        }

        if(nm.p1.hp <= 0) { nm.status = 'finished'; nm.winner = nm.p2.uid; }
        if(nm.p2.hp <= 0) { nm.status = 'finished'; nm.winner = nm.p1.uid; }

        return nm;
      };

      const handlePlayCard = (cardId) => {
        if (match.turn !== user.uid || match.minigame) return;
        if (cardId === 'f_act') { setActSubMenu(true); return; }
        if (cardId === 'f_fight') { setMatch({...match, pendingFight: cardId}); return; }
        const nm = applyCard(match, user.uid, cardId);
        updateMatchState(nm);
      };

      const handleActChoice = (choice) => {
          setActSubMenu(false);
          const nm = applyCard(match, user.uid, 'f_act', null, choice);
          updateMatchState(nm);
      };

      const updateMatchState = async (nm) => {
        setMatch(nm);
        if(nm.isSolo) {
           if(nm.status === 'finished') {
             const won = nm.winner === user.uid;
             setTimeout(() => handleGameEnd(won, won ? 25 : 5, won ? 15 : 2), 1000);
           } else if (nm.turn === 'ai' && !nm.minigame) {
             setTimeout(() => runAI(nm), 1200);
           }
        }
      };

      const runAI = (m) => {
        if(m.status !== 'playing') return;
        const ai = m.p2;
        let choice = ai.hand.find(c => CARDS[c].cat === 'MAGIC' && ai.st >= CARDS[c].cost);
        if(!choice && ai.st < 30) choice = ai.hand.find(c => CARDS[c].cat === 'ITEMS' && CARDS[c].cost <= ai.st);
        if(!choice) choice = ai.hand[0];

        const nm = applyCard(m, 'ai', choice);
        updateMatchState(nm);
      };

      if (!user || !profile) return React.createElement("div", {className: "p-8 text-center text-3xl mt-20"}, "LOADING DETERMINATION...");

      const info = getLevelInfo(profile.exp);

      // --- MENU VIEW ---
      if (view === 'menu') {
        return React.createElement("div", { className: "max-w-2xl mx-auto p-4 flex flex-col items-center h-screen justify-center gap-8" },
          React.createElement("h1", { className: "text-6xl md:text-8xl text-center mb-8", style: { letterSpacing: '4px' } }, "UNDERCARDS"),
          
          subView === '' && React.createElement(React.Fragment, null,
              React.createElement("div", { className: "text-3xl text-left w-full max-w-sm mb-4 leading-loose" },
                React.createElement("div", null, `LOVE: ${info.lv}`),
                React.createElement("div", null, `EXP:  ${profile.exp}`),
                React.createElement("div", null, `NEXT: ${info.next}`),
                React.createElement("div", { className: "text-yellow-400 mt-2" }, `${profile.coins} G`)
              ),
              React.createElement("div", { className: "flex flex-col gap-4 w-full max-w-sm ml-8" },
                React.createElement("button", { className: "ut-menu-btn", onClick: () => setSubView('charSelect') }, "PLAY OFFLINE"),
                React.createElement("button", { className: "ut-menu-btn", onClick: () => alert("Online mode is currently under construction by dog.") }, "PLAY ONLINE"),
                React.createElement("button", { className: "ut-menu-btn", onClick: () => { setView('shop'); setShopView('main'); setShopRawDialogue("yeah.\nwhat d'ya wanna buy?"); } }, "SANS'S SHOP")
              )
          ),
          subView === 'charSelect' && React.createElement(React.Fragment, null,
              React.createElement("h2", { className: "text-4xl mb-4 text-yellow-400" }, "CHOOSE YOUR CHARACTER"),
              React.createElement("div", { className: "flex flex-col gap-4 w-full max-w-sm ml-8" },
                  React.createElement("button", { className: "ut-menu-btn", onClick: () => startMatch('Frisk') }, "PLAY AS FRISK"),
                  React.createElement("button", { className: "ut-menu-btn", onClick: () => startMatch('Sans') }, "PLAY AS SANS"),
                  React.createElement("button", { className: "ut-menu-btn text-gray-500", onClick: () => setSubView('') }, "BACK")
              )
          )
        );
      }

      // --- SHOP VIEW ---
      if (view === 'shop') {
        const seed = Math.floor(Date.now() / 86400000);
        const magics = Object.keys(CARDS).filter(k => CARDS[k].cat === 'MAGIC' || CARDS[k].rarity === 'rare');
        const items = Object.keys(CARDS).filter(k => CARDS[k].cat === 'ITEMS' && CARDS[k].rarity !== 'rare');
        const shopCards = [ magics[seed % magics.length], items[(seed+1) % items.length], items[(seed+2) % items.length] ];

        const buyCard = (cid) => {
          if(profile.coins >= 50 && !profile.inventory.includes(cid)) {
             updateProfile({ coins: profile.coins - 50, inventory: [...profile.inventory, cid] });
             setShopRawDialogue("thanks.\npleasure doing business.");
          } else { setShopRawDialogue("you can't afford that."); }
        };

        const toggleDeck = (cid, role) => {
           const deckKey = role === 'Frisk' ? 'deckFrisk' : 'deckSans';
           let curDeck = [...profile[deckKey]];
           if (curDeck.includes(cid)) {
               if(curDeck.length <= 4) { setShopRawDialogue("you need at least 4 cards."); return; }
               curDeck = curDeck.filter(id => id !== cid);
           } else {
               if(curDeck.length >= 6) { setShopRawDialogue("your deck is full (6 max)."); return; }
               curDeck.push(cid);
           }
           updateProfile({ [deckKey]: curDeck });
        };

        return React.createElement("div", { className: "shop-scene" },
          React.createElement("div", { className: "shop-bg" },
             // Simplistic SVG representation of Sans behind counter
             React.createElement("svg", { width:"250", height:"200", viewBox:"0 0 100 100", style:{ marginBottom: '-4px'} },
                // Hoodie
                React.createElement("path", { d:"M 15 100 Q 20 60 50 60 Q 80 60 85 100 Z", fill:"#111", stroke:"white", strokeWidth:"2" }),
                // Shirt
                React.createElement("path", { d:"M 35 100 L 40 70 Q 50 65 60 70 L 65 100 Z", fill:"white" }),
                // Skull
                React.createElement("path", { d:"M 30 65 C 30 25, 70 25, 70 65 C 70 75, 30 75, 30 65 Z", fill:"white", stroke:"black", strokeWidth:"2" }),
                // Eyes
                React.createElement("ellipse", { cx:40, cy:45, rx:6, ry:8, fill:"black" }),
                React.createElement("ellipse", { cx:60, cy:45, rx:6, ry:8, fill:"black" }),
                // Smile
                React.createElement("path", { d:"M 35 60 Q 50 65 65 60 L 65 65 Q 50 70 35 65 Z", fill:"black" })
             ),
             React.createElement("div", { className: "shop-counter" })
          ),
          
          React.createElement("div", { className: "shop-dialogue-box" },
            React.createElement("div", { className: "shop-text-area" }, shopDialogue),
            React.createElement("div", { className: "shop-options-area" },
               React.createElement("button", { className: "ut-menu-btn", onClick: () => { setShopView('daily'); setShopRawDialogue("new stuff every day.\nsupposedly."); } }, "Daily"),
               React.createElement("button", { className: "ut-menu-btn", onClick: () => { setShopView('item'); setShopRawDialogue("arrange your cards here."); } }, "Item"),
               React.createElement("button", { className: "ut-menu-btn", onClick: () => { setShopView('talk'); setShopRawDialogue("what's on your mind?"); } }, "Talk"),
               React.createElement("button", { className: "ut-menu-btn", onClick: () => setView('menu') }, "Exit")
            )
          ),

          React.createElement("div", { className: "flex-grow p-4 bg-black border-4 border-t-0 border-white overflow-hidden" },
             shopView === 'daily' && React.createElement("div", { className: "flex justify-center gap-6 mt-4" },
                shopCards.map(cid => {
                  const owned = profile.inventory.includes(cid);
                  return React.createElement("div", { key: cid, className: "flex flex-col items-center gap-2" },
                    React.createElement(Card, { cardId: cid, disabled: owned }),
                    React.createElement("button", { className: "ut-action-btn w-full mt-2", disabled: owned || profile.coins<50, onClick: () => buyCard(cid) }, owned ? "SOLD" : "50G")
                  );
                })
             ),
             shopView === 'item' && React.createElement("div", {className: "overflow-y-auto h-full p-2"},
                ['Frisk', 'Sans'].map(role => {
                    const all = Object.keys(CARDS).filter(c => profile.inventory.includes(c) || DEFAULT_DECK['Frisk'].includes(c) || DEFAULT_DECK['Sans'].includes(c));
                    const roleCards = all.filter(c => CARDS[c].role === role);
                    return React.createElement("div", {key:role},
                        React.createElement("h3", {className:`mb-2 ${role==='Frisk'?'text-yellow-400':'text-blue-400'}`}, `${role} Deck (4-6 cards):`),
                        React.createElement("div", {className:"flex gap-2 flex-wrap mb-6"}, 
                            roleCards.map(c => React.createElement(Card, {key:c, cardId:c, isActiveInDeck:profile[`deck${role}`].includes(c), onClick:()=>toggleDeck(c, role)}))
                        )
                    );
                })
             ),
             shopView === 'talk' && React.createElement("div", {className: "flex flex-col gap-4 mt-4 ml-8"},
                [
                    {q:"Who are you?", a:"i'm sans.\nsans the skeleton."},
                    {q:"How did you get here?", a:"i know some shortcuts."},
                    {q:"What is this place?", a:"it's a card shop.\nobviously."}
                ].map((t,i) => React.createElement("button", { key:i, className:"ut-menu-btn text-2xl", onClick:()=>setShopRawDialogue(t.a)}, t.q))
             )
          )
        );
      }

      // --- BATTLE VIEW ---
      if (view === 'battle') {
        if (!match) return null;
        const isP1 = match.p1.uid === user.uid;
        const me = isP1 ? match.p1 : match.p2;
        const opp = isP1 ? match.p2 : match.p1;
        const isMyTurn = match.status === 'playing' && match.turn === user.uid && !match.minigame;

        return React.createElement("div", { className: `max-w-4xl mx-auto p-4 h-screen flex flex-col justify-between ${match.status==='finished'?'opacity-50':''}` },
          
          // Opponent Info
          React.createElement("div", { className: "flex justify-between items-center mb-2 px-4" },
             React.createElement("div", { className: "text-4xl uppercase" }, opp.role),
             React.createElement("div", { className: "flex items-center gap-4 w-1/2" },
               React.createElement("div", { className: "text-red-500 font-bold" }, "HP"),
               React.createElement("div", { className: "bar-bg flex-grow" }, React.createElement("div", { className: "bar-fill-hp bg-red-500", style: { width: `${(opp.hp/opp.maxHp)*100}%` } })),
               React.createElement("div", null, `${opp.hp}`)
             )
          ),

          // Main Center Box
          React.createElement("div", { className: "ut-panel flex-grow mb-4 flex flex-col justify-between border-[6px]" },
             React.createElement("div", { className: "flex-grow overflow-y-auto flex flex-col-reverse p-6" },
               [...match.log].reverse().map((l, i) => React.createElement("div", { key: i, className: "mb-3" }, l))
             ),
             actSubMenu && React.createElement("div", { className: "flex justify-around border-t-4 border-white p-4" },
                React.createElement("button", { className: "ut-action-btn", onClick:()=>handleActChoice('Check')}, "Check"),
                React.createElement("button", { className: "ut-action-btn", onClick:()=>handleActChoice('Talk')}, "Talk"),
                React.createElement("button", { className: "ut-action-btn", onClick:()=>setActSubMenu(false)}, "Cancel")
             )
          ),

          // Player Stats Bottom
          React.createElement("div", { className: "flex justify-between items-center mb-6 px-4" },
             React.createElement("div", { className: "text-4xl uppercase" }, `${me.role}   LV ${me.role==='Frisk' ? info.lv : 1}`),
             React.createElement("div", { className: "flex gap-2 items-center w-1/2" }, 
               React.createElement("span", { className: "text-2xl" }, "HP"),
               React.createElement("div", { className: "bar-bg w-full" }, React.createElement("div", { className: "bar-fill-hp", style: { width: `${(me.hp/me.maxHp)*100}%` } })),
               React.createElement("span", { className: "text-2xl" }, `${me.hp}/${me.maxHp}`)
             )
          ),

          // Hand (3 cards max)
          React.createElement("div", { className: "flex gap-8 justify-center pb-4" },
             me.hand.map((cid, i) => React.createElement(Card, { 
               key: i, cardId: cid, 
               disabled: !isMyTurn || (CARDS[cid].cost && me.st < CARDS[cid].cost),
               onClick: () => handlePlayCard(cid) 
             }))
          ),

          match.pendingFight && React.createElement(FightMinigame, { onComplete: (m) => {
              const nm = applyCard(match, user.uid, match.pendingFight, m);
              nm.pendingFight = null; updateMatchState(nm);
          }}),
          match.minigame && match.minigame.target === user.uid && React.createElement(DodgeMinigame, { 
              pattern: match.minigame.pattern, 
              targetIsAI: false,
              onComplete: (hits) => {
                  const nm = JSON.parse(JSON.stringify(match));
                  if(hits > 0) { nm.p1.hp -= hits * 2; nm.log.push(`* Took ${hits*2} damage.`); }
                  else nm.log.push("* Dodged perfectly!");
                  nm.minigame = null; nm.turn = user.uid; nm.round++;
                  nm.p1.st = Math.min(nm.p1.maxSt, nm.p1.st + 5);
                  nm.p1.hand = drawHand(nm.p1.deck);
                  if(nm.p1.hp <= 0) { nm.status = 'finished'; nm.winner = nm.p2.uid; }
                  updateMatchState(nm);
              } 
          }),
          match.minigame && match.minigame.target === 'ai' && React.createElement(DodgeMinigame, { 
              pattern: match.minigame.pattern, 
              targetIsAI: true,
              onComplete: (hits) => {
                  const nm = JSON.parse(JSON.stringify(match));
                  if(hits > 0) { nm.p2.hp -= hits * 2; nm.log.push(`* Sans took ${hits*2} damage!`); }
                  else nm.log.push("* Sans dodged it easily.");
                  nm.minigame = null; nm.turn = 'ai'; nm.round++;
                  nm.p2.st = Math.min(nm.p2.maxSt, nm.p2.st + 5);
                  nm.p2.hand = drawHand(nm.p2.deck);
                  if(nm.p2.hp <= 0) { nm.status = 'finished'; nm.winner = nm.p1.uid; }
                  updateMatchState(nm);
              } 
          })
        );
      }

      return null;
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
  };

  const _fbConfig = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
  const _appId = typeof __app_id !== 'undefined' ? __app_id : 'undertale-duel-1';
  const _initToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : '';
  window.onload = () => window.initReactApp(_fbConfig, _appId, _initToken);
</script>
</body>
</html>
