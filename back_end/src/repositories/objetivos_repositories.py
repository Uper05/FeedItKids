from sqlalchemy.orm import Session
from src.models import objetivo_model as models
from src.schemas import objetivos_schema as schemas

# CRUD Objetivos

def get_objetivo(db: Session, id_objetivo: int):
    return db.query(models.Objetivos).filter(models.Objetivos.id_objetivo == id_objetivo).first()

def get_objetivos(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Objetivos).offset(skip).limit(limit).all()

def create_objetivos(db:Session, objetivos:schemas.ObjetivosBase):
    db_objetivos = models.Objetivos(
        descricao = objetivos.descricao,
        pontuacao = objetivos.pontuacao,
    )
    db.add(db_objetivos)
    db.commit()
    db.refresh(db_objetivos)
    return db_objetivos

def update_objetivo(db: Session, id_objetivo: int, objetivo: schemas.ObjetivosUpdate):
    db_objetivo = db.query(models.Objetivos).filter(models.Objetivos.id_objetivo == id_objetivo).first()
    if db_objetivo:
        for key, value in objetivo.model_dump(exclude_unset=True).items():
            setattr(db_objetivo, key, value)
        db.commit()
        db.refresh(db_objetivo)
    return db_objetivo

def delete_objetivos(db: Session, id_objetivo: int):
    db_objetivos = db.query(models.Objetivos).filter(models.Objetivos.id_objetivo == id_objetivo).first()
    if  db_objetivos:
        db.delete( db_objetivos)
        db.commit()
    return None 