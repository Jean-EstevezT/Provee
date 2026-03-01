import { Settings } from 'lucide-react'

export default function ConfigPage() {
    return (
        <div className="page-container">
            <div className="page-header">
                <Settings size={28} />
                <h1>Configuración</h1>
            </div>
            <p className="page-description">Ajustes generales de la aplicación.</p>
        </div>
    )
}
