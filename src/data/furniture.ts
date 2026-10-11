export interface FurnitureAssetDefinition {
  id: string
  label: string
  dimensions: [number, number, number]
  colorZones: string[]
  collision: [number, number, number]
}

export const furnitureAssets: FurnitureAssetDefinition[] = [
  { id: 'sofa-3-seat', label: 'Divano', dimensions: [2.15, 0.82, 0.9], colorZones: ['upholstery', 'legs'], collision: [2.15, 0.82, 0.9] },
  { id: 'coffee-table', label: 'Tavolino', dimensions: [1.05, 0.4, 0.58], colorZones: ['top', 'frame'], collision: [1.05, 0.4, 0.58] },
  { id: 'tv-unit', label: 'Mobile TV', dimensions: [1.55, 0.55, 0.42], colorZones: ['body', 'front'], collision: [1.55, 0.55, 0.42] },
  { id: 'dining-table', label: 'Tavolo da pranzo', dimensions: [1.55, 0.76, 0.85], colorZones: ['top', 'frame'], collision: [1.55, 0.76, 0.85] },
  { id: 'double-bed', label: 'Letto matrimoniale', dimensions: [1.7, 0.95, 2.05], colorZones: ['textile', 'frame'], collision: [1.7, 0.95, 2.05] },
  { id: 'wardrobe', label: 'Armadio', dimensions: [1.75, 2.3, 0.58], colorZones: ['body', 'front'], collision: [1.75, 2.3, 0.58] },
  { id: 'desk', label: 'Scrivania', dimensions: [1.2, 0.75, 0.58], colorZones: ['top', 'frame'], collision: [1.2, 0.75, 0.58] },
  { id: 'console', label: 'Consolle ingresso', dimensions: [1.0, 0.82, 0.34], colorZones: ['body', 'accent'], collision: [1.0, 0.82, 0.34] },
  { id: 'kitchen-run', label: 'Cucina', dimensions: [1.5, 2.15, 0.62], colorZones: ['base', 'wall', 'worktop'], collision: [1.5, 2.15, 0.62] },
  { id: 'bathroom-suite', label: 'Sanitari', dimensions: [1.1, 1.0, 0.75], colorZones: ['ceramic', 'accent'], collision: [1.1, 1.0, 0.75] },
]

export const furnitureAssetMap = Object.fromEntries(furnitureAssets.map((asset) => [asset.id, asset]))
