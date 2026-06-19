/**
 * Sprite Sheet Definitions
 * Maps sprite sheet URLs and frame coordinates for all game assets
 */

// Asset URLs (uploaded to cloud storage)
// Using URL-encoded paths for proper file access
export const SPRITE_SHEETS = {
  PROTAGONIST: '/manus-storage/protagonist%20sprite%20sheet_eb31866c.png',
  TILESET: '/manus-storage/tileset%20for%20a%20liminal%20space%20office%20building%20and%20a%20creepy%20hotel_963e33d2.png',
  ITEMS: '/manus-storage/pixel%20art%20RPG%20item%20icons_9fe32a1e.png',
  MONSTERS: '/manus-storage/creepy%20liminal%20space%20monsters_83aa2231.png',
  NPCS: '/manus-storage/mysterious%20NPCs%20for%20your%20game_16202993.png',
  NPCS_ALT: '/manus-storage/mysterious%20NPCs%20for%20your%20game%202_3932a2da.png',
};

/**
 * Protagonist sprite frames (1024x1024 sheet, 8 frames in 2 rows, 4 columns)
 * Each frame is approximately 256x256 pixels
 * Row 0: Idle/neutral poses (front, front-left, left, back)
 * Row 1: Walking poses (front, front-left, left, back)
 */
export const PROTAGONIST_FRAMES = {
  IDLE_FRONT: { x: 0, y: 0, w: 256, h: 256 },
  IDLE_FRONT_LEFT: { x: 256, y: 0, w: 256, h: 256 },
  IDLE_LEFT: { x: 512, y: 0, w: 256, h: 256 },
  IDLE_BACK: { x: 768, y: 0, w: 256, h: 256 },
  WALK_FRONT: { x: 0, y: 256, w: 256, h: 256 },
  WALK_FRONT_LEFT: { x: 256, y: 256, w: 256, h: 256 },
  WALK_LEFT: { x: 512, y: 256, w: 256, h: 256 },
  WALK_BACK: { x: 768, y: 256, w: 256, h: 256 },
};

/**
 * Item icons (1024x1024 sheet)
 * Icons are arranged in a 2x3 grid with spacing
 * Medkit (top-left), Pills (top-right)
 * Energy Bar (middle-left), Coin (middle-right)
 * Note (bottom-right)
 */
export const ITEM_FRAMES = {
  MEDKIT: { x: 0, y: 0, w: 256, h: 256 },
  PILLS: { x: 512, y: 0, w: 256, h: 256 },
  ENERGY_BAR: { x: 0, y: 256, w: 512, h: 256 },
  COIN: { x: 512, y: 256, w: 256, h: 256 },
  NOTE: { x: 512, y: 512, w: 256, h: 256 },
};

/**
 * Monster sprites (1024x1024 sheet)
 * 6 columns x 5 rows of various enemy types
 * Each frame is approximately 170x200 pixels
 */
export const MONSTER_FRAMES = {
  GHOST_1: { x: 0, y: 0, w: 170, h: 200 },
  GHOST_2: { x: 170, y: 0, w: 170, h: 200 },
  GHOST_3: { x: 340, y: 0, w: 170, h: 200 },
  WRAITH_1: { x: 510, y: 0, w: 170, h: 200 },
  WRAITH_2: { x: 680, y: 0, w: 170, h: 200 },
  WRAITH_3: { x: 850, y: 0, w: 170, h: 200 },
  // Row 2
  PHANTOM_1: { x: 0, y: 200, w: 170, h: 200 },
  PHANTOM_2: { x: 170, y: 200, w: 170, h: 200 },
  PHANTOM_3: { x: 340, y: 200, w: 170, h: 200 },
  ENTITY_1: { x: 510, y: 200, w: 170, h: 200 },
  ENTITY_2: { x: 680, y: 200, w: 170, h: 200 },
  ENTITY_3: { x: 850, y: 200, w: 170, h: 200 },
  // Row 3
  SHADOW_1: { x: 0, y: 400, w: 170, h: 200 },
  SHADOW_2: { x: 170, y: 400, w: 170, h: 200 },
  SHADOW_3: { x: 340, y: 400, w: 170, h: 200 },
  TALL_ENTITY: { x: 510, y: 400, w: 170, h: 200 },
  TALL_SHADOW: { x: 680, y: 400, w: 170, h: 200 },
  TALL_PHANTOM: { x: 850, y: 400, w: 170, h: 200 },
  // Row 4
  GLITCH_1: { x: 0, y: 600, w: 170, h: 200 },
  GLITCH_2: { x: 170, y: 600, w: 170, h: 200 },
  GLITCH_3: { x: 340, y: 600, w: 170, h: 200 },
  GLITCH_CROSS: { x: 510, y: 600, w: 170, h: 200 },
  GLITCH_SCATTER: { x: 680, y: 600, w: 170, h: 200 },
  GLITCH_FORM: { x: 850, y: 600, w: 170, h: 200 },
};

