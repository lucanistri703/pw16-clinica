import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errore, setErrore] = useState('')
  const navigate = useNavigate()

  async function gestisciLogin(evento) {
    evento.preventDefault()
    setErrore('')

    try {
      const risposta = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      })

      if (!risposta.ok) {
        setErrore('Credenziali non valide')
        return
      }

      const dati = await risposta.json()
      localStorage.setItem('token', dati.access_token)
      localStorage.setItem('tipo_utente', dati.tipo_utente)

      if (dati.tipo_utente === 'paziente') {
        navigate('/home-paziente')
      } else if (dati.tipo_utente === 'segreteria') {
        navigate('/home-paziente')
      } else if (dati.tipo_utente === 'medico') {
        navigate('/home-paziente')
      }

    } catch (err) {
      setErrore('Errore di connessione al server')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center mb-4">Accedi</h2>
          <form onSubmit={gestisciLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errore && (
              <div className="alert alert-danger" role="alert">
                {errore}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Accedi
            </button>
            <p className="text-center mt-3">
              Non hai un account? <Link to="/registrazione">Registrati</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login