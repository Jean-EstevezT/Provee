import type { CurrencyCode } from '../data/currencies'

export interface AppConfig {
    id?: number // Always 1
    displayCurrency: CurrencyCode
    exchangeRates: Record<CurrencyCode, number> // Valued relative to 1 USD
}
