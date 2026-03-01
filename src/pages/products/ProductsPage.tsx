import { Package } from 'lucide-react'

export default function ProductsPage() {
    return (
        <div className="page-container">
            <div className="page-header">
                <Package size={28} />
                <h1>Productos</h1>
            </div>
            <p className="page-description">Catálogo de artículos con los que interactúas.</p>
        </div>
    )
}
