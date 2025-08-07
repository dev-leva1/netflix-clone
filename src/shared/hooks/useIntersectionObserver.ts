import { useEffect, useRef, useCallback } from 'react'

interface UseIntersectionOptions extends IntersectionObserverInit {
  throttleMs?: number
}

export const useIntersectionObserver = (
  onIntersect: () => void,
  {
    root = null,
    rootMargin = '600px',
    threshold = 0,
    throttleMs = 500,
  }: UseIntersectionOptions = {}
) => {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const lastTriggeredAtRef = useRef<number>(0)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const now = Date.now()
      if (now - lastTriggeredAtRef.current < throttleMs) return

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lastTriggeredAtRef.current = now
          onIntersect()
        }
      })
    },
    [onIntersect, throttleMs]
  )

  useEffect(() => {
    if (!targetRef.current) return

    const observer = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold,
    })

    observer.observe(targetRef.current)

    return () => {
      observer.disconnect()
    }
  }, [handleIntersect, root, rootMargin, threshold])

  return { targetRef }
}


