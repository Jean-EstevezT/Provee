import { useState, useMemo, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
    ShoppingCart,
    Plus,
    Search,
    Check,
    Trash2,
    Pencil,
} from 'lucide-react'
import { db } from '../../db/db'
import { useAllCategories } from '../../hooks/useAllCategories'
import { getCurrencySymbol } from '../../data/currencies'
import type { ShoppingItem } from '../../types/shopping'
import ShoppingFormModal from './ShoppingFormModal'

export default function ShoppingListsPage() {
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState<string>('all')
    const [modalOpen, setModalOpen] = useState(false)
    const [editItem, setEditItem] = useState<ShoppingItem | null>(null)

    const allCategories = useAllCategories()
    const items = useLiveQuery(() => db.shoppingItems.toArray()) ?? []

    const refresh = useCallback(() => { }, [])

    // Filter
    const filtered = useMemo(() => {
        let list = items
        if (activeCategory !== 'all') {
            list = list.filter((i) => i.categoryId === activeCategory)
        }
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(
                (i) =>
                    i.name.toLowerCase().includes(q) ||
                    i.brand.toLowerCase().includes(q),
            )
        }
        // unchecked first, then checked
        return list.sort((a, b) => Number(a.inCart) - Number(b.inCart))
    }, [items, activeCategory, search])

    const getCategoryIcon = (id: string) =>
        allCategories.find((c) => c.id === id)?.icon ?? '📦'

    // Toggle cart
    const toggleCart = async (item: ShoppingItem) => {
        if (item.id === undefined) return
        await db.shoppingItems.update(item.id, { inCart: !item.inCart })
    }

    const openAdd = () => {
        setEditItem(null)
        setModalOpen(true)
    }

    const openEdit = (item: ShoppingItem) => {
        setEditItem(item)
        setModalOpen(true)
    }

    const handleDelete = async (id: number | undefined) => {
        if (id === undefined) return
        if (confirm('¿Eliminar este artículo de la lista?')) {
            await db.shoppingItems.delete(id)
        }
    }

    // Cart summary
    const cartItems = items.filter((i) => i.inCart)
    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    // Use the most common currency in the cart, or first item's currency
    const cartCurrency = cartItems.length > 0 ? cartItems[0].currency : 'USD'

    return (
        <div className="page-container shopping-page">
            {/* Header */}
            <div className="pantry-top">
                <div className="page-header">
                    <ShoppingCart size={28} />
                    <h1>Lista de Compras</h1>
                </div>
                <button className="btn btn--primary btn--sm" onClick={openAdd}>
                    <Plus size={18} />
                    <span>Agregar</span>
                </button>
            </div>

            {/* Search */}
            <div className="search-bar">
                <Search size={18} className="search-bar-icon" />
                <input
                    id="shopping-search"
                    name="search"
                    type="text"
                    autoComplete="off"
                    placeholder="Buscar por nombre o marca…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Category filter */}
            <div className="chip-scroll">
                <button
                    className={`chip ${activeCategory === 'all' ? 'chip--active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                >
                    Todas
                </button>
                {allCategories.map((c) => (
                    <button
                        key={c.id}
                        className={`chip ${activeCategory === c.id ? 'chip--active' : ''}`}
                        onClick={() => setActiveCategory(c.id)}
                    >
                        {c.icon} {c.name}
                    </button>
                ))}
            </div>

            {/* Item list */}
            <div className="shopping-list">
                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay artículos{activeCategory !== 'all' ? ' en esta categoría' : ''}.</p>
                        <button className="btn btn--primary btn--sm" onClick={openAdd}>
                            <Plus size={16} /> Agregar primero
                        </button>
                    </div>
                ) : (
                    filtered.map((item) => (
                        <div
                            key={item.id}
                            className={`shopping-item ${item.inCart ? 'shopping-item--checked' : ''}`}
                        >
                            {/* Check button */}
                            <button
                                className={`shopping-check ${item.inCart ? 'shopping-check--active' : ''}`}
                                onClick={() => toggleCart(item)}
                                aria-label={item.inCart ? 'Quitar del carrito' : 'Agregar al carrito'}
                            >
                                {item.inCart && <Check size={14} strokeWidth={3} />}
                            </button>

                            {/* Item info */}
                            <div className="shopping-item-info">
                                <div className="shopping-item-top">
                                    <span className="shopping-item-icon">{getCategoryIcon(item.categoryId)}</span>
                                    <span className="shopping-item-name">{item.name}</span>
                                </div>
                                <div className="shopping-item-meta">
                                    <span>{item.quantity} {item.unit}</span>
                                    <span className="shopping-item-dot">·</span>
                                    <span>{getCurrencySymbol(item.currency)}{item.price.toFixed(2)}</span>
                                    {item.brand && (
                                        <>
                                            <span className="shopping-item-dot">·</span>
                                            <span>{item.brand}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="shopping-item-actions">
                                <button className="shopping-action-btn" onClick={() => openEdit(item)} aria-label="Editar">
                                    <Pencil size={14} />
                                </button>
                                <button className="shopping-action-btn shopping-action-btn--danger" onClick={() => handleDelete(item.id)} aria-label="Eliminar">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Sticky cart bar */}
            {items.length > 0 && (
                <div className="cart-bar">
                    <div className="cart-bar-icon">
                        <ShoppingCart size={20} />
                        {cartItems.length > 0 && (
                            <span className="cart-bar-badge">{cartItems.length}</span>
                        )}
                    </div>
                    <div className="cart-bar-info">
                        <span className="cart-bar-total">
                            {getCurrencySymbol(cartCurrency)}{cartTotal.toFixed(2)} {cartCurrency}
                        </span>
                        <span className="cart-bar-count">
                            {cartItems.length} en carrito · {items.length} en lista
                        </span>
                    </div>
                </div>
            )}

            <ShoppingFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSaved={refresh}
                editItem={editItem}
            />
        </div>
    )
}
