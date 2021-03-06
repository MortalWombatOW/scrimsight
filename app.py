from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from random import randint 
from sqlalchemy.orm import sessionmaker
import hashlib
from logfile import dmg_cumsum, teams, get_summary, get_players
import json
import numpy as np
from flask_caching import Cache
import os,binascii

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "simple", # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

# set the project root directory as the static folder, you can set others.
app = Flask(__name__,
            static_url_path='',
            static_folder='client/build')

CORS(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://hlavaovemabkqo:fbbedd28e5a4edddd45977b9640344393f93c409c0425f687d43fd97c174cd5f@ec2-54-225-96-191.compute-1.amazonaws.com:5432/ddell78uvtts4r'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/scrimsight'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.config.from_mapping(config)
cache = Cache(app)

app.json_encoder = NumpyEncoder

def hash_logfile(file):
    hash_ = hashlib.sha256(file).hexdigest()

    # possibility of same random number is very low.
    # but if you want to make sure, here you can check id exists in database.
    while db.session.query(Logfile).filter(uuid == hash_).limit(1).first() is not None:
        rand = randint(min_, max_)

    return rand

# Create our database model
# class Rsvp(db.Model):
#     __tablename__ = "rsvps"
#     id = db.Column(db.Integer, primary_key=True)
#     full_name = db.Column(db.String(120), unique=True)
#     email = db.Column(db.String(120), unique=True)
#     additional_information = db.Column(db.String(255))
#     greeting = db.Column(db.String(255))
#     events = db.Column(db.String(255))
#     guests = db.Column(db.Integer)

#     def __init__(self,full_name, email, additional_information, greeting, events, guests):
#         self.full_name = full_name
#         self.email = email
#         self.additional_information = additional_information
#         self.greeting = greeting
#         self.events = events
#         self.guests = guests

#     # def __repr__(self):
#     #     return '<E-mail %r>' % self.email

#     def to_json(self):
#         return {
#             'fullName': self.full_name,
#             'email': self.email,
#             'additional_information': self.additional_information,
#             'greeting': self.greeting,
#             'events':self. events,
#             'guests': self.guests,
#         }

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String(120), primary_key=True)

    def __init__(self, id):
        self.id = id

    def to_json(self):
        return {
            'id': self.id,
        }

class Team(db.Model):
    __tablename__ = 'team'
    id = db.Column(db.String(120), primary_key=True)
    name = db.Column(db.String(120))

    def __init__(self, name, id):
        self.id = id
        self.name = name

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Scrim(db.Model):
    __tablename__ = 'scrim'
    id = db.Column(db.String(120), primary_key=True)
    team1_id = db.Column(db.String(120))
    team2_id = db.Column(db.String(120))
    timestamp = db.Column(db.DateTime)

    def __init__(self):
        self.id = binascii.b2a_hex(os.urandom(15))

    def to_json(self):
        return {
            'id': self.id,
        }

class Map(db.Model):
    __tablename__ = 'map'
    id = db.Column(db.String(120), primary_key=True)
    scrim_id = db.Column(db.String(120))
    log = db.Column(db.Text)

    def __init__(self, scrim_id, log):
        self.log = log
        self.scrim_id = scrim_id
        self.id = hashlib.sha256(log).hexdigest()[0:10]

    def to_json(self):
        return {
            'id': self.id,
        }

class Membership(db.Model):
    __tablename__ = "membership"
    user_id = db.Column(db.String(120), primary_key=True)
    team_id = db.Column(db.String(120))
    membership_type = db.Column(db.String(120))
    def __init__(self, user_id, team_id, membership_type):
        self.user_id = user_id
        self.team_id = team_id
        self.membership_type = membership_type

# class Map(db.Model):
#     __tablename__ = 'map'
#     id = db.Column(db.String(120), primary_key=True)
#     log = db.Column(db.Text)

#     def __init__(self, log):
#         self.log = log
#         self.id = hashlib.sha256(log).hexdigest()

