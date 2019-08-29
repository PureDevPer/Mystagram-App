import React from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { USER_FRAGMENT } from '../../fragments';
import { useQuery } from 'react-apollo-hooks';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from '../../components/Loader';
import UserProfile from '../../components/UserProfile';

export const ME = gql`
	{
		me {
			...UserParts
		}
	}
	${USER_FRAGMENT}
`;

export default ({ navigation }) => {
	const { loading, data } = useQuery(ME);
	return (
		<ScrollView>
			{loading ? <Loader /> : data && data.me && <UserProfile {...data.me} />}
		</ScrollView>
	);
};
