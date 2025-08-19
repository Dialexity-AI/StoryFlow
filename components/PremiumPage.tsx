'use client'

import { useState } from 'react'
import { CheckIcon, StarIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import PaymentModal from './PaymentModal'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Access to basic stories',
      'Standard reading experience',
      'Basic search and filters',
      'Community ratings',
    ],
    limitations: [
      'Limited to 10 stories per day',
      'Ad-supported',
      'No access to premium stories',
      'Standard generation speed',
    ],
    buttonText: 'Current Plan',
    buttonVariant: 'secondary' as const,
  },
  {
    name: 'Premium',
    price: '$9.99',
    period: 'per month',
    popular: true,
    features: [
      'Unlimited story access',
      'Ad-free experience',
      'Access to premium stories',
      'Faster story generation',
      'Advanced search filters',
      'Priority customer support',
      'Download stories offline',
      'Custom reading preferences',
    ],
    buttonText: 'Start Premium Trial',
    buttonVariant: 'primary' as const,
  },
  {
    name: 'Pro',
    price: '$19.99',
    period: 'per month',
    features: [
      'Everything in Premium',
      'Exclusive Pro stories',
      'Early access to new features',
      'Advanced analytics',
      'API access',
      'Custom story recommendations',
      'Priority story generation',
      'Dedicated support',
    ],
    buttonText: 'Go Pro',
    buttonVariant: 'primary' as const,
  },
]

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState('Premium')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPlan, setModalPlan] = useState<{ name: string; price: string; period: string } | null>(null)

  const handleChoose = (plan: any) => {
    if (plan.buttonVariant === 'secondary') return
    setModalPlan({ name: plan.name, price: plan.price, period: plan.period })
    setModalOpen(true)
  }

  return (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 text-fade-in">
          <SparklesIcon className="h-4 w-4" />
          <span>Upgrade Your Reading Experience</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 text-slide-up">
          Choose Your
          <span className="text-primary-600"> Plan</span>
        </h1>
        
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto text-fade-in">
          Unlock unlimited access to AI-generated stories, enjoy an ad-free experience, 
          and get exclusive premium content with our flexible subscription plans.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative card hover-lift ${
              plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
            }`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-secondary-900">{plan.price}</span>
                <span className="text-secondary-600">/{plan.period}</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Features */}
              <div>
                <h4 className="font-semibold text-secondary-900 mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-secondary-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations (for free plan) */}
              {plan.limitations && (
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-3">Limitations:</h4>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0">✕</div>
                        <span className="text-secondary-600">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={() => handleChoose(plan)}
                className={`w-full py-3 px-6 rounded-lg font-medium btn-animate hover-lift ${
                  plan.buttonVariant === 'primary'
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-secondary-200 hover:bg-secondary-300 text-secondary-800'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      <PaymentModal open={modalOpen} plan={modalPlan} onClose={() => setModalOpen(false)} />

      {/* Features Comparison */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
          Compare Features
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-4 px-4 font-semibold text-secondary-900">Feature</th>
                <th className="text-center py-4 px-4 font-semibold text-secondary-900">Free</th>
                <th className="text-center py-4 px-4 font-semibold text-secondary-900">Premium</th>
                <th className="text-center py-4 px-4 font-semibold text-secondary-900">Pro</th>
              </tr>
            </thead>
            <tbody className="space-y-4">
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-4 text-secondary-700">Daily Story Limit</td>
                <td className="text-center py-4 px-4">10 stories</td>
                <td className="text-center py-4 px-4 text-green-600 font-medium">Unlimited</td>
                <td className="text-center py-4 px-4 text-green-600 font-medium">Unlimited</td>
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-4 text-secondary-700">Ad Experience</td>
                <td className="text-center py-4 px-4">Ad-supported</td>
                <td className="text-center py-4 px-4 text-green-600 font-medium">Ad-free</td>
                <td className="text-center py-4 px-4 text-green-600 font-medium">Ad-free</td>
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-4 text-secondary-700">Premium Stories</td>
                <td className="text-center py-4 px-4 text-red-500">✕</td>
                <td className="text-center py-4 px-4 text-green-600 font-medium">✓</td>
                <td className="text-center py-4 px-4 text-green-600 font-medium">✓</td>
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-4 text-secondary-700">Offline Reading</td>
                <td className="text-center py-4 px-4 text-red-500">✕</td>
                <td className="text-center py-4 px-4 text-green-600 font-medium">✓</td>
                <td className="text-center py-4 px-4 text-green-600 font-medium">✓</td>
              </tr>
              <tr className="border-b border-secondary-100">
                <td className="py-4 px-4 text-secondary-700">Priority Support</td>
                <td className="text-center py-4 px-4">Standard</td>
                <td className="text-center py-4 px-4 text-green-600 font-medium">Priority</td>
                <td className="text-center py-4 px-4 text-green-600 font-medium">Dedicated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-6 max-w-3xl mx-auto">
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2">
              Can I cancel my subscription anytime?
            </h3>
            <p className="text-secondary-600">
              Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2">
              Is there a free trial?
            </h3>
            <p className="text-secondary-600">
              Yes! We offer a 7-day free trial for all premium plans. No credit card required to start your trial.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-secondary-600">
              We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely through Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
