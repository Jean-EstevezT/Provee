import { History } from 'lucide-react'

export default function HistoryPage() {
    return (
        <div className="page-container">
            <div className="page-header">
                <History size={28} />
                <h1>Historial de Compras</h1>
            </div>
            <p className="page-description">Registro de todas tus adquisiciones pasadas.</p>
        </div>
    )
}
