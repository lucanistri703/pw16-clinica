import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import HomePaziente from './pages/HomePaziente'
import Registrazione from './pages/Registrazione'
import PrenotazioneVisita from './pages/PrenotazioneVisita'
import LeMiePrenotazioni from './pages/LeMiePrenotazioni'
import HomeSegreteria from './pages/HomeSegreteria'
import GestioneMedici from './pages/GestioneMedici'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home-paziente" element={<HomePaziente />} />
        <Route path="/registrazione" element={<Registrazione />} />
        <Route path="/prenotazione" element={<PrenotazioneVisita />} />
        <Route path="/le-mie-prenotazioni" element={<LeMiePrenotazioni />} />
        <Route path="/home-segreteria" element={<HomeSegreteria />} />
        <Route path="/gestione-medici" element={<GestioneMedici />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App