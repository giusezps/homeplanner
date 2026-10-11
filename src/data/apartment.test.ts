import { describe, expect, it } from 'vitest'
import { CEILING_HEIGHT, openings, rooms, walls, wallLength } from './apartment'

describe('apartment geometry', () => {
  it('uses stable unique IDs and valid dimensions', () => {
    expect(CEILING_HEIGHT).toBe(2.8)
    expect(new Set(walls.map((wall) => wall.id)).size).toBe(walls.length)
    expect(walls.every((wall) => wallLength(wall) > 0 && wall.height === 2.8)).toBe(true)
    expect(rooms.find((room) => room.id === 'living')?.size).toEqual([3.29, 4.21])
    expect(rooms.find((room) => room.id === 'bedroom-courtyard')?.size).toEqual([3.42, 4.54])
  })

  it('keeps every opening attached to a known wall', () => {
    const wallIds = new Set(walls.map((wall) => wall.id))
    expect(openings.every((opening) => wallIds.has(opening.wallId))).toBe(true)
    expect(openings.filter((opening) => opening.type === 'door').length).toBeGreaterThanOrEqual(5)
  })
})
