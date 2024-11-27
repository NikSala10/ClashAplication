import { dispatch } from '../store/store';
import { setOpenCloseScreen, getPostAction, getImgUserFileAction } from '../store/actions';
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
import storage from '../utils/storage';
import { getPostsByUser, getUserData } from '../utils/firebase';
import '../components/nav/nav';
import { setUserCredentials } from '../store/actions';
interface UserData {
    name: string;
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
			const field = this.ownerDocument.createElement("field-component") as Field;
            field.setAttribute(AttributeField.field, '');
            field.setAttribute(AttributeField.label, '');
			const barLateral = this.ownerDocument.createElement("bar-lateral") as BarLateral;
	}
   
	async connectedCallback() {
        if (!appState.imgUserProfile) {
            const imgAction = await getImgUserFileAction();
            dispatch(imgAction);
        }        
        const containerUserInformation = this.shadowRoot?.querySelector('.info-contact-user');  
        getUserData((userInfo: UserData | null) =>  {
                if (!userInfo) {
                        console.warn('No se recibió información de usuario.');
                return;
                }
            while (containerUserInformation?.firstChild) {
                containerUserInformation.removeChild(containerUserInformation.firstChild);
            }
                    
            this.name = userInfo.name || 'Not found';
            this.username = userInfo.username || 'Not found';
            this.email = userInfo.email || 'Not found';
            this.followers = userInfo.followers || 0;
            this.following = userInfo.following || 0;
            this.category = userInfo.category || 'Not found';
            this.placeresidence = userInfo.placeresidence || 'Not found';
            this.currenttraining = userInfo.currenttraining || 'Not found';
            this.currentjob = userInfo.currentjob || 'Not found';
            this.academy = userInfo.academy || 'Not found';
            this.moreworksurl = userInfo.moreworksurl || '#';

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
                                    <img id="img-user" src="" alt="">
                                </div>
                                <div id="follows">
                                    <div id="followers">
                                        <p class="pFOlS">Followers</p>
                                        <p class="num">${this.followers ? this.followers : 'Not found'}</p>
                                    </div>
                                    <div id="followeing">
                                        <p class="pFOlS">Following</p>
                                        <p class="num">${this.following ? this.following : 'Not found'}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="user-text-contact">
                                <h3 id="name-user">${this.name ? this.name : 'Not found'}</h3>
                                <p id="username">${this.username ? this.username : 'Not found'}</p>
                                <btn-component color="#361656" label="Edit" id="btn-edit"></btn-component>
                                <div id="create">
                                    <p id="creative">Creative</p>
                                    <p id="category">${this.category ? this.category : 'Not found'}</p>
                                </div>
                                <h3 id="contct">Contact Information</h3>
                                <p id="email">${this.email ? this.email : 'Not found'}</p>

                                <div class="icons-profesional">
                                    <div class="first">
                                        <field-component field="placeResidence" label="Cali, Colombia"></field-component>
                                        <field-component field="currentJob" label="UI Disney"></field-component>
                                    </div>
                                    <div class="first">
                                        <field-component field="Academy" label="DMI, ICESI"></field-component>
                                        <field-component field="currentTraining" label="Course of Design"></field-component>
                                    </div>
                                </div>
                                <p id="Works">More Works</p>
                                <a id="url" href="${this.moreworksurl ? this.moreworksurl : 'Not found'}" target="_blank">${this.moreworksurl ? this.moreworksurl : 'Not found'}</a>
                            </div>
                     
                        </section>
                        <div id="post-config">
                            <btn-account color="#361656" label="+ Post" id="add-post"></btn-account>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.647 4.081a.724.724 0 0 0 1.08.448c2.439-1.485 5.23 1.305 3.745 3.744a.724.724 0 0 0 .447 1.08c2.775.673 2.775 4.62 0 5.294a.724.724 0 0 0-.448 1.08c1.485 2.439-1.305 5.23-3.744 3.745a.724.724 0 0 0-1.08.447c-.673 2.775-4.62 2.775-5.294 0a.724.724 0 0 0-1.08-.448c-2.439 1.485-5.23-1.305-3.745-3.744a.724.724 0 0 0-.447-1.08c-2.775-.673-2.775-4.62 0-5.294a.724.724 0 0 0 .448-1.08c-1.485-2.439 1.305-5.23 3.744-3.745a.722.722 0 0 0 1.08-.447c.673-2.775 4.62-2.775 5.294 0M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6"/></svg>
                            <svg id="logOut" xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12h-9.5m7.5 3l3-3l-3-3m-5-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-1"/></svg>
                        </div>
                        <div class="filter">
                            <p>All  <b>6</b></p>
                            <p>Favorites <b>6</b></p>
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
                    const userPostCard = this.ownerDocument.createElement("cardaccount-component") as CardAccount;
                    userPostCard.setAttribute(AttributeCardAccount.image, post.image);
                    userPostCard.setAttribute(AttributeCardAccount.postid, post.id);
                    userPostCard.setAttribute(AttributeCardAccount.hashtags, post.hashtags);
                    userPostCard.setAttribute(AttributeCardAccount.likes, post.likes);
                    userPostCard.setAttribute(AttributeCardAccount.favorites, post.favourites);
                    userPostCard.setAttribute(AttributeCardAccount.comments, post.comments);
                    containerPost?.appendChild(userPostCard);
                });
            });

           

        const imgElement = this.shadowRoot?.querySelector('#img-user') as HTMLImageElement;
        if (imgElement && typeof appState.imgUserProfile === 'string' && appState.imgUserProfile !== '') {
            imgElement.src = appState.imgUserProfile; 
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