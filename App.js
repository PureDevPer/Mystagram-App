import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Text, View, AsyncStorage } from 'react-native';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';
import options from './apollo';

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
				storage: AsyncStorage
			});
			const client = new ApolloClient({
				cache,
				...options
			});
			setLoaded(true);
			setClient(client);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		preLoad();
	}, []);
	return loaded && client ? (
		<ApolloProvider client={client}>
			<View>
				<Text>Open up App.js to start working on your app!</Text>
			</View>
		</ApolloProvider>
	) : (
		<AppLoading />
	);
}
