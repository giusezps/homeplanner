import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useProjectStore } from '../state/projectStore'
import { PropertiesPanel } from './PropertiesPanel'

describe('PropertiesPanel', () => {
  beforeEach(() => useProjectStore.getState().newProject())

  it('shows contextual furniture controls and updates the selected color', () => {
    useProjectStore.getState().select({ type: 'furniture', id: 'sofa-living-main' })
    render(<PropertiesPanel />)
    expect(screen.getByRole('heading', { name: 'Divano' })).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Rivestimento'), { target: { value: '#6f7b65' } })
    expect(useProjectStore.getState().project.furniture['sofa-living-main'].colors.upholstery).toBe('#6f7b65')
  })

  it('shows an empty-state prompt when nothing is selected', () => {
    render(<PropertiesPanel />)
    expect(screen.getByText(/seleziona un elemento/i)).toBeInTheDocument()
  })
})
