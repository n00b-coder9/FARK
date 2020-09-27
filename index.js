const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// load the environment variables from '.env' file
dotenv.config();

const app = express();
const BASE_URL = "/graphql";
const PORT = process.env.PORT || 5000;

// Parse the json body
app.use(express.json());
// Parse url encoded form data
app.use(express.urlencoded({ extended: true }));

// app.use(
//     BASE_URL,
//     graphqlHTTP({
//         schema: FarkGraphQLSchema,
//         graphiql: true,
//     }),
// );

// set up the mongodb connection
const MONGODB_URL =
    process.env.MONGODB_URL || "mongodb://localhost:27017/agourse";

// Connect to mongodb
mongoose
    .connect(MONGODB_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        // start the App server
        console.log("Connected to mongodb!");
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    })
    .catch((err) => {
        // If not connected, exit the process
        console.log("Error while connecting to mongodb: ", err);
        process.exit(1);
    });