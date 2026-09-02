import { useNavigate } from 'react-router-dom'

function HomeSegreteria() {
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
          <h2 className="text-center mb-4">Area segreteria</h2>
          <div className="d-grid gap-3">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/gestione-medici')}
            >
              Gestione medici
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/gestione-pazienti')}
            >
              Gestione pazienti
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

export default HomeSegreteria