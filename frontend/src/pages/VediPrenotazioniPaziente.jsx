import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

function VediPrenotazioniPaziente() {
  const { idPaziente } = useParams()
  const location = useLocation()
  const nomePaziente = location.state ? location.state.nome + ' ' + location.state.cognome : ''
  const [prenotazioni, setPrenotazioni] = useState([])
  const [errore, setErrore] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function caricaPrenotazioni() {
      const token = localStorage.getItem('token')
      try {
        const risposta = await fetch('http://127.0.0.1:8000/prenotazioni/paziente/' + idPaziente, {
          headers: { 'Authorization': 'Bearer ' + token },
        })
        if (!risposta.ok) {
          setErrore('Errore nel caricamento delle prenotazioni')
          return
        }
        const dati = await risposta.json()
        setPrenotazioni(dati)
      } catch (err) {
        setErrore('Errore di connessione al server')
      }
    }
    caricaPrenotazioni()
  }, [idPaziente])

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h2 className="text-center mb-4">
            Prenotazioni {nomePaziente ? 'di ' + nomePaziente : 'del paziente'}
          </h2>

          <div className="d-flex justify-content-center mb-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/gestione-pazienti')}
            >
              Torna ai pazienti
            </button>
          </div>

          {errore && (
            <div className="alert alert-danger" role="alert">
              {errore}
            </div>
          )}

          {prenotazioni.length === 0 ? (
            <p className="text-center">Questo paziente non ha prenotazioni.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Medico</th>
                  <th>Specializzazione</th>
                  <th>Data</th>
                  <th>Ora</th>
                  <th>Stato</th>
                </tr>
              </thead>
              <tbody>
                {prenotazioni.map((p) => (
                  <tr key={p.id}>
                    <td>{p.medico_nome} {p.medico_cognome}</td>
                    <td>{p.specializzazione}</td>
                    <td>{p.data}</td>
                    <td>{p.ora_inizio.slice(0, 5)}</td>
                    <td>
                      {p.cancellata ? (
                        <span className="badge bg-secondary">Cancellata</span>
                      ) : (
                        <span className="badge bg-success">Attiva</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default VediPrenotazioniPaziente