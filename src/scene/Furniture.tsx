import { useProjectStore } from '../state/projectStore'
import { FurnitureItem } from './FurnitureItem'

export function Furniture() {
  const furniture = useProjectStore((state) => state.project.furniture)
  return <group>{Object.keys(furniture).map((id) => <FurnitureItem key={id} id={id} />)}</group>
}
