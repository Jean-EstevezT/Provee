/** Units used across the app for product quantities */
export const units = [
    'unidades',
    'kg',
    'g',
    'lb',
    'oz',
    'litros',
    'ml',
    'galones',
    'cajas',
    'paquetes',
    'bolsas',
    'latas',
    'botellas',
    'rollos',
    'sobres',
    'barras',
    'docenas',
    'piezas',
    'rebanadas',
    'tazas',
] as const

export type Unit = (typeof units)[number]
