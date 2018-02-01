# project_2

Welcome to Long Beach Eats!

Explanations of the technologies used
Languages: HTML, CSS, Javascript, JQuery, Node.js
NPM packages: axios, bcryptjs, body-parser, cookie-parser, dotenv, express, express-session, moment, morgan, mustache-express, passport, passport-local, pg-promise

Wireframes
Login Page-->(or new user sign up page)-->User Profile Page-->User Favorites OR Restaurants List-->Individual Restaurant Info page 

User Stories
As a user (and Long Beach resident) I want this app to show me information of all of the restaurants in Long Beach and be able to save some as favorites and possibly comment on ones I've visited.

The approach taken
The first step I took to building my app was to connect to an external API.  The API I used was Yelp.  I used Yelp to search for restaurants only in the city of Long Beach, NY.  I then copied the names of the restaurants from my result into my database

THe next step was to build out my database. I knew I would need three tables.  One table for my users, one for my restaurant names, and one for my users favorites.  

Once the database was complete I started constructing my MVC file structure.

I then created an authorization framework for my app so that I could sign up users and the users would be able to keep track of their favorites.

Next up, CRUD functionality:
Create user, 
Read restaurant list and restaurant info, 
Update rating on user's favorite restaurant, 
Destroy user favorite.

Added additional NPM package MomentJS. On my restaurant info page, the days of the week would show up as a number (0-6) instead of the name of the day of the week.  MomentJS allowed me to change the number so that the name of the day of the week was rendered instead.

CSS


Unsolved problems
Update rating on user favorite is a little buggy at the moment because it will only let you update the restaurant on the top of the list.  After updating that restaurant it goes to the bottom of the list and you can update the next restaurant that moves to the top of the list but you can't update any restaurant that is not at the top of the list.


Any other useful information about your app

