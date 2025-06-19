import styled from '@emotion/styled'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '@/shared/lib/store'

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${({ isOpen }) => (isOpen ? '240px' : '60px')};
  background-color: ${({ theme }) => theme.colors.surface};
  transition: width ${({ theme }) => theme.transitions.default};
  z-index: 50;
  overflow: hidden;
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

  return (
    <SidebarContainer isOpen={sidebarOpen}>
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