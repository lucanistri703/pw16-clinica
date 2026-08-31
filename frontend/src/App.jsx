import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import HomePaziente from './pages/HomePaziente'
import Registrazione from './pages/Registrazione'
import PrenotazioneVisita from './pages/PrenotazioneVisita'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home-paziente" element={<HomePaziente />} />
        <Route path="/registrazione" element={<Registrazione />} />
        <Route path="/prenotazione" element={<PrenotazioneVisita />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App