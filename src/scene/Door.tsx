import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { openings, pointAlongWall, walls } from '../data/apartment'
import { useProjectStore } from '../state/projectStore'

export function Door({ id }: { id: string }) {
  const group = useRef<Group>(null)
  const opening = openings.find((item) => item.id === id)!
  const wall = walls.find((item) => item.id === opening.wallId)!
  const state = useProjectStore((store) => store.project.doors[id])
  const select = useProjectStore((store) => store.select)
  const toggle = useProjectStore((store) => store.toggleDoor)
  const mode = useProjectStore((store) => store.mode)
  const angle = Math.atan2(wall.end[1] - wall.start[1], wall.end[0] - wall.start[0])
  const hingeDistance = opening.hinge === 'end' ? opening.offset + opening.width : opening.offset
  const hinge = pointAlongWall(wall, hingeDistance)
  const direction = opening.hinge === 'end' ? -1 : 1

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y = MathUtils.damp(group.current.rotation.y, direction * state.openAngle, 10, delta)
  })

  return (
    <group position={[hinge[0], 0, hinge[1]]} rotation={[0, -angle, 0]}>
      <group ref={group}>
        <mesh
          position={[direction * opening.width / 2, opening.height / 2, 0]}
          castShadow
          onClick={(event) => { event.stopPropagation(); mode === 'explore' ? toggle(id) : select({ type: 'door', id }) }}
        >
          <boxGeometry args={[opening.width, opening.height, 0.055]} />
          <meshStandardMaterial color={state.color} roughness={0.6} />
        </mesh>
        <mesh position={[direction * opening.width * 0.82, 1.03, direction * 0.045]}>
          <sphereGeometry args={[0.045, 12, 8]} /><meshStandardMaterial color="#b89a64" metalness={0.65} roughness={0.28} />
        </mesh>
      </group>
    </group>
  )
}
