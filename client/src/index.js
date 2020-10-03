import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { gql, useMutation } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import * as serviceWorker from "./serviceWorker";

const httpLink = createHttpLink({
  uri: "http://localhost:8080/graphql",
});
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
// const mut = gql`
//       mutation createUser(
//           $name: String!,
//           $email: String!,
//           $password: String!
//       ) {
//         name
//         email
//         password
//     }
//   `;
// const abcd=(props)=>{
//   const temp=useMutation(props);
//   return null;
// };
// abcd({name:"Faiz Ansari" , email:"abc@gmail.com" , password:"abcdef"});
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
