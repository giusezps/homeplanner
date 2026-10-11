import { useEffect, useMemo, useRef } from 'react'
import { PointerLockControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { createCollisionBoxes, resolveMovement } from './collision'
import { useProjectStore } from '../state/projectStore'

const CAMERA_HEIGHT = 1.65
const MOVE_SPEED = 2.25

export function FirstPersonController() {
  const camera = useThree((state) => state.camera)
  const project = useProjectStore((state) => state.project)
  const keys = useRef(new Set<string>())
  const obstacles = useMemo(() => createCollisionBoxes(project), [project])
  const forward = useMemo(() => new Vector3(), [])
  const right = useMemo(() => new Vector3(), [])

  useEffect(() => {
    camera.position.set(-0.35, CAMERA_HEIGHT, 2.78)
    const down = (event: KeyboardEvent) => keys.current.add(event.code)
    const up = (event: KeyboardEvent) => keys.current.delete(event.code)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [camera])

  useFrame((_, delta) => {
    let longitudinal = 0
    let lateral = 0
    if (keys.current.has('KeyW')) longitudinal += 1
    if (keys.current.has('KeyS')) longitudinal -= 1
    if (keys.current.has('KeyD')) lateral += 1
    if (keys.current.has('KeyA')) lateral -= 1
    if (!longitudinal && !lateral) return
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    right.crossVectors(forward, camera.up).normalize()
    const velocity = forward.multiplyScalar(longitudinal).add(right.multiplyScalar(lateral)).normalize().multiplyScalar(MOVE_SPEED * Math.min(delta, 0.05))
    const next = resolveMovement([camera.position.x, camera.position.z], [camera.position.x + velocity.x, camera.position.z + velocity.z], 0.22, obstacles)
    camera.position.set(next[0], CAMERA_HEIGHT, next[1])
  })

  return <PointerLockControls selector="#scene-canvas" />
}
