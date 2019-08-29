import React, { useState } from 'react';
import styled from 'styled-components';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import { Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useMutation } from 'react-apollo-hooks';
import { CREATE_ACCOUNT } from './AuthQueries';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';

const View = styled.View`
	justify-content: center;
	align-items: center;
	flex: 1;
`;

const FBContainer = styled.View`
	margin-top: 25px;
	padding-top: 25px;
	border-top-width: 1px;
	border-style: solid;
	border-color: ${props => props.theme.lightGreyColor};
`;

const GoogleContainer = styled.View`
	margin-top: 20px;
`;

export default ({ navigation }) => {
	const fNameInput = useInput('');
	const lNameInput = useInput('');
	const emailInput = useInput(navigation.getParam('email', ''));
	const usernameInput = useInput('');
	const [loading, setLoading] = useState(false);
	const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
		variables: {
			username: usernameInput.value,
			email: emailInput.value,
			firstName: fNameInput.value,
			lastName: lNameInput.value
		}
	});
	const handleSignup = async () => {
		const { value: email } = emailInput;
		const { value: fName } = fNameInput;
		const { value: lName } = lNameInput;
		const { value: username } = usernameInput;
		const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (!emailRegex.test(email)) {
			return Alert.alert('That email is invalid');
		}
		if (fName === '') {
			return Alert.alert('I need your name');
		}
		if (username === '') {
			return Alert.alert('Invalid username');
		}

		try {
			setLoading(true);
			const {
				data: { createAccount }
			} = await createAccountMutation();
			if (createAccount) {
				Alert.alert('Account created', 'Log in now!');
				navigation.navigate('Login', { email });
			}
		} catch (error) {
			Alert.alert('Username taken.', 'Log in instead');
			navigation.navigate('Login', { email });
		} finally {
			setLoading(false);
		}
	};
	const fbLogin = async () => {
		try {
			setLoading(true);
			const { type, token } = await Facebook.logInWithReadPermissionsAsync(
				'424584174853730',
				{
					permissions: ['public_profile', 'email']
				}
			);
			if (type === 'success') {
				// Get the user's name using Facebook's Graph API
				const response = await fetch(
					`https://graph.facebook.com/me?access_token=${token}&fields=id,last_name,first_name,email`
				);
				const { email, first_name, last_name } = await response.json();
				updateFormData(email, first_name, last_name);
				setLoading(false);
			} else {
				// type === 'cancel'
			}
		} catch ({ message }) {
			alert(`Facebook Login Error: ${message}`);
		}
	};

	const googleLogin = async () => {
		const GOOGLE_ID =
			'744374235143-b9pav3vfks1cei629fgips5csc5uv719.apps.googleusercontent.com';
		try {
			setLoading(true);
			const result = await Google.logInAsync({
				iosClientId: GOOGLE_ID,
				scopes: ['profile', 'email']
			});

			if (result.type === 'success') {
				const user = await fetch('https://www.googleapis.com/userinfo/v2/me', {
					headers: { Authorization: `Bearer ${result.accessToken}` }
				});
				const { email, family_name, given_name } = await user.json();
				updateFormData(email, given_name, family_name);
			} else {
				return { cancelled: true };
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const updateFormData = (email, firstName, lastName) => {
		emailInput.setValue(email);
		fNameInput.setValue(firstName);
		lNameInput.setValue(lastName);
		const [username] = email.split('@');
		usernameInput.setValue(username);
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View>
				<AuthInput
					{...fNameInput}
					placeholder="First Name"
					autoCapitalize="words"
				/>
				<AuthInput
					{...lNameInput}
					placeholder="Last name"
					autoCapitalize="words"
				/>
				<AuthInput
					{...emailInput}
					placeholder="Email"
					keyboardType="email-address"
					returnKeyType="send"
					autoCorrect={false}
				/>
				<AuthInput
					{...usernameInput}
					placeholder="Username"
					returnKeyType="send"
					autoCorrect={false}
				/>
				<AuthButton loading={loading} text="Sign up" onPress={handleSignup} />
				<FBContainer>
					<AuthButton
						bgColor={'#2D4DA7'}
						loading={false}
						onPress={fbLogin}
						text="Connect Facebook"
					/>
				</FBContainer>
				<GoogleContainer>
					<AuthButton
						bgColor={'#EE1922'}
						loading={false}
						onPress={googleLogin}
						text="Connect Google"
					/>
				</GoogleContainer>
			</View>
		</TouchableWithoutFeedback>
	);
};
