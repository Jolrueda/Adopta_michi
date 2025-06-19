import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Auth from './components/auth';
import MainPage from './components/visualizacion/MainPage';
import CatProfile from './components/CatProfile';
import UserProfile from './components/UserPerfil';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/visualizacion/MainPage" element={<MainPage />} />
                <Route path="/cat/:id" element={<CatProfile />} />
                <Route path="/perfil" element={<UserProfile />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
