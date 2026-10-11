export const CEILING_HEIGHT = 2.8
export const WALL_THICKNESS = 0.18

export interface RoomDefinition {
  id: string
  label: string
  center: [number, number]
  size: [number, number]
  floorId: string
  kind?: 'interior' | 'balcony'
}

export interface WallDefinition {
  id: string
  start: [number, number]
  end: [number, number]
  thickness: number
  height: number
  faceIds: string[]
}

export interface OpeningDefinition {
  id: string
  wallId: string
  type: 'door' | 'window' | 'french-door' | 'passage'
  offset: number
  width: number
  height: number
  sillHeight?: number
  hinge?: 'start' | 'end'
}

export const rooms: RoomDefinition[] = [
  { id: 'kitchen', label: 'Cucina', center: [-2.47, -3.155], size: [1.64, 2.11], floorId: 'floor-kitchen' },
  { id: 'living', label: 'Soggiorno', center: [-1.645, 0.005], size: [3.29, 4.21], floorId: 'floor-living' },
  { id: 'bedroom-courtyard', label: 'Camera corte', center: [1.71, 0.17], size: [3.42, 4.54], floorId: 'floor-bedroom-courtyard' },
  { id: 'entrance', label: 'Ingresso', center: [-0.18, 2.79], size: [3.24, 1.36], floorId: 'floor-entrance' },
  { id: 'bedroom-street', label: 'Camera strada', center: [0.035, 5.58], size: [3.67, 4.24], floorId: 'floor-bedroom-street' },
  { id: 'bathroom', label: 'Bagno', center: [-2.47, 5.435], size: [1.34, 2.53], floorId: 'floor-bathroom' },
  { id: 'balcony-courtyard', label: 'Balcone corte', center: [0.67, -3.01], size: [4.65, 1.8], floorId: 'floor-balcony-courtyard', kind: 'balcony' },
  { id: 'balcony-street', label: 'Balcone strada', center: [0.1, 8.42], size: [4.41, 1.32], floorId: 'floor-balcony-street', kind: 'balcony' },
]

const wall = (id: string, start: [number, number], end: [number, number], faceIds: string[]): WallDefinition => ({
  id, start, end, faceIds, thickness: WALL_THICKNESS, height: CEILING_HEIGHT,
})

export const walls: WallDefinition[] = [
  wall('wall-living-west', [-3.29, -2.1], [-3.29, 2.11], ['wall-living-west:living']),
  wall('wall-living-north', [-3.29, -2.1], [0, -2.1], ['wall-living-north:living']),
  wall('wall-living-bedroom', [0, -2.1], [0, 2.11], ['wall-living-bedroom:living', 'wall-living-bedroom:bedroom']),
  wall('wall-living-entrance', [-3.29, 2.11], [0, 2.11], ['wall-living-west:living']),
  wall('wall-bedroom-courtyard-north', [0, -2.1], [3.42, -2.1], ['wall-bedroom-courtyard:east']),
  wall('wall-bedroom-courtyard-east', [3.42, -2.1], [3.42, 2.44], ['wall-bedroom-courtyard:east']),
  wall('wall-bedroom-courtyard-south', [0, 2.44], [3.42, 2.44], ['wall-bedroom-courtyard:east']),
  wall('wall-kitchen-west', [-3.29, -4.21], [-3.29, -2.1], ['wall-kitchen:kitchen']),
  wall('wall-kitchen-north', [-3.29, -4.21], [-1.65, -4.21], ['wall-kitchen:kitchen']),
  wall('wall-kitchen-east', [-1.65, -4.21], [-1.65, -2.1], ['wall-kitchen:kitchen']),
  wall('wall-entrance-east', [1.44, 2.11], [1.44, 3.47], ['wall-bedroom-street:east']),
  wall('wall-entrance-south', [-1.8, 3.47], [1.87, 3.47], ['wall-bedroom-street:east']),
  wall('wall-bedroom-street-east', [1.87, 3.47], [1.87, 7.71], ['wall-bedroom-street:east']),
  wall('wall-bedroom-street-south', [-1.8, 7.71], [1.87, 7.71], ['wall-bedroom-street:east']),
  wall('wall-bedroom-street-west', [-1.8, 3.47], [-1.8, 7.71], ['wall-bedroom-street:east']),
  wall('wall-service-west', [-3.14, 1.52], [-3.14, 6.7], ['wall-bathroom:bathroom']),
  wall('wall-service-east', [-1.8, 1.52], [-1.8, 3.47], ['wall-bathroom:bathroom']),
  wall('wall-bathroom-east', [-1.8, 4.17], [-1.8, 6.7], ['wall-bathroom:bathroom']),
  wall('wall-bathroom-south', [-3.14, 6.7], [-1.8, 6.7], ['wall-bathroom:bathroom']),
  wall('wall-balcony-courtyard-rail', [-1.65, -3.92], [3, -3.92], []),
  wall('wall-balcony-courtyard-rail-west', [-1.65, -3.92], [-1.65, -2.1], []),
  wall('wall-balcony-courtyard-rail-east', [3, -3.92], [3, -2.1], []),
  wall('wall-balcony-street-rail-south', [-2.1, 9.08], [2.3, 9.08], []),
  wall('wall-balcony-street-rail-west', [-2.1, 7.71], [-2.1, 9.08], []),
  wall('wall-balcony-street-rail-east', [2.3, 7.71], [2.3, 9.08], []),
]

