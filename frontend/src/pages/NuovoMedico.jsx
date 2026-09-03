import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function NuovoMedico() {
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [idSpecializzazione, setIdSpecializzazione] = useState('')
  const [idAmbulatorio, setIdAmbulatorio] = useState('')
  const [specializzazioni, setSpecializzazioni] = useState([])
  const [ambulatori, setAmbulatori] = useState([])
  const [errori, setErrori] = useState({})
  const [erroreGenerale, setErroreGenerale] = useState('')
  const [successo, setSuccesso] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function caricaAnagrafiche() {
      const token = localStorage.getItem('token')
      try {
        const rispostaSpec = await fetch('http://127.0.0.1:8000/anagrafiche/specializzazioni', {
          headers: { 'Authorization': 'Bearer ' + token },
        })
        const datiSpec = await rispostaSpec.json()
        setSpecializzazioni(datiSpec)

        const rispostaAmb = await fetch('http://127.0.0.1:8000/anagrafiche/ambulatori', {
          headers: { 'Authorization': 'Bearer ' + token },
        })
        const datiAmb = await rispostaAmb.json()
        setAmbulatori(datiAmb)
      } catch (err) {
        setErrore('Errore nel caricamento dei dati')
      }
    }
    caricaAnagrafiche()
  }, [])

  async function inviaNuovoMedico(evento) {
    evento.preventDefault()
    setErrori({})
    setErroreGenerale('')
    setSuccesso('')
    const token = localStorage.getItem('token')
    try {
      const risposta = await fetch('http://127.0.0.1:8000/medici/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          nome: nome,
          cognome: cognome,
          email: email,
          telefono: telefono === '' ? null : telefono,
          password: password,
          id_specializzazione: idSpecializzazione === '' ? null : parseInt(idSpecializzazione),
          id_ambulatorio: idAmbulatorio === '' ? null : parseInt(idAmbulatorio),
        }),
      })

      if (risposta.ok) {
        setSuccesso('Medico creato con successo!')
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
          <h2 className="text-center mb-4">Nuovo medico</h2>

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

          <form onSubmit={inviaNuovoMedico}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input type="text" className="form-control" value={nome}
                onChange={(e) => setNome(e.target.value)} />
              {errori.nome && <small className="text-danger">{errori.nome}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Cognome</label>
              <input type="text" className="form-control" value={cognome}
                onChange={(e) => setCognome(e.target.value)} />
              {errori.cognome && <small className="text-danger">{errori.cognome}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email}
                onChange={(e) => setEmail(e.target.value)} />
              {errori.email && <small className="text-danger">{errori.email}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Telefono</label>
              <input type="text" className="form-control" value={telefono}
                onChange={(e) => setTelefono(e.target.value)} />
              {errori.telefono && <small className="text-danger">{errori.telefono}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password}
                onChange={(e) => setPassword(e.target.value)} />
              {errori.password && <small className="text-danger">{errori.password}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Specializzazione</label>
              <select className="form-select" value={idSpecializzazione}
                onChange={(e) => setIdSpecializzazione(e.target.value)}>
                <option value="">-- Seleziona --</option>
                {specializzazioni.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
              {errori.id_specializzazione && <small className="text-danger">{errori.id_specializzazione}</small>}
            </div>
            <div className="mb-3">
              <label className="form-label">Ambulatorio</label>
              <select className="form-select" value={idAmbulatorio}
                onChange={(e) => setIdAmbulatorio(e.target.value)}>
                <option value="">-- Seleziona --</option>
                {ambulatori.map((a) => (
                  <option key={a.id} value={a.id}>{a.nome}</option>
                ))}
              </select>
              {errori.id_ambulatorio && <small className="text-danger">{errori.id_ambulatorio}</small>}
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary w-100">
                Crea medico
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

export default NuovoMedico