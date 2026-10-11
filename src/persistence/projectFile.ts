import JSZip from 'jszip'
import { createDefaultProject, type FurnitureState, type ProjectState, type Vec3 } from '../data/defaultProject'
import { furnitureAssetMap } from '../data/furniture'

const colorPattern = /^#[0-9a-f]{6}$/i

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validVec3(value: unknown): value is Vec3 {
  return Array.isArray(value) && value.length === 3 && value.every((item) => typeof item === 'number' && Number.isFinite(item))
}

function validColor(value: unknown): value is string {
  return typeof value === 'string' && colorPattern.test(value)
}

export function validateProjectObject(input: unknown): ProjectState {
  if (!isRecord(input)) throw new Error('Il file di progetto non è valido.')
  const raw = input as Partial<ProjectState>
  if (typeof raw.formatVersion === 'number' && raw.formatVersion > 1) throw new Error('Questo progetto è stato creato con una versione più recente.')
  if (raw.formatVersion !== 1 || !isRecord(raw.wallFaces) || !isRecord(raw.floors) || !isRecord(raw.doors) || !isRecord(raw.furniture)) throw new Error('Il file di progetto non è valido.')
  const result = createDefaultProject()
  result.projectName = typeof raw.projectName === 'string' && raw.projectName.trim() ? raw.projectName.slice(0, 80) : result.projectName

  for (const id of Object.keys(result.wallFaces)) {
    const color = raw.wallFaces[id]?.color
    if (validColor(color)) result.wallFaces[id].color = color
  }
  for (const id of Object.keys(result.floors)) {
    const color = raw.floors[id]?.color
    if (validColor(color)) result.floors[id].color = color
  }
  for (const id of Object.keys(result.doors)) {
    const door = raw.doors[id]
    if (!door) continue
    if (validColor(door.color)) result.doors[id].color = door.color
    if (typeof door.openAngle === 'number' && Number.isFinite(door.openAngle)) result.doors[id].openAngle = Math.max(0, Math.min(Math.PI / 2, door.openAngle))
  }
  for (const id of Object.keys(result.furniture)) {
    const item = raw.furniture[id] as FurnitureState | undefined
    if (!item) continue
    if (!isRecord(item) || typeof item.assetId !== 'string' || !Object.hasOwn(furnitureAssetMap, item.assetId)) throw new Error('Il file di progetto non è valido.')
    const fallback = result.furniture[id]
    const itemColors = isRecord(item.colors) ? item.colors : {}
    result.furniture[id] = {
      assetId: item.assetId,
      position: validVec3(item.position) ? item.position : fallback.position,
      rotation: validVec3(item.rotation) ? item.rotation : fallback.rotation,
      scale: validVec3(item.scale) ? item.scale : fallback.scale,
      colors: Object.fromEntries(Object.entries(fallback.colors).map(([zone, color]) => [zone, validColor(itemColors[zone]) ? itemColors[zone] : color])),
    }
  }
  return result
}

export async function saveProjectFile(project: ProjectState): Promise<Uint8Array> {
  const zip = new JSZip()
  zip.file('project.json', JSON.stringify(project, null, 2))
  zip.folder('assets')
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 6 } })
}

export async function loadProjectFile(file: Blob | ArrayBuffer | Uint8Array): Promise<ProjectState> {
  try {
    const zip = await JSZip.loadAsync(file)
    const entry = zip.file('project.json')
    if (!entry) throw new Error('invalid')
    const raw = JSON.parse(await entry.async('string')) as unknown
    return validateProjectObject(raw)
  } catch (error) {
    if (error instanceof Error && (error.message === 'Questo progetto è stato creato con una versione più recente.' || error.message === 'Il file di progetto non è valido.')) throw error
    throw new Error('Il file di progetto non è valido.')
  }
}
