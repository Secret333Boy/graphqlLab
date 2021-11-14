import React from 'react';
import {
  createClient,
  Provider,
  defaultExchanges,
  subscriptionExchange,
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Todos from './Todos/Todos.jsx';
import AuthOnly from './AuthOnly/AuthOnly.jsx';
import './App.css';

const subscriptionClient = new SubscriptionClient(
  'wss://' + process.env.graphQLPath,
  {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': process.env.hasuraAdminSecret,
      },
    },
  }
);

const client = createClient({
  url: 'https://' + process.env.graphQLPath,
  fetchOptions: {
    headers: {
      'x-hasura-admin-secret': process.env.hasuraAdminSecret,
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
        <AuthOnly>
          <Todos></Todos>
        </AuthOnly>
      </div>
    </Provider>
  );
};

export default App;
