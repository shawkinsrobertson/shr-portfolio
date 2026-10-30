import './App.css'
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
  <Route path="/pages/shelby" element={<LongformCard studyId={1} />} />
  <Route path="/pages/simpleset" element={<LongformCard studyId={2} />} />
  <Route path="/pages/scavengerhunt" element={<LongformCard studyId={4} />} />
  <Route path="/pages/nogutsnoglory" element={<LongformCard studyId={5} />} />
  <Route path="/pages/bio" element={<BioPage />} />
</Routes>     
    </>
  )
}

export default App
