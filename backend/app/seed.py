from app.database import SessionLocal, Base, engine
from app import models
from app.models.specializzazione import Specializzazione
from app.models.ambulatorio import Ambulatorio
from app.models.impostazioni_clinica import ImpostazioniClinica
from app.models.medico import Medico
from app.models.paziente import Paziente
from app.models.segreteria import Segreteria
from app.auth.sicurezza import hash_password
from datetime import date, time
from app.models.orario_ricevimento import OrarioRicevimento


Base.metadata.create_all(bind=engine)

db = SessionLocal()


cardiologia = Specializzazione(nome="Cardiologia", costo=120.00, durata_minuti=30)
ortopedia = Specializzazione(nome="Ortopedia", costo=100.00, durata_minuti=30)
radiologia = Specializzazione(nome="Radiologia", costo=90.00, durata_minuti=20)
db.add_all([cardiologia, ortopedia, radiologia])


amb1 = Ambulatorio(nome="Ambulatorio 1")
amb2 = Ambulatorio(nome="Ambulatorio 2")
amb3 = Ambulatorio(nome="Ambulatorio 3")
db.add_all([amb1, amb2, amb3])


impostazioni = ImpostazioniClinica(limite_giorni=30, preavviso_cancellazione=2)
db.add(impostazioni)
db.commit()


medico1 = Medico(
    nome="Mario",
    cognome="Rossi",
    email="mario.rossi@clinica.it",
    telefono="3331234567",
    password=hash_password("password123"),
    attivo=True,
    id_specializzazione=cardiologia.id,
    id_ambulatorio=amb1.id,
)
medico2 = Medico(
    nome="Luigi",
    cognome="Verdi",
    email="luigi.verdi@clinica.it",
    telefono="3339876543",
    password=hash_password("password123"),
    attivo=True,
    id_specializzazione=radiologia.id,
    id_ambulatorio=amb2.id,
)
db.add_all([medico1, medico2])
db.commit() 


orario1 = OrarioRicevimento(
    id_medico=medico1.id,
    giorno_settimana=0,
    ora_inizio=time(9, 0),
    ora_fine=time(13, 0),
)
orario2 = OrarioRicevimento(
    id_medico=medico1.id,
    giorno_settimana=2,
    ora_inizio=time(9, 0),
    ora_fine=time(13, 0),
)
orario3 = OrarioRicevimento(
    id_medico=medico2.id,
    giorno_settimana=1,
    ora_inizio=time(14, 0),
    ora_fine=time(18, 0),
)
db.add_all([orario1, orario2, orario3])


paziente1 = Paziente(
    nome="Giovanni",
    cognome="Neri",
    data_nascita=date(1980, 1, 1),
    codice_fiscale="NREGVN80A01H501Z",
    email="giovanni.neri@gmail.com",
    telefono="3335556677",
    password=hash_password("password123"),
)
paziente2 = Paziente(
    nome="Anna",
    cognome="Bianchi",
    data_nascita=date(1990, 5, 15),
    codice_fiscale="BNCNNA90E55H501X",
    email="anna.bianchi@gmail.com",
    telefono=None,
    password=hash_password("password123"),
)
db.add_all([paziente1, paziente2])


segreteria1 = Segreteria(
    nome="Laura",
    cognome="Gialli",
    email="segreteria@clinica.it",
    password=hash_password("password123"),
)
db.add(segreteria1)


db.commit()
db.close()

print("Seed completato: dati di test inseriti nel database.")