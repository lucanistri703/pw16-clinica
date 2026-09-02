import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PrenotazioneVisita() {
  const [specializzazioni, setSpecializzazioni] = useState([])
  const [specializzazioneSelezionata, setSpecializzazioneSelezionata] = useState('')
  const [errore, setErrore] = useState('')
  const [medici, setMedici] = useState([])
  const [medicoSelezionato, setMedicoSelezionato] = useState('')
  const [data, setData] = useState('')
  const [slot, setSlot] = useState([])
  const [slotSelezionato, setSlotSelezionato] = useState('')
  const [nota, setNota] = useState('')
  const [successo, setSuccesso] = useState('')
  const navigate = useNavigate()

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

  useEffect(() => {
    if (specializzazioneSelezionata === '') {
      setMedici([])
      setMedicoSelezionato('')
      return
    }

    async function caricaMedici() {
      const token = localStorage.getItem('token')
      try {
        const risposta = await fetch(
          'http://127.0.0.1:8000/medici/?specializzazione_id=' + specializzazioneSelezionata,
          {
            headers: {
              'Authorization': 'Bearer ' + token,
            },
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
    caricaMedici()
  }, [specializzazioneSelezionata])

  useEffect(() => {
    if (medicoSelezionato === '' || data === '') {
      setSlot([])
      setSlotSelezionato('')
      return
    }
    async function caricaSlot() {
      const token = localStorage.getItem('token')
      try {
        const risposta = await fetch(
          'http://127.0.0.1:8000/prenotazioni/disponibilita?id_medico=' + medicoSelezionato + '&giorno=' + data,
          { headers: { 'Authorization': 'Bearer ' + token } }
        )
        if (!risposta.ok) {
          setErrore('Errore nel caricamento degli orari disponibili')
          setSlot([])
          return
        }
        const dati = await risposta.json()
        setSlot(dati)
      } catch (err) {
        setErrore('Errore di connessione al server')
      }
    }
    caricaSlot()
  }, [medicoSelezionato, data])

  function generaGiorni() {
    const giorni = []
    const oggi = new Date()
    for (let i = 1; i <= 30; i++) {
      const giorno = new Date(oggi)
      giorno.setDate(oggi.getDate() + i)
      const anno = giorno.getFullYear()
      const mese = String(giorno.getMonth() + 1).padStart(2, '0')
      const giornoMese = String(giorno.getDate()).padStart(2, '0')
      giorni.push(anno + '-' + mese + '-' + giornoMese)
    }
    return giorni
  }

  function nomeMedicoSelezionato() {
    const medico = medici.find((m) => String(m.id) === medicoSelezionato)
    if (medico) {
      return medico.nome + ' ' + medico.cognome
    }
    return ''
  }

  function nomeSpecializzazioneSelezionata() {
    const spec = specializzazioni.find((s) => String(s.id) === specializzazioneSelezionata)
    if (spec) {
      return spec.nome
    }
    return ''
  }

  async function inviaPrenotazione() {
    setErrore('')
    setSuccesso('')
    const token = localStorage.getItem('token')
    try {
      const risposta = await fetch('http://127.0.0.1:8000/prenotazioni/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          id_medico: medicoSelezionato,
          giorno: data,
          ora_inizio: slotSelezionato,
          nota_paziente: nota === '' ? null : nota,
        }),
      })

      if (!risposta.ok) {
        const datiErrore = await risposta.json()
        setErrore(datiErrore.detail)
        return
      }

      setSuccesso('Prenotazione effettuata con successo!')
      setSlot([])
      setSlotSelezionato('')
      setData('')
      setNota('')

      setTimeout(() => {
        navigate('/home-paziente')
      }, 2000)

    } catch (err) {
      setErrore('Errore di connessione al server')
    }
  }

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

          <div className="mb-3">
            <label className="form-label">Medico</label>
            <select
              className="form-select"
              value={medicoSelezionato}
              onChange={(e) => setMedicoSelezionato(e.target.value)}
              disabled={specializzazioneSelezionata === ''}
            >
              <option value="">-- Seleziona un medico --</option>
              {medici.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nome} {medico.cognome}
                </option>
              ))}
            </select>
          </div>

          {medicoSelezionato !== '' && (
            <div className="mb-3">
              <label className="form-label">Scegli un giorno</label>
              <div
                className="border rounded p-2"
                style={{ maxHeight: '200px', overflowY: 'auto' }}
              >
                {generaGiorni().map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={
                      data === g
                        ? 'btn btn-primary w-100 mb-1'
                        : 'btn btn-outline-secondary w-100 mb-1'
                    }
                    onClick={() => setData(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {slot.length > 0 && (
            <div className="mb-3">
              <label className="form-label">Orari disponibili</label>
              <div className="d-flex flex-wrap gap-2">
                {slot.map((s) => (
                  <button
                    key={s.ora_inizio}
                    type="button"
                    className={
                      slotSelezionato === s.ora_inizio
                        ? 'btn btn-primary'
                        : 'btn btn-outline-primary'
                    }
                    onClick={() => setSlotSelezionato(s.ora_inizio)}
                  >
                    {s.ora_inizio.slice(0, 5)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {medicoSelezionato !== '' && data !== '' && slot.length === 0 && (
            <div className="alert alert-info" role="alert">
              Nessuna disponibilità per questo giorno
            </div>
          )}

          {slotSelezionato !== '' && (
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Riepilogo prenotazione</h5>
                <p className="mb-1"><strong>Specializzazione:</strong> {nomeSpecializzazioneSelezionata()}</p>
                <p className="mb-1"><strong>Medico:</strong> {nomeMedicoSelezionato()}</p>
                <p className="mb-1"><strong>Data:</strong> {data}</p>
                <p className="mb-0"><strong>Ora:</strong> {slotSelezionato.slice(0, 5)}</p>
              </div>
            </div>
          )}

          {slotSelezionato !== '' && (
            <div className="mb-3">
              <label className="form-label">Nota (opzionale)</label>
                            <textarea
                className="form-control"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows="2"
                maxLength={200}
              ></textarea>
              <small className="text-muted">{nota.length}/200 caratteri</small>
            </div>
          )}

          {slotSelezionato !== '' && (
            <button
              className="btn btn-success w-100"
              onClick={inviaPrenotazione}
            >
              Conferma prenotazione
            </button>
          )}

          {successo && (
            <div className="alert alert-success mt-3" role="alert">
              {successo}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default PrenotazioneVisita