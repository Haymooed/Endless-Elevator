/**
 * Game Controller
 * Handles input, game state updates, and core game logic
 */

import { GameState, MapGenerator, ITEMS, LORE_TEXTS, MathUtil, TILE } from './gameEngine';

export class GameController {
  state: GameState;
  keys: { [key: string]: boolean } = {};
  selectedInventoryItem: string | null = null;
  onStateChange?: (state: GameState) => void;
  onNotification?: (message: string) => void;
  onDialogue?: (speaker: string, text: string, options?: string[]) => void;

  constructor(initialState: GameState) {
    this.state = initialState;
    this.setupInputListeners();
  }

  private setupInputListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      // Handle special keys
      if (e.key === 'i' || e.key === 'I') {
        this.toggleInventory();
      }
      if (e.key === 'e' || e.key === 'E') {
        this.interact();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  update() {
    if (this.state.gameOver) return;

    const { player } = this.state;

    // Handle movement input
    player.vx = 0;
    player.vy = 0;

    if (this.keys['w'] || this.keys['arrowup']) player.vy = -2;
    if (this.keys['s'] || this.keys['arrowdown']) player.vy = 2;
    if (this.keys['a'] || this.keys['arrowleft']) player.vx = -2;
    if (this.keys['d'] || this.keys['arrowright']) player.vx = 2;

    player.isMoving = Math.abs(player.vx) > 0 || Math.abs(player.vy) > 0;

    // Update player position
    player.x += player.vx;
    player.y += player.vy;

    // Collision detection with walls
    const tileX = Math.floor(player.x / TILE.SIZE);
    const tileY = Math.floor(player.y / TILE.SIZE);
    if (this.state.map[tileY] && this.state.map[tileY][tileX] === 1) {
      player.x -= player.vx;
      player.y -= player.vy;
    }

    // Clamp to map bounds
    player.x = MathUtil.clamp(player.x, 0, (this.state.map[0].length - 1) * TILE.SIZE);
    player.y = MathUtil.clamp(player.y, 0, (this.state.map.length - 1) * TILE.SIZE);

    // Update sanity over time
    this.state.sanity = Math.max(0, this.state.sanity - 0.01);

    // Check for item pickups
    for (let i = this.state.items.length - 1; i >= 0; i--) {
      const item = this.state.items[i];
      if (MathUtil.distance(player.x, player.y, item.x, item.y) < TILE.SIZE) {
        this.state.inventory.push(item.id);
        this.state.items.splice(i, 1);
        this.onNotification?.(`Picked up: ${(ITEMS as any)[item.id]?.name || 'Unknown'}`);
      }
    }

    // Check for enemy collisions
    for (let ent of this.state.entities) {
      if (ent.type === 'ENEMY' && MathUtil.distance(player.x, player.y, ent.x, ent.y) < TILE.SIZE * 2) {
        this.takeDamage(10);
        this.onNotification?.('Attacked by entity!');
      }
    }

    // Game over condition
    if (this.state.hp <= 0) {
      this.state.gameOver = true;
      this.onNotification?.('Signal lost...');
    }

    this.onStateChange?.(this.state);
  }

  private takeDamage(amount: number) {
    this.state.hp -= amount;
    this.state.lastHit = Date.now();
    this.state.sanity -= amount * 0.5;
  }

  private interact() {
    const { player, interactables } = this.state;

    // Check for nearby interactables
    for (let obj of interactables) {
      if (MathUtil.distance(player.x, player.y, obj.x, obj.y) < TILE.SIZE * 2) {
        if (obj.type === 'ELEVATOR') {
          this.ascendFloor();
        }
      }
    }

    // Check for nearby NPCs
    for (let ent of this.state.entities) {
      if (ent.type === 'NPC' && MathUtil.distance(player.x, player.y, ent.x, ent.y) < TILE.SIZE * 2) {
        const dialogue = ent.dialog?.[Math.floor(Math.random() * ent.dialog.length)] || '...';
        this.onDialogue?.(ent.name || 'Unknown', dialogue);
      }
    }
  }

  private ascendFloor() {
    const newFloor = this.state.floor + 1;
    const world = MapGenerator.generate(newFloor);

    this.state.floor = newFloor;
    this.state.map = world.map;
    this.state.player.x = world.playerSpawn.x;
    this.state.player.y = world.playerSpawn.y;
    this.state.entities = world.entities;
    this.state.items = world.items;
    this.state.interactables = world.interactables;
    this.state.theme = world.theme;
    this.state.discoveredFloors.add(newFloor);

    // Sanity penalty for ascending
    this.state.sanity = Math.max(0, this.state.sanity - 5);

    this.onNotification?.(`Ascended to floor ${newFloor}`);
    this.onStateChange?.(this.state);
  }

  private toggleInventory() {
    this.onNotification?.('Inventory toggled');
  }

  useItem(itemId: string) {
    const itemDef = (ITEMS as any)[itemId];
    if (!itemDef) return;

    if (itemDef.heal) {
      this.state.hp = Math.min(this.state.maxHp, this.state.hp + itemDef.heal);
    }
    if (itemDef.sanityHeal) {
      this.state.sanity = Math.min(this.state.maxSanity, this.state.sanity + itemDef.sanityHeal);
    }

    // Remove from inventory
    const idx = this.state.inventory.indexOf(itemId);
    if (idx >= 0) {
      this.state.inventory.splice(idx, 1);
    }

    this.onNotification?.(`Used: ${itemDef.name}`);
    this.onStateChange?.(this.state);
  }

  readNote(itemId: string) {
    const text = (LORE_TEXTS as any)[itemId];
    if (text) {
      this.onDialogue?.('Journal Entry', text);
    }
  }

  saveGame() {
    const saveData = {
      floor: this.state.floor,
      hp: this.state.hp,
      sanity: this.state.sanity,
      inventory: this.state.inventory,
      discoveredFloors: Array.from(this.state.discoveredFloors),
    };
    localStorage.setItem('endless_elevator_save', JSON.stringify(saveData));
    this.onNotification?.('Game saved');
  }

  loadGame(): boolean {
    const saveData = localStorage.getItem('endless_elevator_save');
    if (!saveData) return false;

    try {
      const data = JSON.parse(saveData);
      this.state.floor = data.floor;
      this.state.hp = data.hp;
      this.state.sanity = data.sanity;
      this.state.inventory = data.inventory;
      this.state.discoveredFloors = new Set(data.discoveredFloors);

      // Regenerate world for current floor
      const world = MapGenerator.generate(this.state.floor);
      this.state.map = world.map;
      this.state.player.x = world.playerSpawn.x;
      this.state.player.y = world.playerSpawn.y;
      this.state.entities = world.entities;
      this.state.items = world.items;
      this.state.interactables = world.interactables;
      this.state.theme = world.theme;

      return true;
    } catch (e) {
      console.error('Failed to load game:', e);
      return false;
    }
  }
}
