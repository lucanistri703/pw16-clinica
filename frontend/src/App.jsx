import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import HomePaziente from './pages/HomePaziente'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home-paziente" element={<HomePaziente />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App