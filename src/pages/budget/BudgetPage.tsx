import { PiggyBank } from 'lucide-react'

export default function BudgetPage() {
    return (
        <div className="page-container">
            <div className="page-header">
                <PiggyBank size={28} />
                <h1>Presupuesto</h1>
            </div>
            <p className="page-description">Establece y administra cuánto quieres gastar.</p>
        </div>
    )
}