/**
 * NPC sprites (1024x1024 sheet)
 * 3 columns x 2 rows: Janitor, Bellhop, Suited Figure (front and back)
 */
export const NPC_FRAMES = {
  JANITOR_FRONT: { x: 0, y: 0, w: 340, h: 512 },
  BELLHOP_FRONT: { x: 340, y: 0, w: 340, h: 512 },
  SUITED_FRONT: { x: 680, y: 0, w: 340, h: 512 },
  JANITOR_BACK: { x: 0, y: 512, w: 340, h: 512 },
  BELLHOP_BACK: { x: 340, y: 512, w: 340, h: 512 },
  SUITED_BACK: { x: 680, y: 512, w: 340, h: 512 },
};

/**
 * Tileset sprites (1024x1024 sheet)
 * Complex layout with various environment tiles and objects
 * Includes: walls, floors, desks, plants, elevator, hallways
 */
export const TILESET_FRAMES = {
  // Office walls and floors
  OFFICE_WALL_TOP: { x: 250, y: 80, w: 440, h: 90 },
  OFFICE_FLOOR: { x: 250, y: 250, w: 440, h: 200 },
  OFFICE_DESK: { x: 250, y: 250, w: 440, h: 150 },
  OFFICE_COMPUTER: { x: 250, y: 250, w: 100, h: 100 },
  
  // Hotel elements
  HOTEL_WALL: { x: 770, y: 80, w: 180, h: 400 },
  HOTEL_FLOOR: { x: 250, y: 420, w: 440, h: 200 },
  HOTEL_DOOR: { x: 250, y: 420, w: 150, h: 200 },
  
  // Generic props
  PLANT: { x: 250, y: 250, w: 100, h: 150 },
  ELEVATOR_DOOR: { x: 250, y: 420, w: 150, h: 200 },
  CHECKERED_FLOOR: { x: 250, y: 250, w: 200, h: 200 },
};

/**
 * Helper function to draw a sprite from a sheet
 * @param ctx Canvas rendering context
 * @param sheet Image object
 * @param frame Frame definition with x, y, w, h
 * @param destX Destination X coordinate
 * @param destY Destination Y coordinate
 * @param destW Destination width (optional, defaults to frame width)
 * @param destH Destination height (optional, defaults to frame height)
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sheet: HTMLImageElement,
  frame: { x: number; y: number; w: number; h: number },
  destX: number,
  destY: number,
  destW?: number,
  destH?: number
) {
  const dw = destW ?? frame.w;
  const dh = destH ?? frame.h;
  ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, destX, destY, dw, dh);
}

/**
 * Create a placeholder image for failed sprite loads
 */
function createPlaceholder(label: string): HTMLImageElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.fillStyle = '#666';
  ctx.font = '14px monospace';
  ctx.fillText(`Placeholder: ${label}`, 10, 20);
  
  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
}

/**
 * Preload all sprite sheets
 * @returns Promise resolving to object with all loaded images
 */
export async function loadSpriteSheets(): Promise<{
  protagonist: HTMLImageElement;
  tileset: HTMLImageElement;
  items: HTMLImageElement;
  monsters: HTMLImageElement;
  npcs: HTMLImageElement;
  npcsAlt: HTMLImageElement;
}> {
  const loadImage = (src: string, label: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        console.log(`Loaded sprite: ${label}`);
        resolve(img);
      };
      
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${label} from ${src}, using placeholder`);
        resolve(createPlaceholder(label));
      };
      
      img.src = src;
    });
  };

  const [protagonist, tileset, items, monsters, npcs, npcsAlt] = await Promise.all([
    loadImage(SPRITE_SHEETS.PROTAGONIST, 'Protagonist'),
    loadImage(SPRITE_SHEETS.TILESET, 'Tileset'),
    loadImage(SPRITE_SHEETS.ITEMS, 'Items'),
    loadImage(SPRITE_SHEETS.MONSTERS, 'Monsters'),
    loadImage(SPRITE_SHEETS.NPCS, 'NPCs'),
    loadImage(SPRITE_SHEETS.NPCS_ALT, 'NPCs Alt'),
  ]);

  return { protagonist, tileset, items, monsters, npcs, npcsAlt };
}
