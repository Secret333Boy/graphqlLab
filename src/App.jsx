import React, { useState } from 'react';
import {
  createClient,
  Provider,
  defaultExchanges,
  subscriptionExchange,
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Todos from './Todos/Todos.jsx';
import AuthOnly from './Auth/AuthOnly.jsx';
import Logout from './Auth/Logout.jsx';
import './App.css';

const subscriptionClient = new SubscriptionClient(
  'wss://graphql-lab.hasura.app/v1/graphql',
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
  url: 'https://graphql-lab.hasura.app/v1/graphql',
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

const getID = async () => {
  const res = await fetch('/api/getIDByHash');
  const id = await res.json();

  if (!id) {
    document.cookie += '; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    return;
  }
  return id;
};

const App = () => {
  const [id, setID] = useState(() => {
    getID().then((id) => {
      setID(id);
    });
  });
  if (!id) return <p>Loading user data...</p>;

  return (
    <Provider value={client}>
      <div className="App">
        <AuthOnly>
          <Todos id={id} />
          <Logout />
        </AuthOnly>
      </div>
    </Provider>
  );
};

export default App;
