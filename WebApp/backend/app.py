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


 #Transaction Class/Model
class Transaction(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  transactionType = db.Column(db.String(5))
  stockTicker = db.Column(db.String(10))
  price = db.Column(db.Float)
  numberOfStocks = db.Column(db.Integer)
  date = db.Column(db.String(10))
  mode = db.Column(db.String(5))
  user = db.Column(db.String(20))


  def __init__(self, transactionType, stockTicker, price, numberOfStocks, date, mode, user):
    self.transactionType = transactionType
    self.stockTicker = stockTicker
    self.price = price
    self.numberOfStocks = numberOfStocks
    self.date = date
    self.mode = mode
    self.user = user

#Transaction schema
class TransactionSchema(ma.Schema):
    class Meta:
        fields = ('id', 'transactionType', 'stockTicker', 'price', 'numberOfStocks', 'date', 'mode', 'user')


# Init schema
transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)



#User Class/Model
class User(db.Model):
  user = db.Column(db.String(20), primary_key=True)
  buyingPower = db.Column(db.Float)
  userName = db.Column(db.String(50))
  phone = db.Column(db.String(50))
  address = db.Column(db.String(50))
  email = db.Column(db.String(50))
  


  def __init__(self, user, buyingPower, userName, phone, address, email):
    self.user = user
    self.buyingPower = buyingPower
    self.userName = userName
    self.phone = phone
    self.address = address
    self.email = email
    


#User schema
class UserSchema(ma.Schema):
    class Meta:
        fields = ('user','buyingPower', 'userName', 'phone', 'address', 'email')


# Init schema
user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Create user info
@app.route('/api/user', methods=['POST'])
def add_user():
  user = request.json['user']
  buyingPower = request.json['buyingPower']
  userName = request.json['userName']
  phone = request.json['phone']
  address = request.json['address']
  email = request.json['email']
  

  new_user = User(user, buyingPower, userName, phone, address, email)

  db.session.add(new_user)
  db.session.commit()

  return user_schema.jsonify(new_user)


# Get all users
@app.route('/api/user/<user>/info', methods=['GET'])
def get_user(user):
  users = User.query.filter_by(user=user).first()
  return user_schema.jsonify(users)


# Create a Transaction
@app.route('/api/portfolio/transaction', methods=['POST'])
def add_transction():
  transactionType = request.json['transactionType']
  stockTicker = request.json['stockTicker']
  price = request.json['price']
  numberOfStocks = request.json['numberOfStocks']
  date = request.json['date']
  mode = request.json['mode']
  user = request.json['user']

  new_transaction = Transaction(transactionType, stockTicker, price, numberOfStocks, date, mode, user)

  db.session.add(new_transaction)
  db.session.commit()

  return transaction_schema.jsonify(new_transaction)

# Get all transactions for user
@app.route('/api/portfolio/user/<user>/transactions', methods=['GET'])
def get_transactions(user):
  user_transactions = Transaction.query.filter_by(user=user)
  result = transactions_schema.dump(user_transactions)
  return jsonify(result)

# Get Single Transaction
@app.route('/api/portfolio/transaction/<id>', methods=['GET'])
def get_transaction(id):
  transaction = Transaction.query.get(id)
  return transaction_schema.jsonify(transaction)


#Run server
if __name__=="__main__":
    app.run(debug=True)
