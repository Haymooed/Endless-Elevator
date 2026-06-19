export const SPRITE_SHEETS = {
    PROTAGONIST: 'assets/sprites/protagonist%20sprite%20sheet.png',
    TILESET: 'assets/sprites/tileset%20for%20a%20liminal%20space%20office%20building%20and%20a%20creepy%20hotel.png',
    ITEMS: 'assets/sprites/pixel%20art%20RPG%20item%20icons.png',
    MONSTERS: 'assets/sprites/creepy%20liminal%20space%20monsters.png',
    NPCS: 'assets/sprites/mysterious%20NPCs%20for%20your%20game.png',
    NPCS_ALT: 'assets/sprites/mysterious%20NPCs%20for%20your%20game%202.png',
};

// Based on visual inspection, each frame is roughly 256x512 for full height
export const PROTAGONIST_FRAMES = {
    IDLE_FRONT: { x: 50, y: 50, w: 150, h: 420 },
    IDLE_FRONT_LEFT: { x: 300, y: 50, w: 150, h: 420 },
    IDLE_LEFT: { x: 550, y: 50, w: 150, h: 420 },
    IDLE_BACK: { x: 800, y: 50, w: 150, h: 420 },
    WALK_FRONT: { x: 50, y: 550, w: 150, h: 420 },
    WALK_FRONT_LEFT: { x: 300, y: 550, w: 150, h: 420 },
    WALK_LEFT: { x: 550, y: 550, w: 150, h: 420 },
    WALK_BACK: { x: 800, y: 550, w: 150, h: 420 },
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
    OFFICE_FLOOR: { x: 247, y: 75, w: 250, h: 170 },
    OFFICE_WALL: { x: 247, y: 75, w: 250, h: 80 },
    OFFICE_DESK: { x: 250, y: 265, w: 165, h: 75 },
    CHECKERED_FLOOR: { x: 588, y: 265, w: 165, h: 165 },
    ELEVATOR_DOOR: { x: 420, y: 418, w: 165, h: 180 },
    PLANT: { x: 520, y: 170, w: 60, h: 80 },
    COMPUTER: { x: 265, y: 245, w: 45, h: 45 },
};
