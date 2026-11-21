import {Routes, Route} from 'react-router';
import { Layout } from './app/Layout';
import {HomePage} from './pages/HomePage';
import { BioPage } from './pages/bio';
import { NotFoundPage } from './pages/NotFoundPage';
import { LongformCard } from './components/LongformCard/LongformCard';


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<LongformCard />} />
        <Route path="/bio" element={<BioPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
