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
import { getComment, getFiles, uploadUserData, getUserData} from '../utils/firebase'
import { dispatch } from '../store/store'
import { setOpenCloseScreen, getPostAction, getUsersAction, getCommentsAction} from '../store/actions';
import { navigate } from '../store/actions';
import { Screens } from '../types/store';

class Dashboard extends HTMLElement  {
    imagesBanner: Banner1[] = [];
    userHashtagsList : BarLateral[] = [];
    userData: { name?: string; confirmPassword?: string; } = {};
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const imageUrls = await getFiles(this.id); 
        const firstSixImages = imageUrls?.slice(0, 6) || []; 
        firstSixImages.forEach(url => {
            const imageArrayBanner1 = this.ownerDocument.createElement("component-container") as Banner1;
            imageArrayBanner1.setAttribute(Attribute.image, url); 
            this.imagesBanner.push(imageArrayBanner1); 
        });
        
        if (appState.post.length === 0) {
            const postsAction = await getPostAction();
            dispatch(postsAction)
        }
        if (appState.users.length === 0) {
            const usersAction = await getUsersAction();
            dispatch(usersAction)
        }
        if (appState.comments.length === 0) {
            const commentsAction = await getCommentsAction();
            dispatch(commentsAction)
        }

        
        this.render();
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
                <post-1></post-1>
                <div class="container"></div>
                <section class="containers" id="containers">
                    
                    <div class="container-postcards"></div>
                    
                    <div class="container-barLaterals">
                        <bar-lateral titleitem="Lastest" dataitem="hashtags"></bar-lateral>
                        <bar-lateral titleitem="Categories" dataitem="categories"></bar-lateral>
                    </div>
                    <div id="addPost1" class="addPost">
                    <p>+</p>
                </div>
                </section>
           </section>
             
            <foo-ter></foo-ter>
            `;
            
        
            //POST
            const containerPost = this.shadowRoot?.querySelector('.container-postcards');
            if(!appState.loadPost){
                appState.post.forEach((post) =>  {   
                    const user = appState.users.find(user => user.id === post.userUid);
                    const username = `@${user?.name.replace(/\s+/g, '').toLowerCase()}`; 
                    if (user) {
                        uploadUserData(user.id, {
                            username: username,
                            category: user.category || '',
                            imgUser: user.imgUser ||  '', 
                            placeresidence: user.placeresidence || '', 
                            currenttraining: user.currenttraining || '', 
                            currentjob: user.currentjob || '', 
                            academy: user.academy || '',
                            moreworksurl: user.moreworksurl || ''
                        });
                    }
                    // if (post.userUid) {
                    //     const userDataPost = await getUserData(post.userUid);
                    //     name = userDataPost?.name || '';
                    //     username = `@${userDataPost?.name.replace(/\s+/g, '').toLowerCase()}`;  
                    // }
                    const commentsPost = appState.comments.filter((c) => c.postid === post.id)                    
                    const userPostCards = this.ownerDocument.createElement("card-post") as PostCard;
                    userPostCards.setAttribute(AttributePostCard.postid, post.id)
                    userPostCards.setAttribute(AttributePostCard.name, user.name);
                    userPostCards.setAttribute(AttributePostCard.username, username);
                    userPostCards.setAttribute(AttributePostCard.category, post.category);
                    userPostCards.setAttribute(AttributePostCard.description, post.description);
                    userPostCards.setAttribute(AttributePostCard.image, post.image);
                    userPostCards.setAttribute(AttributePostCard.timeposted, String(post.dateadded));
                    userPostCards.setAttribute(AttributePostCard.hashtags, post.hashtags);
                    userPostCards.setAttribute(AttributePostCard.likes, post.likes);
                    userPostCards.setAttribute(AttributePostCard.favorites, post.favourites);
                    userPostCards.setAttribute(AttributePostCard.comments, post.comments);
                    userPostCards.setAttribute(AttributePostCard.commentsElements,JSON.stringify(commentsPost));
                    containerPost?.appendChild(userPostCards);
                });
            }else{
                const postTopLikes = appState.post.slice()
                postTopLikes.sort((a, b) => b.likes - a.likes);
              
                
                postTopLikes.forEach((post) =>  {   
                    const user = appState.users.find(user => user.id === post.userUid);
                    // const username = `@${user?.name.replace(/\s+/g, '').toLowerCase()}`; 
                    // if (post.userUid) {
                    //     const userDataPost = await getUserData(post.userUid);
                    //     name = userDataPost?.name || '';
                    //     username = @${userDataPost?.name.replace(/\s+/g, '').toLowerCase()};  
                    // }
        
                    const userPostCards = this.ownerDocument.createElement("card-post") as PostCard;
                    userPostCards.setAttribute(AttributePostCard.postid, post.id)
                    userPostCards.setAttribute(AttributePostCard.name, user.name);
                    // userPostCards.setAttribute(AttributePostCard.username, username);
                    userPostCards.setAttribute(AttributePostCard.category, post.category);
                    userPostCards.setAttribute(AttributePostCard.description, post.description);
                    userPostCards.setAttribute(AttributePostCard.image, post.image);
                    userPostCards.setAttribute(AttributePostCard.timeposted, String(post.dateadded));
                    userPostCards.setAttribute(AttributePostCard.hashtags, post.hashtags);
                    userPostCards.setAttribute(AttributePostCard.likes, post.likes);
                    userPostCards.setAttribute(AttributePostCard.favorites, post.favourites);
                    userPostCards.setAttribute(AttributePostCard.comments, post.comments);
                    containerPost?.appendChild(userPostCards);
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

         
            //Banner1
            const container = this.shadowRoot?.querySelector('.container');
            this.imagesBanner.forEach(img => {
                container?.appendChild(img);
            });
            
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