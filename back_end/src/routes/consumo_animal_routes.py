from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..repositories import consumo_animal_repositories as crud
from ..schemas import consumo_animal_schema as schemas
from ..database.database import get_db

router = APIRouter()

@router.post("/consumo/", response_model=schemas.ConsumoAnimalCreate)
def create_consumo(consumo: schemas.ConsumoAnimalCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_consumo(db=db, consumo=consumo)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/consumo/{id_consumo}", response_model=schemas.ConsumoAnimalBase)
def read_consumo(id_consumo: int, db: Session = Depends(get_db)):
    db_consumo = crud.get_consumos(db, id_consumo=id_consumo)
    if db_consumo is None:
        raise HTTPException(status_code=404, detail="consumo not found")
    return db_consumo

@router.get("/consumo/", response_model=List[schemas.ConsumoAnimal])
def read_consumo(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    consumo = crud.get_consumo(db, skip=skip, limit=limit)
    return consumo

@router.put("/consumo/{id_consumo}", response_model=schemas.ConsumoAnimalCreate)
def update_consumo(id_consumo: int, consumo: schemas.ConsumoAnimalCreate, db: Session = Depends(get_db)):
    return crud.update_consumo(db=db, id_consumo=id_consumo, consumo=consumo)

@router.delete("/consumo/{id_consumo}", response_model=schemas.ConsumoAnimal)
def delete_consumo(id_consumo: int, db: Session = Depends(get_db)):
    return crud.delete_consumo_animal(db=db, id_consumo=id_consumo)