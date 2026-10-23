import { Button, Input } from '../../../components/ui'
import { useAuth } from '../hooks/use-auth'
import { useLogin } from '../hooks/use-login'
import { useNavigate } from 'react-router-dom'

export function LoginForm() {
  const { login, loading } = useLogin()
  const { login: setSession } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await login(email, password)

    setSession(result.user, result.token)
    navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        placeholder="Email"
      />

      <Input
        name="password"
        type="password"
        placeholder="Password"
      />

      <Button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Log in'}
      </Button>
    </form>
  )
}
