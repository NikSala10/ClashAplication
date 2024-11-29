import { dispatch } from '../store/store';
import { setOpenCloseScreen, navigate } from '../store/actions';
import { Actions, Screens } from '../types/store';
import { addObserver, appState } from '../store/store';
import { loginUser } from '../utils/firebase';
import Button, { AttributeBtn } from '../components/button/button';
import ButtonAccount,  {AttributeBtnAccount} from '../components/buttonAddPostAccount/buttonAccount';
import Field, {AttributeField} from '../components/professionalField/professionalField';
import CardAccount, {AttributeCardAccount} from '../components/cardAccount/cardAccount';
import BarLateral, {Attribute2} from '../components/barLateral/barLateral';
import '../components/addPost/addPost';
import '../components/editAccount/editAccount';
import styles from './login.css'
import PostCard,  {AttributePostCard} from '../components/postCard/postCard';
import storage from '../utils/storage';
import { getPostsByUser, getPosts, getUserData } from '../utils/firebase';
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
    likes: String[];
    favourites: String[];
}
class Account extends HTMLElement {
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
        const containerUserInformation = this.shadowRoot?.querySelector('.info-contact-user');  
        getUserData(appState.user, (userInfo: UserData | null) =>  {
                if (!userInfo) {
                        console.warn('No se recibió información de usuario.');
                return;
                }
            while (containerUserInformation?.firstChild) {
                containerUserInformation.removeChild(containerUserInformation.firstChild);
            }
                    
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
			    <link rel="stylesheet" href="/src/screens/account.css">
                <nav-component></nav-component>
                <section class="account-components" id="account-components">
                    
                    <div class="add-Post hide">
                       <addpost-component></addpost-component> 
                    </div>
                    <div class="edit-account hide">
                       <editaccount-component></editaccount-component> 
                    </div>
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
                                <h3 id="name-user">${this.name ? this.name : 'Not found'}</h3>
                                <p id="username">${this.username ? this.username : 'Not found'}</p>
                                <btn-component color="#361656" label="Edit" id="btn-edit"></btn-component>
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
                                <btn-component color="#361656" label="Edit" id="btn-edit"></btn-component>
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
                                <div id="post-config">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.647 4.081a.724.724 0 0 0 1.08.448c2.439-1.485 5.23 1.305 3.745 3.744a.724.724 0 0 0 .447 1.08c2.775.673 2.775 4.62 0 5.294a.724.724 0 0 0-.448 1.08c1.485 2.439-1.305 5.23-3.744 3.745a.724.724 0 0 0-1.08.447c-.673 2.775-4.62 2.775-5.294 0a.724.724 0 0 0-1.08-.448c-2.439 1.485-5.23-1.305-3.745-3.744a.724.724 0 0 0-.447-1.08c-2.775-.673-2.775-4.62 0-5.294a.724.724 0 0 0 .448-1.08c-1.485-2.439 1.305-5.23 3.744-3.745a.722.722 0 0 0 1.08-.447c.673-2.775 4.62-2.775 5.294 0M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6"/></svg>
                                    <svg id="logOut" xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12h-9.5m7.5 3l3-3l-3-3m-5-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-1"/></svg>
                                </div>
                            </div>
                        </section>
                        <div class="filter">
                            <p id= "Postuser">All <b id="countPost"></b></p>
                            <p id= "PostFavorites">Favorites <b id="countPostFavorites"></b></p>
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
                    
                </section>
				
			`;

             //ADDPOSTBTN
             const btnAddPostResponsive = this.shadowRoot.querySelector('#addPost1');
             btnAddPostResponsive?.addEventListener('click', () => {
                 if (appState.user) {
                     dispatch(setOpenCloseScreen(0));
                 } else {
                     alert('Para crear un post necesitas una cuenta');
                     dispatch(navigate(Screens.LOGIN));
                 }
             });


            const containerPost = this.shadowRoot?.querySelector('.container-postcards');  
            const countPost = this.shadowRoot?.querySelector('#countPost');  
            const countPostFavorites = this.shadowRoot?.querySelector('#countPostFavorites');  
            const Postuser = this.shadowRoot?.querySelector('#Postuser');  
            const btnFavorites = this.shadowRoot?.querySelector('#PostFavorites');  

        // Obtener los posts
        const allPosts = await new Promise<any[]>((resolve) => {
            getPosts((posts) => resolve(posts));
        });

        // Obtener los datos del usuario (incluyendo sus likes)
        const userInfo = await new Promise<UserData | null>((resolve) => {
            getUserData(appState.user, resolve);
        });

        if (userInfo) {
            // Filtrar posts favoritos del usuario
            const favoritePosts = allPosts.filter(post => userInfo.favourites.includes(post.id));

            if (countPostFavorites) {
                countPostFavorites.textContent = `${favoritePosts.length}`;
            }
            const userPosts = allPosts.filter(post => post.userUid === appState.user);
            if (countPost) {
                countPost.textContent = `${userPosts.length}`;
            }
            userPosts.forEach(post => {
                const userPostCard = this.ownerDocument.createElement("cardaccount-component") as CardAccount;
                userPostCard.setAttribute(AttributeCardAccount.image, post.image);
                userPostCard.setAttribute(AttributeCardAccount.postid, post.id);
                userPostCard.setAttribute(AttributeCardAccount.hashtags, post.hashtags);
                userPostCard.setAttribute(AttributeCardAccount.likes, post.likes);
                userPostCard.setAttribute(AttributeCardAccount.favorites, post.favourites);
                userPostCard.setAttribute(AttributeCardAccount.comments, post.comments);
                containerPost?.appendChild(userPostCard);
            });

            Postuser?.addEventListener('click', ()=>{
                while (containerPost?.firstChild) {
                    containerPost.removeChild(containerPost.firstChild);
                }
                userPosts.forEach(post => {
                    const userPostCard = this.ownerDocument.createElement("cardaccount-component") as CardAccount;
                    userPostCard.setAttribute(AttributeCardAccount.image, post.image);
                    userPostCard.setAttribute(AttributeCardAccount.postid, post.id);
                    userPostCard.setAttribute(AttributeCardAccount.hashtags, post.hashtags);
                    userPostCard.setAttribute(AttributeCardAccount.likes, post.likes);
                    userPostCard.setAttribute(AttributeCardAccount.favorites, post.favourites);
                    userPostCard.setAttribute(AttributeCardAccount.comments, post.comments);
                    containerPost?.appendChild(userPostCard);
                });
            })
            // Evento al hacer clic en "Favorites"
            btnFavorites?.addEventListener('click', () => {
                // Limpiar los posts actuales
                while (containerPost?.firstChild) {
                    containerPost.removeChild(containerPost.firstChild);
                }

                // Renderizar solo los posts favoritos
                favoritePosts.forEach(post => {
                    const commentsPost = appState.comments.filter((c) => c.postid === post.id) 
                    const user = appState.users.find(u => u.id === post.userUid); 
                    let stateChange = false 
                    if (user.followers) {
                        const follow = user.followers.find((r: any) => r === appState.user);  
                        stateChange = follow ? true : false 
                    }
                    const userLog = appState.users.find(user => user.id === appState.user);
                    let likeStatus = false
                                     
                    if (userLog) {
                        const like = userLog.likes.find((like:any) => like === post.id);
                        if(like) likeStatus = true
                    }
                 
                    const userPostCards = this.ownerDocument.createElement("card-post") as PostCard;
                    userPostCards.setAttribute(AttributePostCard.postid, post.id)
                    userPostCards.setAttribute(AttributePostCard.userid, post.userUid)
                    userPostCards.setAttribute(AttributePostCard.name, user?.name || '');  
                    userPostCards.setAttribute(AttributePostCard.state, String(stateChange));  
                    userPostCards.setAttribute(AttributePostCard.imguser, user?.imgUser || ''); 
                    userPostCards.setAttribute(AttributePostCard.username, user?.username || '');
                    userPostCards.setAttribute(AttributePostCard.category, post.category);
                    userPostCards.setAttribute(AttributePostCard.description, post.description);
                    userPostCards.setAttribute(AttributePostCard.image, post.image);
                    userPostCards.setAttribute(AttributePostCard.timeposted, String(post.dateadded));
                    userPostCards.setAttribute(AttributePostCard.hashtags, post.hashtags);
                    userPostCards.setAttribute(AttributePostCard.likes, post.likes);
                    userPostCards.setAttribute(AttributePostCard.favorites, post.favourites);
                    userPostCards.setAttribute(AttributePostCard.comments, post.comments);
                    userPostCards.setAttribute(AttributePostCard.likeStatus, String(likeStatus));
                    userPostCards.setAttribute(AttributePostCard.commentsElements,JSON.stringify(commentsPost));
                    containerPost?.appendChild(userPostCards);
                });
            });
        }
			const cssAccount = this.ownerDocument.createElement("style");
			cssAccount.innerHTML = styles;
			this.shadowRoot?.appendChild(cssAccount);
			
            const btnAddPost = this.shadowRoot.querySelector('#add-post');
            const btnEdit = this.shadowRoot.querySelector('#btn-edit');

            if (appState.modalScreen[0]) {
                const add = this.shadowRoot?.querySelector('.add-Post')
                const container = this.shadowRoot?.querySelector('#account-components')
                
                if (add && container) {
                    add.className = "add-Post"
                    container.className = "account-components-post"
                }
            }else if (appState.modalScreen[1]) {
                const add = this.shadowRoot?.querySelector('.edit-account')
                const container = this.shadowRoot?.querySelector('#account-components')
                
                if (add && container) {
                    add.className = "edit-account"
                    container.className = "account-components-post"
                }
            }else{
                const add = this.shadowRoot?.querySelector('.edit-account')
                const container = this.shadowRoot?.querySelector('#account-components')
                
                if (add && container) {
                    add.className = "edit-account hide"
                    container.className = "account-components"
                }
            }
            btnAddPost?.addEventListener('click', ()=>{
                dispatch(setOpenCloseScreen(0))
                
            })
            btnEdit?.addEventListener('click', ()=>{
                dispatch(setOpenCloseScreen(1))
                
            })
            const logOut = this.shadowRoot?.querySelector('#logOut');
            logOut?.addEventListener('click', this.logout);

           


		}

        
       
	}
}

customElements.define('app-account', Account);
export default Account;