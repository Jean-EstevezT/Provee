import { useState, useEffect } from 'react'
import type { ShoppingItem } from '../../types/shopping'
import { units } from '../../data/units'
import { currencies } from '../../data/currencies'
import { useAllCategories } from '../../hooks/useAllCategories'
import { db } from '../../db/db'
import { X } from 'lucide-react'

interface Props {
    open: boolean
    onClose: () => void
    onSaved: () => void
    editItem?: ShoppingItem | null
}

const emptyForm: Omit<ShoppingItem, 'id' | 'createdAt' | 'inCart'> = {
    name: '',
    quantity: 1,
    unit: 'unidades',
    price: 0,
    currency: 'USD',
    categoryId: '',
    brand: '',
}

export default function ShoppingFormModal({ open, onClose, onSaved, editItem }: Props) {
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const allCategories = useAllCategories()

    // Populate form when editing
    useEffect(() => {
        if (editItem) {
            setForm({
                name: editItem.name,
                quantity: editItem.quantity,
                unit: editItem.unit,
                price: editItem.price,
                currency: editItem.currency,
                categoryId: editItem.categoryId,
                brand: editItem.brand,
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

        try {
            if (editItem?.id) {
                await db.shoppingItems.update(editItem.id, { ...form })
            } else {
                await db.shoppingItems.add({
                    ...form,
                    inCart: false,
                    createdAt: new Date().toISOString(),
                })
            }
            setForm(emptyForm)
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
                <div className="modal-header">
                    <h2>{editItem ? 'Editar artículo' : 'Agregar a la lista'}</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="pantry-form" autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="sf-name">Nombre *</label>
                        <input
                            id="sf-name"
                            name="name"
                            type="text"
                            autoComplete="off"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ej: Arroz integral"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group form-group--half">
                            <label htmlFor="sf-qty">Cantidad</label>
                            <input
                                id="sf-qty"
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
                            <label htmlFor="sf-unit">Unidad</label>
                            <select id="sf-unit" name="unit" value={form.unit} onChange={handleChange}>
                                {units.map((u) => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group form-group--half">
                            <label htmlFor="sf-price">Precio</label>
                            <input
                                id="sf-price"
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
                            <label htmlFor="sf-currency">Moneda</label>
                            <select id="sf-currency" name="currency" value={form.currency} onChange={handleChange}>
                                {currencies.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.symbol} {c.code}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="sf-cat">Categoría</label>
                        <select id="sf-cat" name="categoryId" value={form.categoryId} onChange={handleChange}>
                            <option value="">— Seleccionar —</option>
                            {allCategories.map((c) => (
                                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="sf-brand">Marca</label>
                        <input
                            id="sf-brand"
                            name="brand"
                            type="text"
                            autoComplete="off"
                            value={form.brand}
                            onChange={handleChange}
                            placeholder="Ej: Diana"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={saving}>
                            {saving ? 'Guardando…' : editItem ? 'Guardar' : 'Agregar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
