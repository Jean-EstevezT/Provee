import { Info } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="page-container">
            <div className="page-header">
                <Info size={28} />
                <h1>Acerca de</h1>
            </div>
            <p className="page-description">
                <strong>Provee</strong> es tu administrador de inventario del hogar.
                Lleva el control de tu alacena, planifica tus compras y monitorea tu presupuesto
                de forma completamente local. Tus datos nunca salen de tu dispositivo.
            </p>
            <p className="mt-4 text-sm text-slate-500">Versión 0.1.0</p>
        </div>
    )
}
