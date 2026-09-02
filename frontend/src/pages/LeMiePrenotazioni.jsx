import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function LeMiePrenotazioni() {
  const [prenotazioni, setPrenotazioni] = useState([])
  const [errore, setErrore] = useState('')
  const [filtro, setFiltro] = useState('prossime')
  const navigate = useNavigate()

  async function caricaPrenotazioni() {
    const token = localStorage.getItem('token')
    try {
      const risposta = await fetch('http://127.0.0.1:8000/prenotazioni/mie', {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
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

  useEffect(() => {
    caricaPrenotazioni()
  }, [])

  async function cancellaPrenotazione(id) {
    setErrore('')
    const token = localStorage.getItem('token')
    try {
      const risposta = await fetch('http://127.0.0.1:8000/prenotazioni/' + id + '/cancella', {
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      })
      if (!risposta.ok) {
        const datiErrore = await risposta.json()
        setErrore(datiErrore.detail)
        return
      }
      caricaPrenotazioni()
    } catch (err) {
      setErrore('Errore di connessione al server')
    }
  }

  const oggi = new Date().toISOString().slice(0, 10)

  const prenotazioniFiltrate = prenotazioni.filter((p) => {
    if (filtro === 'prossime') {
      return p.data >= oggi
    } else {
      return p.data < oggi
    }
  })

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h2 className="text-center mb-4">Le mie prenotazioni</h2>

          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/home-paziente')}
          >
            Torna alla home
          </button>

          {errore && (
            <div className="alert alert-danger" role="alert">
              {errore}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Visualizza</label>
            <select
              className="form-select"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="prossime">Prossime visite</option>
              <option value="passate">Visite passate</option>
            </select>
          </div>

          {prenotazioniFiltrate.length === 0 ? (
            <p className="text-center">Nessuna prenotazione da mostrare.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Medico</th>
                  <th>Specializzazione</th>
                  <th>Data</th>
                  <th>Ora</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {prenotazioniFiltrate.map((p) => (
                  <tr key={p.id}>
                    <td>{p.medico_nome} {p.medico_cognome}</td>
                    <td>{p.specializzazione}</td>
                    <td>{p.data}</td>
                    <td>{p.ora_inizio.slice(0, 5)}</td>
                    <td>
                      {filtro === 'prossime' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => cancellaPrenotazione(p.id)}
                        >
                          Cancella
                        </button>
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

export default LeMiePrenotazioni