import { useState, useCallback, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
    Warehouse,
    Plus,
    Search,
    ChevronDown,
    ChevronUp,
    Pencil,
    Trash2,
} from 'lucide-react'
import { db } from '../../db/db'
import { getCurrencySymbol } from '../../data/currencies'
import { convertCurrency } from '../../utils/currencyUtils'
import { useAllCategories } from '../../hooks/useAllCategories'
import type { PantryItem } from '../../types/pantry'
import PantryFormModal from './PantryFormModal'
import ConfirmModal from '../../components/ConfirmModal'

export default function PantryPage() {
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState<string>('all')
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [editItem, setEditItem] = useState<PantryItem | null>(null)
    const [itemToDelete, setItemToDelete] = useState<number | null>(null)

    // All categories (defaults + custom from DB)
    const allCategories = useAllCategories()

    // Live query: all pantry items
    const items = useLiveQuery(() => db.pantryItems.toArray()) ?? []

    // Live query: App config
    const appConfig = useLiveQuery(() => db.appConfig.get(1))

    // Refresh helper (useLiveQuery auto-refreshes, but we call it after save)
    const refresh = useCallback(() => {
        /* useLiveQuery handles reactivity automatically */
    }, [])

    // Filtered items
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
                    i.brand.toLowerCase().includes(q) ||
                    i.store.toLowerCase().includes(q),
            )
        }
        return list
    }, [items, activeCategory, search])

    const getCategoryName = (id: string) =>
        allCategories.find((c) => c.id === id)?.name ?? '—'

    const getCategoryIcon = (id: string) =>
        allCategories.find((c) => c.id === id)?.icon ?? '📦'

    const toggleExpand = (id: number | undefined) => {
        if (id === undefined) return
        setExpandedId((prev) => (prev === id ? null : id))
    }

    const openAdd = () => {
        setEditItem(null)
        setModalOpen(true)
    }

    const openEdit = (item: PantryItem) => {
        setEditItem(item)
        setModalOpen(true)
    }

    const handleDeleteClick = (id: number | undefined) => {
        if (id !== undefined) setItemToDelete(id)
    }

    const confirmDelete = async () => {
        if (itemToDelete !== null) {
            await db.pantryItems.delete(itemToDelete)
            setItemToDelete(null)
        }
    }

    const formatDate = (iso?: string) => {
        if (!iso) return '—'
        return new Date(iso).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    return (
        <div className="page-container">
            {/* ── Header ── */}
            <div className="pantry-top">
                <div className="page-header">
                    <Warehouse size={28} />
                    <h1>Mi Alacena</h1>
                </div>
                <button className="btn btn--primary btn--sm" onClick={openAdd}>
                    <Plus size={18} />
                    <span>Agregar</span>
                </button>
            </div>

            {/* ── Search ── */}
            <div className="search-bar">
                <Search size={18} className="search-bar-icon" />
                <input
                    id="pantry-search"
                    name="search"
                    type="text"
                    autoComplete="off"
                    placeholder="Buscar por nombre, marca o tienda…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* ── Category filter chips ── */}
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

            {/* ── Item list ── */}
            <div className="pantry-list">
                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay artículos{activeCategory !== 'all' ? ' en esta categoría' : ''}.</p>
                        <button className="btn btn--primary btn--sm" onClick={openAdd}>
                            <Plus size={16} /> Agregar primero
                        </button>
                    </div>
                ) : (
                    filtered.map((item) => {
                        const isExpanded = expandedId === item.id
                        return (
                            <div key={item.id} className="pantry-item">
                                {/* Collapsed row */}
                                <button
                                    className="pantry-item-row"
                                    onClick={() => toggleExpand(item.id)}
                                >
                                    <span className="pantry-item-icon">
                                        {getCategoryIcon(item.categoryId)}
                                    </span>
                                    <div className="pantry-item-info">
                                        <span className="pantry-item-name">{item.name}</span>
                                        <span className="pantry-item-qty">
                                            {item.quantity} {item.unit}
                                        </span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp size={18} className="pantry-chevron" />
                                    ) : (
                                        <ChevronDown size={18} className="pantry-chevron" />
                                    )}
                                </button>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div className="pantry-item-details">
                                        <div className="detail-grid">
                                            <span className="detail-label">Precio</span>
                                            <span className="detail-value">
                                                {appConfig ? (
                                                    <>
                                                        {getCurrencySymbol(appConfig.displayCurrency)}
                                                        {convertCurrency(item.price, item.currency, appConfig.displayCurrency, appConfig.exchangeRates).toFixed(2)} {appConfig.displayCurrency}
                                                    </>
                                                ) : (
                                                    <>
                                                        {getCurrencySymbol(item.currency)}{item.price.toFixed(2)} {item.currency}
                                                    </>
                                                )}
                                            </span>

                                            <span className="detail-label">Categoría</span>
                                            <span className="detail-value">{getCategoryName(item.categoryId)}</span>

                                            <span className="detail-label">Marca</span>
                                            <span className="detail-value">{item.brand || '—'}</span>

                                            <span className="detail-label">Tienda</span>
                                            <span className="detail-value">{item.store || '—'}</span>

                                            <span className="detail-label">Caducidad</span>
                                            <span className="detail-value">{formatDate(item.expirationDate)}</span>

                                            {item.note && (
                                                <>
                                                    <span className="detail-label">Nota</span>
                                                    <span className="detail-value">{item.note}</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="pantry-item-actions">
                                            <button className="btn btn--secondary btn--xs" onClick={() => openEdit(item)}>
                                                <Pencil size={14} /> Editar
                                            </button>
                                            <button
                                                className="btn btn--danger btn--xs"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteClick(item.id)
                                                }}
                                            >
                                                <Trash2 size={14} /> Eliminar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            {/* ── Modal ── */}
            <PantryFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSaved={refresh}
                editItem={editItem}
            />

            <ConfirmModal
                open={itemToDelete !== null}
                title="Eliminar artículo"
                message="¿Estás seguro de que quieres eliminar este artículo de la alacena? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                isDanger={true}
                onCancel={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
            />
        </div>
    )
}
