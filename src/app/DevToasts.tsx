import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { logger, type LogEvent } from '@/shared/lib/logger'

const Container = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
`

const Toast = styled.div<{ level: LogEvent['level'] }>`
  min-width: 260px;
  max-width: 420px;
  padding: 12px 14px;
  border-radius: 10px;
  color: #fff;
  background: ${({ level }) =>
    level === 'error' ? 'rgba(220, 38, 38, 0.9)'
    : level === 'warn' ? 'rgba(234, 179, 8, 0.9)'
    : 'rgba(37, 99, 235, 0.9)'};
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  font-size: 14px;
`

export const DevToasts = () => {
  const [events, setEvents] = useState<LogEvent[]>([])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const unsub = logger.subscribe((e) => {
      if (e.level === 'error' || e.level === 'warn') {
        setEvents((prev) => [...prev.slice(-3), e])
        setTimeout(() => {
          setEvents((prev) => prev.filter((x) => x !== e))
        }, 4000)
      }
    })
    return unsub
  }, [])

  if (!import.meta.env.DEV || events.length === 0) return null

  return (
    <Container role="status" aria-live="polite">
      {events.map((e, idx) => (
        <Toast key={idx} level={e.level}>
          {e.message}
        </Toast>
      ))}
    </Container>
  )
}


