import { describe, expect, it } from 'vitest'
import { defaultProject } from './defaultProject'
import { furnitureAssets } from './furniture'

describe('default furniture', () => {
  it('has unique known assets and finite transforms', () => {
    expect(new Set(furnitureAssets.map((asset) => asset.id)).size).toBe(furnitureAssets.length)
    const assetIds = new Set(furnitureAssets.map((asset) => asset.id))
    for (const item of Object.values(defaultProject.furniture)) {
      expect(assetIds.has(item.assetId)).toBe(true)
      expect([...item.position, ...item.rotation, ...item.scale].every(Number.isFinite)).toBe(true)
    }
  })

  it('furnishes all primary functions', () => {
    const ids = Object.keys(defaultProject.furniture)
    expect(ids.some((id) => id.includes('sofa'))).toBe(true)
    expect(ids.some((id) => id.includes('kitchen'))).toBe(true)
    expect(ids.filter((id) => id.includes('bed-')).length).toBe(2)
    expect(ids.some((id) => id.includes('bathroom'))).toBe(true)
  })
})
