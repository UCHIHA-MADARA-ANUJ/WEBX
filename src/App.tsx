import { useEffect, useState } from 'react'
import Atmosphere from './components/Atmosphere'
import Boot from './components/Boot'
import Changelog from './components/Changelog'
import Contact from './components/Contact'
import Crew from './components/Crew'
import Hardware from './components/Hardware'
import Hero from './components/Hero'
import Nav from './components/Nav'
import Shell from './components/Shell'
import Systems from './components/Systems'
import Telemetry from './components/Telemetry'

export default function App() {
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    document.body.style.overflow = booted ? '' : 'hidden'
  }, [booted])

  return (
    <>
      <Atmosphere />
      {!booted && <Boot onDone={() => setBooted(true)} />}
      <Nav />
      <main className="relative">
        <Hero />
        <Telemetry />
        <Systems />
        <Hardware />
        <Shell />
        <Changelog />
        <Crew />
        <Contact />
      </main>
    </>
  )
}
