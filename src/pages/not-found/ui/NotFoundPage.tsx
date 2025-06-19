import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
`

const NotFoundTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 4rem;
  margin-bottom: 1rem;
`

const NotFoundText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.2rem;
  margin-bottom: 2rem;
`

const HomeLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 1rem 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  font-weight: 600;
  transition: background-color ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: #c50813;
  }
`

export const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <NotFoundTitle>404</NotFoundTitle>
      <NotFoundText>Страница не найдена</NotFoundText>
      <HomeLink to="/">Вернуться на главную</HomeLink>
    </NotFoundContainer>
  )
} 