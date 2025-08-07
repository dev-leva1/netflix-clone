import '@emotion/react'
import type { AppTheme } from './index'

declare module '@emotion/react' {
  export interface Theme extends AppTheme {
    // extendable theme marker to satisfy no-empty-interface
    __brand?: 'AppTheme'
  }
}