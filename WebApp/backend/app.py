from flask import (Flask, render_template)
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import yfinance as yf
import os
from sqlalchemy import Table, Column, Integer, ForeignKey
from stocknews import StockNews
import json
import csv
import requests
from flask_cors import CORS, cross_origin
from TradeAPI import internalTradeApi
import os.path
from os import path

#init app
app = Flask("__name__")
basedir = os.path.abspath(os.path.dirname(__file__))


# register blueprint
app.register_blueprint(internalTradeApi)

# CORS
CORS(app, resources = {r"/*": {"origins": "*"}})

#Database

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#Init db
db = SQLAlchemy(app)

#init ma
ma = Marshmallow(app)

#create database
@app.before_first_request
def create_tables():
    db.create_all()

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

@app.errorhandler(404)
def page_not_found(error):
    return 'This route does not exist {}'.format(request.url), 404 

@app.route("/api/stock/predictions")
def display_predictions():

    symbol = request.args.get('symbol', default="AAPL")
    filepath = os.path.join(basedir, "data", "Predictions", symbol+".csv") # More than 2 params allowed.
    # create a dictionary
    data = {}
    if path.isfile(filepath):
      # Open a csv reader called DictReader
      with open(filepath, encoding='utf-8') as csvf:
          csvReader = csv.DictReader(csvf)
          
          # Convert each row into a dictionary
          # and add it to data
          for rows in csvReader:
              key = rows['date']
              data[key] = rows
    res = json.dumps(data, indent = 4)
    return res

@app.route("/api/stock/predictions/all")
def display_all_predictions():

    filepath = os.path.join(basedir, "data", "Predictions") 
    path, dirs, files = next(os.walk(filepath))
    file_count = len(files)
    # create a dictionary
    data = {}

    # append datasets to the list 
    for i in range(file_count):
        csv_filepath = os.path.join(filepath, files[i]) 
        tick = os.path.splitext(files[i])[0]
        # Open a csv reader called DictReader
        with open(csv_filepath, encoding='utf-8') as csvf:
            # final_lines = csvf.readlines()[-2:]
            # # key = rows['date']
            # 
            #print(csv_filepath)
            _rows = []
            csvReader = csv.DictReader(csvf)
            # Convert each row into a dictionary
            # and add it to data
            for rows in csvReader:
                _rows.append(rows)
            data[tick] = _rows[-2:]

    res = json.dumps(data, indent = 4)
    return res

@app.route("/api/stock/history")
def display_history():

    symbol = request.args.get('symbol', default="AAPL")
    period = request.args.get('period', default="1mo")
    interval = request.args.get('interval', default="1d")        
    quote = yf.Ticker(symbol)   
    hist = quote.history(period=period, interval=interval)
    data = hist.to_json()
    return data

@app.route("/api/stock/quote")
def display_quote():
  symbol = request.args.get('symbol', default="AAPL")

  quote = yf.Ticker(symbol)

  return quote.info

@app.route("/api/business/news")
def display_news():
  url = 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=f99745454b5948d3a9f5df38f3780cfc'
  headers = {'Content-Type': 'application/json'}
  response = requests.get(url, headers=headers)

  if response.status_code == 200:
      return json.loads(response.content.decode('utf-8'))
  else:
      return None

@app.route("/api/stock/news")
def display_stock_news():
  symbol = request.args.get('symbol', default="AAPL")
  
  
  url = 'https://newsapi.org/v2/everything?q='+symbol+'&from=2021-04-24&to=2021-04-24&sortBy=popularity&apiKey=f99745454b5948d3a9f5df38f3780cfc'
  headers = {'Content-Type': 'application/json'}
  response = requests.get(url, headers=headers)

  if response.status_code == 200:
      return json.loads(response.content.decode('utf-8'))
  else:
      return None      

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

# Update user info
@app.route('/api/user/<user>', methods=['PUT'])
def update_user(user):
    userUpdate = User.query.get(user)

    
    buyingPower = request.json['buyingPower']
    userName = request.json['userName']
    phone = request.json['phone']
    address = request.json['address']
    email = request.json['email']

    userUpdate.user = user
    userUpdate.buyingPower = buyingPower
    userUpdate.userName = userName
    userUpdate.phone = phone
    userUpdate.address = address
    userUpdate.email = email

    db.session.commit()

    return user_schema.jsonify(userUpdate)

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


### STOCK APIs ###



# Category Table
class Category(db.Model):
  categoryId = db.Column(db.Integer, primary_key=True, autoincrement=True)
  categoryName = db.Column(db.String(20))


  def __init__(self, categoryName):
    self.categoryName = categoryName

#Category schema
class CategorySchema(ma.Schema):
    class Meta:
        fields = ('categoryId', 'categoryName')

# Init schema
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)

# Industry schema
class Industry(db.Model):
  industryId = db.Column(db.Integer, primary_key=True, autoincrement=True)
  industryName = db.Column(db.String(20))


  def __init__(self, industryName):
    self.industryName = industryName

# industryName schema
class IndustrySchema(ma.Schema):
    class Meta:
        fields = ('industryId', 'industryName')


