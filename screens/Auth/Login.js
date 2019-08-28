import React from 'react';
import styled from 'styled-components';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`;

const Text = styled.Text``;

export default () => {
	const emailInput = useInput('');
	return (
		<View>
			<AuthInput
				{...emailInput}
				placeholder="Email"
				keyboardType="email-address"
			/>
			<AuthButton text="Log In" onPress={() => null} />
		</View>
	);
};
