import { Nav } from './components/Nav/Nav';
import {Routes, Route} from 'react-router';
import {HomePage} from './pages/HomePage';
import { BioPage } from './pages/bio';
import { LongformCard } from './components/LongformCard/LongformCard';


function App() {
  return (
    <>
    <Nav />
    <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/pages/:slug" element={<LongformCard />} />
  <Route path="/pages/bio" element={<BioPage />} />
</Routes>     
    </>
  )
}

export default App
