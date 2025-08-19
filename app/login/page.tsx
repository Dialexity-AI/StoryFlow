import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-md py-12 page-transition">
      <h1 className="text-3xl font-bold text-secondary-900 mb-6 text-center">Sign in</h1>
      <div className="card">
        <AuthForm mode="login" />
      </div>
    </div>
  )
}
