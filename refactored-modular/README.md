# The Endless Elevator - Refactored Modular Version

This directory contains a complete refactoring of The Endless Elevator game from a single 1370-line HTML file into a modular, maintainable architecture with proper sprite sheet support.

## Architecture Overview

### File Structure

```
src/
├── lib/
│   ├── sprites.ts          # Sprite sheet definitions and frame mappings
│   ├── gameEngine.ts       # Core game logic, state management, world generation
│   ├── renderer.ts         # Canvas rendering with sprite sheet support
│   └── gameController.ts   # Input handling and game state updates
├── pages/
│   └── Game.tsx            # React component for the game page
├── App.tsx                 # Main app component with routing
└── index.css               # Global styles
```

## Key Improvements

### 1. **Modular Separation of Concerns**
- **sprites.ts**: Centralized sprite sheet URLs and frame coordinate definitions
- **gameEngine.ts**: Pure game logic (state, world generation, item/entity definitions)
- **renderer.ts**: All canvas rendering logic with sprite drawing utilities
- **gameController.ts**: Input handling and game state mutations
- **Game.tsx**: React component managing the game lifecycle

### 2. **Sprite Sheet Support**
All 6 sprite sheets are now properly mapped with frame coordinates:

| Sheet | Purpose | Frames | Dimensions |
|-------|---------|--------|------------|
| Protagonist | Player character animations | 8 (idle + walk) | 1024×1024 |
| Tileset | Environment assets | Multiple | 1024×1024 |
| Items | Consumables & lore | 5 items | 1024×1024 |
| Monsters | Enemy variations | 30 types | 1024×1024 |
| NPCs | Non-player characters | 6 variants | 1024×1024 |
| NPCs Alt | Additional NPC variants | 6 variants | 1024×1024 |

### 3. **Type Safety**
- Full TypeScript support with proper interfaces
- Type definitions for GameState, Entity, Item, Interactable, etc.
- Eliminates runtime type errors common in the original single-file version

### 4. **Sprite Rendering**
```typescript
// Unified sprite drawing function
drawSprite(ctx, spriteSheet, frame, x, y, width, height);

// Frame definitions are explicit and maintainable
PROTAGONIST_FRAMES.IDLE_FRONT = { x: 0, y: 0, w: 256, h: 256 }
```

### 5. **Scalability**
- Easy to add new sprite sheets
- Simple to extend game features (new items, enemies, NPCs)
- Modular components can be tested independently

## Sprite Sheet Mapping

### Protagonist Sheet (1024×1024)
- **Row 0**: Idle poses (front, front-left, left, back)
- **Row 1**: Walking poses (front, front-left, left, back)
- Each frame: 256×256 pixels

### Item Icons (1024×1024)
- Medkit (0, 0)
- Pills (512, 0)
- Energy Bar (0, 256)
- Coin (512, 256)
- Note (512, 512)

### Monsters (1024×1024)
- 6 columns × 5 rows
- 30 unique enemy variations
- Each frame: ~170×200 pixels

### NPCs (1024×1024)
- 3 characters × 2 directions (front/back)
- Janitor, Bellhop, Suited Figure
- Each frame: 340×512 pixels

## Game Features

### Core Mechanics
- **Procedural floor generation** using random walk algorithm
- **Dynamic theme system** with 8 environmental themes
- **Inventory system** with consumable items
- **Sanity mechanic** affecting visuals and gameplay
- **Combat system** with enemy encounters
- **Dialogue system** for NPC interactions

### UI/UX
- Real-time HUD with health and sanity bars
- Floor counter and theme display
- Interaction prompts
- Notification system
- Inventory screen
- Game over screen
- Retro scanlines effect

### Visual Effects
- **Field of view lighting** with dynamic radius
- **Sanity-based glitch effects** (hue rotation, inversion)
- **Screen shake** when sanity is low
- **Particle system** for visual feedback
- **Animated sprites** with walk cycles

## Usage

### Loading Sprites
```typescript
import { loadSpriteSheets } from '@/lib/sprites';

const spriteSheets = await loadSpriteSheets();
// Returns: { protagonist, tileset, items, monsters, npcs, npcsAlt }
```

### Drawing Sprites
```typescript
import { drawSprite, PROTAGONIST_FRAMES } from '@/lib/sprites';

drawSprite(
  ctx,
  spriteSheets.protagonist,
  PROTAGONIST_FRAMES.IDLE_FRONT,
  x, y,
  width, height
);
```

### Game State Management
```typescript
import { createInitialGameState, GameController } from '@/lib/gameEngine';

const state = createInitialGameState();
const controller = new GameController(state);

controller.onStateChange = (newState) => {
  // Handle state updates
};
```

## Extending the Game

### Adding a New Item
1. Add to `ITEMS` in `gameEngine.ts`
2. Add frame definition to `ITEM_FRAMES` in `sprites.ts`
3. Update `getItemFrameKey()` in `renderer.ts`

### Adding a New Enemy Type
1. Add to `MONSTER_FRAMES` in `sprites.ts`
2. Update enemy spawning logic in `MapGenerator.generate()`
3. Add rendering logic in `Renderer.render()`

### Adding a New Theme
1. Add to `THEMES` in `gameEngine.ts`
2. Update theme selection logic in `MapGenerator.generate()`
3. Adjust lighting/color values as needed

## Performance Considerations

- **Sprite batching**: All sprites drawn in a single render pass
- **Culling**: Only visible tiles rendered based on camera position
- **Lighting**: Computed once per frame using canvas compositing
- **Particle pooling**: Particles reused instead of constantly created/destroyed

## Browser Compatibility

- Modern browsers with Canvas 2D support
- Requires ES2020+ JavaScript support
- Tested on Chromium-based browsers

## Future Improvements

- **Audio system**: Integrate procedural sound effects
- **Save/load**: Implement game state persistence
- **Multiplayer**: Add network synchronization
- **Mobile support**: Touch controls and responsive canvas
- **Animation system**: Skeletal animation for more complex sprites
- **Shader effects**: WebGL rendering for advanced visual effects

## Original vs. Refactored

| Aspect | Original | Refactored |
|--------|----------|-----------|
| Lines of code | 1370 | ~1200 (split across modules) |
| File count | 1 | 4 core modules + React component |
| Type safety | None | Full TypeScript |
| Sprite support | Procedural only | Sprite sheets + procedural |
| Testability | Difficult | Easy (modular) |
| Maintainability | Low | High |
| Extensibility | Limited | Excellent |

## License

Same as original project.
