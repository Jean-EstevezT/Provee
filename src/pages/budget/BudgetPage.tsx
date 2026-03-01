import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { PiggyBank, Edit3, Save, X, Activity } from 'lucide-react'
import { db } from '../../db/db'
import { getCurrencySymbol } from '../../data/currencies'
import { convertCurrency } from '../../utils/currencyUtils'
import { getCurrentPeriodBounds, formatPeriodBounds } from '../../utils/dateUtils'
import type { BudgetPeriod, BudgetConfig } from '../../types/budget'

export default function BudgetPage() {
    const config = useLiveQuery(() => db.budgetConfig.get(1))
    const [editing, setEditing] = useState(false)
    const [formAmount, setFormAmount] = useState<number>(0)
    const [formPeriod, setFormPeriod] = useState<BudgetPeriod>('monthly')

    // Live Query for all history items
    const allHistory = useLiveQuery(() => db.historyItems.toArray()) ?? []

    // Live query: App config
    const appConfig = useLiveQuery(() => db.appConfig.get(1))

    // If there is no config in DB yet, show the setup state
    const isConfigured = !!config

    const handleEditStart = () => {
        setFormAmount(config?.amount ?? 0)
        setFormPeriod(config?.period ?? 'monthly')
        setEditing(true)
    }

    const handleSave = async () => {
        if (formAmount <= 0) return

        const newConfig: BudgetConfig = {
            id: 1, // Singleton
            amount: formAmount,
            period: formPeriod,
            currency: 'USD', // Future proofing, for now we assume USD or same base currency as items
        }

        if (isConfigured) {
            await db.budgetConfig.put(newConfig)
        } else {
            await db.budgetConfig.add(newConfig)
        }
        setEditing(false)
    }

    // --- Calculation Logic ---
    const currentPeriod = config?.period ?? 'monthly'
    const bounds = getCurrentPeriodBounds(currentPeriod)

    // Filter history items within the current selected period bounds
    const periodHistory = allHistory.filter(item => {
        return item.date >= bounds.start && item.date <= bounds.end
    })

    const totalSpent = periodHistory.reduce((sum, item) => {
        const itemTotal = item.price * item.quantity;
        if (appConfig) {
            return sum + convertCurrency(itemTotal, item.currency, appConfig.displayCurrency, appConfig.exchangeRates)
        }
        return sum + itemTotal
    }, 0)

    const budgetAmount = config?.amount ?? 0
    const remaining = Math.max(0, budgetAmount - totalSpent)

    // Determine the Currency format for display
    const displayCurrency = appConfig ? appConfig.displayCurrency : 'USD'
    const symbol = getCurrencySymbol(displayCurrency)

    // Progress calculation
    const progressPercentage = budgetAmount > 0
        ? Math.min(100, (totalSpent / budgetAmount) * 100)
        : 0

    // Color logic
    let progressColor = 'var(--color-success)' // Green
    if (progressPercentage >= 90) progressColor = 'var(--color-danger)' // Red
    else if (progressPercentage >= 75) progressColor = 'var(--color-warning)' // Orange

    return (
        <div className="page-container config-page">
            <div className="pantry-top">
                <div className="page-header">
                    <PiggyBank size={28} />
                    <h1>Presupuesto</h1>
                </div>
                {isConfigured && !editing && (
                    <button className="btn btn--secondary btn--sm" onClick={handleEditStart}>
                        <Edit3 size={18} />
                        <span>Editar</span>
                    </button>
                )}
            </div>

            {/* Editing / Setup Mode */}
            {(!isConfigured || editing) && (
                <div className="card glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                        {!isConfigured ? 'Configura tu Presupuesto' : 'Editar Presupuesto'}
                    </h2>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label>Límite de Gasto</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={formAmount || ''}
                            onChange={(e) => setFormAmount(Number(e.target.value))}
                            placeholder="Ej: 500.00"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Periodo</label>
                        <select
                            value={formPeriod}
                            onChange={(e) => setFormPeriod(e.target.value as BudgetPeriod)}
                            style={{ WebkitAppearance: 'menulist', appearance: 'auto' }}
                        >
                            <option value="weekly">Semanal</option>
                            <option value="biweekly">Quincenal</option>
                            <option value="monthly">Mensual</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {isConfigured && (
                            <button className="btn btn--secondary" onClick={() => setEditing(false)} style={{ flex: 1 }}>
                                <X size={18} /> Cancelar
                            </button>
                        )}
                        <button className="btn btn--primary" onClick={handleSave} style={{ flex: 1 }}>
                            <Save size={18} /> Guardar
                        </button>
                    </div>
                </div>
            )}

            {/* Dashboard Mode */}
            {isConfigured && !editing && (
                <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Period Banner */}
                    <div className="glass-panel" style={{
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)', // Subtle gold tint
                        border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Periodo Actual ({currentPeriod === 'weekly' ? 'Semanal' : currentPeriod === 'biweekly' ? 'Quincenal' : 'Mensual'})
                            </span>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>
                                {formatPeriodBounds(bounds.start, bounds.end)}
                            </div>
                        </div>
                        <Activity size={24} color="var(--color-primary)" opacity={0.8} />
                    </div>

                    {/* Spend Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="glass-panel" style={{ padding: '1.25rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Gastado</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--color-text)' }}>
                                {symbol}{totalSpent.toFixed(2)}
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.25rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Restante</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem', color: progressPercentage >= 100 ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                                {symbol}{remaining.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontWeight: 600 }}>Presupuesto Total: {symbol}{budgetAmount.toFixed(2)}</span>
                            <span style={{ color: progressColor, fontWeight: 700 }}>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div style={{
                            height: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '100px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progressPercentage}%`,
                                backgroundColor: progressColor,
                                transition: 'width 0.5s ease-out, background-color 0.3s ease'
                            }} />
                        </div>
                        {progressPercentage >= 100 && (
                            <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
                                Has superado tu presupuesto para este periodo.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
