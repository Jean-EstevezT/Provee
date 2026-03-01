import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'

import PantryPage from '../pages/pantry/PantryPage'
import ShoppingListsPage from '../pages/shopping-lists/ShoppingListsPage'
import ProductsPage from '../pages/products/ProductsPage'
import CategoriesPage from '../pages/categories/CategoriesPage'
import HistoryPage from '../pages/history/HistoryPage'
import BudgetPage from '../pages/budget/BudgetPage'
import ExpensesPage from '../pages/expenses/ExpensesPage'
import ConfigPage from '../pages/config/ConfigPage'
import AboutPage from '../pages/about/AboutPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Navigate to="/alacena" replace /> },
            { path: 'alacena', element: <PantryPage /> },
            { path: 'listas', element: <ShoppingListsPage /> },
            { path: 'productos', element: <ProductsPage /> },
            { path: 'categorias', element: <CategoriesPage /> },
            { path: 'historial', element: <HistoryPage /> },
            { path: 'presupuesto', element: <BudgetPage /> },
            { path: 'gastos', element: <ExpensesPage /> },
            { path: 'configuracion', element: <ConfigPage /> },
            { path: 'acerca', element: <AboutPage /> },
        ],
    },
])
