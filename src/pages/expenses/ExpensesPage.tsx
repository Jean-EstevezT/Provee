import { Receipt } from 'lucide-react'

export default function ExpensesPage() {
    return (
        <div className="page-container">
            <div className="page-header">
                <Receipt size={28} />
                <h1>Mis Gastos</h1>
            </div>
            <p className="page-description">Seguimiento de los desembolsos realizados.</p>
        </div>
    )
}
