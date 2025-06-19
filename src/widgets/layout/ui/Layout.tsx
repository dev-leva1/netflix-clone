import styled from '@emotion/styled'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useAppStore } from '@/shared/lib/store'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? '240px' : '60px')};
  transition: margin-left ${({ theme }) => theme.transitions.default};
  padding: 0;
`

const ContentWrapper = styled.div`
  padding-top: 70px;
  min-height: 100vh;
`

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const sidebarOpen = useAppStore(state => state.sidebarOpen)

  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent sidebarOpen={sidebarOpen}>
        <Header />
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  )
} 