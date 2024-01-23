from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from flask_migrate import Migrate
import pickle
import pandas as pd
import os
from os import path
from config.generate_key import JWT_SECRET_KEY


import pip._vendor.requests 
from flask_sqlalchemy import SQLAlchemy
import requests
from models import db, User, Movie
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt 


load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app) 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db) #to keep track of changes to schemas
CORS(app)

# with app.app_context():
#     create_database()

@app.route("/add_to_list", methods=['POST'])
@jwt_required()
def add_to_list():
    try:
    
        user_id = get_jwt_identity()
        movie_id = request.json["movie_id"]
        title = request.json["title"]
        overview = request.json["overview"]
        poster = request.json["poster"]
        user_id = request.json["user_id"]
        date = request.json["date"]
      

        new_movie = Movie( movie_id =movie_id,title=title,overview=overview, poster= poster,  user_id = user_id, date=date) #creates movie
        db.session.add(new_movie)
        db.session.commit()

        return jsonify({'message': 'Movie added'}),200
    except Exception as e:
        return jsonify({'error': str(e)}),500
        
@app.route("/usermovies_list", methods=['GET'])
@jwt_required()
def get_user_list():
   
    try:
       
        print("Request JSON:", request)
        user_id = get_jwt_identity()
        print(f"Current User ID in get_user_list: {user_id}")
       
        user_movies = Movie.query.filter_by(user_id=user_id).all()
        print("*********************************************** ")
      
         # Convert the list of Movie objects to a list of dictionaries
        movies = [
            {
                'id': movie.id,
                'movie_id': movie.movie_id,
                'title': movie.title,
                'overview': movie.overview,
                'poster_path': movie.poster,
                'user_id': movie.user_id,
                'date': movie.date
            }
            for movie in user_movies
        ]

        return jsonify({'movies_list': movies}),200
    except Exception as e:
        print(f"Error fetching user movies: {e}")
        return jsonify({'error': str(e)}),500
        


def get_movie_options():
    try:
        movies = pickle.load(open('./pickle_files/simplified_movies_data.pkl', 'rb'))
        titles = movies['title'].tolist()
        # print("first 5 titles are: ", titles[:5])
        # return jsonify({"titles": titles}) #returns {titles: Array(10000)}
        return jsonify({'movies': [{'label': title} for title in titles[:]]}) # returns movies: Array(10000) as movies{label: 'moviename'}

    except Exception as e:
        return jsonify({'error': str(e)})
    

def recommendations(title, content_tags, sim):
    index_of_movie = content_tags[content_tags['title'] == title].index[0]
    similar_to = sorted(list(enumerate(sim[index_of_movie])),reverse=True, key=lambda vector: vector[1]) #sorted tuple list of index, similarity score
    recommendations = []
    rec_ids=[]
    for s in similar_to[:10]: #iterate first 10 entries
        #print(content_tags.iloc[s[0]].title) #print the title at location s[0]- index in tuple list
        recommendations.append(content_tags.iloc[s[0]].title)
        rec_ids.append(str(content_tags.iloc[s[0]].id))
    #print('recommendations, recs are: ',recommendations, 'with ids: ', rec_ids)
    return recommendations, rec_ids

@app.route("/", methods = ['GET','POST'])
@jwt_required()
def index():
    content_tags = pickle.load(open('./pickle_files/simplified_movies_data.pkl', 'rb'))
    similarities = pickle.load(open('./pickle_files/similarities.pkl', 'rb'))
    if request.method =='POST': #add title user selected
        title = request.json['title']['label']
        recs, rec_ids = recommendations(title, content_tags, similarities)
        posters =[]
        overviews=[]
        release_dates=[]
        for id in rec_ids:
            posters.append(get_poster(int(id)))
            overviews.append(get_overview(int(id)))
            release_dates.append(get_date(int(id)))
       
        #print('recommendations, IN INDEX are: ',recs)
        movie_recommendations = [
            {
                "title": title,
                "id": id,
                "poster_path": poster_path,
                "overview": overview,
                "date": date,
            }
            for title, id, poster_path, overview, date in zip(recs, rec_ids, posters, overviews, release_dates)
        ]
        #print('structured RECS: ', movie_recommendations)
        #return jsonify({'recommendations': recs, 'ids': rec_ids})
        return jsonify({'recomendations': movie_recommendations})
       
    else:# get movie options for user to choose from
        movie_options = get_movie_options()
        return movie_options
  
#@app.route("/movie_poster/<int:id>", methods=['GET'])
def get_poster(id):
    #use movie_id to build url
    API_KEY=os.getenv('API_KEY')
    if API_KEY is None:
        return jsonify({'error': 'api key is not set'}),500
    URL=f'https://api.themoviedb.org/3/movie/{id}?api_key={API_KEY}'
   
    

    response = requests.get(URL)
    data = response.json()

    # print('the data in poster id response is: ', response.text)
    poster_path = data['backdrop_path']
    #print('the poster path is: ',poster_path)
    #return jsonify({'url': poster_path})
    return poster_path
def get_overview(id):
    API_KEY=os.getenv('API_KEY')
    if API_KEY is None:
        return jsonify({'error': 'api key is not set'}),500
    URL=f'https://api.themoviedb.org/3/movie/{id}?api_key={API_KEY}'
    response = requests.get(URL)
    data = response.json()

    overview = data['overview']
    #print('the movie overview is: ',overview)
    return overview
def get_date(id):
    API_KEY=os.getenv('API_KEY')
    if API_KEY is None:
        return jsonify({'error': 'api key is not set'}),500
    URL=f'https://api.themoviedb.org/3/movie/{id}?api_key={API_KEY}'
    response = requests.get(URL)
    data = response.json()

    date = data['release_date']
    #print('the movie release date is:  ',date)
    return date


@app.route("/sign_up", methods=['POST'])
def sign_up():
    if request.method == 'POST':
        username = request.json["userName"]
        email = request.json["email"]
        password = request.json["password"]
       
        userExists = User.query.filter_by(email = email).first() 
        if userExists:
            return jsonify({'error':'that email is associated with an existing account'}), 409
        else:
            if len(email)<4:
                return jsonify({'error': 'please enter a longer email'}), 400
            if len(password)<6:
                return jsonify({'error': 'passwords must be more than 6 characters in length'}), 400
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            try:
                new_user= User(username = username, email= email,  password = hashed_password)
                db.session.add(new_user)
                db.session.commit()
                return jsonify({'message': 'your account was created successfully!'}), 200
            except:
                return jsonify({'error': 'db error creating new user'}), 500

@app.route("/login", methods=['POST'])
def login():
    if request.method == 'POST':
        
        email = request.json["email"]
        password = request.json["password"]
        #print('in login email: ', email, ' and pass: ', password)
        #check if email exists in system
        user = User.query.filter_by(email = email).first() 
       
        if not user:
            return jsonify({'error':'email is incorrect, please try again'}), 401
        #check if user and pw exists in system and is valid by hashing pw and comparing it
        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({'error':'incorrect password, please try again'}), 401

        #else log user in by sending an access token
    
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200

if __name__=="__main__":
    
    app.run(debug=True)

   