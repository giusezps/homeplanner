import { useMemo } from 'react'
import type { WallDefinition } from '../data/apartment'
import { pointAlongWall, wallLength, wallSegments } from '../data/apartment'
import { useProjectStore } from '../state/projectStore'

export function Wall({ wall }: { wall: WallDefinition }) {
  const selection = useProjectStore((state) => state.selection)
  const select = useProjectStore((state) => state.select)
  const appearances = useProjectStore((state) => state.project.wallFaces)
  const length = wallLength(wall)
  const angle = Math.atan2(wall.end[1] - wall.start[1], wall.end[0] - wall.start[0])
  const normal: [number, number] = [-Math.sin(angle), Math.cos(angle)]
  const segments = useMemo(() => wallSegments(wall), [wall])
  const isRailing = wall.id.includes('rail')

  if (isRailing) {
    const midpoint = pointAlongWall(wall, length / 2)
    return (
      <group>
        <mesh position={[midpoint[0], 0.52, midpoint[1]]} rotation={[0, -angle, 0]} castShadow>
          <boxGeometry args={[length, 0.08, 0.06]} /><meshStandardMaterial color="#514b43" metalness={0.35} />
        </mesh>
        {Array.from({ length: Math.max(2, Math.ceil(length / 0.6)) + 1 }).map((_, index, all) => {
          const point = pointAlongWall(wall, (index / (all.length - 1)) * length)
          return <mesh key={index} position={[point[0], 0.25, point[1]]}><boxGeometry args={[0.04, 0.55, 0.04]} /><meshStandardMaterial color="#514b43" metalness={0.35} /></mesh>
        })}
      </group>
    )
  }

  return (
    <group>
      {segments.map((segment, index) => {
        const midpoint = pointAlongWall(wall, segment.offset + segment.length / 2)
        return (
          <group key={`${wall.id}-${index}`}>
            <mesh position={[midpoint[0], segment.y, midpoint[1]]} rotation={[0, -angle, 0]} castShadow receiveShadow>
              <boxGeometry args={[segment.length, segment.height, wall.thickness - 0.025]} />
              <meshStandardMaterial color="#c9c1b5" roughness={0.9} />
            </mesh>
            {wall.faceIds.map((faceId, faceIndex) => {
              const side = faceIndex === 0 ? 1 : -1
              const offset = wall.thickness / 2 + 0.003
              const color = appearances[faceId]?.color ?? '#ece6dc'
              const selected = selection?.id === faceId
              return (
                <mesh
                  key={faceId}
                  position={[midpoint[0] + normal[0] * offset * side, segment.y, midpoint[1] + normal[1] * offset * side]}
                  rotation={[0, -angle, 0]}
                  onClick={(event) => { event.stopPropagation(); select({ type: 'wallFace', id: faceId }) }}
                >
                  <boxGeometry args={[segment.length, segment.height, 0.012]} />
                  <meshStandardMaterial color={color} roughness={0.92} emissive={selected ? '#302317' : '#000000'} />
                </mesh>
              )
            })}
          </group>
        )
      })}
    </group>
  )
}
