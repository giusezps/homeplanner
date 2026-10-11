import { useRef } from 'react'
import { clearAutosave } from '../persistence/autosave'
import { loadProjectFile, saveProjectFile } from '../persistence/projectFile'
import { useProjectStore } from '../state/projectStore'

export function FileMenu() {
  const inputRef = useRef<HTMLInputElement>(null)
  const project = useProjectStore((state) => state.project)
  const replaceProject = useProjectStore((state) => state.replaceProject)
  const resetProject = useProjectStore((state) => state.resetProject)
  const setOpen = useProjectStore((state) => state.setFileMenuOpen)
  const setError = useProjectStore((state) => state.setError)

  const download = async () => {
    const bytes = await saveProjectFile(project)
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project.projectName.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'Apartment'}.home3dproj`
    link.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  const importFile = async (file?: File) => {
    if (!file) return
    try { replaceProject(await loadProjectFile(file)); setOpen(false) }
    catch (error) { setError(error instanceof Error ? error.message : 'Impossibile aprire il progetto.') }
  }

  return <div className="file-menu" role="menu">
    <button onClick={() => { clearAutosave(); resetProject(); setOpen(false) }}><span>＋</span><div><strong>Nuovo progetto</strong><small>Riparti dall’allestimento iniziale</small></div></button>
    <button onClick={download}><span>↓</span><div><strong>Esporta progetto</strong><small>Scarica un file .home3dproj</small></div></button>
    <button onClick={() => inputRef.current?.click()}><span>↑</span><div><strong>Importa progetto</strong><small>Apri un progetto salvato</small></div></button>
    <button onClick={() => { resetProject(); setOpen(false) }}><span>↺</span><div><strong>Ripristina</strong><small>Annulla tutte le modifiche</small></div></button>
    <input ref={inputRef} type="file" accept=".home3dproj,application/zip" hidden onChange={(event) => importFile(event.target.files?.[0])} />
  </div>
}
