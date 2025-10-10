import { Routes, Route } from "react-router-dom"
import Home from '@/components/pages/Home.jsx'
import About from '@/components/pages/About.jsx'
import Navbar from '@/components/Navbar.jsx'
import HowItWork from '@/components/pages/Howitwork'
import PredictionForm from "@/components/pages/PredictionForm.jsx"

function App() {



  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
          </>
        } />
        <Route path="/predict" element={
          <>
            <Navbar />
            <PredictionForm />
          </>
        } />
        <Route path="/about" element={
          <>
            <Navbar />
            <About />
          </>
        } />
        <Route path="/how-it-works" element={
          <>
            <Navbar />
            <HowItWork />
          </>
        } />
      </Routes>
    </>
  )
}

export default App
