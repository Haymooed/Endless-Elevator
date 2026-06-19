export const ITEMS = {
    MEDKIT: { id: 'MEDKIT', name: 'Rusted Medkit', type: 'consumable', desc: 'Restores 40 HP. Smells faintly of lavender and ozone.', heal: 40 },
    PILLS: { id: 'PILLS', name: 'Unmarked Pills', type: 'consumable', desc: 'Restores 30 Sanity. The bottle has no label.', sanityHeal: 30 },
    ENERGY_BAR: { id: 'ENERGY_BAR', name: 'Stale Energy Bar', type: 'consumable', desc: 'Restores 15 HP and 5 Sanity. Tastes like dust.', heal: 15, sanityHeal: 5 },
    STRANGE_COIN: { id: 'STRANGE_COIN', name: 'Heavy Coin', type: 'resource', desc: 'A cold, heavy coin with an unrecognized face.' },
    NOTE_1: { id: 'NOTE_1', name: 'Crumpled Note', type: 'lore', desc: '"Don\'t look at the walls when they breathe." Read it?' },
    NOTE_2: { id: 'NOTE_2', name: 'Maintenance Log', type: 'lore', desc: '"Elevator keeps going past the roof. Cable length mathematically impossible." Read it?' }
};

export const LORE_TEXTS = {
    NOTE_1: "I've been going down for three days. Or is it up? The numbers stopped making sense. At floor 104, I swear the building was breathing. I need to find the maintenance shaft.",
    NOTE_2: "Work order #4012: Investigate structural anomaly on floor 13. Tenant reports the hallway extends infinitely. Update: Hallway verified infinite. Sealing door. Do not report."
};
