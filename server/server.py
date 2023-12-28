from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import os
import pip._vendor.requests 
import requests
from dotenv import load_dotenv
load_dotenv()

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
    
#TODO: finish function and return movie id as well

def recommendations(title, content_tags, sim):
    index_of_movie = content_tags[content_tags['title'] == title].index[0]
    similar_to = sorted(list(enumerate(sim[index_of_movie])),reverse=True, key=lambda vector: vector[1]) #sorted tuple list of index, similarity score
    recommendations = []
    rec_ids=[]
    for s in similar_to[:10]: #iterate first 10 entries
        #print(content_tags.iloc[s[0]].title) #print the title at location s[0]- index in tuple list
        recommendations.append(content_tags.iloc[s[0]].title)
        rec_ids.append(str(content_tags.iloc[s[0]].id))
    print('recommendations, recs are: ',recommendations, 'with ids: ', rec_ids)
    return recommendations, rec_ids

@app.route("/", methods = ['GET','POST'])
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
       
        print('recommendations, IN INDEX are: ',recs)
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
        print('structured RECS: ', movie_recommendations)
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
    print('the poster path is: ',poster_path)
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
    print('the movie overview is: ',overview)
    return overview
def get_date(id):
    API_KEY=os.getenv('API_KEY')
    if API_KEY is None:
        return jsonify({'error': 'api key is not set'}),500
    URL=f'https://api.themoviedb.org/3/movie/{id}?api_key={API_KEY}'
    response = requests.get(URL)
    data = response.json()

    date = data['release_date']
    print('the movie release date is:  ',date)
    return date




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

   