from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)
from flask_cors import CORS
from flask_migrate import Migrate
import pickle
import pandas as pd
import os
from os import path

# from config.generate_key import JWT_SECRET_KEY
import pip._vendor.requests
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import distinct
import requests
from models import db, User, Movie
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
import json
import boto3
from botocore.exceptions import ConnectionError
from flask_caching import Cache


load_dotenv()

app = Flask(__name__)

bcrypt = Bcrypt(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["CACHE_TYPE"] = "simple"
cache = Cache(app)
jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)  # to keep track of changes to schemas
CORS(app, resources={r"/*": {"origins": "https://movierecommender-5hmu.onrender.com"}})

# with app.app_context():
#     create_database()


@app.route("/delete_movie/<id>", methods=["DELETE"])
@jwt_required()
def delete_movie(id):
    try:
        movie = Movie.query.get(id)
        if movie:
            db.session.delete(movie)
            db.session.commit()

            return jsonify({"message": "Movie deleted"}), 200
        else:
            return jsonify({"error": "Movie not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/add_to_list", methods=["POST"])
@jwt_required()
def add_to_list():
    try:
        user_id = get_jwt_identity()
        movie_id = request.json["movie_id"]
        title = request.json["title"]
        overview = request.json["overview"]
        poster = request.json["poster"]
        date = request.json["date"]
        cast = request.json["cast"]
        crew = request.json["crew"]
        existing_movie = Movie.query.filter_by(
            movie_id=movie_id, user_id=user_id
        ).first()
        if existing_movie is None:
            new_movie = Movie(
                movie_id=movie_id,
                title=title,
                overview=overview,
                poster=poster,
                user_id=user_id,
                date=date,
                cast=json.dumps(cast),
                crew=json.dumps(crew),
            )  # creates movie
            db.session.add(new_movie)
            db.session.commit()

            return jsonify({"message": "Movie added"}), 200
        else:
            return jsonify({"message": "Movie already exists"}), 200
    except Exception as e:
        print(f"Error adding user movies: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/usermovies_list", methods=["GET"])
@jwt_required()
def get_user_list():

    try:
        user_id = get_jwt_identity()
        user_movies = (
            db.session.query(Movie)
            .filter_by(user_id=user_id)
            .group_by(Movie.id)  # groups by specific col
            .all()
        )

        if user_movies is None:
            return jsonify({"message": "user has no movies yet"}), 404

        # Convert the list of Movie objects to a list of dictionaries
        movies = [
            {
                "id": movie.id,
                "movie_id": movie.movie_id,
                "title": movie.title,
                "overview": movie.overview,
                "poster_path": movie.poster,
                "user_id": movie.user_id,
                "date": movie.date,
                "cast": movie.cast,
                "crew": movie.crew,
            }
            for movie in user_movies
        ]
        # print(f"Current movies in get_user_list: {movies}")
        return jsonify({"movies_list": movies}), 200
    except Exception as e:
        print(f"Error fetching user movies: {e}")
        return jsonify({"error": str(e)}), 500


def get_movie_options(movies):
    try:
        # movies = pickle.load(open('./pickle_files/simplified_movies_data.pkl', 'rb'))
        titles = movies["title"].tolist()
        unique_titles = set()
        for title in titles:
            # Check if the movie title is already in the set
            if title not in unique_titles:
                unique_titles.add(title)

        return jsonify(
            {"movies": [{"label": title} for title in list(unique_titles)[:]]}
        )  # returns movies: Array(10000) as movies{label: 'moviename'}

    except Exception as e:
        return jsonify({"error": str(e)})


@cache.memoize(timeout=3600)  # Caches data for one hour
def get_content_tags():
    config_env_path = os.path.join(os.path.dirname(__file__), "..", "config", ".env")
    load_dotenv(dotenv_path=config_env_path)

    s3 = boto3.client("s3")
    max_retries = 3
    retry_count = 0

    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
    while retry_count < max_retries:
        try:
            response2 = s3.get_object(
                Bucket=AWS_BUCKET_NAME, Key="simplified_movies_data.pkl"
            )

            content_tags = pickle.loads(response2["Body"].read())

            # print("fetched data, response2 is: ", response2)
            return content_tags

        except:
            retry_count += 1

            if retry_count == max_retries:
                print("Max retries exceeded. Failed to retrieve objects from s3")


@cache.memoize(timeout=3600)  # Caches data for one hour
def get_similarities():
    config_env_path = os.path.join(os.path.dirname(__file__), "..", "config", ".env")
    load_dotenv(dotenv_path=config_env_path)

    s3 = boto3.client("s3")
    max_retries = 3
    retry_count = 0

    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
    while retry_count < max_retries:
        try:

            response1 = s3.get_object(Bucket=AWS_BUCKET_NAME, Key="similarities.pkl")
            similarities = pickle.loads(response1["Body"].read())
            # print("fetched data, response2 is: ", response1)
            return similarities

        except:
            retry_count += 1

            if retry_count == max_retries:
                print("Max retries exceeded. Failed to retrieve objects from s3")


def recommendations(title, content_tags, sim):
    index_of_movie = content_tags[content_tags["title"] == title].index[0]
    similar_to = sorted(
        list(enumerate(sim[index_of_movie])), reverse=True, key=lambda vector: vector[1]
    )  # sorted tuple list of index, similarity score
    recommendations = []
    rec_ids = []
    for s in similar_to[1:11]:  # iterate first 10 entries
        # print(content_tags.iloc[s[0]].title) #print the title at location s[0]- index in tuple list
        recommendations.append(content_tags.iloc[s[0]].title)
        rec_ids.append(str(content_tags.iloc[s[0]].id))
    # print('recommendations, recs are: ',recommendations, 'with ids: ', rec_ids)

    return recommendations, rec_ids


@app.route("/", methods=["GET", "POST"])
@jwt_required()
def index():
    content_tags = get_content_tags()

    if request.method == "POST":  # add title user selected
        try:
            similarities = get_similarities()
            title = request.json["title"]["label"]
            recs, rec_ids = recommendations(title, content_tags, similarities)
            unique_movies = set()
            movie_recommendations = []

            for movie, id in zip(recs, rec_ids):
                # Check if the movie_id is already in the set
                if id not in unique_movies:
                    unique_movies.add(id)
                    movie_recommendations.append(
                        {
                            "title": movie,
                            "id": id,
                            "poster_path": get_poster(int(id)),
                            "overview": get_overview(int(id)),
                            "date": get_date(int(id)),
                            "cast": json.dumps(
                                get_movie_cast(int(id))
                            ),  # converts to JSON
                            "crew": json.dumps(get_movie_crew(int(id))),
                        }
                    )

            return jsonify({"recomendations": movie_recommendations}), 200
        except Exception as e:
            return jsonify({"error": str(e)})

    else:  # get movie options for user to choose from

        movie_options = get_movie_options(content_tags)
        return movie_options


def get_poster(id):
    # use movie_id to build url
    API_KEY = os.getenv("API_KEY")
    if API_KEY is None:
        return jsonify({"error": "api key is not set"}), 500
    URL = f"https://api.themoviedb.org/3/movie/{id}?api_key={API_KEY}"

    response = requests.get(URL)
    data = response.json()
    poster_path = data["backdrop_path"]

    return poster_path


def get_movie_cast(id):
    # use movie_id to build url
    API_KEY = os.getenv("API_KEY")
    if API_KEY is None:
        return jsonify({"error": "api key is not set"}), 500
    URL = f"https://api.themoviedb.org/3/movie/{id}/credits?api_key={API_KEY}"

    response = requests.get(URL)
    data = response.json()
    cast = data["cast"]
    return cast[:5]


def get_movie_crew(id):
    # use movie_id to build url
    API_KEY = os.getenv("API_KEY")
    if API_KEY is None:
        return jsonify({"error": "api key is not set"}), 500
    URL = f"https://api.themoviedb.org/3/movie/{id}/credits?api_key={API_KEY}"

    response = requests.get(URL)
    data = response.json()
    crew = data["crew"]
    return crew[:5]


def get_overview(id):
    API_KEY = os.getenv("API_KEY")
    if API_KEY is None:
        return jsonify({"error": "api key is not set"}), 500
    URL = f"https://api.themoviedb.org/3/movie/{id}?api_key={API_KEY}"
    response = requests.get(URL)
    data = response.json()
    overview = data["overview"]
    return overview


def get_date(id):
    API_KEY = os.getenv("API_KEY")
    if API_KEY is None:
        return jsonify({"error": "api key is not set"}), 500
    URL = f"https://api.themoviedb.org/3/movie/{id}?api_key={API_KEY}"
    response = requests.get(URL)
    data = response.json()

    date = data["release_date"]

    return date


@app.route("/sign_up", methods=["POST"])
def sign_up():
    if request.method == "POST":
        username = request.json["userName"]
        email = request.json["email"]
        password = request.json["password"]

        userExists = User.query.filter_by(email=email).first()
        if userExists:
            return (
                jsonify({"error": "that email is associated with an existing account"}),
                409,
            )
        else:
            if len(email) < 4:
                return jsonify({"error": "please enter a longer email"}), 400
            if len(password) < 6:
                return (
                    jsonify(
                        {"error": "passwords must be more than 6 characters in length"}
                    ),
                    400,
                )
            hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
            try:
                new_user = User(
                    username=username, email=email, password=hashed_password
                )
                db.session.add(new_user)
                db.session.commit()
                return (
                    jsonify({"message": "your account was created successfully!"}),
                    200,
                )
            except:
                return jsonify({"error": "db error creating new user"}), 500


@app.route("/login", methods=["POST"])
def login():
    if request.method == "POST":

        email = request.json["email"]
        password = request.json["password"]
        # print('in login email: ', email, ' and pass: ', password)
        # check if email exists in system
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "email is incorrect, please try again"}), 401
        # check if user and pw exists in system and is valid by hashing pw and comparing it
        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "incorrect password, please try again"}), 401

        # else log user in by sending an access token

        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200


if __name__ == "__main__":

    app.run(debug=True)
