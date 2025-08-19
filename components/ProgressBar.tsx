'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function ProgressBar() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    // показуємо бар при зміні шляху і перезапускаємо анімацію
    setVisible(true)
    setKey(prev => prev + 1)
    const timer = setTimeout(() => setVisible(false), 500) // швидко зникає
    return () => clearTimeout(timer)
  }, [pathname])

  if (!visible) return null
  return (
    <div className="route-progress">
      <div key={key} className="route-progress-bar" />
    </div>
  )
}
