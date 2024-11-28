import { Actions, Screens } from '../types/store';
import { getComment, getPosts, getUsers, getPostsByUser, getFileProfile, getUserData } from '../utils/firebase';
import { appState } from './store';

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

export const getUsersAction = async () => {
	const users = await getUsers(); 
	return {
		action: Actions.GETUSERS,
		payload: users,
	};
};


export const getCommentsAction = async () => {
	const comments = await getComment(); 
	return {
		action: Actions.GETCOMMENT,
		payload: comments,
	};
};

export const getImgUserFileAction = async () => {
	const imgByUser = await getFileProfile(appState.user); 
	return {
		action: Actions.GETIMGUSERPROFILE,
		payload: imgByUser,
	};
};

export const loadPost = (loadPost: Boolean) => {
    return {
        action: Actions.LOADPOST,
        payload: loadPost,
    };
};