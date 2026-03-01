import type { CurrencyCode } from '../data/currencies'
import type { Unit } from '../data/units'

export interface HistoryItem {
    id?: number
    name: string
    quantity: number
    unit: Unit
    price: number
    currency: CurrencyCode
    store: string
    categoryId: string

    // ISO string for sorting and separating by days
    date: string
}
