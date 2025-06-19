import { Providers } from './app/providers'
import { AppRouter } from './app/router'
import { Layout } from './widgets/layout'

function App() {
  return (
    <Providers>
      <Layout>
        <AppRouter />
      </Layout>
    </Providers>
  )
}

export default App
