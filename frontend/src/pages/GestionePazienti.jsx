import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function GestionePazienti() {
  const [pazienti, setPazienti] = useState([])
  const [errore, setErrore] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function caricaPazienti() {
      const token = localStorage.getItem('token')
      try {
        const risposta = await fetch('http://127.0.0.1:8000/pazienti/', {
          headers: { 'Authorization': 'Bearer ' + token },
        })
        if (!risposta.ok) {
          setErrore('Errore nel caricamento dei pazienti')
          return
        }
        const dati = await risposta.json()
        setPazienti(dati)
      } catch (err) {
        setErrore('Errore di connessione al server')
      }
    }
    caricaPazienti()
  }, [])

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h2 className="text-center mb-4">Gestione pazienti</h2>

          <div className="d-flex justify-content-center mb-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/home-segreteria')}
            >
              Torna alla home
            </button>
          </div>

          {errore && (
            <div className="alert alert-danger" role="alert">
              {errore}
            </div>
          )}

          {pazienti.length === 0 ? (
            <p className="text-center">Nessun paziente registrato.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cognome</th>
                  <th>Codice fiscale</th>
                  <th>Email</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {pazienti.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.cognome}</td>
                    <td>{p.codice_fiscale}</td>
                    <td>{p.email}</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => navigate('/gestione-pazienti/' + p.id + '/prenotazioni', {
                            state: { nome: p.nome, cognome: p.cognome }
                          })}
                        >
                          Vedi prenotazioni
                        </button>
                      </div>
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

export default GestionePazienti