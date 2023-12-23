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
    
#TODO: finish function and return movie id as well

def recommendations(title, content_tags, sim):
    index_of_movie = content_tags[content_tags['title'] == title].index[0]
    similar_to = sorted(list(enumerate(sim[index_of_movie])),reverse=True, key=lambda vector: vector[1]) #sorted tuple list of index, similarity score
    recommendations = []
    for s in similar_to[:10]: #iterate first 10 entries
        #print(content_tags.iloc[s[0]].title) #print the title at location s[0]- index in tuple list
        recommendations.append(content_tags.iloc[s[0]].title)
    print('recommendations, recs are: ',recommendations)
    return recommendations

@app.route("/", methods = ['GET','POST'])
def index():
    content_tags = pickle.load(open('./pickle_files/simplified_movies_data.pkl', 'rb'))
    similarities = pickle.load(open('./pickle_files/similarities.pkl', 'rb'))
    if request.method =='POST': #add title user selected
        title = request.json['title']['label']
        recs = recommendations(title, content_tags, similarities)
        
        print('recommendations, IN INDEX are: ',recs)
        return jsonify({'recommendations': recs})
       
    else:# get movie options for user to choose from
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

   