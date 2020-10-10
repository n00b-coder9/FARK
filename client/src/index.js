import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import * as serviceWorker from './serviceWorker';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import theme from './theme';

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
