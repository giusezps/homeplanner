import { useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useProjectStore } from '../state/projectStore'

export function EditCamera() {
  const camera = useThree((state) => state.camera)
  const view = useProjectStore((state) => state.view)
  const dragging = useProjectStore((state) => Boolean(state.dragDraft))
  useEffect(() => {
    if (view === 'plan') { camera.position.set(0, 14.5, 2.35); camera.lookAt(0, 0, 2.35) }
    else { camera.position.set(9.2, 9.5, 12.5); camera.lookAt(0, 0, 2.2) }
  }, [camera, view])
  return <OrbitControls makeDefault enabled={!dragging} target={[0, 0.7, 2.2]} enableRotate={view === '3d'} minDistance={4} maxDistance={22} maxPolarAngle={Math.PI / 2.04} />
}
