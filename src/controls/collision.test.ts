import { describe, expect, it } from 'vitest'
import { collides, resolveMovement, type CollisionBox } from './collision'
import { createCollisionBoxes } from './collision'
import { createDefaultProject } from '../data/defaultProject'
import { openings, pointAlongWall, walls } from '../data/apartment'

const wall: CollisionBox = { id: 'wall', minX: -1, maxX: 1, minZ: -0.1, maxZ: 0.1 }
const closedDoor: CollisionBox = { id: 'door', minX: 1, maxX: 1.8, minZ: -0.08, maxZ: 0.08 }
const chair: CollisionBox = { id: 'chair', minX: 2, maxX: 2.6, minZ: 2, maxZ: 2.6 }

describe('first-person collision', () => {
  it('blocks walls, closed doors and furniture', () => {
    expect(collides([0, 0], 0.22, [wall])).toBe(true)
    expect(collides([1.4, 0], 0.22, [closedDoor])).toBe(true)
    expect(collides([2.3, 2.3], 0.22, [chair])).toBe(true)
    expect(resolveMovement([0, -0.5], [0, 0], 0.22, [wall])).toEqual([0, -0.5])
  })

  it('allows traversal when an open door is omitted from obstacles', () => {
    expect(collides([1.4, 0], 0.22, [])).toBe(false)
    expect(resolveMovement([1.4, -0.5], [1.4, 0.35], 0.22, [])).toEqual([1.4, 0.35])
  })

  it('opens the real living-room passage and keeps balcony rails solid', () => {
    const project = createDefaultProject()
    project.doors['door-living-entrance'].openAngle = Math.PI / 2
    project.furniture = {}
    const boxes = createCollisionBoxes(project)
    const opening = openings.find((item) => item.id === 'door-living-entrance')!
    const openingWall = walls.find((item) => item.id === opening.wallId)!
    const passageCenter = pointAlongWall(openingWall, opening.offset + opening.width / 2)
    expect(collides(passageCenter, 0.18, boxes)).toBe(false)

    const rail = walls.find((item) => item.id === 'wall-balcony-street-rail-south')!
    const railCenter = pointAlongWall(rail, 1)
    expect(collides(railCenter, 0.18, boxes)).toBe(true)
  })
})
