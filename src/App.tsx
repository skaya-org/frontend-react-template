import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import ChargingStation from './components/ChargingStation/ChargingStation';
import CritterWorkshop from './components/CritterWorkshop/CritterWorkshop';
import LevelSelectScreen from './components/LevelSelectScreen/LevelSelectScreen';
import GameScreen from './components/GameScreen/GameScreen';
import SandboxMode from './components/SandboxMode/SandboxMode';
import StoreScreen from './components/StoreScreen/StoreScreen';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/play" element={<GameScreen />} />
          <Route path="/station" element={<ChargingStation />} />
          <Route path="/sandbox" element={<SandboxMode />} />
          <Route path="/levels" element={<LevelSelectScreen />} />
          <Route path="/workshop" element={<CritterWorkshop />} />
          <Route path="/store" element={<StoreScreen />} />
        </Routes>
    </Router>
  );
}

export default App;