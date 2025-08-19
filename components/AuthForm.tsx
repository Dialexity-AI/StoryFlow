'use client'

import { useState } from 'react'
import Link from 'next/link'

type Mode = 'login' | 'signup'

interface Props {
  mode: Mode
}

export default function AuthForm({ mode }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  const isSignup = mode === 'signup'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password || (isSignup && !name)) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      const res = await fetch(`${base}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Invalid credentials' }))
        setError(err.error || 'Invalid credentials')
        return
      }

      const data = await res.json()
      localStorage.setItem('sf_user', JSON.stringify(data.user))
      window.location.href = '/library'
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isSignup && (
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full"
            placeholder="Your name"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field w-full"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">Password</label>
        <div className="flex items-center gap-2">
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="btn-secondary px-3 py-2"
          >
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">{error}</div>}

      <button type="submit" disabled={loading} className="w-full btn-primary btn-animate">
        {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
      </button>

      <button type="button" disabled className="w-full btn-secondary">
        Continue with Google (soon)
      </button>

      <p className="text-sm text-secondary-600 text-center">
        {isSignup ? (
          <>Already have an account? <Link className="nav-link" href="/login">Sign in</Link></>
        ) : (
          <>Don&apos;t have an account? <Link className="nav-link" href="/signup">Create one</Link></>
        )}
      </p>
    </form>
  )
}
