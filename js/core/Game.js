import { GAME_MODES, TILE_SIZE } from '../data/Constants.js';
import { Renderer } from './Renderer.js';
import { MapGenerator } from '../world/MapGenerator.js';

export class Game {
    constructor() {
        this.state = {
            mode: GAME_MODES.MENU,
            floorNum: 0,
            discoveredFloors: [0],
            map: null,
            theme: null,
            player: { x: 0, y: 0, vx: 0, vy: 0, speed: 4, size: 24 },
            hp: 100, maxHp: 100,
            sanity: 100, maxSanity: 100,
            inventory: [],
            interactables: [],
            items: [],
            entities: [],
            lastHit: 0
        };
        
        this.keys = {};
        this.renderer = new Renderer('game-canvas');
        this.init();
    }

    async init() {
        await this.renderer.init();
        this.setupInput();
        this.setupUI();
        // Initialize floor 0 immediately to ensure map exists
        this.travelToFloor(0);
        // Start loop
        requestAnimationFrame((t) => this.loop(t));
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === 'i' && (this.state.mode === GAME_MODES.PLAYING || this.state.mode === GAME_MODES.INVENTORY)) {
                this.toggleInventory();
            }
            if ((e.key === 'e' || e.key === ' ') && this.state.mode === GAME_MODES.PLAYING) {
                this.handleInteraction();
            }
        });
        window.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);
    }

    setupUI() {
        document.getElementById('btn-new-game').onclick = () => this.startNewGame();
    }

    startNewGame() {
        this.state.hp = 100;
        this.state.sanity = 100;
        this.state.inventory = [];
        this.travelToFloor(0);
    }

    travelToFloor(num) {
        this.state.floorNum = num;
        if (!this.state.discoveredFloors.includes(num)) this.state.discoveredFloors.push(num);
        
        const world = MapGenerator.generate(num);
        this.state.map = world.map;
        this.state.theme = world.theme;
        this.state.player.x = world.playerSpawn.x;
        this.state.player.y = world.playerSpawn.y;
        this.state.interactables = world.interactables;
        this.state.items = world.items;
        this.state.entities = world.entities;
        
        this.changeMode(GAME_MODES.PLAYING);
    }

    changeMode(mode) {
        this.state.mode = mode;
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const hud = document.getElementById('hud');
        
        if (mode === GAME_MODES.MENU) {
            document.getElementById('screen-main').classList.add('active');
            hud.style.display = 'none';
        } else {
            hud.style.display = 'flex';
            if (mode === GAME_MODES.ELEVATOR) document.getElementById('screen-elevator').classList.add('active');
            else if (mode === GAME_MODES.INVENTORY) document.getElementById('screen-inventory').classList.add('active');
        }
    }

    toggleInventory() {
        this.changeMode(this.state.mode === GAME_MODES.PLAYING ? GAME_MODES.INVENTORY : GAME_MODES.PLAYING);
    }

    handleInteraction() {
        const p = this.state.player;
        for (let obj of this.state.interactables) {
            if (obj.type === 'ELEVATOR') {
                const dist = Math.sqrt((p.x - obj.x)**2 + (p.y - obj.y)**2);
                if (dist < 64) {
                    this.changeMode(GAME_MODES.ELEVATOR);
                    this.populateElevatorPanel();
                }
            }
        }
    }

    checkCollision(x, y, size) {
        const margin = 4;
        const c1 = Math.floor((x + margin) / TILE_SIZE);
        const r1 = Math.floor((y + margin) / TILE_SIZE);
        const c2 = Math.floor((x + size - margin) / TILE_SIZE);
        const r2 = Math.floor((y + size - margin) / TILE_SIZE);

        if (r1 < 0 || r2 >= this.state.map.length || c1 < 0 || c2 >= this.state.map[0].length) return true;

        return this.state.map[r1][c1] === 1 || this.state.map[r1][c2] === 1 ||
               this.state.map[r2][c1] === 1 || this.state.map[r2][c2] === 1;
    }

    populateElevatorPanel() {
        const container = document.getElementById('floor-buttons');
        container.innerHTML = '';
        const max = Math.max(...this.state.discoveredFloors);
        for (let i = 0; i <= max + 1; i++) {
            const btn = document.createElement('button');
            btn.innerText = i === 0 ? 'H' : i;
            btn.disabled = !this.state.discoveredFloors.includes(i) && i !== max + 1;
            btn.onclick = () => this.travelToFloor(i);
            container.appendChild(btn);
        }
    }

    update(dt) {
        if (this.state.mode !== GAME_MODES.PLAYING) return;

        const p = this.state.player;
        let dx = 0, dy = 0;
        if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
        if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
        if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
        if (this.keys['d'] || this.keys['arrowright']) dx += 1;

        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx*dx + dy*dy);
            dx /= len; dy /= len;
            
            const nextX = p.x + dx * p.speed;
            const nextY = p.y + dy * p.speed;
            
            if (!this.checkCollision(nextX, p.y, p.size)) p.x = nextX;
            if (!this.checkCollision(p.x, nextY, p.size)) p.y = nextY;
        }
        p.vx = dx; p.vy = dy;

        // Enemy AI
        this.state.entities.forEach(ent => {
            if (ent.type === 'ENEMY') {
                const dist = Math.sqrt((p.x - ent.x)**2 + (p.y - ent.y)**2);
                if (dist < 200 && dist > 10) {
                    const edx = (p.x - ent.x) / dist;
                    const edy = (p.y - ent.y) / dist;
                    const enextX = ent.x + edx * ent.speed;
                    const enextY = ent.y + edy * ent.speed;
                    if (!this.checkCollision(enextX, ent.y, 24)) ent.x = enextX;
                    if (!this.checkCollision(ent.x, enextY, 24)) ent.y = enextY;
                }
                if (dist < 20 && Date.now() - this.state.lastHit > 1000) {
                    this.state.hp -= 10;
                    this.state.lastHit = Date.now();
                }
            }
        });

        // Sanity drain
        if (this.state.floorNum > 0) {
            this.state.sanity = Math.max(0, this.state.sanity - 0.01);
        }

        this.updateHUD();
    }

    updateHUD() {
        document.getElementById('hp-bar').style.width = `${this.state.hp}%`;
        document.getElementById('sanity-bar').style.width = `${this.state.sanity}%`;
        document.getElementById('floor-display').innerText = `FLOOR: ${this.state.floorNum === 0 ? 'HUB' : this.state.floorNum}`;
    }

    loop(t) {
        const dt = t - (this.lastTime || t);
        this.lastTime = t;
        this.update(dt);
        this.renderer.render(this.state);
        requestAnimationFrame((t) => this.loop(t));
    }
}
