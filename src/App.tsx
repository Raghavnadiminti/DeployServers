import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DeployServersHome from './homepage';
import Dashboard from './dashboard';

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<DeployServersHome />} />
        
       
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;