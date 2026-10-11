import { useEffect } from 'react'
import { useProjectStore } from '../state/projectStore'

export function SelectionManager() {
  const select = useProjectStore((state) => state.select)
  useEffect(() => {
    const clear = (event: KeyboardEvent) => { if (event.key === 'Escape') select(null) }
    window.addEventListener('keydown', clear)
    return () => window.removeEventListener('keydown', clear)
  }, [select])
  return null
}
