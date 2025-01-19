import Hero from './components/Hero'
import Services from './components/Services'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PhpSolutions from './components/PhpSolutions'
import Blog from './components/Blog'
import type { FC } from 'react'

const Home: FC = () => {
    return (
        <main>
            <Navbar />
            <Hero />
            <PhpSolutions />
            <Services />
            <About />
            <Projects />
            <Blog />
            <Contact />
            <Footer />
        </main>
    )
}

export default Home 