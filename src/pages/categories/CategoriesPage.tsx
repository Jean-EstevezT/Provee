import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Tags, Plus, Trash2 } from 'lucide-react'
import { defaultCategories } from '../../data/categories'
import { db } from '../../db/db'
import CategoryFormModal from './CategoryFormModal'

export default function CategoriesPage() {
    const [modalOpen, setModalOpen] = useState(false)

    // Custom categories from DB
    const customCategories = useLiveQuery(() => db.categories.toArray()) ?? []

    const handleDelete = async (id: string) => {
        if (confirm('¿Eliminar esta categoría personalizada?')) {
            await db.categories.delete(id)
        }
    }

    return (
        <div className="page-container">
            <div className="pantry-top">
                <div className="page-header">
                    <Tags size={28} />
                    <h1>Categorías</h1>
                </div>
                <button className="btn btn--primary btn--sm" onClick={() => setModalOpen(true)}>
                    <Plus size={18} />
                    <span>Agregar</span>
                </button>
            </div>

            <p className="page-description">
                Organiza tus productos de la alacena y listas de compras por categoría.
            </p>

            {/* Default categories */}
            <h2 className="section-title">Predeterminadas</h2>
            <div className="categories-grid">
                {defaultCategories.map((cat) => (
                    <div key={cat.id} className="category-card">
                        <span className="category-icon">{cat.icon}</span>
                        <span className="category-name">{cat.name}</span>
                    </div>
                ))}
            </div>

            {/* Custom categories */}
            {customCategories.length > 0 && (
                <>
                    <h2 className="section-title" style={{ marginTop: '1.5rem' }}>Personalizadas</h2>
                    <div className="categories-grid">
                        {customCategories.map((cat) => (
                            <div key={cat.id} className="category-card category-card--custom">
                                <span className="category-icon">{cat.icon}</span>
                                <span className="category-name">{cat.name}</span>
                                <button
                                    className="category-delete-btn"
                                    onClick={() => handleDelete(cat.id)}
                                    aria-label={`Eliminar ${cat.name}`}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <CategoryFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSaved={() => { }}
            />
        </div>
    )
}
