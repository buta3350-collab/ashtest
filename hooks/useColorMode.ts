'use client'
import { useCallback } from 'react'

export function useColorMode() {
  const toggle = useCallback(() => {
    const isLight = document.documentElement.classList.toggle('light')
    localStorage.setItem('shabani-modus', isLight ? 'light' : 'dark')
  }, [])

  return { toggle }
}
