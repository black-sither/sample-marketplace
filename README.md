## Problem Statement
This is an MVP Design for a Ecommerce shopping Backend which would enable clients to buy and sell products.

## Steps to run
Add a .env file in folder structure root with the following values
```
DB_NAME=shop
DB_USER=postgres
DB_HOST=localhost
DB_PASSWORD=postgres
DB_DRIVER=postgres
NODE_ENV=develpoment
TOKEN_KEY=mysecret
PORT=8080
AUTH_STRATERGY=jwt
 ```
In root of the folder structure execute ` docker-compose up `
which will bring up the postgres docker container and seed the `shop` databse in it 

Run `npm i` in root directory to install required node modules

You can then start the application by running either `npm start` or `npm run start:dev` in the root directory of the folder.

## Design
We have chosen to use a SQL table (postgres) here as the data is relational in nature hence, suitable for use with a relational Database to maintain referrential integrity at the Database Layer instead of the Application layer

![Alt text](meta/ERD.png?raw=true "ERD")


## Further scope for Improvements in MVP
- Request body validation (e.g JOI Validation)
- CI integration for linting and integration tests
- Pagination of api responses
- Error code as part of erroneous api responses
- Dnamic environment configuration (e.g nconf)
