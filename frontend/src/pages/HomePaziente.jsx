import { useNavigate } from 'react-router-dom'

function HomePaziente() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('tipo_utente')
    navigate('/')
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Area paziente</h2>
          <div className="d-grid gap-3">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/prenotazione')}
            >
              Prenota una visita
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/le-mie-prenotazioni')}
            >
              Le mie prenotazioni
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePaziente