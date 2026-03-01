/** Currencies supported in the app */
export const currencies = [
    { code: 'USD', symbol: '$', name: 'Dólar estadounidense' },
    { code: 'COP', symbol: '$', name: 'Peso colombiano' },
    { code: 'VES', symbol: 'Bs.', name: 'Bolívar venezolano' },
    { code: 'MXN', symbol: '$', name: 'Peso mexicano' },
    { code: 'ARS', symbol: '$', name: 'Peso argentino' },
    { code: 'CLP', symbol: '$', name: 'Peso chileno' },
    { code: 'PEN', symbol: 'S/', name: 'Sol peruano' },
    { code: 'BRL', symbol: 'R$', name: 'Real brasileño' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'BOB', symbol: 'Bs.', name: 'Boliviano' },
    { code: 'UYU', symbol: '$U', name: 'Peso uruguayo' },
    { code: 'PYG', symbol: '₲', name: 'Guaraní paraguayo' },
    { code: 'DOP', symbol: 'RD$', name: 'Peso dominicano' },
    { code: 'GTQ', symbol: 'Q', name: 'Quetzal guatemalteco' },
    { code: 'HNL', symbol: 'L', name: 'Lempira hondureño' },
    { code: 'NIO', symbol: 'C$', name: 'Córdoba nicaragüense' },
    { code: 'CRC', symbol: '₡', name: 'Colón costarricense' },
    { code: 'PAB', symbol: 'B/.', name: 'Balboa panameño' },
] as const

export type CurrencyCode = (typeof currencies)[number]['code']

/** Helper to get the symbol for a currency code */
export function getCurrencySymbol(code: string): string {
    return currencies.find((c) => c.code === code)?.symbol ?? '$'
}
