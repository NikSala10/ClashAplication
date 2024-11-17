import { Actions, Screens } from '../types/store';
import { getPosts, getUsers } from '../utils/firebase';

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

export const setOpenCloseScreen = (modalScreen: Number) => {
	return {
		action: Actions.OPENCLOSESCREEN,
		payload: modalScreen,
	};
};

export const getProductsAction = async () => {
	const posts = await getPosts(); //Firestore
	return {
		action: Actions.GETPOST,
		payload: posts,
	};
};

export const getUsersAction = async () => {
	const users = await getUsers(); //Firestore
	return {
		action: Actions.GETUSERS,
		payload: users,
	};
};

export const loadPost = (loadPost: Boolean) => {
    return {
        action: Actions.LOADPOST,
        payload: loadPost,
    };
};