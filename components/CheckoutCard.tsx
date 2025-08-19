'use client'

import { useState } from 'react'

export default function CheckoutCard() {
  const [loading, setLoading] = useState(false)
  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      if (!res.ok) {
        // demo redirect
        window.location.href = '/premium?success=1'
        return
      }
      const data = await res.json()
      window.location.href = data.url || '/premium?success=1'
    } catch {
      window.location.href = '/premium?success=1'
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">Premium</h3>
      <p className="text-secondary-600 mb-4">Ad‑free reading, unlimited access, faster generation</p>
      <div className="text-3xl font-bold text-secondary-900 mb-4">$9.99 <span className="text-base text-secondary-500">/ month</span></div>
      <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full btn-animate">
        {loading ? 'Redirecting…' : 'Start Premium'}
      </button>
    </div>
  )
}
