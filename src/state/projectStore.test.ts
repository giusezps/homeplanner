import { beforeEach, describe, expect, it } from 'vitest'
import { defaultProject } from '../data/defaultProject'
import { useProjectStore } from './projectStore'

describe('project store', () => {
  beforeEach(() => useProjectStore.getState().newProject())

  it('switches modes and views without changing the project', () => {
    const initial = useProjectStore.getState().project
    useProjectStore.getState().setMode('edit')
    useProjectStore.getState().setView('plan')
    expect(useProjectStore.getState().mode).toBe('edit')
    expect(useProjectStore.getState().view).toBe('plan')
    expect(useProjectStore.getState().project).toBe(initial)
  })

  it('updates appearance and furniture transforms, then resets them', () => {
    const store = useProjectStore.getState()
    store.setColor('wallFace', 'wall-living-bedroom:living', '#9b6b52')
    store.updateFurnitureTransform('sofa-living-main', [2, 0, 3], [0, 1, 0])
    expect(useProjectStore.getState().project.wallFaces['wall-living-bedroom:living'].color).toBe('#9b6b52')
    expect(useProjectStore.getState().project.furniture['sofa-living-main'].position).toEqual([2, 0, 3])
    useProjectStore.getState().resetSelected('furniture', 'sofa-living-main')
    expect(useProjectStore.getState().project.furniture['sofa-living-main']).toEqual(defaultProject.furniture['sofa-living-main'])
  })
})
