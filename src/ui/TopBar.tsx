import { useProjectStore } from '../state/projectStore'
import { FileMenu } from './FileMenu'

export function TopBar() {
  const mode = useProjectStore((state) => state.mode)
  const view = useProjectStore((state) => state.view)
  const fileOpen = useProjectStore((state) => state.fileMenuOpen)
  const setMode = useProjectStore((state) => state.setMode)
  const setView = useProjectStore((state) => state.setView)
  const setFileOpen = useProjectStore((state) => state.setFileMenuOpen)
  return <header className="topbar">
    <div className="brand"><span className="brand-monogram">CR</span><div><strong>Casa Rivoli</strong><small>Apartment editor</small></div></div>
    <nav className="mode-switch" aria-label="Modalità"><button className={mode === 'explore' ? 'active' : ''} onClick={() => setMode('explore')}>Esplora</button><button className={mode === 'edit' ? 'active' : ''} onClick={() => setMode('edit')}>Modifica</button></nav>
    <div className="topbar-actions">
      <div className="view-switch" aria-label="Vista"><button className={view === '3d' ? 'active' : ''} onClick={() => setView('3d')}>3D</button><button className={view === 'plan' ? 'active' : ''} onClick={() => setView('plan')}>Pianta</button></div>
      <div className="file-wrap"><button className="file-button" onClick={() => setFileOpen(!fileOpen)}>File <span>⌄</span></button>{fileOpen && <FileMenu />}</div>
    </div>
  </header>
}
