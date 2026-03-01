import Dexie, { type EntityTable } from 'dexie'
import type { PantryItem } from '../types/pantry'
import type { ShoppingItem } from '../types/shopping'
import type { Category } from '../data/categories'
import type { HistoryItem } from '../types/history'
import type { BudgetConfig } from '../types/budget'

const db = new Dexie('ProveeDB') as Dexie & {
    pantryItems: EntityTable<PantryItem, 'id'>
    brands: EntityTable<{ id?: number; name: string }, 'id'>
    stores: EntityTable<{ id?: number; name: string }, 'id'>
    categories: EntityTable<Category & { id: string }, 'id'>
    shoppingItems: EntityTable<ShoppingItem, 'id'>
    historyItems: EntityTable<HistoryItem, 'id'>
    budgetConfig: EntityTable<BudgetConfig, 'id'>
}

db.version(1).stores({
    pantryItems: '++id, name, categoryId, brand, store, expirationDate',
    brands: '++id, &name',
    stores: '++id, &name',
})

db.version(2).stores({
    pantryItems: '++id, name, categoryId, brand, store, expirationDate, currency',
    brands: '++id, &name',
    stores: '++id, &name',
})

db.version(3).stores({
    pantryItems: '++id, name, categoryId, brand, store, expirationDate, currency',
    brands: '++id, &name',
    stores: '++id, &name',
    categories: 'id, &name',
})

db.version(4).stores({
    pantryItems: '++id, name, categoryId, brand, store, expirationDate, currency',
    brands: '++id, &name',
    stores: '++id, &name',
    categories: 'id, &name',
    shoppingItems: '++id, name, categoryId, inCart',
})

db.version(5).stores({
    pantryItems: '++id, name, categoryId, brand, store, expirationDate, currency',
    brands: '++id, &name',
    stores: '++id, &name',
    categories: 'id, &name',
    shoppingItems: '++id, name, categoryId, brand, store, inCart',
})

db.version(6).stores({
    pantryItems: '++id, name, categoryId, brand, store, expirationDate, currency',
    brands: '++id, &name',
    stores: '++id, &name',
    categories: 'id, &name',
    shoppingItems: '++id, name, categoryId, brand, store, inCart',
    historyItems: '++id, date',
})

db.version(7).stores({
    pantryItems: '++id, name, categoryId, brand, store, expirationDate, currency',
    brands: '++id, &name',
    stores: '++id, &name',
    categories: 'id, &name',
    shoppingItems: '++id, name, categoryId, brand, store, inCart',
    historyItems: '++id, date',
    budgetConfig: '++id',
})

export { db }
