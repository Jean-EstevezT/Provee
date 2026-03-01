export interface Category {
    id: string
    name: string
    icon: string
}

export const defaultCategories: Category[] = [
    { id: 'papeleria', name: 'Papelería', icon: '📝' },
    { id: 'limpieza', name: 'Limpieza', icon: '🧹' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
    { id: 'carnes', name: 'Carnes', icon: '🥩' },
    { id: 'congelados', name: 'Platillos Preparados Congelados', icon: '🧊' },
    { id: 'charcuteria', name: 'Charcutería', icon: '🍖' },
    { id: 'lacteos', name: 'Productos Lácteos', icon: '🧀' },
    { id: 'frutas-verduras', name: 'Frutas y Verduras', icon: '🥦' },
    { id: 'huevos', name: 'Huevos', icon: '🥚' },
    { id: 'higiene', name: 'Higiene Personal', icon: '🧴' },
    { id: 'importados', name: 'Importados', icon: '🌍' },
    { id: 'abarrotes', name: 'Abarrotes', icon: '🛒' },
    { id: 'panaderia', name: 'Panadería y Postres', icon: '🍞' },
    { id: 'botanas', name: 'Botanas y Dulces', icon: '🍬' },
    { id: 'salud-belleza', name: 'Salud y Belleza', icon: '💊' },
]
