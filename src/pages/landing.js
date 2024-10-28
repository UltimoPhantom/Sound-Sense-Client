import FeatureSection from "./feature"
import HeroSection from "./HeroSection"
import Navbar from "./Navbar"
import Footer from "./Footer"

const LandingPage = () => {
  return (
    <>

      <Navbar />

      <div id="hero">
        <HeroSection />
      </div>

      <div id="features">
        <FeatureSection />
      </div>



      <div id="contact-us">
        <Footer />
      </div>

    </>
  )
}
export default LandingPage