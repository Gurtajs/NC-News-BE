# Northcoders News API

# Introduction
Created a backend news API with different endpoints which is available to view on https://news-project-1.onrender.com/api.

# Overview 
The project is a backend news API that has endpoints that we can access to view the data for a given endpoint. This API will feed the front end, providing it with the information contained in the API.

# Set up instructions
1. Clone the following github repository URL https://github.com/Gurtajs/News-project by running git clone https://github.com/<your_github_username>/News-project.git
2. Install the dependencies needed to run this project with: npm install
3. To seed the local database firstly setup the database. To do this run the script found in the package.json file, that is: npm run setup-dbs. Then seed the local database with: npm run seed.
4. There are two test files, one to test the util functions and the other to test the app endpoints. Supertest is used to test our endpoints with: npm test.

# Env files
Create two .env files, both for the development and test databases. Inside each file set PGDATABASE = <name of database>. Finally, add these two files to .gitignore so that the databsase names and other secret information is not exposed.

# Minimum versions needed
This project was built with Node.js v18.6.0 and Postgres 15.6.
