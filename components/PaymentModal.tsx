'use client'

import { useEffect, useMemo, useState } from 'react'
import { XMarkIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface PlanInfo {
  name: string
  price: string
  period: string
}

interface PaymentModalProps {
  open: boolean
  plan: PlanInfo | null
  onClose: () => void
}

export default function PaymentModal({ open, plan, onClose }: PaymentModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [promo, setPromo] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (open) {
      const t = requestAnimationFrame(() => setVisible(true))
      // lock background scroll
      document.body.style.overflow = 'hidden'
      return () => {
        cancelAnimationFrame(t)
        document.body.style.overflow = ''
      }
    } else {
      setVisible(false)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (open) {
      try {
        const u = localStorage.getItem('sf_user')
        if (u) {
          const parsed = JSON.parse(u)
          setName(parsed?.name || '')
          setEmail(parsed?.email || '')
        }
      } catch {}
    }
  }, [open])

  const disabled = useMemo(() => {
    if (processing) return true
    return !email || !name || card.replace(/\s/g, '').length < 12 || !expiry || cvc.length < 3
  }, [processing, email, name, card, expiry, cvc])

  const handlePay = async () => {
    setProcessing(true)
    setSuccess(false)
    await new Promise((r) => setTimeout(r, 800))
    setProcessing(false)
    setSuccess(true)
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onClose(), 220)
  }

  const maskedPrice = useMemo(() => {
    if (!plan) return ''
    return `${plan.price} / ${plan.period}`
  }, [plan])

  if (!open || !plan) return null

  return (
    <div
      className={`modal-overlay flex items-center justify-center px-4 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div
        className={`modal-content ${visible ? 'show' : ''} w-full max-w-lg p-5 md:p-6 max-h-[85vh] overflow-y-auto rounded-2xl`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-secondary-900">Checkout</h3>
            <p className="text-secondary-600">{plan.name} • {maskedPrice}</p>
          </div>
          <button onClick={handleClose} className="text-secondary-600 hover:text-secondary-900 transition-colors">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-6 md:py-8">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-lg md:text-xl font-semibold text-secondary-900 mb-2">Payment simulated</h4>
            <p className="text-secondary-600 mb-6">Thanks! You now have Premium in demo mode.</p>
            <button onClick={handleClose} className="btn-primary btn-animate">Done</button>
          </div>
        ) : (
          <div className="space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Card number</label>
                <input
                  inputMode="numeric"
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  className="input-field"
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">Expiry</label>
                  <input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">CVC</label>
                  <input
                    inputMode="numeric"
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Promo code</label>
                <div className="flex gap-2">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Enter code"
                  />
                  <button type="button" className="btn-secondary">Apply</button>
                </div>
              </div>
            </div>

            <div className="bg-secondary-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-secondary-700">Plan</div>
                <div className="font-medium text-secondary-900">{plan.name}</div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-secondary-700">Price</div>
                <div className="font-medium text-secondary-900">{maskedPrice}</div>
              </div>
              {promo && (
                <div className="flex items-center justify-between mt-2">
                  <div className="text-secondary-700">Promo</div>
                  <div className="font-medium text-green-600">Applied</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-secondary-600">Secure checkout</div>
              <div className="inline-flex items-center gap-1 text-primary-700">
                <SparklesIcon className="h-4 w-4" /> <span className="text-sm">StoryFlow</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={disabled}
              className="w-full btn-primary btn-animate hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing…' : `Pay ${plan.price}`}
            </button>
            <p className="text-xs text-secondary-500 text-center">By continuing you agree to the Terms and Privacy Policy.</p>
          </div>
        )}
      </div>
    </div>
  )
}
