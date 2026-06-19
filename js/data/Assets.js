export const SPRITE_SHEETS = {
    PROTAGONIST: 'assets/sprites/protagonist sprite sheet.png',
    TILESET: 'assets/sprites/tileset for a liminal space office building and a creepy hotel.png',
    ITEMS: 'assets/sprites/pixel art RPG item icons.png',
    MONSTERS: 'assets/sprites/creepy liminal space monsters.png',
    NPCS: 'assets/sprites/mysterious NPCs for your game.png',
    NPCS_ALT: 'assets/sprites/mysterious NPCs for your game 2.png',
};

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

export const ITEM_FRAMES = {
    MEDKIT: { x: 0, y: 0, w: 256, h: 256 },
    PILLS: { x: 512, y: 0, w: 256, h: 256 },
    ENERGY_BAR: { x: 0, y: 256, w: 512, h: 256 },
    COIN: { x: 512, y: 256, w: 256, h: 256 },
    NOTE: { x: 512, y: 512, w: 256, h: 256 },
};

export const MONSTER_FRAMES = {
    GHOST_1: { x: 0, y: 0, w: 170, h: 200 },
    GHOST_2: { x: 170, y: 0, w: 170, h: 200 },
    GHOST_3: { x: 340, y: 0, w: 170, h: 200 },
    WRAITH_1: { x: 510, y: 0, w: 170, h: 200 },
    WRAITH_2: { x: 680, y: 0, w: 170, h: 200 },
    WRAITH_3: { x: 850, y: 0, w: 170, h: 200 },
    PHANTOM_1: { x: 0, y: 200, w: 170, h: 200 },
    ENTITY_1: { x: 510, y: 200, w: 170, h: 200 },
    SHADOW_1: { x: 0, y: 400, w: 170, h: 200 },
    GLITCH_1: { x: 0, y: 600, w: 170, h: 200 },
};

export const NPC_FRAMES = {
    JANITOR_FRONT: { x: 0, y: 0, w: 340, h: 512 },
    BELLHOP_FRONT: { x: 340, y: 0, w: 340, h: 512 },
    SUITED_FRONT: { x: 680, y: 0, w: 340, h: 512 },
    JANITOR_BACK: { x: 0, y: 512, w: 340, h: 512 },
};

export const TILESET_FRAMES = {
    OFFICE_WALL_TOP: { x: 250, y: 80, w: 440, h: 90 },
    OFFICE_FLOOR: { x: 250, y: 250, w: 440, h: 200 },
    OFFICE_DESK: { x: 250, y: 250, w: 440, h: 150 },
    HOTEL_WALL: { x: 770, y: 80, w: 180, h: 400 },
    HOTEL_FLOOR: { x: 250, y: 420, w: 440, h: 200 },
    PLANT: { x: 250, y: 250, w: 100, h: 150 },
    ELEVATOR_DOOR: { x: 250, y: 420, w: 150, h: 200 },
};
