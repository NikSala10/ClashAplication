import { Actions, Screens } from '../types/store';

export const navigate = (screen: Screens) => {
	return {
		action: Actions.NAVIGATE,
		payload: screen,
	};
};

export const setUserCredentials = (user: string) => {
	return {
		action: Actions.SETUSERCREDENTIALS,
		payload: user,
	};
};