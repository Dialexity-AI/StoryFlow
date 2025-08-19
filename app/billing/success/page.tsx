import Link from 'next/link'

export default function BillingSuccessPage() {
  return (
    <div className="container mx-auto max-w-xl py-16 text-center space-y-6">
      <h1 className="text-3xl font-bold text-secondary-900">Thank you for upgrading!</h1>
      <p className="text-secondary-600">Your Premium is now active. Enjoy ad‑free reading and faster generation.</p>
      <Link href="/library" className="btn-primary btn-animate">Go to Library</Link>
    </div>
  )
}
