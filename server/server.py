from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)


def get_movie_options():
    try:
        movies = pickle.load(open('./pickle_files/simplified_movies_data.pkl', 'rb'))
        titles = movies['title'].tolist()
        print("first 5 titles are: ", titles[:5])

        
        # return jsonify({"titles": titles}) #returns {titles: Array(10000)}
        return jsonify({'movies': [{'label': title} for title in titles[:]]}) # returns movies: Array(10000) as movies{label: 'moviename'}

    except Exception as e:
        return jsonify({'error': str(e)})
    
#TODO: return results based on title
def get_title(title):
    return title
@app.route("/", methods = ['GET','POST'])
def index():
    if request.method =='POST':

        title = request.form.get('title')
        results_based_on_title = get_title(title)
        return jsonify({"results" :results_based_on_title})
    else:
        movie_options = get_movie_options()
        
        return movie_options

@app.route("/sign_up", methods=['POST'])
def sign_up():
    username = request.json["userName"]
    email = request.json["email"]
    username = request.json["password"]
    pass
    # email_exists = 

    # if email_exists:



if __name__=="__main__":
    app.run(debug=True)

   