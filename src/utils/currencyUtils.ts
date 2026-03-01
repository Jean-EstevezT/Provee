import type { CurrencyCode } from '../data/currencies'

/**
 * Converts an amount from one currency to another using a dictionary of rates relative to USD.
 * 
 * @param amount The numerical amount to convert
 * @param from The currency code the amount is currently in
 * @param to The target currency code to display
 * @param rates A dictionary of exchange rates where keys are CurrencyCodes and values are their worth in 1 USD (e.g. { USD: 1, COP: 3700 })
 * @returns The converted amount
 */
export function convertCurrency(
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode,
    rates: Record<CurrencyCode, number>
): number {
    if (from === to) return amount

    // 1. Convert initial amount to USD Base
    // If 1 USD = 3700 COP, and we have 7400 COP, then base USD is 7400/3700 = 2 USD
    const fromRate = rates[from] || 1 // Fallback to 1 if missing
    const amountInUSD = amount / fromRate

    // 2. Convert USD Base to Target Currency
    // If Target is EUR and 1 USD = 0.9 EUR, then 2 USD * 0.9 = 1.8 EUR
    const toRate = rates[to] || 1 // Fallback to 1 if missing

    return amountInUSD * toRate
}
