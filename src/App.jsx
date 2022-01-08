import React from 'react';
import {
  createClient,
  Provider,
  defaultExchanges,
  subscriptionExchange,
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Todos from './Todos/Todos.jsx';
import './App.css';

const subscriptionClient = new SubscriptionClient(
  process.env.REACT_APP_graphQLLinkws,
  {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': process.env.REACT_APP_hasuraAdminSecret,
      },
    },
  }
);

const client = createClient({
  url: process.env.REACT_APP_graphQLLink,
  fetchOptions: {
    headers: {
      'x-hasura-admin-secret': process.env.REACT_APP_hasuraAdminSecret,
    },
  },
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
  requestPolicy: 'cache-and-network',
});

const App = () => {
  return (
    <Provider value={client}>
      <div className="App">
        <Todos />
      </div>
    </Provider>
  );
};

export default App;
