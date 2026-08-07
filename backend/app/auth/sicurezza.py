import bcrypt


def hash_password(password: str) -> str:
    """Genera l'hash bcrypt di una password in chiaro."""
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hash_bytes = bcrypt.hashpw(password_bytes, salt)
    return hash_bytes.decode("utf-8")


def verifica_password(password: str, hash_salvato: str) -> bool:
    """Verifica se una password in chiaro corrisponde all'hash salvato."""
    password_bytes = password.encode("utf-8")
    hash_bytes = hash_salvato.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hash_bytes)