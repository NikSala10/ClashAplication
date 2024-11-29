import { dispatch } from '../store/store';
import { setOpenCloseScreen, navigate } from '../store/actions';
import { Actions, Screens } from '../types/store';
import { addObserver, appState } from '../store/store';
import { loginUser } from '../utils/firebase';
import Button, { AttributeBtn } from '../components/button/button';
import ButtonAccount,  {AttributeBtnAccount} from '../components/buttonAddPostAccount/buttonAccount';
import Field, {AttributeField} from '../components/professionalField/professionalField';
import PostUserCard,  {AttributeCardUser} from '../components/postAccountUser/postUserby';
import BarLateral, {Attribute2} from '../components/barLateral/barLateral';
import '../components/addPost/addPost';
import '../components/editAccount/editAccount';
import styles from './login.css'
import storage from '../utils/storage';
import { getPostsByUserAccount, getUserData, uploadUserData } from '../utils/firebase';
import '../components/nav/nav';
import { setUserCredentials } from '../store/actions';
interface UserData {
    name: string;
    imgUser:string;
    username: string;
    email: string;
    followers: [];
    following: [];
    category: string;
    placeresidence: string;
    currenttraining: string;
    currentjob: string;
    academy: string;
    moreworksurl: string;
    likes:[],
	favourites:[]
}
class AccountUsers extends HTMLElement {
    imguser?: string;
    name?: string;
    email?: string;
    following?: number;
    followers?: number;
    username?: string;
    category?: string;
    placeresidence?: string;
	currenttraining?: string;
	currentjob?: string;
	academy?: string;
    moreworksurl?: string;
    userid?:string;
    state?: boolean

	constructor() {
		super();
        addObserver(this)
		this.attachShadow({ mode: 'open' });
        const btnAddPost = this.ownerDocument.createElement("btn-account") as ButtonAccount;
            btnAddPost.setAttribute(AttributeBtnAccount.color, '');
            btnAddPost.setAttribute(AttributeBtnAccount.label, '');
			const barLateral = this.ownerDocument.createElement("bar-lateral") as BarLateral;
	}
   
	async connectedCallback() {
        const userId = appState.userId;
        
        const containerUserInformation = this.shadowRoot?.querySelector('.info-contact-user');  
        getUserData(userId, (userInfo: UserData | null) =>  {
                if (!userInfo) {
                    console.warn('No se recibió información de usuario.');
                return;
                }
            while (containerUserInformation?.firstChild) {
                containerUserInformation.removeChild(containerUserInformation.firstChild);
            }
            let stateChange = false 
                if (userInfo.followers) {
                    const follow = userInfo.followers.find((r: any) => r === appState.user);  
                    stateChange = follow ? true : false 
                }
            
           
            this.state = stateChange
            this.name = userInfo.name || 'Not found';
            this.imguser = userInfo.imgUser;
            this.username = userInfo.username || 'Not found';
            this.email = userInfo.email || 'Not found';
            this.followers = userInfo.followers.length || 0;
            this.following = userInfo.following.length || 0;
            this.category = userInfo.category || 'Empty field';
            this.placeresidence = userInfo.placeresidence || 'Empty field';
            this.currentjob = userInfo.currentjob || 'Empty field';
            this.currenttraining = userInfo.currenttraining || 'Empty field';
            this.academy = userInfo.academy || 'Empty field';
            this.moreworksurl = userInfo.moreworksurl || 'Url not entered';

            const fieldPlaceResidence = this.ownerDocument.createElement("field-component") as Field;
            fieldPlaceResidence.setAttribute(AttributeField.field, '');
            fieldPlaceResidence.setAttribute(AttributeField.label, '');
            
            this.render();

        });

        this.render();
	}
    logout() {
		indexedDB.deleteDatabase('firebase-heartbeat-database');
		indexedDB.deleteDatabase('firebaseLocalStorageDb');
		window.location.reload();
        dispatch(setUserCredentials(''))
        alert('Ha cerrado sesión')
        
	}
    
