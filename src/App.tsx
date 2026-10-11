import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ApartmentScene } from './scene/ApartmentScene'
import { FirstPersonController } from './controls/FirstPersonController'
import { EditCamera } from './controls/EditCamera'
import { ExploreOverlay } from './ui/ExploreOverlay'
import { TopBar } from './ui/TopBar'
import { PropertiesPanel } from './ui/PropertiesPanel'
import { SelectionManager } from './editor/SelectionManager'
import { FurnitureManipulator } from './editor/FurnitureManipulator'
import { useProjectStore } from './state/projectStore'

export default function App() {
  const mode = useProjectStore((state) => state.mode)
  const view = useProjectStore((state) => state.view)
  const error = useProjectStore((state) => state.error)
  const select = useProjectStore((state) => state.select)
  const setError = useProjectStore((state) => state.setError)
  return <main className={`app-shell mode-${mode} view-${view}`}>
    {mode === 'edit' && <TopBar />}
    <div className="workspace">
      <div className="scene-wrap">
        <Canvas
          id="scene-canvas"
          shadows
          dpr={[1, 1.65]}
          camera={{ fov: 48, near: 0.05, far: 90, position: [9.2, 9.5, 12.5] }}
          onPointerMissed={() => mode === 'edit' && select(null)}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <ApartmentScene />
            {mode === 'explore' ? <FirstPersonController /> : <EditCamera />}
            <SelectionManager />
            <FurnitureManipulator />
          </Suspense>
        </Canvas>
        {mode === 'edit' && <div className="scene-caption"><span>{view === 'plan' ? 'VISTA PIANTA' : 'VISTA 3D'}</span><p>{view === 'plan' ? 'Trascina gli arredi per riposizionarli' : 'Trascina per orbitare · Rotella per zoomare'}</p></div>}
      </div>
      {mode === 'edit' && <PropertiesPanel />}
    </div>
    {mode === 'explore' && <ExploreOverlay />}
    {error && <div className="error-toast" role="alert"><span>{error}</span><button aria-label="Chiudi" onClick={() => setError(null)}>×</button></div>}
  </main>
}