export const openings: OpeningDefinition[] = [
  { id: 'door-living-entrance', wallId: 'wall-living-entrance', type: 'door', offset: 2.38, width: 0.82, height: 2.12, hinge: 'end' },
  { id: 'door-bedroom-courtyard', wallId: 'wall-bedroom-courtyard-south', type: 'door', offset: 0.12, width: 0.82, height: 2.12, hinge: 'start' },
  { id: 'door-bedroom-street', wallId: 'wall-entrance-south', type: 'door', offset: 0.18, width: 0.82, height: 2.12, hinge: 'start' },
  { id: 'door-kitchen', wallId: 'wall-kitchen-east', type: 'door', offset: 1.25, width: 0.76, height: 2.12, hinge: 'end' },
  { id: 'door-bathroom', wallId: 'wall-bathroom-east', type: 'door', offset: 1.54, width: 0.72, height: 2.12, hinge: 'start' },
  { id: 'window-kitchen', wallId: 'wall-kitchen-north', type: 'window', offset: 0.55, width: 0.72, height: 1.1, sillHeight: 1.0 },
  { id: 'window-living', wallId: 'wall-living-north', type: 'window', offset: 1.85, width: 1.05, height: 1.35, sillHeight: 0.72 },
  { id: 'window-bedroom-courtyard', wallId: 'wall-bedroom-courtyard-north', type: 'window', offset: 1.35, width: 1.05, height: 1.35, sillHeight: 0.72 },
  { id: 'french-bedroom-street', wallId: 'wall-bedroom-street-south', type: 'french-door', offset: 1.28, width: 1.25, height: 2.25 },
]

export function wallLength(definition: WallDefinition): number {
  return Math.hypot(definition.end[0] - definition.start[0], definition.end[1] - definition.start[1])
}

export function pointAlongWall(definition: WallDefinition, distance: number): [number, number] {
  const length = wallLength(definition)
  const t = distance / length
  return [definition.start[0] + (definition.end[0] - definition.start[0]) * t, definition.start[1] + (definition.end[1] - definition.start[1]) * t]
}

export function wallSegments(definition: WallDefinition): Array<{ offset: number; length: number; y: number; height: number }> {
  const related = openings.filter((opening) => opening.wallId === definition.id).sort((a, b) => a.offset - b.offset)
  const segments: Array<{ offset: number; length: number; y: number; height: number }> = []
  let cursor = 0
  for (const opening of related) {
    if (opening.offset > cursor) segments.push({ offset: cursor, length: opening.offset - cursor, y: definition.height / 2, height: definition.height })
    const sill = opening.sillHeight ?? 0
    if (sill > 0) segments.push({ offset: opening.offset, length: opening.width, y: sill / 2, height: sill })
    const top = sill + opening.height
    if (top < definition.height) segments.push({ offset: opening.offset, length: opening.width, y: top + (definition.height - top) / 2, height: definition.height - top })
    cursor = opening.offset + opening.width
  }
  const length = wallLength(definition)
  if (cursor < length) segments.push({ offset: cursor, length: length - cursor, y: definition.height / 2, height: definition.height })
  return segments
}

export const apartmentBounds = { minX: -3.35, maxX: 3.5, minZ: -4.3, maxZ: 9.15 }
