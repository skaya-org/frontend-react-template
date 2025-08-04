import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import Aboutpage from './pages/Aboutpage/Aboutpage';
import DocumentationPage from './pages/Docspage/Docspage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/about" element={<Aboutpage/>} />
          <Route path="/docs" element={<DocumentationPage/>} />
        </Routes>
    </Router>
  );
}

export default App;