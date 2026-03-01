import { useLiveQuery } from 'dexie-react-hooks'
import { defaultCategories, type Category } from '../data/categories'
import { db } from '../db/db'

/**
 * Returns all categories: defaults + custom from IndexedDB.
 * Reactively updates when custom categories change.
 */
export function useAllCategories(): Category[] {
    const custom = useLiveQuery(() => db.categories.toArray()) ?? []
    return [...defaultCategories, ...custom]
}
