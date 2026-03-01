import { useLiveQuery } from 'dexie-react-hooks'
import { Receipt, TrendingUp, Store as StoreIcon, PieChart } from 'lucide-react'
import { db } from '../../db/db'
import { getCurrencySymbol } from '../../data/currencies'
import { convertCurrency } from '../../utils/currencyUtils'
import { useAllCategories } from '../../hooks/useAllCategories'

export default function ExpensesPage() {
    const allHistory = useLiveQuery(() => db.historyItems.toArray()) ?? []
    const allCategories = useAllCategories()
    const appConfig = useLiveQuery(() => db.appConfig.get(1))

    // 1. Calculate General Total
    const totalSpent = allHistory.reduce((sum, item) => {
        const cost = item.price * item.quantity
        if (appConfig) {
            return sum + convertCurrency(cost, item.currency, appConfig.displayCurrency, appConfig.exchangeRates)
        }
        return sum + cost
    }, 0)

    // 2. Group by Category
    const categoryStats = allHistory.reduce((acc, item) => {
        let cost = item.price * item.quantity
        if (appConfig) {
            cost = convertCurrency(cost, item.currency, appConfig.displayCurrency, appConfig.exchangeRates)
        }

        if (!acc[item.categoryId]) {
            acc[item.categoryId] = 0
        }
        acc[item.categoryId] += cost
        return acc
    }, {} as Record<string, number>)

    // Map object back to an array, attach names/icons, and sort descending
    const sortedCategories = Object.entries(categoryStats)
        .map(([id, amount]) => {
            const catInfo = allCategories.find(c => c.id === id)
            return {
                id,
                name: catInfo?.name ?? 'Sin Categoría',
                icon: catInfo?.icon ?? '📦',
                amount
            }
        })
        .sort((a, b) => b.amount - a.amount)

    // 3. Group by Store
    const storeStats = allHistory.reduce((acc, item) => {
        const storeName = (item.store && item.store.trim() !== '') ? item.store : 'Otra Tienda'
        let cost = item.price * item.quantity
        if (appConfig) {
            cost = convertCurrency(cost, item.currency, appConfig.displayCurrency, appConfig.exchangeRates)
        }

        if (!acc[storeName]) {
            acc[storeName] = 0
        }
        acc[storeName] += cost
        return acc
    }, {} as Record<string, number>)

    const sortedStores = Object.entries(storeStats)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)

    // Determine base currency for Display
    const displayCurrency = appConfig ? appConfig.displayCurrency : (allHistory.length > 0 ? allHistory[0].currency : 'USD')
    const currencySymbol = getCurrencySymbol(displayCurrency)

    return (
        <div className="page-container config-page">
            <div className="pantry-top">
                <div className="page-header">
                    <Receipt size={28} />
                    <h1>Gastos y Estadísticas</h1>
                </div>
            </div>

            {totalSpent === 0 ? (
                <div className="empty-state">
                    <TrendingUp size={48} opacity={0.5} />
                    <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
                        Aún no tienes gastos registrados.
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', opacity: 0.7 }}>
                        El historial se alimentará automáticamente de tus compras y traspasos a la alacena.
                    </p>
                </div>
            ) : (
                <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Big Total Panel */}
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Total Gastado General
                        </span>
                        <div style={{ fontSize: '3rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-primary)' }}>
                            {currencySymbol}{totalSpent.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                            Basado en {allHistory.length} artículos comprados
                        </div>
                    </div>

                    {/* Breakdown Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                        {/* Categories Box */}
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <PieChart size={20} color="var(--color-primary)" />
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Por Categoría</h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {sortedCategories.map((cat) => {
                                    const percentage = (cat.amount / totalSpent) * 100
                                    return (
                                        <div key={cat.id}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <span>{cat.icon}</span>
                                                    <span>{cat.name}</span>
                                                </span>
                                                <span style={{ fontWeight: 600 }}>{currencySymbol}{cat.amount.toFixed(2)}</span>
                                            </div>
                                            <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${percentage}%`,
                                                    backgroundColor: 'var(--color-primary)',
                                                    opacity: 0.85
                                                }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Stores Box */}
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <StoreIcon size={20} color="var(--color-primary)" />
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Por Tienda</h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {sortedStores.map((store) => {
                                    const percentage = (store.amount / totalSpent) * 100
                                    return (
                                        <div key={store.name}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                                                <span className="truncate" style={{ maxWidth: '60%' }}>{store.name}</span>
                                                <span style={{ fontWeight: 600 }}>{currencySymbol}{store.amount.toFixed(2)}</span>
                                            </div>
                                            <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${percentage}%`,
                                                    backgroundColor: '#10B981', // green shade for variety
                                                    opacity: 0.85
                                                }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
