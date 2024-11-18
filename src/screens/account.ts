import { dispatch } from '../store/store';
import { setOpenCloseScreen, getPostAction } from '../store/actions';
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
import '../components/nav/nav';
import { setUserCredentials } from '../store/actions';

class Account extends HTMLElement {
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
			const cardAccount = this.ownerDocument.createElement("cardaccount-component") as CardAccount;
            cardAccount.setAttribute(AttributeCardAccount.likes, '');
            cardAccount.setAttribute(AttributeCardAccount.comments, '');
            cardAccount.setAttribute(AttributeCardAccount.favorites, '');
            cardAccount.setAttribute(AttributeCardAccount.hashtags, '');
			const barLateral = this.ownerDocument.createElement("bar-lateral") as BarLateral;
            
            
	}

	async connectedCallback() {
		this.render();
        if (appState.post.length === 0) {
            const postsAction = await getPostAction();
            dispatch(postsAction)
        }
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
            let hash = ['hola', 'hola2', 'hola3']
            
            
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
                                    <img id="img-user" src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="">
                                </div>
                                <div id="follows">
                                    <div id="followers">
                                        <p class="pFOlS">Followers</p>
                                        <p class="num">14</p>
                                    </div>
                                    <div id="followeing">
                                        <p class="pFOlS">Following</p>
                                        <p class="num">10</p>
                                    </div>
                                </div>
                            </div>
                            <div class="user-text-contact">
                                <h3 id="name-user">Yeliani Barbosa</h3>
                                <p id="username">@yelibarbosis</p>
                                <btn-component color="#361656" label="Edit" id="btn-edit"></btn-component>
                                <div id="create">
                                    <p id="creative">Creative</p>
                                    <p id="category">Illustrator</p>
                                </div>
                                <h3 id="contct">Contact Information</h3>
                                <p id="email">@yeliani@gmail.com</p>

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
                                <a id="url" href="https://www.behance.net/yelianibarbosa1" target="_blank">https://www.behance.net/yelianibarbosa1</a>
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
                                <cardaccount-component likes="3" comments="5" favorites="8" send="10" hashtags='${JSON.stringify(hash)}' image="../src/assets/alien.jpg"></cardaccount-component>
                                <cardaccount-component likes="3" comments="5" favorites="8" send="10" hashtags='${JSON.stringify(hash)}' image="../src/assets/alien.jpg"></cardaccount-component>
                                <cardaccount-component likes="3" comments="5" favorites="8" send="10" hashtags='${JSON.stringify(hash)}' image="../src/assets/alien.jpg"></cardaccount-component>
                                <cardaccount-component likes="3" comments="5" favorites="8" send="10" hashtags='${JSON.stringify(hash)}' image="../src/assets/alien.jpg"></cardaccount-component>
                            </div>
                            <div class="container-barLaterals">
                                <bar-lateral titleitem="Lastest" dataitem="hashtags"></bar-lateral>
                                <bar-lateral titleitem="Categories" dataitem="categories"></bar-lateral>
                            </div>
                        </section>
                    </div>
                    
                </section>
				
			`;
           
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