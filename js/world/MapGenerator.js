import { THEMES, TILE_SIZE } from '../data/Constants.js';

export class MapGenerator {
    static generate(floorNum) {
        const width = 40;
        const height = 40;
        let map = Array(height).fill().map(() => Array(width).fill(0));
        
        let themeKey = 'OFFICE';
        if (floorNum === 0) themeKey = 'ELEVATOR';
        else {
            const themes = Object.keys(THEMES).filter(k => k !== 'ELEVATOR' && k !== 'VOID');
            themeKey = themes[Math.floor(Math.random() * themes.length)];
        }
        
        const theme = THEMES[themeKey];
        const startX = Math.floor(width/2);
        const startY = Math.floor(height/2);
        
        // Elevator room
        for(let r=-2; r<=2; r++) {
            for(let c=-2; c<=2; c++) {
                map[startY+r][startX+c] = 2;
            }
        }
        
        // Procedural generation using a simple drunkard's walk
        if (floorNum !== 0) {
            let x = startX, y = startY;
            let steps = 200 + floorNum * 10;
            while (steps > 0) {
                map[y][x] = 2;
                const dir = Math.floor(Math.random() * 4);
                if (dir === 0) y--; else if (dir === 1) y++; else if (dir === 2) x--; else x++;
                x = Math.max(2, Math.min(width - 3, x));
                y = Math.max(2, Math.min(height - 3, y));
                steps--;
            }

            // Add walls around floors
            for (let r = 1; r < height - 1; r++) {
                for (let c = 1; c < width - 1; c++) {
                    if (map[r][c] === 2) {
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                if (map[r + dy][c + dx] === 0) map[r + dy][c + dx] = 1;
                            }
                        }
                    }
                }
            }
        }

        const items = [];
        const entities = [];
        const interactables = [{ type: 'ELEVATOR', x: (startX - 1) * TILE_SIZE, y: (startY - 1) * TILE_SIZE }];

        if (floorNum !== 0) {
            // Spawn some items and enemies
            for (let i = 0; i < 5; i++) {
                const rx = Math.floor(Math.random() * width);
                const ry = Math.floor(Math.random() * height);
                if (map[ry][rx] === 2 && Math.abs(rx - startX) > 5) {
                    items.push({ id: 'MEDKIT', x: rx * TILE_SIZE, y: ry * TILE_SIZE });
                }
            }
            
            for (let i = 0; i < 3; i++) {
                const rx = Math.floor(Math.random() * width);
                const ry = Math.floor(Math.random() * height);
                if (map[ry][rx] === 2 && Math.abs(rx - startX) > 8) {
                    entities.push({ type: 'ENEMY', x: rx * TILE_SIZE, y: ry * TILE_SIZE, speed: 1.5 });
                }
            }
        }

        return {
            map,
            theme,
            playerSpawn: { x: startX * TILE_SIZE, y: startY * TILE_SIZE },
            interactables,
            items,
            entities
        };
    }
}
