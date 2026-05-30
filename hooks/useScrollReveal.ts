'use client'
import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on')
            ro.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-line').forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [])
}
