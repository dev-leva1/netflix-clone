import styled from '@emotion/styled'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '@/shared/lib/store'
import { useEffect, useRef, useState } from 'react'
import { config } from '@/shared/config'
import * as Dialog from '@radix-ui/react-dialog'

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 0 20px rgba(0,0,0,0.4);
  transition: transform ${({ theme }) => theme.transitions.default}, width ${({ theme }) => theme.transitions.default};
  z-index: 200;
  overflow: hidden;
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    transform: none;
    width: ${({ isOpen }) => (isOpen ? '240px' : '60px')};
  }
`

const SidebarContent = styled.div`
  padding: 1rem 0;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const NavList = styled.nav`
  flex: 1;
  padding: 1rem 0;
`

const NavItem = styled(Link)<{ isActive: boolean; isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.text.secondary};
  background-color: ${({ isActive }) => 
    isActive ? 'rgba(229, 9, 20, 0.1)' : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.default};
  border-left: ${({ isActive, theme }) => 
    isActive ? `3px solid ${theme.colors.primary}` : '3px solid transparent'};
  min-height: 44px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${({ theme }) => theme.colors.text.primary};
  }
`

const NavIcon = styled.span`
  font-size: 1.5rem;
  min-width: 24px;
  text-align: center;
`

const NavText = styled.span<{ isOpen: boolean }>`
  margin-left: 1rem;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: opacity ${({ theme }) => theme.transitions.default};
  white-space: nowrap;
`

const menuItems = [
  { path: '/', icon: '🏠', label: 'Главная' },
  { path: '/search', icon: '🔍', label: 'Поиск' },
  { path: '/favorites', icon: '❤️', label: 'Избранное' },
]

export const Sidebar = () => {
  const location = useLocation()
  const sidebarOpen = useAppStore(state => state.sidebarOpen)
  const toggleSidebar = useAppStore(state => state.toggleSidebar)

  const [isMobile, setIsMobile] = useState<boolean>(false)
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${config.ui.breakpoints.md - 1}px)`)
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile('matches' in e ? e.matches : (e as MediaQueryList).matches)
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Close on route change in mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Focus trap and ESC close in mobile drawer
  useEffect(() => {
    if (!(isMobile && sidebarOpen)) return

    const sidebarEl = containerRef.current
    if (!sidebarEl) return

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="search"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',')

    const focusables = Array.from(sidebarEl.querySelectorAll<HTMLElement>(focusableSelectors))
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    first?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        toggleSidebar()
      }
      if (e.key === 'Tab' && focusables.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMobile, sidebarOpen, toggleSidebar])

  if (isMobile) {
    return (
      <Dialog.Root open={sidebarOpen} onOpenChange={toggleSidebar}>
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 150 }} />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <SidebarContainer
              id="app-sidebar"
              isOpen={sidebarOpen}
              ref={containerRef as unknown as React.RefObject<HTMLElement>}
              role="dialog"
              aria-modal
              aria-label="Основная навигация"
            >
              <SidebarContent>
                <NavList>
                  {menuItems.map((item) => (
                    <NavItem
                      key={item.path}
                      to={item.path}
                      isActive={location.pathname === item.path}
                      isOpen={sidebarOpen}
                      onClick={() => { if (sidebarOpen) toggleSidebar() }}
                    >
                      <NavIcon>{item.icon}</NavIcon>
                      <NavText isOpen={sidebarOpen}>{item.label}</NavText>
                    </NavItem>
                  ))}
                </NavList>
              </SidebarContent>
            </SidebarContainer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  return (
    <SidebarContainer
      id="app-sidebar"
      isOpen={sidebarOpen}
      ref={containerRef as unknown as React.RefObject<HTMLElement>}
      role="navigation"
      aria-label="Основная навигация"
    >
      <SidebarContent>
        <NavList>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              isActive={location.pathname === item.path}
              isOpen={sidebarOpen}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavText isOpen={sidebarOpen}>{item.label}</NavText>
            </NavItem>
          ))}
        </NavList>
      </SidebarContent>
    </SidebarContainer>
  )
} 