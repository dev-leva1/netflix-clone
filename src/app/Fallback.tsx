import styled from '@emotion/styled'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 12px;
  text-align: center;
  padding: 24px;
`

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
`

const Desc = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
`

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
`

export const Fallback = () => {
  return (
    <Container role="alert" aria-live="assertive">
      <Title>Что-то пошло не так</Title>
      <Desc>Попробуйте обновить страницу. Если проблема сохраняется — вернитесь позже.</Desc>
      <Button onClick={() => window.location.reload()}>Обновить</Button>
    </Container>
  )
}


