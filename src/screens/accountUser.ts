import { dispatch } from '../store/store';
import { setOpenCloseScreen } from '../store/actions';
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
import { getPostsByUser, getUserData } from '../utils/firebase';
import '../components/nav/nav';
import { setUserCredentials } from '../store/actions';
interface UserData {
    name: string;
    imgUser:string;
    username: string;
    email: string;
    followers: number;
    following: number;
    category: string;
    placeresidence: string;
    currenttraining: string;
    currentjob: string;
    academy: string;
    moreworksurl: string;
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
            this.followers = userInfo.followers || 0;
            this.following = userInfo.following || 0;
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
                                    <p id="followThe">Follow</p>
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
                        <div class="filter">
                            <p>All  <b>6</b></p>
                        </div>
                        <hr>
                        <section class="containers">
                            <div class="container-postcards">
                            </div>
                            <div class="container-barLaterals">
                                <bar-lateral titleitem="Lastest" dataitem="hashtags"></bar-lateral>
                                <bar-lateral titleitem="Categories" dataitem="categories"></bar-lateral>
                            </div>
                        </section>
                    </div>
                    
                </section>
				
			`;
            const containerPost = this.shadowRoot?.querySelector('.container-postcards');  
            getPostsByUser((posts: any[]) =>  {
                while (containerPost?.firstChild) {
                    containerPost.removeChild(containerPost.firstChild);
                }
                posts.forEach((post: any) => {        
                    const userPostCard = this.ownerDocument.createElement("postuser-component") as PostUserCard;
                    userPostCard.setAttribute(AttributeCardUser.image, post.image);
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
			
        }
    }
       
	 
}

customElements.define('app-accountuser', AccountUsers);
export default AccountUsers;