import { useMemo, useRef } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { Plane, Vector3 } from 'three'
import { useProjectStore } from '../state/projectStore'
import { furnitureAssetMap } from '../data/furniture'

interface BoxProps {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  radius?: number
}

function Box({ position, size, color }: BoxProps) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={0.66} /></mesh>
}

function FourLegs({ width, depth, height, color }: { width: number; depth: number; height: number; color: string }) {
  return <>{[-1, 1].flatMap((x) => [-1, 1].map((z) => <Box key={`${x}-${z}`} position={[x * width * 0.42, height / 2, z * depth * 0.39]} size={[0.055, height, 0.055]} color={color} />))}</>
}

function Model({ assetId, colors }: { assetId: string; colors: Record<string, string> }) {
  const asset = furnitureAssetMap[assetId]
  const [width, height, depth] = asset.dimensions
  const primary = colors[asset.colorZones[0]] ?? '#a68a70'
  const secondary = colors[asset.colorZones[1]] ?? '#3b332d'

  if (assetId === 'sofa-3-seat') return <>
    <Box position={[0, 0.23, 0]} size={[width, 0.38, depth]} color={primary} />
    <Box position={[0, 0.63, depth * 0.38]} size={[width, 0.68, 0.2]} color={primary} />
    <Box position={[-width * 0.46, 0.48, 0]} size={[0.16, 0.55, depth]} color={primary} />
    <Box position={[width * 0.46, 0.48, 0]} size={[0.16, 0.55, depth]} color={primary} />
    {[-0.67, 0, 0.67].map((x) => <Box key={x} position={[x, 0.47, -0.05]} size={[0.62, 0.13, 0.7]} color={primary} />)}
    <FourLegs width={width} depth={depth} height={0.11} color={secondary} />
  </>

  if (assetId === 'coffee-table' || assetId === 'dining-table' || assetId === 'desk') return <>
    <Box position={[0, height - 0.06, 0]} size={[width, 0.12, depth]} color={primary} />
    <FourLegs width={width} depth={depth} height={height - 0.1} color={secondary} />
    {assetId === 'dining-table' && [[-0.9, 0], [0.9, 0], [0, -0.66], [0, 0.66]].map(([x, z], index) => <group key={index} position={[x, 0, z]} rotation={[0, index > 1 ? Math.PI / 2 : 0, 0]}><Box position={[0, 0.43, 0]} size={[0.42, 0.09, 0.42]} color="#9c826a" /><Box position={[0, 0.75, 0.18]} size={[0.42, 0.6, 0.08]} color="#9c826a" /><FourLegs width={0.42} depth={0.42} height={0.4} color="#302a25" /></group>)}
  </>

  if (assetId === 'double-bed') return <>
    <Box position={[0, 0.25, 0]} size={[width, 0.38, depth]} color={secondary} />
    <Box position={[0, 0.52, 0]} size={[width - 0.08, 0.28, depth - 0.14]} color={primary} />
    <Box position={[0, 0.78, depth * 0.47]} size={[width, 0.92, 0.12]} color={secondary} />
    {[-0.42, 0.42].map((x) => <Box key={x} position={[x, 0.72, depth * 0.28]} size={[0.7, 0.14, 0.42]} color="#ede5d8" />)}
  </>

  if (assetId === 'wardrobe') return <>
    <Box position={[0, height / 2, 0]} size={[width, height, depth]} color={primary} />
    {[-0.43, 0.43].map((x) => <Box key={x} position={[x, height / 2, -depth / 2 - 0.012]} size={[0.8, height - 0.12, 0.03]} color={secondary} />)}
  </>

  if (assetId === 'kitchen-run') return <>
    <Box position={[0, 0.45, 0]} size={[width, 0.9, depth]} color={colors.base} />
    <Box position={[0, 0.94, 0]} size={[width + 0.04, 0.08, depth + 0.04]} color={colors.worktop} />
    <Box position={[0, 1.78, depth * 0.16]} size={[width, 0.72, depth * 0.62]} color={colors.wall} />
    {[-0.5, 0, 0.5].map((x) => <mesh key={x} position={[x, 0.52, -depth / 2 - 0.014]}><planeGeometry args={[0.012, 0.58]} /><meshStandardMaterial color="#332f2a" /></mesh>)}
  </>

  if (assetId === 'bathroom-suite') return <>
    <mesh position={[-0.3, 0.46, 0]} castShadow><cylinderGeometry args={[0.25, 0.2, 0.55, 20]} /><meshStandardMaterial color={primary} roughness={0.35} /></mesh>
    <Box position={[0.28, 0.38, 0.15]} size={[0.48, 0.7, 0.42]} color={primary} />
    <mesh position={[0.28, 0.76, 0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.25, 0.18, 0.12, 20]} /><meshStandardMaterial color={primary} /></mesh>
  </>

  return <>
    <Box position={[0, height / 2, 0]} size={[width, height, depth]} color={primary} />
    <Box position={[0, height * 0.55, -depth / 2 - 0.012]} size={[width * 0.88, height * 0.68, 0.025]} color={secondary} />
  </>
}

export function FurnitureItem({ id }: { id: string }) {
  const item = useProjectStore((state) => state.project.furniture[id])
  const mode = useProjectStore((state) => state.mode)
  const view = useProjectStore((state) => state.view)
  const draft = useProjectStore((state) => state.dragDraft?.id === id ? state.dragDraft.position : null)
  const selected = useProjectStore((state) => state.selection?.id === id)
  const select = useProjectStore((state) => state.select)
  const beginDrag = useProjectStore((state) => state.beginFurnitureDrag)
  const previewDrag = useProjectStore((state) => state.previewFurnitureDrag)
  const commitDrag = useProjectStore((state) => state.commitFurnitureDrag)
  const floorPlane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), [])
  const dragPoint = useRef(new Vector3())
  const grabOffset = useRef(new Vector3())
  const dragPointer = useRef<number | null>(null)
  const onClick = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); select({ type: 'furniture', id }) }
  const canDrag = mode === 'edit' && view === 'plan'
  const finishDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!canDrag || dragPointer.current !== event.pointerId) return
    event.stopPropagation()
    commitDrag()
    dragPointer.current = null
    ;(event.target as EventTarget & { releasePointerCapture?: (id: number) => void }).releasePointerCapture?.(event.pointerId)
  }
  return (
    <group
      position={draft ?? item.position}
      rotation={item.rotation}
      scale={item.scale}
      onClick={onClick}
      onPointerDown={(event) => {
        if (!canDrag || !event.ray.intersectPlane(floorPlane, dragPoint.current)) return
        event.stopPropagation()
        select({ type: 'furniture', id })
        beginDrag(id)
        dragPointer.current = event.pointerId
        grabOffset.current.set(item.position[0] - dragPoint.current.x, 0, item.position[2] - dragPoint.current.z)
        ;(event.target as EventTarget & { setPointerCapture?: (id: number) => void }).setPointerCapture?.(event.pointerId)
      }}
      onPointerMove={(event) => {
        const active = useProjectStore.getState().dragDraft
        if (!canDrag || dragPointer.current !== event.pointerId || active?.id !== id || !event.ray.intersectPlane(floorPlane, dragPoint.current)) return
        event.stopPropagation()
        previewDrag([dragPoint.current.x + grabOffset.current.x, 0, dragPoint.current.z + grabOffset.current.z])
      }}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <Model assetId={item.assetId} colors={item.colors} />
      {selected && <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.8, 0.86, 48]} /><meshBasicMaterial color="#cf8555" depthTest={false} /></mesh>}
    </group>
  )
}
