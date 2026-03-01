import { useLiveQuery } from 'dexie-react-hooks'
import { History, ReceiptText } from 'lucide-react'
import { db } from '../../db/db'
import { getCurrencySymbol } from '../../data/currencies'

export default function HistoryPage() {
    // Live query: all history items sorted by date descending
    const items = useLiveQuery(() => db.historyItems.orderBy('date').reverse().toArray()) ?? []

    // Group items by local date string
    const groupedItems = items.reduce((acc, item) => {
        const dateObj = new Date(item.date)
        const dateString = dateObj.toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })

        // Capitalize first letter of weekday
        const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)

        if (!acc[formattedDate]) {
            acc[formattedDate] = []
        }
        acc[formattedDate].push(item)
        return acc
    }, {} as Record<string, typeof items>)

    return (
        <div className="page-container">
            {/* Header */}
            <div className="pantry-top">
                <div className="page-header">
                    <History size={28} />
                    <h1>Historial de Compras</h1>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="empty-state">
                    <ReceiptText size={48} opacity={0.5} />
                    <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
                        Aún no hay compras registradas.
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', opacity: 0.7 }}>
                        Los artículos aparecerán aquí automáticamente cuando los transfieras del carrito a la Alacena o cuando agregues uno nuevo.
                    </p>
                </div>
            ) : (
                <div className="pantry-grid" style={{ gap: '2rem' }}>
                    {Object.entries(groupedItems).map(([dateLabel, dateItems]) => (
                        <div key={dateLabel} className="history-group">
                            <h2 style={{
                                fontSize: '1.1rem',
                                color: 'var(--color-primary)',
                                borderBottom: '1px solid var(--color-border)',
                                paddingBottom: '0.5rem',
                                marginBottom: '1rem',
                                fontWeight: 500
                            }}>
                                {dateLabel}
                            </h2>

                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {dateItems.map((item) => (
                                    <div key={item.id} className="pantry-item-card" style={{ padding: '1rem', cursor: 'default' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem 0' }}>{item.name}</h3>
                                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                                    <span>{item.quantity} {item.unit}</span>
                                                    {item.store && (
                                                        <>
                                                            <span style={{ opacity: 0.5 }}>•</span>
                                                            <span>{item.store}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                                                {getCurrencySymbol(item.currency)}{item.price.toFixed(2)} {item.currency}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
