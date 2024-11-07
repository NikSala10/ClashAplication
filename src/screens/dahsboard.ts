import  {imageArray} from '../data/dataBanner'
import '../components/post1/post1'
import '../components/footer/footer'
import '../components/banner1/banner1'
import Banner1, {Attribute} from '../components/banner1/banner1';
import  '../components/barLateral/barLateral'
import '../components/nav/nav'
import PostCard, {AttributePostCard} from '../components/postCard/postCard';
import BarLateral, {Attribute2} from '../components/barLateral/barLateral';
import '../components/addPost/addPost'
import { appState } from '../store/store'
import { getPosts, getUserData, getFiles } from '../utils/firebase'
import { dispatch } from '../store/store'
import { setUserCredentials } from '../store/actions'

class Dashboard extends HTMLElement  {
    imagesBanner: Banner1[] = [];
    userPostList: PostCard[] = []
    userHashtagsList : BarLateral[] = [];
    userData: { name?: string; confirmPassword?: string; } = {};
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.render();  
        const imageUrls = await getFiles(this.id); 
        const firstSixImages = imageUrls?.slice(0, 6) || []; 
        firstSixImages.forEach(url => {
            const imageArrayBanner1 = this.ownerDocument.createElement("component-container") as Banner1;
            imageArrayBanner1.setAttribute(Attribute.image, url); 
            this.imagesBanner.push(imageArrayBanner1); 
        });

        const userId = appState.user;
        if (userId) {
            const userData = await getUserData(userId);
        }
    
        const posts = await getPosts();
        
        for (const post of posts || []) {
            let username = '';
            let name = '';
    
            if (post.userUid) {
                const userDataPost = await getUserData(post.userUid);
                name = userDataPost?.name || '';
                username = `@${userDataPost?.name.replace(/\s+/g, '').toLowerCase()}`;
              
                
            }
    console.log(post.id);
    
            const userPostCards = this.ownerDocument.createElement("card-post") as PostCard;
            userPostCards.setAttribute(AttributePostCard.postid, post.id)
            userPostCards.setAttribute(AttributePostCard.name, name);
            userPostCards.setAttribute(AttributePostCard.username, username);
            userPostCards.setAttribute(AttributePostCard.category, post.category);
            userPostCards.setAttribute(AttributePostCard.description, post.description);
            userPostCards.setAttribute(AttributePostCard.image, post.image);
            userPostCards.setAttribute(AttributePostCard.timeposted, String(post.dateadded));
            userPostCards.setAttribute(AttributePostCard.hashtags, post.hashtags);
    
            this.userPostList.push(userPostCards);
        }
    
        this.render();
    }




    logout() {
		indexedDB.deleteDatabase('firebase-heartbeat-database');
		indexedDB.deleteDatabase('firebaseLocalStorageDb');
		window.location.reload();
        dispatch(setUserCredentials(''))
        alert('Ha cerrado sesión')
        
	}
    render()  {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/Components/banner1/index.css">
             <link rel="stylesheet" href="../src/components/postCard/postCard.css">
           <link rel="stylesheet" href="/src/index.css">
           <nav-component></nav-component>
           <section class="all" id="all">
                <div class="add-Post hide" id="add-Post">
                    <addpost-component></addpost-component> 
                </div>
                <button id="logOut">Cerrar Sesion</button>
                <post-1></post-1>
                <div class="container"></div>
                <section class="containers" id="containers">
                    
                    <div class="container-postcards"></div>
                    
                    <div class="container-barLaterals">
                        <bar-lateral titleitem="Lastest" dataitem="hashtags"></bar-lateral>
                        <bar-lateral titleitem="Categories" dataitem="categories"></bar-lateral>
                    </div>
                    <div class="addPost">
                    <p>+</p>
                </div>
                </section>
           </section>
             
            <foo-ter></foo-ter>
            `;
          
            //POST
            const containerPost = this.shadowRoot?.querySelector('.container-postcards')
            this.userPostList.forEach((postElement) =>  {   
                containerPost?.appendChild(postElement);
            });

            //Banner1
            const container = this.shadowRoot?.querySelector('.container');
            this.imagesBanner.forEach(img => {
                container?.appendChild(img);
            });
            
            
            const logOut = this.shadowRoot?.querySelector('#logOut');
            logOut?.addEventListener('click', this.logout);
         
            
            const containerAll = this.shadowRoot?.querySelector('#all') as HTMLElement;
            const add = this.shadowRoot?.querySelector('#add-Post') as HTMLElement;

            if (appState.modalScreen[0]) {
                add.className = "add-Post"
                containerAll.className = "container-modal"
            }else{
                add.className = "add-Post hide"
                containerAll.className = ""
            }
        }
       
    }
}

customElements.define('app-dashboard', Dashboard);
export default Dashboard;