	async render() {
		if (this.shadowRoot) {
            const userImage = this.imguser || '/src/assets/ImgUserIcon.svg';
			this.shadowRoot.innerHTML = `
			    <link rel="stylesheet" href="/src/screens/accountUser.css">
                <nav-component></nav-component>
                <section class="account-components" id="account-components">
                    <div class="container-account"  >
                        <section class="info-contact-user">
                            <div class="user-info">
                                <div class="circle-img">
                                    <img id="img-user" src="${userImage}" alt="">
                                </div>
                                <div id="follows">
                                    <div id="followers">
                                        <p class="pFOlS">Followers</p>
                                        <p class="num">${this.followers}</p>
                                    </div>
                                    <div id="followeing">
                                        <p class="pFOlS">Following</p>
                                        <p class="num">${this.following}</p>
                                    </div>
                                </div>
                               
                            </div>
                            <div class="user-text-contact">
                                <div class="followText">
                                    <div class="nm">
                                        <h3 id="name-user">${this.name ? this.name : 'Not found'}</h3>
                                        <p id="username">${this.username ? this.username : 'Not found'}</p>
                                    </div>
                                    <p id="followThe">${this.state ? 'Following' : 'Follow'}</p>
                                </div>
                                <div id="create">
                                    <p id="creative">Creative</p>
                                    <p id="category">${this.category ? this.category : 'Empty field'}</p>
                                </div>
                                <h3 id="contct">Contact Information</h3>
                                <p id="email">${this.email ? this.email : 'Not found'}</p>

                                <div class="icons-profesional">
                                    <div class="first">
                                        <field-component field="placeResidence" label="${this.placeresidence ? this.placeresidence : 'Empty field'}"></field-component>
                                        <field-component field="currentJob" label="${this.currentjob ? this.currentjob : 'Empty field'}"></field-component>
                                    </div>
                                    <div class="first">
                                        <field-component field="Academy" label="${this.academy ? this.academy : 'Empty field'}"></field-component>
                                        <field-component field="currentTraining" label="${this.currenttraining ? this.currenttraining : 'Empty field'}"></field-component>
                                    </div>
                                </div>
                                <p id="Works">More Works</p>
                                <a id="url" href="${this.moreworksurl ? this.moreworksurl : 'Url not entered'}" target="_blank">${this.moreworksurl ? this.moreworksurl : 'Not found'}</a>
                            </div>
                     
                        </section>
                        <section class="info-contact-user2">
                            <div class="user-info">
                                <div class="circle-img">
                                    <img id="img-user" src="${userImage}" alt="">
                                </div>
                                <div id="create">
                                    <p id="username">${this.username ? this.username : 'Not found'}</p>
                                    <p id="creative">Creative</p>
                                    <p id="category">${this.category ? this.category : 'Empty field'}</p>
                                </div>
                                <p id="followThe">${this.state ? 'Following' : 'Follow'}</p>
                            </div>
                            <div class="user-text-contact">
                                <h3 id="contct">Contact Information</h3>
                                <p id="email">${this.email ? this.email : 'Not found'}</p>

                                <div class="icons-profesional">
                                    <div class="first">
                                        <field-component field="placeResidence" label="${this.placeresidence ? this.placeresidence : 'Empty field'}"></field-component>
                                        <field-component field="currentJob" label="${this.currentjob ? this.currentjob : 'Empty field'}"></field-component>
                                    </div>
                                    <div class="first">
                                        <field-component field="Academy" label="${this.academy ? this.academy : 'Empty field'}"></field-component>
                                        <field-component field="currentTraining" label="${this.currenttraining ? this.currenttraining : 'Empty field'}"></field-component>
                                    </div>
                                </div>
                                <p id="Works">More Works</p>
                                <a id="url" href="${this.moreworksurl ? this.moreworksurl : 'Url not entered'}" target="_blank">${this.moreworksurl ? this.moreworksurl : 'Not found'}</a>
                            </div>
                            <div id="follows">
                                <div id="followers">
                                    <p class="pFOlS">Followers</p>
                                    <p class="num">${this.followers}</p>
                                </div>
                                <div id="followeing">
                                    <p class="pFOlS">Following</p>
                                    <p class="num">${this.following}</p>
                                </div>
                            </div>
                        </section>
                        <div class="filter">
                             <p id= "Postuser">All <b id="countPost"></b></p>
                        </div>
                        <hr>
                        <section class="containers">
                            <div class="container-postcards">
                            </div>
                            <div class="container-barLaterals">
                                <bar-lateral titleitem="Lastest" dataitem="hashtags"></bar-lateral>
                                <bar-lateral titleitem="Categories" dataitem="categories"></bar-lateral>
                            </div>
                        <div id="addPost1" class="addPost">
                            <p>+</p>
                        </div>
                        </section>
                    </div>
                    <p>+</p>
                </section>
				
			`;
            const countPost = this.shadowRoot?.querySelector('#countPost');  
            const containerPost = this.shadowRoot?.querySelector('.container-postcards');  
            const userId = appState.userId;
            getPostsByUserAccount(userId,(posts: any[]) =>  {
                while (containerPost?.firstChild) {
                    containerPost.removeChild(containerPost.firstChild);
                }
                if (countPost) {
                    countPost.textContent = `${posts.length}`;
                }
               
                posts.forEach((post: any) => {        
                    const userPostCard = this.ownerDocument.createElement("postuser-component") as PostUserCard;
                    userPostCard.setAttribute(AttributeCardUser.image, post.image);
                    userPostCard.setAttribute(AttributeCardUser.userid, post.userUid);
                    userPostCard.setAttribute(AttributeCardUser.postid, post.id);
                    userPostCard.setAttribute(AttributeCardUser.hashtags, post.hashtags);
                    userPostCard.setAttribute(AttributeCardUser.likes, post.likes);
                    userPostCard.setAttribute(AttributeCardUser.favorites, post.favourites);
                    userPostCard.setAttribute(AttributeCardUser.comments, post.comments);
                    containerPost?.appendChild(userPostCard);
                });
                    
            });

			const cssAccount = this.ownerDocument.createElement("style");
			cssAccount.innerHTML = styles;
			this.shadowRoot?.appendChild(cssAccount);
			
            const state = this.shadowRoot?.querySelector('#followThe') as HTMLElement;

            if (state) {
                state.addEventListener('click', async () => {
                 
                    
                    const currentUser = appState.user;  // Usuario actual   
                    if (!currentUser) {
                        alert('Debes iniciar sesión para seguir a otros usuarios.');
                        return;
                    }
            
                      // Usuario objetivo
                    if (!userId) {
        
                        console.error('No se encontró el usuario objetivo.');

                        return;
                    }
            
                    const isFollowing = state.textContent === 'Following';
                    try {
                        // Obtén los datos actuales de los usuarios
                        const targetUser = await new Promise<UserData | null>((resolve) =>
                            getUserData(userId, resolve)
                        );
                        const currentUserInfo = await new Promise<UserData | null>((resolve) =>
                            getUserData(currentUser, resolve)
                        );
            
                        if (!targetUser || !currentUserInfo) {
                            console.error('No se pudo obtener la información de los usuarios.');
                            return;
                        }
            
                        // Agregar o quitar el ID del usuario en los arrays de seguidores y seguidos
                        const updatedFollowers = isFollowing
                            ? targetUser.followers.filter((id: string) => id !== currentUser) // Si ya está siguiendo, lo elimina
                            : [...targetUser.followers, currentUser]; // Si no está siguiendo, agrega al array
            
                        const updatedFollowing = isFollowing
                            ? currentUserInfo.following.filter((id: string) => id !== userId) // Elimina si está siguiendo
                            : [...currentUserInfo.following, userId]; // Agrega al array si no lo está
            
                        // Actualiza los datos en Firebase solo si hubo un cambio
                        if (isFollowing) {
                            // Eliminar del array si es "Unfollow"
                            await uploadUserData(userId, {
                                ...targetUser,
                                followers: updatedFollowers,
                            } as UserData);
            
                            await uploadUserData(currentUser, {
                                ...currentUserInfo,
                                following: updatedFollowing,
                            } as UserData);
                        } else {
                            // Agregar al array si es "Follow"
                            await uploadUserData(userId, {
                                ...targetUser,
                                followers: updatedFollowers,
                            } as UserData);
            
                            await uploadUserData(currentUser, {
                                 ...currentUserInfo,
                                following: updatedFollowing,
                            } as UserData);
                        }
            
                        // Cambiar el texto del botón, sin hacer un re-render completo
                        state.textContent = isFollowing ? 'Follow' : 'Following';
            
                    } catch (error) {
                        console.error('Error al actualizar la información de seguimiento:', error);
                    }
                });
            }

            //ADDPOSTBTN
            const btnAddPost = this.shadowRoot.querySelector('#addPost1');
            btnAddPost?.addEventListener('click', () => {
                if (appState.user) {
                    dispatch(setOpenCloseScreen(0));
                } else {
                    alert('Para crear un post necesitas una cuenta');
                    dispatch(navigate(Screens.LOGIN));
                }
            });
        }
    }
       
	 
}

customElements.define('app-accountuser', AccountUsers);
export default AccountUsers;