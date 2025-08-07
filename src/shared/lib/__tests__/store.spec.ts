import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../store'

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.getState().reset()
  })

  it('toggleFavorite adds and removes movie', () => {
    const movie = { id: 1, name: 'A' } as { id: number; name: string }
    useAppStore.getState().toggleFavorite(movie)
    expect(useAppStore.getState().movies.favorites.find(m => m.id === 1)).toBeTruthy()
    useAppStore.getState().toggleFavorite(movie)
    expect(useAppStore.getState().movies.favorites.find(m => m.id === 1)).toBeFalsy()
  })

  it('setSearchFilters merges and deletes undefined', () => {
    useAppStore.getState().setSearchFilters({ genre: 'drama', year: 2020, ratingFrom: 7 })
    expect(useAppStore.getState().searchFilters).toEqual({ genre: 'drama', year: 2020, ratingFrom: 7 })
    useAppStore.getState().setSearchFilters({ year: undefined })
    expect(useAppStore.getState().searchFilters).toEqual({ genre: 'drama', ratingFrom: 7 })
  })

  it('persist API is available (integration smoke)', () => {
    const persistApi = (useAppStore as unknown as { persist?: { rehydrate: () => void } }).persist
    expect(persistApi).toBeDefined()
    expect(typeof persistApi?.rehydrate).toBe('function')
  })
})


