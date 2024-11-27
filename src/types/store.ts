export type Observer = { render: () => void } & HTMLElement;

export type AppState = {
    screen: string;
    user: '';
    post: any[];
    modalScreen: Boolean[];
    loadPost: Boolean;
    users: any[];
    comments: any[];
    imgUserProfile: string
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
    'OPENCLOSESCREEN' = 'OPENCLOSESCREEN',
    'LOADPOST' = 'LOADPOST',
    'GETPOST' = 'GETPOST',
    'GETUSERS' = 'GETUSERS',
    'GETCOMMENT' = 'GETCOMMENT',
    'GETPOSTSBYUSER' = 'GETPOSTSBYUSER',
    'GETIMGUSERPROFILE' = 'GETIMGUSERPROFILE',
    'GETUSERDATA' = 'GETUSERDATA'
}