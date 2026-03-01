import type { CurrencyCode } from '../data/currencies'

export interface ShoppingItem {
    id?: number
    name: string
    quantity: number
    unit: string
    price: number
    currency: CurrencyCode
    categoryId: string
    brand: string
    inCart: boolean       // checked = in cart
    createdAt: string
}
