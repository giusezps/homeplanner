import JSZip from 'jszip'
import { describe, expect, it } from 'vitest'
import { createDefaultProject } from '../data/defaultProject'
import { loadProjectFile, saveProjectFile } from './projectFile'

describe('portable project files', () => {
  it('round-trips editable state and ignores unknown saved IDs', async () => {
    const project = createDefaultProject()
    project.wallFaces['wall-living-bedroom:living'].color = '#112233'
    project.doors['door-kitchen'].openAngle = Math.PI / 2
    project.furniture['sofa-living-main'].position = [1, 0, 2]
    ;(project.wallFaces as Record<string, { color: string }>).unknown = { color: '#ffffff' }
    const archive = await saveProjectFile(project)
    const loaded = await loadProjectFile(archive)
    expect(loaded.wallFaces['wall-living-bedroom:living'].color).toBe('#112233')
    expect(loaded.doors['door-kitchen'].openAngle).toBe(Math.PI / 2)
    expect(loaded.furniture['sofa-living-main'].position).toEqual([1, 0, 2])
    expect(loaded.wallFaces.unknown).toBeUndefined()
  })

  it('rejects newer and malformed projects', async () => {
    const newer = new JSZip()
    newer.file('project.json', JSON.stringify({ ...createDefaultProject(), formatVersion: 2 }))
    await expect(loadProjectFile(await newer.generateAsync({ type: 'uint8array' }))).rejects.toThrow('Questo progetto è stato creato con una versione più recente.')
    const malformed = new JSZip()
    malformed.file('project.json', '{broken')
    await expect(loadProjectFile(await malformed.generateAsync({ type: 'uint8array' }))).rejects.toThrow('Il file di progetto non è valido.')
  })

  it('rejects invalid collection shapes and inherited asset names', async () => {
    const invalidCollections = new JSZip()
    invalidCollections.file('project.json', JSON.stringify({ formatVersion: 1, projectName: 'Bad', wallFaces: true, floors: true, doors: true, furniture: true }))
    await expect(loadProjectFile(await invalidCollections.generateAsync({ type: 'uint8array' }))).rejects.toThrow('Il file di progetto non è valido.')

    const poisoned = createDefaultProject()
    poisoned.furniture['sofa-living-main'].assetId = 'constructor'
    const inheritedAsset = new JSZip()
    inheritedAsset.file('project.json', JSON.stringify(poisoned))
    await expect(loadProjectFile(await inheritedAsset.generateAsync({ type: 'uint8array' }))).rejects.toThrow('Il file di progetto non è valido.')
  })
})
