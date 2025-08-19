import Link from 'next/link'

export default function BillingCancelPage() {
  return (
    <div className="container mx-auto max-w-xl py-16 text-center space-y-6">
      <h1 className="text-3xl font-bold text-secondary-900">Payment canceled</h1>
      <p className="text-secondary-600">You can upgrade anytime to enjoy Premium features.</p>
      <Link href="/billing" className="btn-secondary btn-animate">Back to Billing</Link>
    </div>
  )
}
