# Sprite Sheet Audit Notes

## Sources inspected

- `/home/ubuntu/Endless-Elevator/sprite sheets/protagonist sprite sheet.png`
- `/home/ubuntu/Endless-Elevator/sprite sheets/tileset for a liminal space office building and a creepy hotel.png`
- `/home/ubuntu/Endless-Elevator/sprite sheets/pixel art RPG item icons.png`
- `/home/ubuntu/Endless-Elevator/sprite sheets/creepy liminal space monsters.png`
- `/home/ubuntu/Endless-Elevator/sprite sheets/mysterious NPCs for your game.png`

## Key findings

The current game file is a single large HTML document with embedded CSS and JavaScript. Rendering currently uses mostly procedural rectangles and generated textures rather than the provided sprite sheets.

The protagonist sheet is a 1024x1024 image containing eight character poses arranged in two rows and four columns. It appears suitable for directional idle and walking variants, though the exact frame boundaries will need to be approximated or measured in code.

The tileset image is a 1024x1024 environment composition containing office and hotel themed floor, wall, desk, plant, elevator, and hallway art. It is not laid out as a perfectly regular atlas, so extraction will likely require manually defined source rectangles rather than simple grid indexing.

The item icons image is a 1024x1024 sheet with clearly separated icons for a medkit, pill bottle, energy bar, coin, and a note/paper. These align well with the existing in-game items.

The monsters image is a 1024x1024 sheet with multiple ghostlike and humanoid shadow monsters, plus glitch fragments. It is suitable for enemy rendering and variation selection.

The NPC sprite sheet includes at least janitor, bellhop/elevator attendant, and faceless suited figure variants. It is suitable for replacing the current placeholder NPC rectangles.

## Refactor implications

A good implementation path is to split the current single-file game into `index.html`, `styles.css`, and multiple JavaScript modules such as asset loading, sprite definitions, rendering, world generation, entities, UI, and main bootstrap.

Sprite rendering should use `drawImage` with explicit source rectangles mapped in a sprite definition file. Because several source images are composited rather than uniform grids, a manual atlas map will likely be more reliable than automatic slicing.

The existing item, NPC, enemy, elevator, desk, and plant rendering can be upgraded first, with floor and wall rendering using extracted environment tiles where practical.

The face areas in the character art are blurred in the source assets, so the implementation should simply use the sheet as provided without trying to reconstruct obscured details.

## Next checks needed

- Inspect the remainder of the JavaScript game architecture in the HTML file.
- Identify where textures, entity rendering, map generation, and UI state are defined.
- Create a modular file structure and migrate the working logic before swapping sprite-based render paths.
- Add a small asset manifest for image paths and source rectangles.
