import type { BudgetPeriod } from '../types/budget'

/**
 * Returns the start and end of the current day in ISO string format.
 */
export function getTodayBounds(): { start: string; end: string } {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    return { start: start.toISOString(), end: end.toISOString() }
}

/**
 * Returns the start and end ISO strings for the current period
 * based on the selected BudgetPeriod type.
 */
export function getCurrentPeriodBounds(period: BudgetPeriod): { start: string; end: string } {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const date = now.getDate()

    let start: Date
    let end: Date

    switch (period) {
        case 'weekly':
            // Assume week starts on Monday (1) and ends on Sunday (0)
            const dayOfWeek = now.getDay()
            // distance back to Monday (if today is Sunday(0), go back 6 days)
            const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

            start = new Date(year, month, date - diffToMonday, 0, 0, 0)
            end = new Date(year, month, start.getDate() + 6, 23, 59, 59, 999)
            break

        case 'biweekly': // Quincenal
            if (date <= 15) {
                // First bi-week: 1st to 15th
                start = new Date(year, month, 1, 0, 0, 0)
                end = new Date(year, month, 15, 23, 59, 59, 999)
            } else {
                // Second bi-week: 16th to End of Month
                start = new Date(year, month, 16, 0, 0, 0)
                // To get the last day of the month, ask for day 0 of the NEXT month
                end = new Date(year, month + 1, 0, 23, 59, 59, 999)
            }
            break

        case 'monthly':
            start = new Date(year, month, 1, 0, 0, 0)
            end = new Date(year, month + 1, 0, 23, 59, 59, 999)
            break

        default:
            // Fallback to monthly
            start = new Date(year, month, 1, 0, 0, 0)
            end = new Date(year, month + 1, 0, 23, 59, 59, 999)
    }

    return {
        start: start.toISOString(),
        end: end.toISOString(),
    }
}

/**
 * Formats a Date range into a human-readable string.
 * Example: "1 - 15 de Oct" or "12 - 18 de Nov"
 */
export function formatPeriodBounds(startIso: string, endIso: string): string {
    const s = new Date(startIso)
    const e = new Date(endIso)

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    if (s.getMonth() === e.getMonth()) {
        return `${s.getDate()} - ${e.getDate()} de ${monthNames[s.getMonth()]}`
    } else {
        return `${s.getDate()} ${monthNames[s.getMonth()]} - ${e.getDate()} ${monthNames[e.getMonth()]}`
    }
}
