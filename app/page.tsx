import Loader from '@/components/Loader'
import Nav from '@/components/Nav'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import CEO from '@/components/sections/CEO'
import Vehicles from '@/components/sections/Vehicles'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import Reviews from '@/components/sections/Reviews'
import CTA from '@/components/sections/CTA'
import Footer from '@/components/sections/Footer'
import BookingModal from '@/components/BookingModal'
import PageTransition from '@/components/PageTransition'
import ClientInit from '@/components/ClientInit'
import SplashChoice from '@/components/SplashChoice'
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
        <About />
        <CEO />
        <Vehicles />
        <Services />
        <Process />
        <Reviews />
        <CTA />
      </main>
      <Footer />
      <BookingModal />
      <PageTransition />
      <ClientInit />
      <SplashChoice />
      <SectionIndicator />
    </>
  )
}
