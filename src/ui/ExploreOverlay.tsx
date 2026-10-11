import { useState } from 'react'
import { useProjectStore } from '../state/projectStore'

export function ExploreOverlay() {
  const setMode = useProjectStore((state) => state.setMode)
  const [hintVisible, setHintVisible] = useState(true)
  return (
    <div className="explore-ui">
      <header className="explore-header"><span className="brand-mark">Casa Rivoli</span><button onClick={() => setMode('edit')}>Modifica</button></header>
      <div className="reticle" aria-hidden="true" />
      {hintVisible && <button className="control-hint" onClick={() => setHintVisible(false)}><strong>Clicca per esplorare</strong><span>WASD per muoverti · Mouse per guardare · ESC per uscire</span></button>}
    </div>
  )
}
