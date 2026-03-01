import type { CurrencyCode } from '../data/currencies'
import type { Unit } from '../data/units'

export interface ShoppingItem {
    id?: number
    name: string
    quantity: number
    unit: Unit
    price: number
    currency: CurrencyCode
    categoryId: string
    brand: string
    store?: string
    inCart: boolean       // checked = in cart
    createdAt: string
}
