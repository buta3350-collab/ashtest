'use client'
import { useEffect, useRef } from 'react'

export function useNavScroll(navRef: React.RefObject<HTMLElement | null>) {
  const state = useRef({
    expandedW: 0,
    prevScrollY: 0,
    collapseScrollY: 0,
    isCollapsed: false,
  })

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const isMobile = () => window.innerWidth <= 768

    function initWidth() {
      const s = state.current
      if (isMobile()) {
        nav!.style.removeProperty('width')
        nav!.classList.remove('nav-collapsed')
        s.isCollapsed = false
        return
      }
      nav!.style.removeProperty('width')
      nav!.classList.remove('nav-collapsed')
      s.isCollapsed = false
      s.expandedW = nav!.offsetWidth
      nav!.style.width = s.expandedW + 'px'
    }

    document.fonts.ready.then(() => setTimeout(initWidth, 80))
    window.addEventListener('resize', initWidth, { passive: true })

    function onScroll() {
      const s = state.current
      const sy = window.scrollY

      if (isMobile()) {
        nav!.classList.toggle('glass', sy > 60)
        s.prevScrollY = sy
        return
      }

      if (!s.isCollapsed && sy > s.prevScrollY && sy > 60) {
        s.isCollapsed = true
        s.collapseScrollY = sy
        nav!.style.width = '160px'
        nav!.classList.add('nav-collapsed')
      } else if (s.isCollapsed && sy < s.prevScrollY && s.collapseScrollY - sy > 30) {
        s.isCollapsed = false
        nav!.style.width = s.expandedW + 'px'
        nav!.classList.remove('nav-collapsed')
      }

      s.prevScrollY = sy
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    function onNavClick() {
      const s = state.current
      if (s.isCollapsed && !isMobile()) {
        s.isCollapsed = false
        nav!.style.width = s.expandedW + 'px'
        nav!.classList.remove('nav-collapsed')
        s.collapseScrollY = window.scrollY
      }
    }

    nav.addEventListener('click', onNavClick)

    return () => {
      window.removeEventListener('resize', initWidth)
      window.removeEventListener('scroll', onScroll)
      nav.removeEventListener('click', onNavClick)
    }
  }, [navRef])
}
