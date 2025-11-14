// cards.js
// Character definitions
const characters = {
  Frisk: {
    hp: 20,
    stamina: null,
    allowed: ["Item", "Option"], // cannot use Magic
  },
  Sans: {
    hp: 1,
    stamina: 6, // stamina gates dodges
    allowed: ["Magic", "Option"], // restricted items
  },
  Papyrus: {
    hp: 12,
    stamina: null,
    allowed: ["Item", "Magic", "Option"],
  }
};

// Decks per character
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
