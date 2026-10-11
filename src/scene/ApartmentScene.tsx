import { Environment, ContactShadows } from '@react-three/drei'
import { openings, rooms, walls } from '../data/apartment'
import { useProjectStore } from '../state/projectStore'
import { Door } from './Door'
import { Floor } from './Floor'
import { Wall } from './Wall'
import { Furniture } from './Furniture'

function WindowFrame({ openingId }: { openingId: string }) {
  const opening = openings.find((item) => item.id === openingId)!
  const wall = walls.find((item) => item.id === opening.wallId)!
  const angle = Math.atan2(wall.end[1] - wall.start[1], wall.end[0] - wall.start[0])
  const length = Math.hypot(wall.end[0] - wall.start[0], wall.end[1] - wall.start[1])
  const t = (opening.offset + opening.width / 2) / length
  const x = wall.start[0] + (wall.end[0] - wall.start[0]) * t
  const z = wall.start[1] + (wall.end[1] - wall.start[1]) * t
  const y = (opening.sillHeight ?? 0) + opening.height / 2
  return (
    <group position={[x, y, z]} rotation={[0, -angle, 0]}>
      <mesh><boxGeometry args={[opening.width, opening.height, 0.035]} /><meshPhysicalMaterial color="#9eb6ba" transparent opacity={0.32} roughness={0.12} transmission={0.2} /></mesh>
      {[-1, 1].map((side) => <mesh key={side} position={[side * opening.width / 2, 0, 0]}><boxGeometry args={[0.055, opening.height + 0.06, 0.075]} /><meshStandardMaterial color="#e7e0d5" /></mesh>)}
      <mesh><boxGeometry args={[opening.width + 0.06, 0.055, 0.075]} /><meshStandardMaterial color="#e7e0d5" /></mesh>
    </group>
  )
}

export function ApartmentScene() {
  const mode = useProjectStore((state) => state.mode)
  return (
    <>
      <color attach="background" args={['#d9d3c8']} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[-5, 10, -4]} intensity={2.1} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-1, 2.35, 1]} intensity={16} distance={8} color="#ffd9aa" />
      <group>
        {rooms.map((room) => <Floor key={room.id} room={room} />)}
        {walls.map((definition) => <Wall key={definition.id} wall={definition} />)}
        {openings.filter((opening) => opening.type === 'door').map((opening) => <Door key={opening.id} id={opening.id} />)}
        {openings.filter((opening) => opening.type === 'window' || opening.type === 'french-door').map((opening) => <WindowFrame key={opening.id} openingId={opening.id} />)}
        <Furniture />
        {mode === 'explore' && <mesh position={[0.1, 2.82, 1.8]}><boxGeometry args={[6.7, 0.08, 11.75]} /><meshStandardMaterial color="#f3eee5" side={2} /></mesh>}
      </group>
      <ContactShadows position={[0, -0.01, 1.5]} opacity={0.32} scale={16} blur={2.4} far={4} />
      <Environment preset="apartment" environmentIntensity={0.35} />
    </>
  )
}
