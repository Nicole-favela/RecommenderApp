from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# @app.route("/testinfo")
# def testinfo():
#     return {
#         "users": 
#             ["john", "adam","dean","morgan"]

        
#     }
#TODO: return results based on title
def get_title(title):
    return title
@app.route("/", methods = ['GET','POST'])
def index():
    if request.method =='POST':

        title = request.form.get('title')
        results_based_on_title = get_title(title)
        return jsonify({"results" :results_based_on_title})
    return {"index route"}


if __name__=="__main__":
    app.run(debug=True)