# Movie Recommender ML Web App

## Overview
Web application designed to provide users with personalized movie recommendations based on movie preference by utilizing content based filtering techniques. 

## Features
- Search: Search 10k movie titles.
- Discover: View recommendations based on title selected.
- Movie Info: Movie details like cast, crew and posters from tmdb API.
- Movie list: Add movies of interest to your list and remove them just as easily.
- User registration and login: Secure sign-up and auth allows you to resume browsing and keep your movie list.  

## Technologies and Techniques
- **Frontend**: React js, CSS, MUI components and dynamic icons from uiverse.io
- **Backend**: Flask, Postgresql, JWT authentication, AWS s3 bucket
- **Extenal APIs**: TMDB API for movie data 
- **Content Filering**: Uses cosine similarity to recommend movies based on what the user selections. It uses information like the title, overview, and movie genre to predict which movies are most similar to the one selected. 




