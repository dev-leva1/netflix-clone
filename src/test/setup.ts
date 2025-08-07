import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { server } from './mocks/server'

// jsdom polyfill for matchMedia used in components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// IntersectionObserver polyfill stub for jsdom
class IO {
  observe(element: Element) {
    void element
  }
  unobserve(element: Element) {
    void element
  }
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return [] }
}
// assign to jsdom global
;(globalThis as unknown as { IntersectionObserver: typeof IO }).IntersectionObserver = IO

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())


