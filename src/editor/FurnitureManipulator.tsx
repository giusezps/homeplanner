import { useEffect } from 'react'
import { useProjectStore } from '../state/projectStore'

export function FurnitureManipulator() {
  const commit = useProjectStore((state) => state.commitFurnitureDrag)
  useEffect(() => {
    const finish = () => { if (useProjectStore.getState().dragDraft) commit() }
    window.addEventListener('pointerup', finish)
    return () => window.removeEventListener('pointerup', finish)
  }, [commit])
  return null
}
