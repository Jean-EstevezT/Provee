import type { Unit } from '../data/units'
import type { CurrencyCode } from '../data/currencies'

export interface PantryItem {
    id?: number
    name: string
    quantity: number
    unit: Unit
    price: number
    currency: CurrencyCode
    categoryId: string
    expirationDate?: string   // ISO date string, optional
    brand: string
    store: string
    note: string
    createdAt: string         // ISO date string
    updatedAt: string         // ISO date string
}
