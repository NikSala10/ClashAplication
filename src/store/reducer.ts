import { Actions } from '../types/store';

export const reducer = (currentAction: any, currentState: any) => {
	const { action, payload } = currentAction;

	switch (action) {
		case Actions.NAVIGATE:
			return {
				...currentState,
				screen: payload,
			};

		case Actions.SETUSERCREDENTIALS:
			return {
				...currentState,
				user: payload,
			};
		case Actions.OPENCLOSESCREEN:
		
			const modalScreen1 = currentState.modalScreen
			const newModalScreen: any = []

            for (let i = 0; i < modalScreen1.length; i++) {
				if (i == payload) {
					newModalScreen.push(!modalScreen1[i])
				}else{
					newModalScreen.push(modalScreen1[i])
				}
			}
			
			return {
				...currentState,
				modalScreen: newModalScreen,
				
			};
		default:
			return currentState;
	}
};