export type Vec3 = [number, number, number]

export interface FurnitureState {
  assetId: string
  position: Vec3
  rotation: Vec3
  scale: Vec3
  colors: Record<string, string>
}

export interface ProjectState {
  formatVersion: 1
  projectName: string
  wallFaces: Record<string, { color: string }>
  floors: Record<string, { color: string }>
  doors: Record<string, { color: string; openAngle: number }>
  furniture: Record<string, FurnitureState>
}

export const defaultProject: ProjectState = {
  formatVersion: 1,
  projectName: 'Casa Rivoli',
  wallFaces: {
    'wall-living-bedroom:living': { color: '#e8dfd1' },
    'wall-living-bedroom:bedroom': { color: '#d9d2c5' },
    'wall-living-west:living': { color: '#f3eee6' },
    'wall-living-north:living': { color: '#f3eee6' },
    'wall-bedroom-courtyard:east': { color: '#eee8dd' },
    'wall-bedroom-street:east': { color: '#eadfd3' },
    'wall-kitchen:kitchen': { color: '#f0e8da' },
    'wall-bathroom:bathroom': { color: '#e4ded2' },
  },
  floors: {
    'floor-living': { color: '#b98c62' },
    'floor-kitchen': { color: '#c7b9a3' },
    'floor-bedroom-courtyard': { color: '#b98c62' },
    'floor-bedroom-street': { color: '#b98c62' },
    'floor-bathroom': { color: '#a9a397' },
    'floor-entrance': { color: '#c3a47f' },
    'floor-balcony-courtyard': { color: '#9f9a90' },
    'floor-balcony-street': { color: '#9f9a90' },
  },
  doors: {
    'door-living-entrance': { color: '#7a5137', openAngle: 0 },
    'door-bedroom-courtyard': { color: '#7a5137', openAngle: 0 },
    'door-bedroom-street': { color: '#7a5137', openAngle: 0 },
    'door-kitchen': { color: '#7a5137', openAngle: 0 },
    'door-bathroom': { color: '#7a5137', openAngle: 0 },
  },
  furniture: {
    'sofa-living-main': { assetId: 'sofa-3-seat', position: [-2.65, 0, -0.65], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], colors: { upholstery: '#a88e72', legs: '#312922' } },
    'coffee-table-living': { assetId: 'coffee-table', position: [-1.7, 0, -0.65], rotation: [0, 0, 0], scale: [1, 1, 1], colors: { top: '#8a5d3c', frame: '#25231f' } },
    'tv-unit-living': { assetId: 'tv-unit', position: [-0.35, 0, -0.65], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], colors: { body: '#453a31', front: '#d2b998' } },
    'dining-table-living': { assetId: 'dining-table', position: [-1.3, 0, 1.3], rotation: [0, 0, 0], scale: [1, 1, 1], colors: { top: '#946b49', frame: '#25231f' } },
    'bed-bedroom-courtyard': { assetId: 'double-bed', position: [1.15, 0, -0.65], rotation: [0, 0, 0], scale: [1, 1, 1], colors: { textile: '#d7c4ab', frame: '#70503c' } },
    'wardrobe-bedroom-courtyard': { assetId: 'wardrobe', position: [3.0, 0, 1.15], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], colors: { body: '#d8c8b4', front: '#bfa98c' } },
    'bed-bedroom-street': { assetId: 'double-bed', position: [0.75, 0, 6.45], rotation: [0, 0, 0], scale: [1, 1, 1], colors: { textile: '#b7b1a1', frame: '#6e5543' } },
    'desk-bedroom-street': { assetId: 'desk', position: [-1.15, 0, 4.3], rotation: [0, 0, 0], scale: [1, 1, 1], colors: { top: '#a87b56', frame: '#27231f' } },
    'console-entrance': { assetId: 'console', position: [0.95, 0, 2.85], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], colors: { body: '#665044', accent: '#c1a076' } },
    'kitchen-units': { assetId: 'kitchen-run', position: [-2.47, 0, -3.82], rotation: [0, 0, 0], scale: [1, 1, 1], colors: { base: '#8d8a72', wall: '#d8cfbd', worktop: '#4a4742' } },
    'bathroom-suite': { assetId: 'bathroom-suite', position: [-2.47, 0, 5.25], rotation: [0, 0, 0], scale: [1, 1, 1], colors: { ceramic: '#f4f1e9', accent: '#a89988' } },
  },
}

export function createDefaultProject(): ProjectState {
  return structuredClone(defaultProject)
}
