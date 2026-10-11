import { furnitureAssetMap } from '../data/furniture'
import { useProjectStore, type SelectionType } from '../state/projectStore'

const zoneLabels: Record<string, string> = {
  upholstery: 'Rivestimento', legs: 'Gambe', top: 'Piano', frame: 'Struttura', body: 'Corpo', front: 'Frontali',
  textile: 'Tessuto', base: 'Basi', wall: 'Pensili', worktop: 'Piano di lavoro', ceramic: 'Ceramica', accent: 'Dettagli',
}
const typeLabels: Record<SelectionType, string> = { wallFace: 'Parete', floor: 'Pavimento', door: 'Porta', furniture: 'Arredo' }
const palette = ['#f3eee6', '#ded2bd', '#c7b59b', '#a88e72', '#8f8c76', '#9b6b52', '#6f7b65', '#403933']

export function PropertiesPanel() {
  const selection = useProjectStore((state) => state.selection)
  const project = useProjectStore((state) => state.project)
  const setColor = useProjectStore((state) => state.setColor)
  const reset = useProjectStore((state) => state.resetSelected)
  const updateTransform = useProjectStore((state) => state.updateFurnitureTransform)
  const toggleDoor = useProjectStore((state) => state.toggleDoor)

  if (!selection) return <aside className="properties-panel empty"><div className="panel-kicker">Proprietà</div><div className="empty-icon">⌁</div><h2>Seleziona un elemento</h2><p>Scegli una parete, un pavimento, una porta o un arredo nella scena.</p></aside>

  const furniture = selection.type === 'furniture' ? project.furniture[selection.id] : null
  const asset = furniture ? furnitureAssetMap[furniture.assetId] : null
  const title = asset?.label ?? typeLabels[selection.type]
  const colors = furniture?.colors ?? {
    color: selection.type === 'wallFace' ? project.wallFaces[selection.id]?.color : selection.type === 'floor' ? project.floors[selection.id]?.color : project.doors[selection.id]?.color,
  }

  return (
    <aside className="properties-panel">
      <div className="panel-kicker">{typeLabels[selection.type]}</div>
      <h2>{title}</h2>
      <p className="object-id">{selection.id}</p>
      <section><h3>Colore</h3>{Object.entries(colors).map(([zone, color]) => <div className="color-field" key={zone}>
        <label htmlFor={`color-${zone}`}>{zoneLabels[zone] ?? 'Colore'}</label>
        <div className="color-input-wrap"><input id={`color-${zone}`} aria-label={zoneLabels[zone] ?? 'Colore'} type="color" value={color ?? '#ffffff'} onChange={(event) => setColor(selection.type, selection.id, event.target.value, furniture ? zone : undefined)} /><code>{color}</code></div>
        <div className="swatches">{palette.map((swatch) => <button key={swatch} aria-label={`Imposta ${swatch}`} style={{ background: swatch }} onClick={() => setColor(selection.type, selection.id, swatch, furniture ? zone : undefined)} />)}</div>
      </div>)}</section>
      {furniture && <section><h3>Posizione</h3><div className="coordinate-grid">
        <label>X<input type="number" step="0.1" value={furniture.position[0].toFixed(2)} onChange={(event) => updateTransform(selection.id, [Number(event.target.value), 0, furniture.position[2]], furniture.rotation)} /></label>
        <label>Z<input type="number" step="0.1" value={furniture.position[2].toFixed(2)} onChange={(event) => updateTransform(selection.id, [furniture.position[0], 0, Number(event.target.value)], furniture.rotation)} /></label>
      </div><label className="range-label">Rotazione <span>{Math.round(furniture.rotation[1] * 180 / Math.PI)}°</span><input type="range" min="-180" max="180" step="15" value={Math.round(furniture.rotation[1] * 180 / Math.PI)} onChange={(event) => updateTransform(selection.id, furniture.position, [0, Number(event.target.value) * Math.PI / 180, 0])} /></label><p className="field-note">In vista Pianta puoi trascinare direttamente l’arredo.</p></section>}
      {selection.type === 'door' && <button className="secondary-action" onClick={() => toggleDoor(selection.id)}>{project.doors[selection.id]?.openAngle ? 'Chiudi porta' : 'Apri porta'}</button>}
      <button className="text-action" onClick={() => reset(selection.type, selection.id)}>Ripristina elemento</button>
    </aside>
  )
}
