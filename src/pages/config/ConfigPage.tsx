import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Settings, Save, RefreshCw, DollarSign } from 'lucide-react'
import { db } from '../../db/db'
import { currencies } from '../../data/currencies'
import type { CurrencyCode } from '../../data/currencies'
import type { AppConfig } from '../../types/config'

const DEFAULT_CONFIG: AppConfig = {
    id: 1,
    displayCurrency: 'USD',
    exchangeRates: {
        USD: 1,
        EUR: 0.92,
        COP: 3900,
        MXN: 17.0,
        ARS: 850,
        CLP: 950,
        PEN: 3.8,
        VES: 36.5,
        BRL: 5.0,
        BOB: 6.9,
        UYU: 39.0,
        PYG: 7300,
        DOP: 59.0,
        GTQ: 7.8,
        HNL: 24.7,
        NIO: 36.6,
        CRC: 510,
        PAB: 1.0,
    }
}

export default function ConfigPage() {
    const dbConfig = useLiveQuery(() => db.appConfig.get(1))

    // Local state for the form so we can edit before hitting save
    const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG)
    const [saving, setSaving] = useState(false)
    const [savedMsg, setSavedMsg] = useState(false)

    // Sync local state when DB loads (only the very first time it loads)
    useEffect(() => {
        if (dbConfig) {
            setConfig(dbConfig)
        }
    }, [dbConfig])

    const handleSave = async () => {
        setSaving(true)
        if (dbConfig) {
            await db.appConfig.put(config)
        } else {
            await db.appConfig.add(config)
        }
        setSaving(false)
        setSavedMsg(true)
        setTimeout(() => setSavedMsg(false), 3000)
    }

    const handleDisplayCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConfig(prev => ({
            ...prev,
            displayCurrency: e.target.value as CurrencyCode
        }))
    }

    const handleRateChange = (code: CurrencyCode, val: string) => {
        const numVal = parseFloat(val)
        // If empty or invalid, just keep as string temporarily in state until save?
        // Let's enforce numbers but allow empty briefly
        setConfig(prev => ({
            ...prev,
            exchangeRates: {
                ...prev.exchangeRates,
                [code]: isNaN(numVal) ? 0 : numVal
            }
        }))
    }

    return (
        <div className="page-container config-page">
            <div className="pantry-top">
                <div className="page-header">
                    <Settings size={28} />
                    <h1>Configuración</h1>
                </div>
                <button
                    className="btn btn--primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Save size={18} />
                    <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                </button>
            </div>

            {savedMsg && (
                <div style={{ backgroundColor: 'var(--color-success)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                    ¡Configuración guardada exitosamente!
                </div>
            )}

            <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Global Setup */}
                <section className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <RefreshCw size={22} color="var(--color-primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Moneda de Visualización</h2>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                        Selecciona la moneda en la que quieres ver <strong>todos los precios e informes</strong>.
                        Tus precios guardados originalmente no se verán afectados, solo serán convertidos visualmente a esta moneda.
                    </p>

                    <div className="form-group mb-0">
                        <select
                            value={config.displayCurrency}
                            onChange={handleDisplayCurrencyChange}
                            style={{ WebkitAppearance: 'menulist', appearance: 'auto', fontSize: '1.1rem', padding: '0.75rem' }}
                        >
                            {currencies.map(c => (
                                <option key={c.code} value={c.code}>
                                    {c.code} - {c.name} ({c.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Exchange Rates */}
                <section className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <DollarSign size={22} color="var(--color-primary)" />
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Tasas de Cambio</h2>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Define cúanto equivale <strong>1 USD</strong> en el resto de las monedas.
                        Este valor será el que use el sistema interamente para convertir de una moneda a otra.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {currencies.map(c => {
                            // USD should be read only 1
                            if (c.code === 'USD') return null;

                            return (
                                <div key={c.code} className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{c.code}</span>
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>1 USD =</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>{c.symbol}</span>
                                        <input
                                            type="number"
                                            min="0.00001"
                                            step="any"
                                            value={config.exchangeRates[c.code as keyof typeof config.exchangeRates] || ''}
                                            onChange={(e) => handleRateChange(c.code as CurrencyCode, e.target.value)}
                                            style={{ paddingLeft: '2rem' }}
                                        />
                                    </div>
                                </div>
                            )
                        })}

                        {/* Always show USD as reference, disabled */}
                        <div className="form-group" style={{ marginBottom: 0, opacity: 0.6 }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>USD (Base)</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>$</span>
                                <input
                                    type="number"
                                    value={1}
                                    disabled
                                    style={{ paddingLeft: '2rem' }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}
