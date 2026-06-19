# Endless Elevator - Professional Architecture

## Project Structure
- `index.html`: Entry point, UI overlays, and canvas container.
- `css/style.css`: Professional styling, animations, and layout.
- `js/`:
    - `core/`:
        - `Game.js`: Main state machine and loop.
        - `Renderer.js`: Canvas drawing and sprite management.
        - `Input.js`: Keyboard and interaction handling.
        - `Audio.js`: Sound effects and ambient music.
    - `world/`:
        - `MapGenerator.js`: Procedural floor generation.
        - `ThemeManager.js`: Environmental themes and lighting.
    - `entities/`:
        - `Entity.js`: Base class for player, NPCs, and enemies.
        - `Player.js`: Player-specific logic.
        - `Enemy.js`: AI and combat logic.
        - `NPC.js`: Dialogue and interaction logic.
    - `systems/`:
        - `Inventory.js`: Item management and usage.
        - `Dialogue.js`: Multi-step conversation system.
        - `Collision.js`: Physics and collision detection.
    - `data/`:
        - `Constants.js`: TILE_SIZE, modes, etc.
        - `Assets.js`: Sprite sheet mappings and paths.
        - `Items.js`: Item definitions.
        - `Lore.js`: Lore and dialogue text.

## Sprite Sheet Strategy
We will use the existing sprite sheets but map them more accurately:
1. **Protagonist**: Map all 8 frames for idle and walking.
2. **Tileset**: Extract specific wall, floor, and prop tiles.
3. **Items**: Map all icons for inventory and world display.
4. **Monsters**: Map different enemy types to floor difficulty.
5. **NPCs**: Use themed NPCs (Janitor, Bellhop, etc.).

## Professional Polish
- **Transition Effects**: Smooth floor transitions and menu fades.
- **Enhanced UI**: Custom fonts, better HUD, and interactive menus.
- **Soundscape**: Layered ambient sounds and context-aware SFX.
- **Performance**: Efficient rendering and modularized logic.
