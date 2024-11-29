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
import { getComment, getFiles, getUserData, getPosts} from '../utils/firebase'
import { dispatch } from '../store/store'
import { setOpenCloseScreen, getUsersAction, getCommentsAction} from '../store/actions';
import { navigate } from '../store/actions';
import { Screens } from '../types/store';
import { loadPost } from '../store/actions';
interface UserData {
    name: string;
    imgUser:string;
    username: string;
}
class Dashboard extends HTMLElement  {
    name?: string;
    imguser?:string;
    username?:string;
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
        
        if (appState.users.length === 0) {
            const usersAction = await getUsersAction();
            dispatch(usersAction)
        }
        if (appState.comments.length === 0) {
            const commentsAction = await getCommentsAction();
            dispatch(commentsAction)
        }
        const containerUserInformation = this.shadowRoot?.querySelector('.info-contact-user');  
        const userId = appState.user
            getUserData(userId, (userInfo: UserData | null) => {
                if (!userInfo) {
                    console.warn('No se recibió información de usuario.');
                    return;
                }

                while (containerUserInformation?.firstChild) {
                    containerUserInformation.removeChild(containerUserInformation.firstChild);
                }
                this.name = userInfo.name || ''; 
                this.imguser = userInfo.imgUser || '';
                this.username = userInfo.username || '@user';  
                this.render();
            });
        this.render();
    }

    render()  {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/Components/banner1/index.css">
             <link rel="stylesheet" href="../src/components/postCard/postCard.css">
           <link rel="stylesheet" href="/src/index.css">
           <nav-component></nav-component>
             <div class="bar-responsive">
                <p id="nav-all">All</p>
                <p id="nav-new">Top</p>
            </div>
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
            
            const navNew = this.shadowRoot.querySelector('#nav-new');
            const navAll = this.shadowRoot.querySelector('#nav-all');
            navNew?.addEventListener('click', ()=>{
                dispatch(loadPost(true))
            })
            navAll?.addEventListener('click', ()=>{
                dispatch(loadPost(false))
            })
            //POST
            const containerPost = this.shadowRoot?.querySelector('.container-postcards');
            if(!appState.loadPost){
               getPosts((posts: any[]) =>  {
                while (containerPost?.firstChild) {
                    containerPost.removeChild(containerPost.firstChild);
                }
                posts.forEach((post: any) => {     
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
            }else{
                const containerPost = this.shadowRoot?.querySelector('.container-postcards');
                if (!containerPost) {
                    console.error('No se encontró el contenedor de posts.');
                    return;
                }
                getPosts(async (posts: any[]) => {
                    // Limpiar el contenedor antes de renderizar nuevos datos
                    while (containerPost.firstChild) {
                        containerPost.removeChild(containerPost.firstChild);
                    }
                
                    // Ordenar los posts por likes en orden descendente
                    const postTopLikes = posts
                        .slice()
                        .sort((a, b) => b.likes - a.likes);
                
                    // Renderizar los posts ordenados
                    for (const post of postTopLikes) {
                        const user = appState.users.find((user) => user.id === post.userUid);
                        const userLog = appState.users.find((user) => user.id === appState.user);
                
                        let likeStatus = false;
                        if (userLog?.likes?.includes(post.id)) {
                            likeStatus = true;
                        }
                
                        const userPostCards = this.ownerDocument.createElement('card-post') as PostCard;
                        userPostCards.setAttribute(AttributePostCard.postid, post.id);
                        userPostCards.setAttribute(AttributePostCard.name, user?.name || 'Usuario desconocido');
                        userPostCards.setAttribute(AttributePostCard.username, user?.username || '@usuario');
                        userPostCards.setAttribute(AttributePostCard.category, post.category || 'Sin categoría');
                        userPostCards.setAttribute(AttributePostCard.description, post.description || 'Sin descripción');
                        userPostCards.setAttribute(AttributePostCard.image, post.image || '');
                        userPostCards.setAttribute(AttributePostCard.timeposted, String(post.dateadded));
                        userPostCards.setAttribute(AttributePostCard.hashtags, post.hashtags || '[]');
                        userPostCards.setAttribute(AttributePostCard.likes, String(post.likes || '0'));
                        userPostCards.setAttribute(AttributePostCard.favorites, String(post.favourites || '0'));
                        userPostCards.setAttribute(AttributePostCard.comments, String(post.comments || '0'));
                        userPostCards.setAttribute(AttributePostCard.likeStatus, String(likeStatus));
                
                        containerPost.appendChild(userPostCards);
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