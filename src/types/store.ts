export type Observer = { render: () => void } & HTMLElement;

export type AppState = {
	screen: string;
	user: '';
	modalScreen: Boolean[]
};

export enum Screens {
	'LOGIN' = 'LOGIN',
	'DASHBOARD' = 'DASHBOARD',
	'REGISTER' = 'REGISTER',
	'ACCOUNT' = 'ACCOUNT'
}

export enum Actions {
	'NAVIGATE' = 'NAVIGATE',
	'SETUSERCREDENTIALS' = 'SETUSERCREDENTIALS',
	'OPENCLOSESCREEN' = 'OPENCLOSESCREEN'
}