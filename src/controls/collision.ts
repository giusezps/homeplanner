import type { ProjectState } from '../data/defaultProject'
import { furnitureAssetMap } from '../data/furniture'
import { openings, pointAlongWall, walls, wallLength, wallSegments } from '../data/apartment'

export interface CollisionBox { id: string; minX: number; maxX: number; minZ: number; maxZ: number }
export type Point2 = [number, number]

export function collides(point: Point2, radius: number, obstacles: CollisionBox[]): boolean {
  return obstacles.some((box) => point[0] + radius > box.minX && point[0] - radius < box.maxX && point[1] + radius > box.minZ && point[1] - radius < box.maxZ)
}

export function resolveMovement(current: Point2, desired: Point2, radius: number, obstacles: CollisionBox[]): Point2 {
  if (!collides(desired, radius, obstacles)) return desired
  const alongX: Point2 = [desired[0], current[1]]
  if (!collides(alongX, radius, obstacles)) return alongX
  const alongZ: Point2 = [current[0], desired[1]]
  if (!collides(alongZ, radius, obstacles)) return alongZ
  return current
}

function boxAroundLine(id: string, start: Point2, end: Point2, thickness: number): CollisionBox {
  const half = thickness / 2
  return { id, minX: Math.min(start[0], end[0]) - half, maxX: Math.max(start[0], end[0]) + half, minZ: Math.min(start[1], end[1]) - half, maxZ: Math.max(start[1], end[1]) + half }
}

export function createCollisionBoxes(project: ProjectState): CollisionBox[] {
  const boxes = walls.flatMap((wall) => wallSegments(wall)
    .filter((segment) => segment.y - segment.height / 2 < 1.75)
    .map((segment, index) => boxAroundLine(`${wall.id}:${index}`, pointAlongWall(wall, segment.offset), pointAlongWall(wall, segment.offset + segment.length), wall.thickness)))
  for (const opening of openings.filter((item) => item.type === 'door')) {
    if ((project.doors[opening.id]?.openAngle ?? 0) > Math.PI / 4) continue
    const wall = walls.find((item) => item.id === opening.wallId)!
    const start = pointAlongWall(wall, opening.offset)
    const end = pointAlongWall(wall, opening.offset + opening.width)
    boxes.push(boxAroundLine(opening.id, start, end, 0.1))
  }
  for (const [id, item] of Object.entries(project.furniture)) {
    const asset = furnitureAssetMap[item.assetId]
    if (!asset) continue
    const angle = item.rotation[1]
    const width = Math.abs(Math.cos(angle)) * asset.collision[0] + Math.abs(Math.sin(angle)) * asset.collision[2]
    const depth = Math.abs(Math.sin(angle)) * asset.collision[0] + Math.abs(Math.cos(angle)) * asset.collision[2]
    boxes.push({ id, minX: item.position[0] - width / 2, maxX: item.position[0] + width / 2, minZ: item.position[2] - depth / 2, maxZ: item.position[2] + depth / 2 })
  }
  return boxes
}

export function doorCollisionBox(id: string): CollisionBox | null {
  const opening = openings.find((item) => item.id === id)
  const wall = opening && walls.find((item) => item.id === opening.wallId)
  if (!opening || !wall) return null
  const start = pointAlongWall(wall, opening.offset)
  const end = pointAlongWall(wall, Math.min(wallLength(wall), opening.offset + opening.width))
  return boxAroundLine(id, start, end, 0.1)
}
