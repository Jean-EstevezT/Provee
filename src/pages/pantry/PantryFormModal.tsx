import { useState, useEffect } from 'react'
import type { PantryItem } from '../../types/pantry'
import { units } from '../../data/units'
import { currencies } from '../../data/currencies'
import { useAllCategories } from '../../hooks/useAllCategories'
import { db } from '../../db/db'
import { X } from 'lucide-react'

interface Props {
    open: boolean
    onClose: () => void
    onSaved: () => void
    editItem?: PantryItem | null
}

const emptyForm: Omit<PantryItem, 'id' | 'createdAt' | 'updatedAt'> = {
    name: '',
    quantity: 1,
    unit: 'unidades',
    price: 0,
    currency: 'USD',
    categoryId: '',
    expirationDate: '',
    brand: '',
    store: '',
    note: '',
}

export default function PantryFormModal({ open, onClose, onSaved, editItem }: Props) {
    const [form, setForm] = useState(emptyForm)
    const [brands, setBrands] = useState<string[]>([])
    const [stores, setStores] = useState<string[]>([])
    const [saving, setSaving] = useState(false)

    // All categories (defaults + custom)
    const allCategories = useAllCategories()

    // Load brands & stores from DB
    useEffect(() => {
        db.brands.toArray().then((b) => setBrands(b.map((x) => x.name)))
        db.stores.toArray().then((s) => setStores(s.map((x) => x.name)))
    }, [open])

    // Populate form when editing
    useEffect(() => {
        if (editItem) {
            setForm({
                name: editItem.name,
                quantity: editItem.quantity,
                unit: editItem.unit,
                price: editItem.price,
                currency: editItem.currency ?? 'USD',
                categoryId: editItem.categoryId,
                expirationDate: editItem.expirationDate ?? '',
                brand: editItem.brand,
                store: editItem.store,
                note: editItem.note,
            })
        } else {
            setForm(emptyForm)
        }
    }, [editItem, open])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        setForm((f) => ({
            ...f,
            [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) return
        setSaving(true)

        const now = new Date().toISOString()

        try {
            // Save brand if new
            if (form.brand.trim()) {
                const existing = await db.brands.where('name').equals(form.brand.trim()).first()
                if (!existing) await db.brands.add({ name: form.brand.trim() })
            }

            // Save store if new
            if (form.store.trim()) {
                const existing = await db.stores.where('name').equals(form.store.trim()).first()
                if (!existing) await db.stores.add({ name: form.store.trim() })
            }

            if (editItem?.id) {
                await db.pantryItems.update(editItem.id, {
                    ...form,
                    updatedAt: now,
                })
            } else {
                await db.pantryItems.add({
                    ...form,
                    createdAt: now,
                    updatedAt: now,
                })
            }

            onSaved()
            onClose()
        } finally {
            setSaving(false)
        }
    }

    if (!open) return null

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                    <h2>{editItem ? 'Editar artículo' : 'Nuevo artículo'}</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="pantry-form" autoComplete="off">
                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="pf-name">Nombre *</label>
                        <input
                            id="pf-name"
                            name="name"
                            type="text"
                            autoComplete="off"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ej: Leche entera"
                            required
                        />
                    </div>

                    {/* Quantity + Unit row */}
                    <div className="form-row">
                        <div className="form-group form-group--half">
                            <label htmlFor="pf-qty">Cantidad</label>
                            <input
                                id="pf-qty"
                                name="quantity"
                                type="number"
                                autoComplete="off"
                                min="0"
                                step="0.01"
                                value={form.quantity}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group form-group--half">
                            <label htmlFor="pf-unit">Unidad</label>
                            <select id="pf-unit" name="unit" value={form.unit} onChange={handleChange}>
                                {units.map((u) => (
                                    <option key={u} value={u}>
                                        {u}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Price + Currency row */}
                    <div className="form-row">
                        <div className="form-group form-group--half">
                            <label htmlFor="pf-price">Precio</label>
                            <input
                                id="pf-price"
                                name="price"
                                type="number"
                                autoComplete="off"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group form-group--half">
                            <label htmlFor="pf-currency">Moneda</label>
                            <select id="pf-currency" name="currency" value={form.currency} onChange={handleChange}>
                                {currencies.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.symbol} {c.code} — {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label htmlFor="pf-cat">Categoría</label>
                        <select id="pf-cat" name="categoryId" value={form.categoryId} onChange={handleChange}>
                            <option value="">— Seleccionar —</option>
                            {allCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.icon} {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Expiration date */}
                    <div className="form-group">
                        <label htmlFor="pf-exp">Fecha de caducidad</label>
                        <input
                            id="pf-exp"
                            name="expirationDate"
                            type="date"
                            value={form.expirationDate}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Brand (datalist for autocomplete) */}
                    <div className="form-group">
                        <label htmlFor="pf-brand">Marca</label>
                        <input
                            id="pf-brand"
                            name="brand"
                            type="text"
                            list="brands-list"
                            value={form.brand}
                            onChange={handleChange}
                            placeholder="Ej: Lala"
                        />
                        <datalist id="brands-list">
                            {brands.map((b) => (
                                <option key={b} value={b} />
                            ))}
                        </datalist>
                    </div>

                    {/* Store (datalist for autocomplete) */}
                    <div className="form-group">
                        <label htmlFor="pf-store">Tienda</label>
                        <input
                            id="pf-store"
                            name="store"
                            type="text"
                            list="stores-list"
                            value={form.store}
                            onChange={handleChange}
                            placeholder="Ej: Walmart"
                        />
                        <datalist id="stores-list">
                            {stores.map((s) => (
                                <option key={s} value={s} />
                            ))}
                        </datalist>
                    </div>

                    {/* Note */}
                    <div className="form-group">
                        <label htmlFor="pf-note">Nota</label>
                        <textarea
                            id="pf-note"
                            name="note"
                            rows={2}
                            value={form.note}
                            onChange={handleChange}
                            placeholder="Alguna observación…"
                        />
                    </div>

                    {/* Actions */}
                    <div className="form-actions">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={saving}>
                            {saving ? 'Guardando…' : editItem ? 'Guardar cambios' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
