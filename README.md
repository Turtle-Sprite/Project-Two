# Project-Two

# Description
* Create an organizer for all your to-dos. Set dates, reminders, and login to your profile to update progress. 

# API
* Google Calendar

# ERD
![ERD](ERD.png)

# Wireframe
![Wireframe](Wireframe.png)

# User stories
* As a user, I want to sign in to my account. 
* I want to view my profile which has a list of all of my goals and to-dos.
* I want to edit and delete my goals and to-dos.
* I want to add dates and reminders in my calendar

| HTTP METHOD (_Verb_) | URL (_Nouns_)     | CRUD    | Response                             | Notes                                                                                                                    |
| -------------------- | ----------------- | ------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| GET                  | `/`          | READ    | Welcome page with information about site  |                                                                                       |
| POST                  | `/users/new` | CREATE   | Sign up for account form              | requires email and password                                             |
| GET                | `/users/login`          | READ |  Page requires email and password authetication from database      | redirect to where to find data (GET `/users/:user_id`) or just the new user data |
| PUT/PATCH            | `/users/:userid` | UPDATE  | No data, or updated user `{ user }`  |  redirect to where to find data (GET `/users/:userid`) or just the new user data |
| DELETE               | `/users/:userid` | DESTROY | No data                              | can send  redirect to homepage (GET `/`)                               |
| GET             | `/users/:user_id/goals` | READ | Page displaying goals      |                               |
| GET              | `/users/:user_id/goals/:goalsid` | READ| Page of tasks associated with goals  |                              |
| POST           | `/users/:user_id/goals` | CREATE| Add a new goal with tasks  |    redirect to `/users/:user_id/goals/:goalsid`      
| PUT        | `/users/:user_id/goals/:goalsid` | Update| update a goal with tasks  |    redirect to `/users/:user_id/goals/:goalsid` and show updated information
| DELETE       | `/users/:user_id/goals/:goalsid` | DESTROY | no data |    redirect to `/users/:user_id/goals' and show updated information

# MVP
* Create two new models that store data about goals and tasks using postgres
* Insert the calendar API into the tasks and goals pages
* Create full CRUD routes on goals using express
* Add in bootstrap styling

# Stretch
* Add a blogging component and make this into an event/travel planning blog
* Add in another model for blogging
* Add a photo uploading API 
* Add commenting abilities
* Create a better profile experience

