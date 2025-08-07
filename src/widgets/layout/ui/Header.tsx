import styled from '@emotion/styled'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppStore } from '@/shared/lib/store'
import { useSearchSuggestions } from '@/shared/hooks/useMovies'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 70px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 100;
  backdrop-filter: blur(10px);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    padding: 0 1rem;
  }
`

const Logo = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    font-size: 1.5rem;
  }
`

const SearchContainer = styled.div<{ isOpen: boolean }>`
  position: relative;
  flex: 1;
  max-width: 400px;
  margin: 0 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    max-width: none;
    margin: 0 1rem;
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  transition: all ${({ theme }) => theme.transitions.default};
  min-height: 44px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(255, 255, 255, 0.15);
  }
`

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const MenuButton = styled.button`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: background-color ${({ theme }) => theme.transitions.default};
  min-width: 44px;
  min-height: 44px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`

const SearchToggleButton = styled(MenuButton)`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    display: none;
  }
`

export const Header = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { searchQuery, setSearchQuery, toggleSidebar, addToSearchHistory, searchHistory } = useAppStore()
  const [focused, setFocused] = useState(false)
  const { data: suggestions } = useSearchSuggestions(searchQuery)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  useEffect(() => {
    const q = params.get('q') || ''
    if (q && q !== searchQuery) setSearchQuery(q)
  }, [params, searchQuery, setSearchQuery])

  // Keyboard shortcuts: '/' focus, 'Esc' close on mobile
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if (!isTyping && e.key === '/') {
        e.preventDefault()
        setMobileSearchOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      }
      if (e.key === 'Escape') setMobileSearchOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const list = useMemo(() => suggestions?.docs ?? [], [suggestions])

  const submit = (q: string) => {
    const next = q.trim()
    if (!next) return
    addToSearchHistory(next)
    const nextParams = new URLSearchParams(params)
    nextParams.set('q', next)
    nextParams.delete('page')
    navigate(`/search?${nextParams.toString()}`)
  }

  return (
    <HeaderContainer>
      <MenuButton
        type="button"
        onClick={toggleSidebar}
        aria-label="Открыть меню"
        aria-controls="app-sidebar"
      >
        ☰
      </MenuButton>

      <Logo>NETFLIX</Logo>

      <SearchContainer isOpen={mobileSearchOpen}>
        <SearchInput
          type="search"
          placeholder="Поиск фильмов..."
          value={searchQuery}
          ref={inputRef}
          aria-label="Поиск фильмов"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit(searchQuery)
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {focused && (list.length > 0 || searchHistory.length > 0) && (
          <div style={{ position: 'absolute', background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', marginTop: '8px', width: '100%', maxHeight: 360, overflowY: 'auto' }}>
            {searchHistory.slice(0, 5).map((q) => (
              <div key={`h-${q}`} style={{ padding: '8px 12px', cursor: 'pointer' }} onMouseDown={() => submit(q)}>
                {q}
              </div>
            ))}
            {list.map((m) => (
              <div key={m.id} style={{ padding: '8px 12px', cursor: 'pointer' }} onMouseDown={() => submit(m.name || '')}>
                {(m.name || 'Без названия') + (m.year ? ` (${m.year})` : '')}
              </div>
            ))}
          </div>
        )}
      </SearchContainer>

      <UserActions>
        <SearchToggleButton
          type="button"
          aria-label="Показать поиск"
          aria-controls="mobile-search-input"
          aria-expanded={mobileSearchOpen}
          onClick={() => {
            const next = !mobileSearchOpen
            setMobileSearchOpen(next)
            if (next) setTimeout(() => inputRef.current?.focus(), 0)
          }}
        >
          🔍
        </SearchToggleButton>
        <MenuButton type="button" aria-label="Профиль">👤</MenuButton>
      </UserActions>
    </HeaderContainer>
  )
} 