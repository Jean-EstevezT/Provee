import { useState } from 'react'
import { db } from '../../db/db'
import { X } from 'lucide-react'
import EmojiPicker from '../../components/EmojiPicker'

interface Props {
    open: boolean
    onClose: () => void
    onSaved: () => void
}

export default function CategoryFormModal({ open, onClose, onSaved }: Props) {
    const [name, setName] = useState('')
    const [icon, setIcon] = useState('📦')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = name.trim()
        if (!trimmed) return

        setSaving(true)
        setError('')

        try {
            // Generate slug-based ID
            const id = trimmed
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')

            // Check if already exists
            const existing = await db.categories.get(id)
            if (existing) {
                setError('Ya existe una categoría con ese nombre.')
                setSaving(false)
                return
            }

            await db.categories.add({ id, name: trimmed, icon })
            setName('')
            setIcon('📦')
            onSaved()
            onClose()
        } catch {
            setError('Error al guardar la categoría.')
        } finally {
            setSaving(false)
        }
    }

    if (!open) return null

    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Nueva categoría</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="pantry-form">
                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="cf-name">Nombre *</label>
                        <input
                            id="cf-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Mascotas"
                            required
                        />
                    </div>

                    {/* Preview */}
                    <div className="category-preview">
                        <span className="category-preview-icon">{icon}</span>
                        <span className="category-preview-name">{name || 'Mi categoría'}</span>
                    </div>

                    {/* Emoji picker */}
                    <div className="form-group">
                        <label>Icono</label>
                        <EmojiPicker selected={icon} onSelect={setIcon} />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <div className="form-actions">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={saving}>
                            {saving ? 'Guardando…' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
