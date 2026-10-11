import type { ProjectState } from '../data/defaultProject'
import { validateProjectObject } from './projectFile'

export const AUTOSAVE_KEY = 'homeplanner:project:v1'

export function saveAutosave(project: ProjectState): void {
  try { localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(project)) } catch { /* Storage may be disabled; portable files still work. */ }
}

export function loadAutosave(): ProjectState | null {
  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY)
    return saved ? validateProjectObject(JSON.parse(saved)) : null
  } catch { return null }
}

export function clearAutosave(): void {
  try { localStorage.removeItem(AUTOSAVE_KEY) } catch { /* no-op */ }
}
