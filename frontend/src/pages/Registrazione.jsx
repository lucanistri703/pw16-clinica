import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Registrazione() {
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [dataNascita, setDataNascita] = useState('')
  const [codiceFiscale, setCodiceFiscale] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [errori, setErrori] = useState({})
  const [erroreGenerale, setErroreGenerale] = useState('')
  const navigate = useNavigate()

  async function gestisciRegistrazione(evento) {
    evento.preventDefault()
    setErrori({})
    setErroreGenerale('')

    try {
      const risposta = await fetch('http://127.0.0.1:8000/pazienti/registrazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome,
          cognome: cognome,
          data_nascita: dataNascita,
          codice_fiscale: codiceFiscale,
          email: email,
          telefono: telefono === '' ? null : telefono,
          password: password,
        }),
      })

      if (risposta.ok) {
        alert('Registrazione completata! Ora puoi accedere.')
        navigate('/')
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
        <div className="col-md-5">
          <h2 className="text-center mb-4">Registrazione paziente</h2>
          <form onSubmit={gestisciRegistrazione}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              {errori.nome && <div className="text-danger">{errori.nome}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Cognome</label>
              <input
                type="text"
                className="form-control"
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
              />
              {errori.cognome && <div className="text-danger">{errori.cognome}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Data di nascita</label>
              <input
                type="text"
                className="form-control"
                placeholder="AAAA-MM-GG"
                value={dataNascita}
                onChange={(e) => setDataNascita(e.target.value)}
              />
              {errori.data_nascita && <div className="text-danger">{errori.data_nascita}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Codice fiscale</label>
              <input
                type="text"
                className="form-control"
                value={codiceFiscale}
                onChange={(e) => setCodiceFiscale(e.target.value)}
              />
              {errori.codice_fiscale && <div className="text-danger">{errori.codice_fiscale}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errori.email && <div className="text-danger">{errori.email}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Telefono</label>
              <input
                type="text"
                className="form-control"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
              {errori.telefono && <div className="text-danger">{errori.telefono}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errori.password && <div className="text-danger">{errori.password}</div>}
            </div>
            {erroreGenerale && (
              <div className="alert alert-danger" role="alert">
                {erroreGenerale}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Registrati
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Registrazione