import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import HomePaziente from './pages/HomePaziente'
import Registrazione from './pages/Registrazione'
import PrenotazioneVisita from './pages/PrenotazioneVisita'
import LeMiePrenotazioni from './pages/LeMiePrenotazioni'
import HomeSegreteria from './pages/HomeSegreteria'
import GestioneMedici from './pages/GestioneMedici'
import NuovoMedico from './pages/NuovoMedico'
import NuovaAssenza from './pages/NuovaAssenza'
import GestionePazienti from './pages/GestionePazienti'
import VediPrenotazioniPaziente from './pages/VediPrenotazioniPaziente'

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
        <Route path="/gestione-medici/nuovo" element={<NuovoMedico />} />
        <Route path="/gestione-medici/:idMedico/assenza" element={<NuovaAssenza />} />
        <Route path="/gestione-pazienti" element={<GestionePazienti />} />
        <Route path="/gestione-pazienti/:idPaziente/prenotazioni" element={<VediPrenotazioniPaziente />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App