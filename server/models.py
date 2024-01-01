
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String
import datetime
from sqlalchemy.orm import Mapped, mapped_column
from uuid import uuid4



db = SQLAlchemy()

def generate_uuid():
    return uuid4().hex
def create_database():
    db.create_all()
    print('Database created')
class User(db.Model):
    # __tablename__="users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(80), index=True, unique=True, nullable=False)
    password = db.Column(db.String(500), nullable=False)
    created = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=True)