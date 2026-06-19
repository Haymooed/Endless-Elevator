export const TILE_SIZE = 32;

export const GAME_MODES = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    ELEVATOR: 'ELEVATOR',
    INVENTORY: 'INVENTORY',
    DIALOGUE: 'DIALOGUE',
    DEAD: 'DEAD'
};

export const THEMES = {
    ELEVATOR: { name: "Elevator", bg: '#2a2a2a', wall: '#404040', floor: '#1a1a1a', ambient: 'hum', light: 1.0, color: [200, 200, 220] },
    OFFICE: { name: "Abandoned Office", bg: '#111', wall: '#cccccc', floor: '#4a5a6a', ambient: 'vent', light: 0.8, color: [240, 240, 255] },
    HOTEL: { name: "The Grand Hotel", bg: '#201010', wall: '#8b0000', floor: '#daa520', ambient: 'soft', light: 0.7, color: [255, 200, 150] },
    GARDEN: { name: "Overgrown Rooftop", bg: '#051005', wall: '#2d5a27', floor: '#1a3317', ambient: 'wind', light: 0.9, color: [180, 255, 180] },
    HOSPITAL: { name: "Sterile Ward", bg: '#ffffff', wall: '#e0eaf5', floor: '#c0d0e0', ambient: 'buzz', light: 0.6, color: [200, 255, 255] },
    BASEMENT: { name: "Waterlogged Basement", bg: '#000', wall: '#202020', floor: '#102030', ambient: 'drip', light: 0.3, color: [100, 150, 255] },
    VOID: { name: "The Void", bg: '#000', wall: '#050505', floor: '#000000', ambient: 'static', light: 0.1, color: [50, 50, 50], glitch: true },
    FLESH: { name: "Living Walls", bg: '#300000', wall: '#601010', floor: '#400505', ambient: 'heartbeat', light: 0.4, color: [255, 50, 50], pulse: true }
};
