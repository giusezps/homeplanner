import { create } from 'zustand'
import { createDefaultProject, defaultProject, type ProjectState, type Vec3 } from '../data/defaultProject'

export type AppMode = 'explore' | 'edit'
export type EditView = '3d' | 'plan'
export type SelectionType = 'wallFace' | 'floor' | 'door' | 'furniture'
export interface Selection { type: SelectionType; id: string }

interface ProjectStore {
  project: ProjectState
  mode: AppMode
  view: EditView
  selection: Selection | null
  fileMenuOpen: boolean
  error: string | null
  dragDraft: { id: string; position: Vec3 } | null
  setMode: (mode: AppMode) => void
  setView: (view: EditView) => void
  select: (selection: Selection | null) => void
  setFileMenuOpen: (open: boolean) => void
  setError: (error: string | null) => void
  setColor: (type: SelectionType, id: string, color: string, zone?: string) => void
  updateFurnitureTransform: (id: string, position: Vec3, rotation: Vec3) => void
  beginFurnitureDrag: (id: string) => void
  previewFurnitureDrag: (position: Vec3) => void
  commitFurnitureDrag: () => void
  toggleDoor: (id: string) => void
  resetSelected: (type: SelectionType, id: string) => void
  replaceProject: (project: ProjectState) => void
  newProject: () => void
  resetProject: () => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: createDefaultProject(),
  mode: 'edit',
  view: '3d',
  selection: null,
  fileMenuOpen: false,
  error: null,
  dragDraft: null,
  setMode: (mode) => set({ mode, selection: null, fileMenuOpen: false }),
  setView: (view) => set({ view }),
  select: (selection) => set({ selection }),
  setFileMenuOpen: (fileMenuOpen) => set({ fileMenuOpen }),
  setError: (error) => set({ error }),
  setColor: (type, id, color, zone) => set((state) => {
    const project = structuredClone(state.project)
    if (type === 'wallFace' && project.wallFaces[id]) project.wallFaces[id].color = color
    if (type === 'floor' && project.floors[id]) project.floors[id].color = color
    if (type === 'door' && project.doors[id]) project.doors[id].color = color
    if (type === 'furniture' && project.furniture[id]) {
      const key = zone ?? Object.keys(project.furniture[id].colors)[0]
      if (key) project.furniture[id].colors[key] = color
    }
    return { project }
  }),
  updateFurnitureTransform: (id, position, rotation) => set((state) => {
    if (!state.project.furniture[id]) return state
    const project = structuredClone(state.project)
    project.furniture[id].position = position
    project.furniture[id].rotation = rotation
    return { project }
  }),
  beginFurnitureDrag: (id) => set((state) => state.project.furniture[id] ? { dragDraft: { id, position: [...state.project.furniture[id].position] } } : state),
  previewFurnitureDrag: (position) => set((state) => state.dragDraft ? { dragDraft: { ...state.dragDraft, position } } : state),
  commitFurnitureDrag: () => set((state) => {
    if (!state.dragDraft || !state.project.furniture[state.dragDraft.id]) return { dragDraft: null }
    const project = structuredClone(state.project)
    project.furniture[state.dragDraft.id].position = state.dragDraft.position
    return { project, dragDraft: null }
  }),
  toggleDoor: (id) => set((state) => {
    if (!state.project.doors[id]) return state
    const project = structuredClone(state.project)
    project.doors[id].openAngle = project.doors[id].openAngle > 0 ? 0 : Math.PI / 2
    return { project }
  }),
  resetSelected: (type, id) => set((state) => {
    const project = structuredClone(state.project)
    if (type === 'wallFace' && defaultProject.wallFaces[id]) project.wallFaces[id] = structuredClone(defaultProject.wallFaces[id])
    if (type === 'floor' && defaultProject.floors[id]) project.floors[id] = structuredClone(defaultProject.floors[id])
    if (type === 'door' && defaultProject.doors[id]) project.doors[id] = structuredClone(defaultProject.doors[id])
    if (type === 'furniture' && defaultProject.furniture[id]) project.furniture[id] = structuredClone(defaultProject.furniture[id])
    return { project }
  }),
  replaceProject: (project) => set({ project: structuredClone(project), selection: null, error: null }),
  newProject: () => set({ project: createDefaultProject(), selection: null, error: null }),
  resetProject: () => set({ project: createDefaultProject(), selection: null, error: null }),
}))

export type { ProjectState }
