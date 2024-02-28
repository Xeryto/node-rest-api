# NodeJS API
### Introduction
* NodeJS API is a sample NodeJS Express API that provides a set of endpoints for users to interact with. It is built with NodeJS, ExpressJS, and MongoDB. The API provides a set of endpoints for users to interact with, including getting the hottest stocks, information about a select country, and a dog picture of the day. The API also provides user authentication and authorization features, allowing users to sign up and log in to their accounts. It can be accessed globally at this [link](http://ec2-18-222-52-133.us-east-2.compute.amazonaws.com:3000/).
### Project Support Features
* Users can signup and login to their accounts
* Authenticated users can access and interact with all endpoints, namely getting hottest stocks, information about a select country, and a dog picture of the day.
### Installation Guide
* You need to write the following commands on the terminal screen so that you can run the project locally.
```
git clone https://github.com/Xeryto/node-rest-api.git
cd node-rest-api
npm install
```
* After that, go to .env file and insert the API keys as well as the connection string to your MongoDB database.
### Usage
* To start the server, run
```
node setup/index.js
```
* The application is running on [localhost](http://127.0.0.1:3000).
* Connect to the API using Postman on port 3000.
### API Endpoints
| HTTP Verbs | Endpoints                                                                                               | Action                                                                                                                                                                                                                  |
| --- |---------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| POST | /auth/register                                                                                         | To sign up a new user account                                                                                                                                                                                           |
| POST | /auth/login                                                                                            | To login an existing user account                                                                                                                                                                                       |
| PATCH | /user/update/:username?username=:newUsername                                                          | To edit the username of the user account                                                                                                                                                                                |
| DELETE | /user/delete/:username                                                                               | To delete a user account                                                                                                                                                                                                |
| GET | /API/hottestStocksInfo                                                                                  | To retrieve top-3 most discussed stocks on Reddit with stock info attached to each stock                                                                                                                                |
| GET | /API/guide?country=:targetCountry&targetCurrency=:targetCurrency&money=:moneySum&currency=:ownCurrency  | To retrieve info about a country by its name or currency. If both currency and money query fields are provided, it also tried to translate the money sum into local currency and adds a corresponding field to response |
| GET | /API/pictureOfDay                                                                                       | Returns a random picture of the dog, updated every 24 hours                                                                                                                                                             |
### Technologies Used
* [NodeJS](https://nodejs.org/) This is a cross-platform runtime environment built on Chrome's V8 JavaScript engine used in running JavaScript codes on the server. It allows for installation and managing of dependencies and communication with databases.
* [ExpressJS](https://www.expresjs.org/) This is a NodeJS web application framework.
* [MongoDB](https://www.mongodb.com/) This is a free open source NOSQL document database with scalability and flexibility. Data are stored in flexible JSON-like documents.
* [Mongoose ODM](https://mongoosejs.com/) This makes it easy to write MongoDB validation by providing a straight-forward, schema-based solution to model to application data.
### Authors
* [Daniil Igoshin](https://github.com/Xeryto)