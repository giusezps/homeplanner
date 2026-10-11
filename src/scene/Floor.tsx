import { useProjectStore } from '../state/projectStore'
import type { RoomDefinition } from '../data/apartment'

export function Floor({ room }: { room: RoomDefinition }) {
  const color = useProjectStore((state) => state.project.floors[room.floorId]?.color ?? '#aaa49a')
  const selected = useProjectStore((state) => state.selection?.id === room.floorId)
  const select = useProjectStore((state) => state.select)
  return (
    <mesh
      position={[room.center[0], room.kind === 'balcony' ? -0.08 : -0.04, room.center[1]]}
      receiveShadow
      onClick={(event) => { event.stopPropagation(); select({ type: 'floor', id: room.floorId }) }}
    >
      <boxGeometry args={[room.size[0], 0.1, room.size[1]]} />
      <meshStandardMaterial color={color} roughness={0.82} emissive={selected ? '#2a2115' : '#000000'} />
    </mesh>
  )
}
