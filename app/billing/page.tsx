import CheckoutCard from '@/components/CheckoutCard'
import BillingActions from '@/components/BillingActions'

export default function BillingPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12 space-y-6">
      <h1 className="text-3xl font-bold text-secondary-900 mb-2 text-center">Upgrade to Premium</h1>
      <p className="text-secondary-600 text-center">Support the project and get the best experience</p>
      <CheckoutCard />
      <BillingActions />
    </div>
  )
}
