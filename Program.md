# Undertale Card Battle

## Files
- `index.html` → Main game UI and entry point.
- `style.css` → All styling for layout, cards, meters, etc.
- `cards.js` → Character definitions and decks.
- `game.js` → Game logic (drag & drop, AI play, turn resolution).

## Characters
- **Frisk**: 20 HP, no stamina. Allowed: Item, Option.
- **Sans**: 1 HP, 6 stamina. Allowed: Magic, Option. Dodges consume stamina.
- **Papyrus**: 12 HP, no stamina. Allowed: Item, Magic, Option.

## Gameplay Loop
1. Player drags a card into a slot.
2. AI chooses a card and places it.
3. Click **End Turn** to resolve:
   - Healing and stamina effects apply.
   - Damage is applied (Sans dodges if stamina > 0).
   - HP bars update.
4. Cards are cleared from slots.
5. Win/Loss/Draw checked.

## Notes
- Future expansion: random draws, multiple turns, unlockable cards.
- Style inspired by Undertale battle UI.
