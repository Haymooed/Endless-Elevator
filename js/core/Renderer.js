import { TILE_SIZE } from '../data/Constants.js';
import { SPRITE_SHEETS, PROTAGONIST_FRAMES, ITEM_FRAMES, MONSTER_FRAMES, NPC_FRAMES, TILESET_FRAMES } from '../data/Assets.js';

export class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.camera = { x: 0, y: 0, zoom: 2.5 };
        this.sprites = {};
        this.particles = [];
        this.loaded = false;
    }

    async init() {
        const loadImg = (src, key) => new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                console.log(`Loaded ${key}`);
                resolve(img);
            };
            img.onerror = () => {
                console.error(`Failed to load ${key} from ${src}`);
                // Create a colored placeholder if image fails to load
                const canvas = document.createElement('canvas');
                canvas.width = 32; canvas.height = 32;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ff00ff'; ctx.fillRect(0,0,32,32);
                const placeholder = new Image();
                placeholder.src = canvas.toDataURL();
                resolve(placeholder);
            };
            img.src = src;
        });

        const promises = Object.entries(SPRITE_SHEETS).map(async ([key, src]) => {
            this.sprites[key] = await loadImg(src, key);
        });

        await Promise.all(promises);
        this.loaded = true;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;
    }

    drawSprite(sheetKey, frame, dx, dy, dw, dh) {
        if (!this.loaded) return;
        const sheet = this.sprites[sheetKey];
        this.ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, dx, dy, dw || frame.w, dh || frame.h);
    }

    render(state) {
        if (!this.loaded || !state.map || !state.theme) return;
        const { map, player, theme, entities, items, interactables, sanity } = state;
        const cw = this.canvas.width;
        const ch = this.canvas.height;

        // Camera
        this.camera.x = player.x - cw / (2 * this.camera.zoom);
        this.camera.y = player.y - ch / (2 * this.camera.zoom);

        this.ctx.save();
        this.ctx.fillStyle = theme.bg;
        this.ctx.fillRect(0, 0, cw, ch);
        
        this.ctx.translate(-this.camera.x * this.camera.zoom, -this.camera.y * this.camera.zoom);
        this.ctx.scale(this.camera.zoom, this.camera.zoom);

        // Map
        this.renderMap(map, theme);

        // Interactables
        interactables.forEach(obj => this.renderInteractable(obj));

        // Items
        items.forEach(item => this.renderItem(item));

        // Entities
        entities.forEach(ent => this.renderEntity(ent));

        // Player
        this.renderPlayer(player, state.lastHit);

        this.ctx.restore();

        // Lighting
        this.renderLighting(player, theme, sanity);
    }

    renderMap(map, theme) {
        for (let r = 0; r < map.length; r++) {
            for (let c = 0; c < map[r].length; c++) {
                const tile = map[r][c];
                if (tile === 0) continue;
                const px = c * TILE_SIZE;
                const py = r * TILE_SIZE;

                if (tile === 2) { // Floor
                    this.ctx.fillStyle = theme.floor;
                    this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                } else if (tile === 1) { // Wall
                    this.ctx.fillStyle = theme.wall;
                    this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }

    renderPlayer(player, lastHit) {
        const isWalking = Math.abs(player.vx) > 0 || Math.abs(player.vy) > 0;
        let frame = PROTAGONIST_FRAMES.IDLE_FRONT;
        
        if (isWalking) {
            const animFrame = Math.floor(Date.now() / 200) % 2;
            frame = animFrame === 0 ? PROTAGONIST_FRAMES.WALK_FRONT : PROTAGONIST_FRAMES.IDLE_FRONT;
        }

        if (lastHit && Date.now() - lastHit < 200) {
            this.ctx.globalAlpha = 0.5;
        }
        
        this.drawSprite('PROTAGONIST', frame, player.x - 4, player.y - 8, 32, 32);
        this.ctx.globalAlpha = 1.0;
    }

    renderItem(item) {
        const frame = ITEM_FRAMES[item.id] || ITEM_FRAMES.MEDKIT;
        const yOff = Math.sin(Date.now() / 200 + item.x) * 3;
        this.drawSprite('ITEMS', frame, item.x, item.y + yOff, 16, 16);
    }

    renderEntity(ent) {
        if (ent.type === 'ENEMY') {
            const frame = MONSTER_FRAMES.GHOST_1;
            const yOff = Math.sin(Date.now() / 150 + ent.x) * 2;
            this.drawSprite('MONSTERS', frame, ent.x, ent.y + yOff, 24, 32);
        } else if (ent.type === 'NPC') {
            const frame = NPC_FRAMES.JANITOR_FRONT;
            this.drawSprite('NPCS', frame, ent.x, ent.y, 24, 32);
        }
    }

    renderInteractable(obj) {
        if (obj.type === 'ELEVATOR') {
            this.drawSprite('TILESET', TILESET_FRAMES.ELEVATOR_DOOR, obj.x, obj.y, 64, 64);
        }
    }

    renderLighting(player, theme, sanity) {
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        
        // Calculate player screen position
        const screenPx = (player.x + TILE_SIZE/2 - this.camera.x) * this.camera.zoom;
        const screenPy = (player.y + TILE_SIZE/2 - this.camera.y) * this.camera.zoom;
        
        // Base darkness
        let darkness = 0.9 - (theme.light * 0.4);
        if (sanity < 50) darkness += (50 - sanity) / 100;
        darkness = Math.max(0.1, Math.min(0.98, darkness));

        // Create an offscreen canvas for lighting to avoid multiply issues
        if (!this.lightCanvas) {
            this.lightCanvas = document.createElement('canvas');
        }
        if (this.lightCanvas.width !== cw || this.lightCanvas.height !== ch) {
            this.lightCanvas.width = cw;
            this.lightCanvas.height = ch;
        }
        const lctx = this.lightCanvas.getContext('2d');
        
        // Fill with darkness
        lctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
        lctx.fillRect(0, 0, cw, ch);

        // Create light cutout
        const radius = 200;
        const grad = lctx.createRadialGradient(screenPx, screenPy, radius * 0.1, screenPx, screenPy, radius);
        grad.addColorStop(0, 'rgba(0, 0, 0, 1)'); // Full transparent cutout
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fades to darkness

        lctx.globalCompositeOperation = 'destination-out';
        lctx.fillStyle = grad;
        lctx.beginPath();
        lctx.arc(screenPx, screenPy, radius, 0, Math.PI * 2);
        lctx.fill();

        // Draw the light layer over the main canvas
        this.ctx.globalCompositeOperation = 'source-over'; // Changed from multiply for better visibility
        this.ctx.drawImage(this.lightCanvas, 0, 0);
    }
}