#     def to_json(self):
#         return {
#             'id': self.uuid,
#         }

# class Logfile(db.Model):
#     __tablename__ = 'logfile'
#     id = db.Column(db.String(120), primary_key=True)
#     log = db.Column(db.Text)

#     def __init__(self, log):
#         self.log = log
#         self.id = hashlib.sha256(log).hexdigest()

#     def to_json(self):
#         return {
#             'id': self.uuid,
#         }

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/user/create', methods=['post'])
def create_user(id):
    return jsonify(id), 404

@app.route('/map/<id>', methods=['GET'])
def get_map(id):
    map_ = db.session.query(Map).filter(Map.id == id).first()  
    
    if map_:
        response_object = {
            'status': 'Success',
            'data': dmg_cumsum(map_.log).to_csv()
        }
        
        return jsonify(response_object), 200
    response_object = {
        'status': 'Not found'
    }
    
    return jsonify(response_object), 404

@app.route('/map/<id>/summary', methods=['GET'])
@cache.cached(timeout=50)
def get_map_summary(id):
    map_ = db.session.query(Map).filter(Map.id == id).first()

    # print(log.log[0:500])  
    
    if map_:
        response_object = {
            'status': 'Success',
            'data': get_summary(map_.log)
        }
        
        return jsonify(response_object), 200
    response_object = {
        'status': 'Not found'
    }
    
    return jsonify(response_object), 404


@app.route('/map/<id>/players', methods=['GET'])
@cache.cached(timeout=50)
def get_teams(id):
    log = db.session.query(Map).filter(Map.id == id).first()  
    
    if log:
        response_object = {
            'status': 'Success',
            'data': get_players(log.log)
        }
        
        return jsonify(response_object), 200
    response_object = {
        'status': 'Not found'
    }
    
    return jsonify(response_object), 404

@app.route('/explore', methods=['GET'])
def get_logfiles():
    ids = db.session.query(Map.id).all()

    response_object = {
        'status': 'Success',
        'data': ids
    }
    
    return jsonify(response_object), 200

@app.route('/upload', methods=['POST'])
def upload():
    post_data = request.files.get('log').read()
    response_object = {
        'status': 'fail',
        'message': 'Invalid payload.'
    }
    
    hash_ = hashlib.sha256(post_data).hexdigest()[0:10]
    if not db.session.query(Map).filter(Map.id == hash_).count():
        logfile = Map(post_data)
        db.session.add(logfile)
        db.session.commit()
        response_object = {
            'status': 'success',
            'message': hash_
        }

        return jsonify(response_object), 201

    return jsonify(response_object), 400

# @app.route('/rsvp', methods=['POST'])
# def rsvp():
#     post_data = request.get_json()
#     response_object = {
#         'status': 'fail',
#         'message': 'Invalid payload.'
#     }

#     full_name = post_data['fullName']
#     email = post_data['email']
#     additional_information = post_data['additionalInformation']
#     greeting = post_data['greeting']
#     events = post_data['events']
#     guests = post_data['guests']

#     if not db.session.query(Rsvp).filter(Rsvp.email == email).count():
#             rsvp = Rsvp(full_name, email, additional_information, greeting, events, guests)
#             db.session.add(rsvp)
#             db.session.commit()
            
#             response_object = {
#                 'status': 'success',
#                 'message': 'RSVP has been added'
#             }

#             return jsonify(response_object), 201

#     return jsonify(response_object), 400

# @app.route('/greetings', methods=['GET'])
# def greetings():
#     all_greetings = Rsvp.query.with_entities(Rsvp.full_name, Rsvp.greeting).all()    
#     response_object = {
#         'status': 'Success',
#         'data': {            
#             'greetings': [{'name' : greeting[0], 'content':greeting[1]} for greeting in all_greetings]
#         }
#     }
    
#     return jsonify(response_object), 200

if __name__ == '__main__':
    app.run()
