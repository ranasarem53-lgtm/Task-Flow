import { AppProviders } from './providers/app-providers'
import { AppLayout } from  '../components/layout/app-layout'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import '../styles/App.css'
import '../styles/dashboard.css'

function App() {
  return (
    <AppProviders>
      <AppLayout>
        <RouterProvider router={router} />
      </AppLayout>
    </AppProviders>
  )
}

export default App