from flask import (Flask, render_template)
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os

#init app
app = Flask("__name__")
basedir = os.path.abspath(os.path.dirname(__file__))

#Database

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#Init db
db = SQLAlchemy(app)

#init ma
ma = Marshmallow(app)

# Product Class/Model
#class Product(db.Model):
#   id = db.Column(db.Integer, primary_key=True)
#   name = db.Column(db.String(100), unique=True)
#   description = db.Column(db.String(200))
#   price = db.Column(db.Float)
#   qty = db.Column(db.Integer)

#   def __init__(self, name, description, price, qty):
#     self.name = name
#     self.description = description
#     self.price = price
#     self.qty = qty

 #Transaction Class/Model
class Transaction(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  transactionType = db.Column(db.String(5), unique=True)
  stockTicker = db.Column(db.String(10))
  price = db.Column(db.Float)
  numberOfStocks = db.Column(db.Integer)
  date = db.Column(db.String(10))
  mode = db.Column(db.String(5))


  def __init__(self, transactionType, stockTicker, price, numberOfStocks, date, mode):
    self.transactionType = transactionType
    self.stockTicker = stockTicker
    self.price = price
    self.numberOfStocks = numberOfStocks
    self.date = date
    self.mode = mode

#Product schema
class TransactionSchema(ma.Schema):
    class Meta:
        fields = ('id', 'transactionType', 'stockTicker', 'price', 'numberOfStocks', 'date', 'mode')


# Init schema
transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)


# Create a Transaction
@app.route('/transaction', methods=['POST'])
def add_transction():
  transactionType = request.json['transactionType']
  stockTicker = request.json['stockTicker']
  price = request.json['price']
  numberOfStocks = request.json['numberOfStocks']
  date = request.json['date']
  mode = request.json['mode']

  new_transaction = Transaction(transactionType, stockTicker, price, numberOfStocks, date, mode)

  db.session.add(new_transaction)
  db.session.commit()

  return transaction_schema.jsonify(new_transaction)

  


#Run server
if __name__=="__main__":
    app.run(debug=True)
