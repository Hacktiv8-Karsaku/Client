import { split, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: "https://201e-180-242-59-10.ngrok-free.app/graphql",
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://201e-180-242-59-10.ngrok-free.app/graphql',
  connectionParams: async () => {
    const token = await SecureStore.getItemAsync("access_token");
    return {
      Authorization: token ? `Bearer ${token}` : "",
    };
  },
  retryAttempts: 5,
  retryWait: async (retries) => {
    await new Promise((resolve) => setTimeout(resolve, retries * 1000));
  },
  shouldRetry: (error) => {
    return true;
  },
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync("access_token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(splitLink)),
  cache: new InMemoryCache()
});

export default client;
