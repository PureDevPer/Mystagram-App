import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { AsyncStorage } from 'react-native';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';
import apolloClientOptions from './apollo';
import { ThemeProvider } from 'styled-components';
import styles from './styles';
import NavController from './components/NavController';
import { AuthProvider } from './AuthContext';

export default function App() {
	const [loaded, setLoaded] = useState(false);
	const [client, setClient] = useState(null);

	const preLoad = async () => {
		try {
			await Font.loadAsync({
				...Ionicons.font
			});
			await Asset.loadAsync([require('./assets/logo.png')]);
			const cache = new InMemoryCache();
			await persistCache({
				cache,
				storage: AsyncStorage // Similar to LocalStorage
				// If storage finds previous history, the history is saved in cache
			});
			const client = new ApolloClient({
				cache,
				...apolloClientOptions
			});

			// If everything is loaded, setLoaded is true and setClient is client
			setLoaded(true);
			setClient(client);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		preLoad();
	}, []);

	// Once component is mounted, loaded is false and client is null
	// Then, go to AppLoading
	return loaded && client ? (
		<ApolloProvider client={client}>
			<ThemeProvider theme={styles}>
				<AuthProvider>
					<NavController />
				</AuthProvider>
			</ThemeProvider>
		</ApolloProvider>
	) : (
		<AppLoading />
	);
}
