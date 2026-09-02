import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function GestioneMedici() {
  const [medici, setMedici] = useState([])
  const [includiDisattivati, setIncludiDisattivati] = useState(false)
  const [errore, setErrore] = useState('')
  const navigate = useNavigate()

  async function caricaMedici() {
    const token = localStorage.getItem('token')
    try {
      const risposta = await fetch(
        'http://127.0.0.1:8000/medici/?includi_disattivati=' + includiDisattivati,
        {
          headers: { 'Authorization': 'Bearer ' + token },
        }
      )
      if (!risposta.ok) {
        setErrore('Errore nel caricamento dei medici')
        return
      }
      const dati = await risposta.json()
      setMedici(dati)
    } catch (err) {
      setErrore('Errore di connessione al server')
    }
  }

  useEffect(() => {
    caricaMedici()
  }, [includiDisattivati])

  async function cambiaStatoMedico(id) {
    setErrore('')
    const token = localStorage.getItem('token')
    try {
      const risposta = await fetch('http://127.0.0.1:8000/medici/' + id + '/stato', {
        method: 'PATCH',
        headers: { 'Authorization': 'Bearer ' + token },
      })
      if (!risposta.ok) {
        const datiErrore = await risposta.json()
        setErrore(datiErrore.detail)
        return
      }
      caricaMedici()
    } catch (err) {
      setErrore('Errore di connessione al server')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h2 className="text-center mb-4">Gestione medici</h2>

          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/home-segreteria')}
          >
            Torna alla home
          </button>

          {errore && (
            <div className="alert alert-danger" role="alert">
              {errore}
            </div>
          )}

          <div className="form-check mb-3 d-flex align-items-center gap-2">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              id="includiDisattivati"
              checked={includiDisattivati}
              onChange={(e) => setIncludiDisattivati(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="includiDisattivati">
              Mostra anche i medici disattivati
            </label>
          </div>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Specializzazione</th>
                <th>Ambulatorio</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {medici.map((m) => (
                <tr key={m.id}>
                  <td>{m.nome}</td>
                  <td>{m.cognome}</td>
                  <td>{m.specializzazione}</td>
                  <td>{m.ambulatorio}</td>
                  <td>
                    {m.attivo ? (
                      <span className="badge bg-success">Attivo</span>
                    ) : (
                      <span className="badge bg-secondary">Disattivato</span>
                    )}
                  </td>
                  <td>
                    {m.attivo ? (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => cambiaStatoMedico(m.id)}
                      >
                        Disattiva
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => cambiaStatoMedico(m.id)}
                      >
                        Attiva
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GestioneMedici