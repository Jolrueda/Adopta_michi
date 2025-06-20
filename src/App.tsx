import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Auth from './components/auth';
import MainPage from './components/visualizacion/MainPage';
import CatProfile from './components/CatProfile';
import UserProfile from './components/UserPerfil';
import AdoptionRequestsPage from "./components/AdoptionRequests/AdoptionRequestsPage.tsx";
import Donacion from './components/Donaciones/Donacion';
import CrearGato from './components/CrearGato/CrearGato.tsx';
import GraciasPorTuDonacion from './components/Donaciones/GraciasDonacion.tsx';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/visualizacion/MainPage" element={<MainPage />} />
                <Route path="/cat/:id" element={<CatProfile />} />
                <Route path="/perfil" element={<UserProfile />} />
                <Route path="/solicitudes" element={<AdoptionRequestsPage />} />
                <Route path="/donacion" element={<Donacion />} />
                <Route path="/crear-gato" element={<CrearGato/>} />
                <Route path="/gracias" element={<GraciasPorTuDonacion selectedAmount={null} customAmount={''} onAnotherDonation={function(): void {
                    throw new Error('Function not implemented.');
                } } />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
