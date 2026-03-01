import { useState, useCallback } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
    Warehouse,
    ShoppingCart,
    Package,
    Tags,
    History,
    PiggyBank,
    Receipt,
    Settings,
    Info,
    Menu,
    X,
} from 'lucide-react'

const navItems = [
    { to: '/alacena', label: 'Alacena', icon: Warehouse },
    { to: '/listas', label: 'Listas', icon: ShoppingCart },
    { to: '/productos', label: 'Productos', icon: Package },
    { to: '/categorias', label: 'Categorías', icon: Tags },
    { to: '/historial', label: 'Historial', icon: History },
    { to: '/presupuesto', label: 'Presupuesto', icon: PiggyBank },
    { to: '/gastos', label: 'Gastos', icon: Receipt },
    { to: '/configuracion', label: 'Configuración', icon: Settings },
    { to: '/acerca', label: 'Acerca de', icon: Info },
]

export default function Layout() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const location = useLocation()

    const toggleDrawer = useCallback(() => setDrawerOpen((o) => !o), [])
    const closeDrawer = useCallback(() => setDrawerOpen(false), [])

    // Find the current page label for the mobile header
    const currentLabel =
        navItems.find((n) => location.pathname.startsWith(n.to))?.label ?? 'Provee'

    return (
        <div className="layout">
            {/* ── Mobile header bar ── */}
            <header className="mobile-header">
                <button
                    className="hamburger-btn"
                    onClick={toggleDrawer}
                    aria-label="Abrir menú"
                >
                    <Menu size={24} />
                </button>
                <span className="mobile-header-title">{currentLabel}</span>
            </header>

            {/* ── Overlay (mobile) ── */}
            <div
                className={`drawer-overlay ${drawerOpen ? 'drawer-overlay--visible' : ''}`}
                onClick={closeDrawer}
            />

            {/* ── Sidebar / Drawer ── */}
            <aside className={`sidebar ${drawerOpen ? 'sidebar--open' : ''}`}>
                <div className="sidebar-brand">
                    <span className="brand-icon">🛒</span>
                    <span className="brand-text">Provee</span>
                    {/* Close button visible only on mobile inside the drawer */}
                    <button
                        className="drawer-close-btn"
                        onClick={closeDrawer}
                        aria-label="Cerrar menú"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={closeDrawer}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                            }
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* ── Main content ── */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}
