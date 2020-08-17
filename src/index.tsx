import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { Operation } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
  // uri: 'https://gameshelf-backend.herokuapp.com/graphql',
  uri: 'http://localhost:4000/graphql',
  request: (operation): void => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token ? `${token}` : '',
      },
    });
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
