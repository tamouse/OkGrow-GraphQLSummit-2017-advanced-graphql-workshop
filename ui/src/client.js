import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import App from './components/App';

// http://localhost:8080 is put behind a proxy by webpack (cors)
const uri = '/graphql';
const httpLink = new HttpLink({ uri });
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('AUTH_TOKEN');
  console.log(token)
  operation.setContext(()=>({
    headers: {
      authorization: token ? `JWT ${token}` : null,
    }
  }));
  return(forward(operation));
})

const link = ApolloLink.from([authLink, httpLink])

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

export default () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);
