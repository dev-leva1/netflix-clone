import styled from '@emotion/styled'
import { useAppStore } from '@/shared/lib/store'

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
`

const Logo = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
`

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 2rem;
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

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

export const Header = () => {
  const { searchQuery, setSearchQuery, toggleSidebar } = useAppStore()

  return (
    <HeaderContainer>
      <MenuButton onClick={toggleSidebar}>
        ☰
      </MenuButton>
      
      <Logo>NETFLIX</Logo>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Поиск фильмов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      
      <UserActions>
        <MenuButton>👤</MenuButton>
      </UserActions>
    </HeaderContainer>
  )
} 