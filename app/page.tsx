import Loader from '@/components/Loader'
import Nav from '@/components/Nav'
import Hero from '@/components/sections/Hero'
import Vehicles from '@/components/sections/Vehicles'
import Autocenter from '@/components/sections/Autocenter'
import Pflege from '@/components/sections/Pflege'
import CEO from '@/components/sections/CEO'
import About from '@/components/sections/About'
import Process from '@/components/sections/Process'
import Reviews from '@/components/sections/Reviews'
import CTA from '@/components/sections/CTA'
import Footer from '@/components/sections/Footer'
import BookingModal from '@/components/BookingModal'
import PageTransition from '@/components/PageTransition'
import ClientInit from '@/components/ClientInit'
import SectionIndicator from '@/components/SectionIndicator'

export default function Home() {
  return (
    <>
      <div id="red-smoke" aria-hidden="true">
        <div className="smoke-orb s1" />
        <div className="smoke-orb s2" />
        <div className="smoke-orb s3" />
        <div className="smoke-orb s4" />
        <div className="smoke-orb s5" />
      </div>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Vehicles />
        <Autocenter />
        <Pflege />
        <Process />
        <About />
        <CEO />
        <Reviews />
        <CTA />
      </main>
      <Footer />
      <BookingModal />
      <PageTransition />
      <ClientInit />
      <SectionIndicator />
    </>
  )
}
