import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function NuovaAssenza() {
  const { idMedico } = useParams()
  const [dataInizio, setDataInizio] = useState('')
  const [dataFine, setDataFine] = useState('')
  const [motivo, setMotivo] = useState('')
  const [errori, setErrori] = useState({})
  const [erroreGenerale, setErroreGenerale] = useState('')
  const [successo, setSuccesso] = useState('')
  const navigate = useNavigate()

  async function inviaAssenza(evento) {
    evento.preventDefault()
    setErrori({})
    setErroreGenerale('')
    setSuccesso('')
    const token = localStorage.getItem('token')
    try {
      const risposta = await fetch('http://127.0.0.1:8000/assenze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          id_medico: parseInt(idMedico),
          data_inizio: dataInizio,
          data_fine: dataFine,
          motivo: motivo,
        }),
      })

      if (risposta.ok) {
        setSuccesso('Assenza registrata con successo!')
        setTimeout(() => {
          navigate('/gestione-medici')
        }, 2000)
        return
      }

      const datiErrore = await risposta.json()
      if (Array.isArray(datiErrore.detail)) {
        const nuoviErrori = {}
        for (const err of datiErrore.detail) {
          const campo = err.loc[err.loc.length - 1]
          nuoviErrori[campo] = err.msg
        }
        setErrori(nuoviErrori)
      } else {
        setErroreGenerale(datiErrore.detail)
      }

    } catch (err) {
      setErroreGenerale('Errore di connessione al server')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Registra assenza</h2>

          {erroreGenerale && (
            <div className="alert alert-danger" role="alert">
              {erroreGenerale}
            </div>
          )}

          {successo && (
            <div className="alert alert-success" role="alert">
              {successo}
            </div>
          )}

          <form onSubmit={inviaAssenza}>
            <div className="mb-3">
              <label className="form-label">Data inizio</label>
              <input
                type="text"
                className="form-control"
                placeholder="AAAA-MM-GG"
                value={dataInizio}
                onChange={(e) => setDataInizio(e.target.value)}
              />
              {errori.data_inizio && <small className="text-danger">{errori.data_inizio}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Data fine</label>
              <input
                type="text"
                className="form-control"
                placeholder="AAAA-MM-GG"
                value={dataFine}
                onChange={(e) => setDataFine(e.target.value)}
              />
              {errori.data_fine && <small className="text-danger">{errori.data_fine}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Motivo</label>
              <textarea
                className="form-control"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows="2"
                maxLength={100}
              ></textarea>
              <small className="text-muted">{motivo.length}/100 caratteri</small>
              {errori.motivo && <div><small className="text-danger">{errori.motivo}</small></div>}
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary w-100">
                Registra assenza
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => navigate('/gestione-medici')}
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NuovaAssenza