## Steps to start the server

- pip3 install pipenv
- pipenv shell
- pipenv install flask flask-sqlalchemy flask-marshmallow marshmallow-sqlalchemy flask-cors alpaca-trade-api
- python app.py

## To reload the db file

- from app import db
- db.create_all()
