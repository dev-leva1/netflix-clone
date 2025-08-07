import styled from '@emotion/styled'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useAppStore } from '@/shared/lib/store'
import { useCallback, useEffect, useState } from 'react'
import { config } from '@/shared/config'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  margin-left: 0;
  transition: margin-left ${({ theme }) => theme.transitions.default};
  padding: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    margin-left: ${({ sidebarOpen }) => (sidebarOpen ? '240px' : '60px')};
  }
`

const ContentWrapper = styled.div`
  padding-top: 70px;
  min-height: 100vh;
`

const Backdrop = styled.div<{ show: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${({ show }) => (show ? 1 : 0)};
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
  transition: opacity ${({ theme }) => theme.transitions.default};
  z-index: 150;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    display: none;
  }
`

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const sidebarOpen = useAppStore(state => state.sidebarOpen)
  const toggleSidebar = useAppStore(state => state.toggleSidebar)

  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${config.ui.breakpoints.md - 1}px)`)
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile('matches' in e ? e.matches : (e as MediaQueryList).matches)
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const closeSidebar = useCallback(() => {
    if (sidebarOpen) toggleSidebar()
  }, [sidebarOpen, toggleSidebar])

  return (
    <LayoutContainer>
      <Sidebar />
      <Backdrop show={isMobile && sidebarOpen} onClick={closeSidebar} />
      <MainContent sidebarOpen={sidebarOpen}>
        <Header />
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  )
} 