# Init schema
industry_schema = IndustrySchema()
industries_schema = IndustrySchema(many=True)


class Stock(db.Model):
  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  stockSymbol = db.Column(db.Integer)
  # categoryId = db.Column(db.Integer, ForeignKey(Category.categoryId))
  # industryId = db.Column(db.Integer, ForeignKey(Industry.industryId))
  category = db.Column(db.String(20))
  industry = db.Column(db.String(20))

  def __init__(self, stockSymbol, category, industry):
    #self.stockId = stockId
    self.stockSymbol = stockSymbol
    self.category = category
    self.industry = industry

#Stock schema
class StockSchema(ma.Schema):
    class Meta:
        fields = ('id', 'stockSymbol', 'category', 'industry')

# Init schema
stock_schema = StockSchema()
stocks_schema = StockSchema(many=True)


# Stock Price Table
class StockPrice(db.Model):
  stockPriceId = db.Column(db.Integer, primary_key=True, autoincrement=True)
  stockId = db.Column(db.Integer, ForeignKey(Stock.id))
  date = db.Column(db.String(20))
  open = db.Column(db.Float)
  high = db.Column(db.Float)
  low = db.Column(db.Float)
  close = db.Column(db.Float)
  volume = db.Column(db.Float)

  def __init__(self, stockId, date, open, high, low, close, volume):
    self.stockId = stockId
    self.date = date
    self.open = open
    self.high = high
    self.low = low
    self.close = close
    self.volume = volume

#Stock schema
class StockPriceSchema(ma.Schema):
    class Meta:
        fields = ('stockPriceId', 'stockId', 'date', 'open', 'high', 'low', 'close', 'volume')


# Init schema
stock_price_schema = StockPriceSchema()
stocks_price_schema = StockPriceSchema(many=True)


# APIs

# Add new stock to stock table
@app.route('/api/portfolio/addstock', methods=['POST'])
def add_stock():
  #stockId = request.json['stockId']
  stockSymbol = request.json['stockSymbol']
  category = request.json['category']
  industry = request.json['industry']

  new_stock = Stock(stockSymbol, category, industry)

  db.session.add(new_stock)
  db.session.commit()

  return stock_schema.jsonify(new_stock)

# Get all stocks
@app.route('/api/portfolio/getallstocks', methods=['GET'])
def get_all_stocks():
  stocks = Stock.query.all()
  return jsonify(stocks_schema.dump(stocks))


# search stock by Industry or Category
@app.route('/api/portfolio/searchstock', methods=['POST'])
def search_stock():
  categoryId = request.json['category']
  industryId = request.json['industry']

  # if category is null, search by industry
  # else if industry is null, search by category
  # if both are not null, search by both
  # if both are null, return all stocks
  if (categoryId != "" or categoryId is not None) and (industryId == "" or industryId is None):
    stocks = Stock.query.filter(Stock.category == categoryId).all()
  elif (industryId != "" or industryId is not None) and (categoryId == "" or categoryId is None):
    stocks = Stock.query.filter(Stock.industry == industryId).all()
  elif (industryId != "" or industryId is not None) and (categoryId != "" or categoryId is not None):
    stocks = Stock.query.filter(Stock.industry == industryId and Stock.category == categoryId).all()
  else:
    stocks = Stock.query.all()
  return jsonify(stocks_schema.dump(stocks))
  
# Add new stock Price to stock price table
@app.route('/api/portfolio/addstockprice', methods=['POST'])
def add_stock_price():
  stockId = request.json['stockId']
  date = request.json['date']
  open = request.json['open']
  high = request.json['high']
  low = request.json['low']
  close = request.json['close']
  volume = request.json['volume']

  stockPrice = StockPrice(stockId, date, open, high, low, close, volume)

  db.session.add(stockPrice)
  db.session.commit()

  return stock_price_schema.jsonify(stockPrice)

# Get stock price by stock id
@app.route('/api/portfolio/getstockprice/<id>', methods=['GET'])
def get_stockprice_by_id(id):
  stockprice = StockPrice.query.get(id)
  return jsonify(stock_price_schema.dump(stockprice))


# Get all categories (for search screen dropdown)
@app.route('/api/portfolio/categories', methods=['GET'])
@cross_origin()
def get_categories():
  categories = Category.query.all()
  return categories_schema.jsonify(categories)

@app.route('/api/portfolio/addcategory', methods=['POST'])
def add_category():
  categoryName = request.json['categoryName']

  category = Category(categoryName)

  db.session.add(category)
  db.session.commit()

  return category_schema.jsonify(category)

# Get all industries (for search screen dropdown)
@app.route('/api/portfolio/industries', methods=['GET'])
def get_industries():
  industries = Industry.query.all()
  return industries_schema.jsonify(industries)

@app.route('/api/portfolio/addindustry', methods=['POST'])
def add_industry():
  industryName = request.json['industryName']

  industry = Industry(industryName)

  db.session.add(industry)
  db.session.commit()

  return industry_schema.jsonify(industry)

if __name__=="__main__":
    if not os.path.exists('db.sqlite'):
      db.create_all()
    
    app.run(debug=True)
    