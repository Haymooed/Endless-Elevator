/**
 * THE ENDLESS ELEVATOR - Core Game Engine
 * Refactored from single-file implementation into modular architecture
 */

import { drawSprite, PROTAGONIST_FRAMES, ITEM_FRAMES, MONSTER_FRAMES, NPC_FRAMES, TILESET_FRAMES } from './sprites';

// --- UTILITIES & MATH ---
export const MathUtil = {
  rand: (min: number, max: number) => Math.random() * (max - min) + min,
  randInt: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
  distance: (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
  clamp: (val: number, min: number, max: number) => Math.max(min, Math.min(max, val)),
  lerp: (a: number, b: number, t: number) => a + (b - a) * t,
  choose: <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
  chance: (percent: number) => Math.random() < percent / 100,
};

export const TILE = { SIZE: 32 };

// --- THEME DEFINITIONS ---
export const THEMES = {
  ELEVATOR: { name: 'Elevator', bg: '#2a2a2a', wall: '#404040', floor: '#1a1a1a', ambient: 'hum', light: 1.0, color: [200, 200, 220] },
  OFFICE: { name: 'Abandoned Office', bg: '#111', wall: '#cccccc', floor: '#4a5a6a', ambient: 'vent', light: 0.8, color: [240, 240, 255] },
  HOTEL: { name: 'The Grand Hotel', bg: '#201010', wall: '#8b0000', floor: '#daa520', ambient: 'soft', light: 0.7, color: [255, 200, 150] },
  GARDEN: { name: 'Overgrown Rooftop', bg: '#051005', wall: '#2d5a27', floor: '#1a3317', ambient: 'wind', light: 0.9, color: [180, 255, 180] },
  HOSPITAL: { name: 'Sterile Ward', bg: '#ffffff', wall: '#e0eaf5', floor: '#c0d0e0', ambient: 'buzz', light: 0.6, color: [200, 255, 255] },
  BASEMENT: { name: 'Waterlogged Basement', bg: '#000', wall: '#202020', floor: '#102030', ambient: 'drip', light: 0.3, color: [100, 150, 255] },
  VOID: { name: 'The Void', bg: '#000', wall: '#050505', floor: '#000000', ambient: 'static', light: 0.1, color: [50, 50, 50], glitch: true },
  FLESH: { name: 'Living Walls', bg: '#300000', wall: '#601010', floor: '#400505', ambient: 'heartbeat', light: 0.4, color: [255, 50, 50], pulse: true },
};

// --- ITEM DEFINITIONS ---
export const ITEMS = {
  MEDKIT: { id: 'MEDKIT', name: 'Rusted Medkit', type: 'consumable', desc: 'Restores 40 HP. Smells faintly of lavender and ozone.', heal: 40 },
  PILLS: { id: 'PILLS', name: 'Unmarked Pills', type: 'consumable', desc: 'Restores 30 Sanity. The bottle has no label.', sanityHeal: 30 },
  ENERGY_BAR: { id: 'ENERGY_BAR', name: 'Stale Energy Bar', type: 'consumable', desc: 'Restores 15 HP and 5 Sanity. Tastes like dust.', heal: 15, sanityHeal: 5 },
  STRANGE_COIN: { id: 'STRANGE_COIN', name: 'Heavy Coin', type: 'resource', desc: 'A cold, heavy coin with an unrecognized face.' },
  NOTE_1: { id: 'NOTE_1', name: 'Crumpled Note', type: 'lore', desc: '"Don\'t look at the walls when they breathe." Read it?' },
  NOTE_2: { id: 'NOTE_2', name: 'Maintenance Log', type: 'lore', desc: '"Elevator keeps going past the roof. Cable length mathematically impossible." Read it?' },
};

export const LORE_TEXTS = {
  NOTE_1: "I've been going down for three days. Or is it up? The numbers stopped making sense. At floor 104, I swear the building was breathing. I need to find the maintenance shaft.",
  NOTE_2: 'Work order #4012: Investigate structural anomaly on floor 13. Tenant reports the hallway extends infinitely. Update: Hallway verified infinite. Sealing door. Do not report.',
};

// --- TYPE DEFINITIONS ---
export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hp: number;
  maxHp: number;
  direction: 'front' | 'back' | 'left' | 'right';
  isMoving: boolean;
}

export interface Entity {
  type: 'ENEMY' | 'NPC';
  x: number;
  y: number;
  hp?: number;
  speed?: number;
  color?: string;
  name?: string;
  dialog?: string[];
}

export interface Item {
  id: string;
  x: number;
  y: number;
}

export interface Interactable {
  type: string;
  x: number;
  y: number;
}

export interface GameState {
  floor: number;
  hp: number;
  maxHp: number;
  sanity: number;
  maxSanity: number;
  inventory: string[];
  map: number[][];
  player: Player;
  entities: Entity[];
  items: Item[];
  interactables: Interactable[];
  theme: any;
  lastHit?: number;
  gameOver: boolean;
  discoveredFloors: Set<number>;
}

