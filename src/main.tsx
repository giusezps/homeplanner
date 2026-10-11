import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { loadAutosave, saveAutosave } from './persistence/autosave'
import { useProjectStore } from './state/projectStore'

const saved = loadAutosave()
if (saved) useProjectStore.getState().replaceProject(saved)

let autosaveTimer: ReturnType<typeof setTimeout> | undefined
useProjectStore.subscribe((state, previous) => {
  if (state.project === previous.project) return
  clearTimeout(autosaveTimer)
  autosaveTimer = setTimeout(() => saveAutosave(state.project), 350)
})

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
