import './App.css';
import { Routes, Route } from 'react-router-dom';
import Auth from './components/auth';
import MainPage from './components/visualizacion/MainPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/visualizacion/MainPage" element={<MainPage />} />
        </Routes>
    );
}

export default App;