// --- MAP GENERATOR ---
export class MapGenerator {
  static generate(floorNum: number) {
    const width = 40;
    const height = 40;
    let map = Array(height)
      .fill(null)
      .map(() => Array(width).fill(0));
    let rooms: any[] = [];

    // Select theme based on floor
    let themeKey = 'OFFICE';
    if (floorNum === 0) themeKey = 'ELEVATOR';
    else if (floorNum % 10 === 0) themeKey = 'VOID';
    else {
      const themes = Object.keys(THEMES).filter((k) => k !== 'ELEVATOR' && k !== 'VOID');
      themeKey = MathUtil.choose(themes);
      if (floorNum > 20 && Math.random() > 0.5) themeKey = 'FLESH';
      if (floorNum > 10 && Math.random() > 0.7) themeKey = 'BASEMENT';
    }

    const theme = (THEMES as any)[themeKey];

    // Generate Hub / Starting Area
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height / 2);

    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        map[startY + r][startX + c] = 2;
      }
    }

    let interactables = [{ type: 'ELEVATOR', x: (startX - 1) * TILE.SIZE, y: (startY - 1) * TILE.SIZE }];
    let playerSpawn = { x: startX * TILE.SIZE, y: startY * TILE.SIZE };

    if (floorNum !== 0) {
      let walkers = [{ x: startX, y: startY, life: Math.min(50 + floorNum * 2, 200) }];

      while (walkers.length > 0) {
        let w = walkers.pop()!;
        while (w.life > 0) {
          map[w.y][w.x] = 2;

          const dir = MathUtil.randInt(0, 3);
          if (dir === 0) w.y--;
          else if (dir === 1) w.y++;
          else if (dir === 2) w.x--;
          else w.x++;

          w.x = MathUtil.clamp(w.x, 2, width - 3);
          w.y = MathUtil.clamp(w.y, 2, height - 3);

          if (Math.random() < 0.05) {
            const rw = MathUtil.randInt(3, 7);
            const rh = MathUtil.randInt(3, 7);
            for (let r = 0; r < rh; r++) {
              for (let c = 0; c < rw; c++) {
                if (w.y + r < height - 1 && w.x + c < width - 1) map[w.y + r][w.x + c] = 2;
              }
            }
            rooms.push({ x: w.x, y: w.y, w: rw, h: rh });
          }

          if (Math.random() < 0.05 && walkers.length < 5) {
            walkers.push({ x: w.x, y: w.y, life: w.life / 2 });
          }

          w.life--;
        }
      }

      // Generate Walls
      for (let r = 1; r < height - 1; r++) {
        for (let c = 1; c < width - 1; c++) {
          if (map[r][c] === 2) {
            for (let y = -1; y <= 1; y++) {
              for (let x = -1; x <= 1; x++) {
                if (map[r + y][c + x] === 0) map[r + y][c + x] = 1;
              }
            }
          }
        }
      }
    } else {
      for (let r = -3; r <= 3; r++) {
        for (let c = -3; c <= 3; c++) {
          if (Math.abs(r) === 3 || Math.abs(c) === 3) map[startY + r][startX + c] = 1;
        }
      }
      map[startY + 3][startX] = 2;
    }

    // Populate items and entities
    let items = [];
    let entities = [];

    if (floorNum !== 0) {
      let floorTiles = [];
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
          if (map[r][c] === 2 && MathUtil.distance(c, r, startX, startY) > 5) {
            floorTiles.push({ r, c });
          }
        }
      }

      floorTiles.sort(() => Math.random() - 0.5);

      const numItems = MathUtil.randInt(1, 4 + Math.floor(floorNum / 10));
      for (let i = 0; i < numItems && floorTiles.length > 0; i++) {
        let t = floorTiles.pop()!;
        let itemKey = MathUtil.choose(Object.keys(ITEMS));
        items.push({ id: itemKey, x: t.c * TILE.SIZE, y: t.r * TILE.SIZE });
      }

      const numEnemies = MathUtil.randInt(0, 1 + Math.floor(floorNum / 5));
      for (let i = 0; i < numEnemies && floorTiles.length > 0; i++) {
        let t = floorTiles.pop()!;
        entities.push({ type: 'ENEMY' as const, x: t.c * TILE.SIZE, y: t.r * TILE.SIZE, hp: 50, speed: 1.5 + floorNum * 0.05 });
      }

      for (let i = 0; i < rooms.length && i < 5; i++) {
        let rm = rooms[i];
        let propType = themeKey === 'OFFICE' ? 'DESK' : themeKey === 'GARDEN' ? 'PLANT' : null;
        if (propType) interactables.push({ type: propType, x: (rm.x + 1) * TILE.SIZE, y: (rm.y + 1) * TILE.SIZE });
      }

      if (Math.random() < 0.3 && floorTiles.length > 0) {
        let t = floorTiles.pop()!;
        entities.push({
          type: 'NPC' as const,
          x: t.c * TILE.SIZE,
          y: t.r * TILE.SIZE,
          name: 'The Janitor',
          dialog: ['"Messy down here, isn\'t it?"', '"Watch out for the shadows."'],
        });
      }
    }

    return { map, width, height, theme, playerSpawn, interactables, items, entities, floorNum };
  }
}

// --- GAME STATE INITIALIZATION ---
export function createInitialGameState(): GameState {
  const world = MapGenerator.generate(0);
  return {
    floor: 0,
    hp: 100,
    maxHp: 100,
    sanity: 100,
    maxSanity: 100,
    inventory: [],
    map: world.map,
    player: {
      x: world.playerSpawn.x,
      y: world.playerSpawn.y,
      vx: 0,
      vy: 0,
      size: TILE.SIZE,
      hp: 100,
      maxHp: 100,
      direction: 'front',
      isMoving: false,
    },
    entities: world.entities,
    items: world.items,
    interactables: world.interactables,
    theme: world.theme,
    gameOver: false,
    discoveredFloors: new Set([0]),
  };
}

// --- PARTICLE SYSTEM ---
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export class ParticleSystem {
  particles: Particle[] = [];

  addParticle(x: number, y: number, color: string) {
    this.particles.push({
      x,
      y,
      vx: MathUtil.rand(-2, 2),
      vy: MathUtil.rand(-2, 2),
      life: 1.0,
      color,
      size: MathUtil.rand(2, 4),
    });
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    for (let p of this.particles) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1.0;
  }
}
