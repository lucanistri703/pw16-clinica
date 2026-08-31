import { useState, useEffect } from 'react'

function PrenotazioneVisita() {
  const [specializzazioni, setSpecializzazioni] = useState([])
  const [specializzazioneSelezionata, setSpecializzazioneSelezionata] = useState('')
  const [errore, setErrore] = useState('')

  useEffect(() => {
    async function caricaSpecializzazioni() {
      const token = localStorage.getItem('token')
      try {
        const risposta = await fetch('http://127.0.0.1:8000/anagrafiche/specializzazioni', {
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        })
        if (!risposta.ok) {
          setErrore('Errore nel caricamento delle specializzazioni')
          return
        }
        const dati = await risposta.json()
        setSpecializzazioni(dati)
      } catch (err) {
        setErrore('Errore di connessione al server')
      }
    }
    caricaSpecializzazioni()
  }, [])

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Prenota una visita</h2>

          {errore && (
            <div className="alert alert-danger" role="alert">
              {errore}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Specializzazione</label>
            <select
              className="form-select"
              value={specializzazioneSelezionata}
              onChange={(e) => setSpecializzazioneSelezionata(e.target.value)}
            >
              <option value="">-- Seleziona una specializzazione --</option>
              {specializzazioni.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.nome}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PrenotazioneVisita