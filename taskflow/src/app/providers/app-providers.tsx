import { AuthProvider } from '../../features/auth'

type AppProvidersProps = {
    children: React.ReactNode
    }

    export function AppProviders({ children }: AppProvidersProps) {
    return <AuthProvider>{children}</AuthProvider>
    }