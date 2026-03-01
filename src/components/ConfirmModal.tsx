import { AlertTriangle, Info } from 'lucide-react'

interface ConfirmModalProps {
    open: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isDanger?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({
    open,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isDanger = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!open) return null

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
            <div className="modal-content modal-content--sm" style={{ maxWidth: '380px', padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: isDanger ? '#f87171' : '#D4AF37' }}>
                    {isDanger ? <AlertTriangle size={48} strokeWidth={1.5} /> : <Info size={48} strokeWidth={1.5} />}
                </div>

                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>{title}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    {message}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <button
                        className="btn btn--secondary"
                        onClick={onCancel}
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`btn ${isDanger ? 'btn--primary' : 'btn--primary'}`}
                        onClick={onConfirm}
                        style={{ flex: 1, justifyContent: 'center', backgroundColor: isDanger ? 'var(--color-danger)' : undefined, borderColor: isDanger ? 'transparent' : undefined }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
