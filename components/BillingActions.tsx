'use client'

export default function BillingActions() {
  const handleManageBilling = async () => {
    try {
      let customerId: string | undefined
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('sf_user') : null
        if (stored) {
          const user = JSON.parse(stored)
          customerId = user?.stripeCustomerId
        }
      } catch {}

      const res = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      }
    } catch {}
  }

  return (
    <div className="flex justify-center">
      <button onClick={handleManageBilling} className="btn-secondary btn-animate">Manage Billing</button>
    </div>
  )
}
