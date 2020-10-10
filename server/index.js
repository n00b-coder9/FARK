const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const FarkGraphQLSchema = require('./graphQl/schema');
const resolvers = require('./graphQl/resolvers');
// load the environment variables from '.env' file
dotenv.config();

const app = express();
const BASE_URL = '/graphql';

const PORT = process.env.PORT || 8080;

// Parse the json body
app.use(express.json());
// Parse url encoded form data
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(
    BASE_URL,
    graphqlHTTP({
      schema: FarkGraphQLSchema,
      rootValue: resolvers,
      graphiql: true,
    }),
);
// set up the mongodb connection
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/agourse';

// Connect to mongodb
mongoose
    .connect(MONGODB_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      // start the App server
      // eslint-disable-next-line no-console
      console.log('Connected to mongodb!');
      // eslint-disable-next-line no-console
      app.listen(PORT, () => console.log(`Listening on port ${PORT}/graphql to GraphiQl`));
    })
    .catch((err) => {
      // If not connected, exit the process
      // eslint-disable-next-line no-console
      console.log('Error while connecting to mongodb: ', err);
      process.exit(1);
    });
