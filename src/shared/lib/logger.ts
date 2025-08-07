type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEvent {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  error?: unknown
  timestamp: string
}

let subscribers: Array<(event: LogEvent) => void> = []

export const logger = {
  subscribe(listener: (event: LogEvent) => void) {
    subscribers.push(listener)
    return () => {
      subscribers = subscribers.filter((l) => l !== listener)
    }
  },
  emit(event: LogEvent) {
    for (const s of subscribers) s(event)
  },
  log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown) {
    const event: LogEvent = { level, message, timestamp: new Date().toISOString() }
    if (context) {
      event.context = context
    }
    if (error !== undefined) {
      event.error = error
    }
    if (import.meta.env.DEV) {
      // консоль в dev
      const payload = context ? { ...context, error } : error ? { error } : undefined
      // eslint-disable-next-line no-console
      if (payload) {
        console[level === 'debug' ? 'log' : level](`[${event.timestamp}] ${message}`, payload)
      } else {
        console[level === 'debug' ? 'log' : level](`[${event.timestamp}] ${message}`)
      }
    }
    this.emit(event)
  },
  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context)
  },
  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context)
  },
  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context)
  },
  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.log('error', message, context, error)
  },
}

export type { LogEvent, LogLevel }


