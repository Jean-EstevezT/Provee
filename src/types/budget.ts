import type { CurrencyCode } from '../data/currencies'

export type BudgetPeriod = 'weekly' | 'biweekly' | 'monthly'

export interface BudgetConfig {
    id?: number // Always 1
    amount: number
    period: BudgetPeriod
    currency: CurrencyCode
}
