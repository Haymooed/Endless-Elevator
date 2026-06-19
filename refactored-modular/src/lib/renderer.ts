/**
 * Rendering Engine
 * Handles all canvas drawing with sprite sheet support
 */

import { drawSprite, PROTAGONIST_FRAMES, ITEM_FRAMES, MONSTER_FRAMES, NPC_FRAMES } from './sprites';
import { TILE, GameState, MathUtil, Particle } from './gameEngine';

export interface SpriteSheets {
  protagonist: HTMLImageElement;
  tileset: HTMLImageElement;
  items: HTMLImageElement;
  monsters: HTMLImageElement;
  npcs: HTMLImageElement;
  npcsAlt: HTMLImageElement;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  spriteSheets: SpriteSheets;
  camera = { x: 0, y: 0, zoom: 2 };
  particles: Particle[] = [];

  constructor(canvas: HTMLCanvasElement, spriteSheets: SpriteSheets) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.spriteSheets = spriteSheets;
  }

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

  private updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  render(state: GameState) {
    const { map, player, theme, entities, items, interactables } = state;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    // Camera Follow
    this.camera.x = MathUtil.lerp(this.camera.x, player.x - cw / (2 * this.camera.zoom), 0.1);
    this.camera.y = MathUtil.lerp(this.camera.y, player.y - ch / (2 * this.camera.zoom), 0.1);

    // Sanity visual effects
    let screenShakeX = 0,
      screenShakeY = 0;
    if (state.sanity < 30) {
      if (Math.random() < 0.1) {
        screenShakeX = MathUtil.rand(-5, 5);
        screenShakeY = MathUtil.rand(-5, 5);
      }
    }

    this.ctx.save();
    this.ctx.fillStyle = theme.bg;
    this.ctx.fillRect(0, 0, cw, ch);

    this.ctx.translate(-this.camera.x * this.camera.zoom + screenShakeX, -this.camera.y * this.camera.zoom + screenShakeY);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);

    // 1. Draw Map (Floor & Walls)
    const startC = Math.max(0, Math.floor(this.camera.x / TILE.SIZE));
    const startR = Math.max(0, Math.floor(this.camera.y / TILE.SIZE));
    const endC = Math.min(map[0].length, Math.ceil((this.camera.x + cw / this.camera.zoom) / TILE.SIZE));
    const endR = Math.min(map.length, Math.ceil((this.camera.y + ch / this.camera.zoom) / TILE.SIZE));

    for (let r = startR; r < endR; r++) {
      for (let c = startC; c < endC; c++) {
        const tile = map[r][c];
        const px = c * TILE.SIZE;
        const py = r * TILE.SIZE;

        if (tile === 0) continue;

        // Floor
        this.ctx.fillStyle = theme.floor;
        if (tile === 1 || tile === 2 || tile === 3) {
          this.ctx.fillRect(px, py, TILE.SIZE, TILE.SIZE);
          if ((c + r) % 2 === 0) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
            this.ctx.fillRect(px, py, TILE.SIZE, TILE.SIZE);
          }
        }

        // Walls
        if (tile === 1) {
          this.ctx.fillStyle = theme.wall;
          this.ctx.fillRect(px, py, TILE.SIZE, TILE.SIZE);
          this.ctx.fillStyle = 'rgba(255,255,255,0.1)';
          this.ctx.fillRect(px, py, TILE.SIZE, 4);
          this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
          this.ctx.fillRect(px, py + TILE.SIZE - 4, TILE.SIZE, 4);
        }
      }
    }

    // 2. Draw Interactables (Elevator, Props)
    for (let obj of interactables) {
      if (obj.type === 'ELEVATOR') {
        // Draw elevator using tileset
        this.ctx.fillStyle = '#4a4a5a';
        this.ctx.fillRect(obj.x, obj.y, TILE.SIZE * 2, TILE.SIZE * 2);
        this.ctx.fillStyle = '#6a6a7a';
        this.ctx.fillRect(obj.x + 4, obj.y + 4, TILE.SIZE * 2 - 8, TILE.SIZE * 2 - 8);
        this.ctx.fillStyle = '#f0d050';
        this.ctx.fillRect(obj.x + 8, obj.y + 8, TILE.SIZE * 2 - 16, TILE.SIZE * 2 - 16);
      } else if (obj.type === 'DESK') {
        this.ctx.fillStyle = '#5c4033';
        this.ctx.fillRect(obj.x, obj.y, TILE.SIZE, TILE.SIZE);
        this.ctx.fillStyle = '#000';
        this.ctx.strokeRect(obj.x, obj.y, TILE.SIZE, TILE.SIZE);
      } else if (obj.type === 'PLANT') {
        this.ctx.fillStyle = '#228b22';
        this.ctx.beginPath();
        this.ctx.arc(obj.x + 16, obj.y + 16, 12, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // 3. Draw Items with sprites
    for (let item of items) {
      const yOff = Math.sin(Date.now() / 200 + item.x) * 3;
      const frame = (ITEM_FRAMES as any)[this.getItemFrameKey(item.id)] || ITEM_FRAMES.MEDKIT;
      drawSprite(this.ctx, this.spriteSheets.items, frame, item.x, item.y + yOff, TILE.SIZE, TILE.SIZE);
    }

    // 4. Draw Entities (NPCs, Enemies) with sprites
    for (let ent of entities) {
      if (ent.type === 'ENEMY') {
        const yOff = Math.sin(Date.now() / 150 + ent.x) * 2;
        const monsterFrame = this.getRandomMonsterFrame();
        drawSprite(this.ctx, this.spriteSheets.monsters, monsterFrame, ent.x - 4, ent.y - 8 + yOff, TILE.SIZE * 1.5, TILE.SIZE * 1.5);
      } else if (ent.type === 'NPC') {
        const npcFrame = NPC_FRAMES.JANITOR_FRONT;
        drawSprite(this.ctx, this.spriteSheets.npcs, npcFrame, ent.x - 8, ent.y - 16, TILE.SIZE * 2, TILE.SIZE * 2);
      }
    }

    // 5. Draw Player with sprite animation
    let pFrame = PROTAGONIST_FRAMES.IDLE_FRONT;
    if (Math.abs(player.vx) > 0 || Math.abs(player.vy) > 0) {
      const walkFrame = Math.floor(Date.now() / 200) % 2 === 0 ? PROTAGONIST_FRAMES.WALK_FRONT : PROTAGONIST_FRAMES.WALK_FRONT_LEFT;
      pFrame = walkFrame;
    }

    if (state.lastHit && Date.now() - state.lastHit < 200) {
      this.ctx.globalCompositeOperation = 'lighter';
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(player.x, player.y, player.size, player.size);
      this.ctx.globalCompositeOperation = 'source-over';
    } else {
      drawSprite(this.ctx, this.spriteSheets.protagonist, pFrame, player.x - 4, player.y - 8, TILE.SIZE * 1.5, TILE.SIZE * 1.5);
    }

    // 6. Draw Particles
    this.updateParticles();
    for (let p of this.particles) {
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    this.ctx.globalAlpha = 1.0;

    // 7. Lighting / Shadow Map (FOV)
    this.ctx.restore();

    const lightCanvas = document.createElement('canvas');
    lightCanvas.width = cw;
    lightCanvas.height = ch;
    const lctx = lightCanvas.getContext('2d')!;

    let darkness = 0.95 - theme.light * 0.5;
    if (state.sanity < 50) darkness += (50 - state.sanity) / 100;
    darkness = MathUtil.clamp(darkness, 0.2, 0.98);

    lctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
    lctx.fillRect(0, 0, cw, ch);

    const screenPx = (player.x + TILE.SIZE / 2 - this.camera.x) * this.camera.zoom;
    const screenPy = (player.y + TILE.SIZE / 2 - this.camera.y) * this.camera.zoom;

    let lightRadius = 150;
    if (state.sanity < 40 && Math.random() < 0.05) lightRadius *= 0.5;

    const gradient = lctx.createRadialGradient(screenPx, screenPy, lightRadius * 0.2, screenPx, screenPy, lightRadius);
    const colorStr = theme.color.join(',');
    gradient.addColorStop(0, `rgba(${colorStr}, 1)`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    lctx.globalCompositeOperation = 'destination-out';
    lctx.fillStyle = gradient;
    lctx.beginPath();
    lctx.arc(screenPx, screenPy, lightRadius, 0, Math.PI * 2);
    lctx.fill();

    this.ctx.globalCompositeOperation = 'multiply';
    this.ctx.drawImage(lightCanvas, 0, 0);
    this.ctx.globalCompositeOperation = 'source-over';

    // Sanity glitches
    if (state.sanity < 20 && Math.random() < 0.02) {
      this.canvas.style.filter = 'hue-rotate(90deg) contrast(150%)';
      setTimeout(() => (this.canvas.style.filter = ''), 100);
    } else if (state.sanity < 10 && Math.random() < 0.05) {
      this.canvas.style.filter = 'invert(100%)';
      setTimeout(() => (this.canvas.style.filter = ''), 50);
    }
  }

  private getItemFrameKey(itemId: string): string {
    const mapping: { [key: string]: string } = {
      MEDKIT: 'MEDKIT',
      PILLS: 'PILLS',
      ENERGY_BAR: 'ENERGY_BAR',
      STRANGE_COIN: 'COIN',
      NOTE_1: 'NOTE',
      NOTE_2: 'NOTE',
    };
    return mapping[itemId] || 'MEDKIT';
  }

  private getRandomMonsterFrame() {
    const frames = Object.values(MONSTER_FRAMES);
    return frames[Math.floor(Math.random() * frames.length)];
  }
}
