export function setSeo(title: string, description?: string): void {
  if (title) {
    document.title = title
  }
  if (description !== undefined) {
    const existing = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (existing) {
      existing.content = description
    } else {
      const m = document.createElement('meta')
      m.name = 'description'
      m.content = description
      document.head.appendChild(m)
    }
  }
}


