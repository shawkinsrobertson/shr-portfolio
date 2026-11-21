import {Routes, Route} from 'react-router';
import { Layout } from './app/Layout';
import {HomePage} from './pages/HomePage';
import { BioPage } from './pages/bio';
import { NotFoundPage } from './pages/NotFoundPage';
import { CaseStudyPage } from './pages/CaseStudyPage';


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<CaseStudyPage />} />
        <Route path="/bio" element={<BioPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
