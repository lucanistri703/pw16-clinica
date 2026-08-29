import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import HomePaziente from './pages/HomePaziente'
import Registrazione from './pages/Registrazione'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home-paziente" element={<HomePaziente />} />
        <Route path="/registrazione" element={<Registrazione />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App