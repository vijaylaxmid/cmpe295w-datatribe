from flask import (Flask, render_template)
from flask import Flask, request, jsonify, Blueprint
from flask_marshmallow import Marshmallow
import json
import requests
from flask_cors import CORS, cross_origin
import alpaca_trade_api as tradeapi
from flask_marshmallow import Marshmallow, Schema
from flask_marshmallow.fields import fields
from flask_cors import CORS, cross_origin
from json import JSONEncoder

internalTradeApi = Blueprint('internalTradeApi', __name__, url_prefix='/api/trade')

# CORS
CORS(internalTradeApi, resources = {r"/*": {"origins": "*"}})


# Classes and schemas

class PortfolioSchema(Schema):    
    quantity = fields.Float()
    symbol = fields.Str()

portfolioSchema = PortfolioSchema()

class AccountSchema(Schema):    
    account_number = fields.Str()
    buying_power = fields.Float()
    cash = fields.Float()
    daytrade_count = fields.Float()
    daytrading_buying_power = fields.Float()
    equity = fields.Float()
    id =fields.Str()
    last_equity = fields.Float()
    portfolio_value = fields.Float()
    status = fields.Str()
    trading_blocked = fields.Boolean()

accountSchema = AccountSchema()

# JSON Encoder
class MyEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__

def dumper(obj):
    try:
        return obj.toJSON()
    except:
        return obj.__dict__

# Alpaca Paper trading APIs

# set keys
api_key = 'PK3YTS72QVH4PQXW8E1H'
api_secret = 'KWaafnzGVgzudXGd80bGDQXGXnINeS8DtriBY6jV'
base_url = 'https://paper-api.alpaca.markets'
api = tradeapi.REST(api_key, api_secret, base_url, api_version='v2')

# use this line to read keys from env variables in prod
# api = tradeapi.REST(api_version='v2')

# variables

clock = api.get_clock()
isMarketOpen = clock.is_open


# Get account details like buying power
@internalTradeApi.route('/getaccountdetails', methods=['GET'])
def get_account_details():
  account = api.get_account()
  result = accountSchema.dump(account)
  return result


# Get all positions/ portfolio
@internalTradeApi.route('/getAllPositions', methods=['GET'])
def get_all_positions():
    portfolio = api.list_positions()
    result = portfolioSchema.dump(portfolio, many=True)
    return jsonify(result)

# Get positions by ticker symbol
@internalTradeApi.route('/getPositionBySymbol', methods=['POST'])
def get_position_by_symbol():
    symbol = request.json['symbol']
    position = api.get_position(symbol)
    result = portfolioSchema.dump(position)
    return jsonify(result)


# place buy or sell order on alpaca
@internalTradeApi.route('/submitOrders', methods=['POST'])
def submit_orders():
    symbol = request.json['symbol']
    quantity = request.json['quantity']
    # side = buy/ sell
    side = request.json['side']
    # type = market/ limit
    type = request.json['type']
    timeInForce = request.json['timeInForce']
  
    try:
        api.submit_order(
            symbol= symbol,
            qty= quantity,
            side= side,
            type= type,
            time_in_force=timeInForce
            )
        
        return "order placed"
    except Exception:
        return Exception

    # # Get position after sale
    # position = api.get_position(symbol)
    # result = portfolioSchema.dump(position)
    # return jsonify(result)


  # get a list of existing orders on alpaca
@internalTradeApi.route('/listOrders', methods=['POST'])
def list_orders():
    #  open, closed or all. Defaults to open
    status = request.json['status']
    # 50/ 100 etc
    limit = request.json['limit']
  
    orders = api.list_orders(
            status= status,
            limit= limit,
            nested= True
            )

    return json.dumps(orders, default=dumper, indent=1)