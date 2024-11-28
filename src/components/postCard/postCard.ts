import { getCommentsByPost, getUserData, updatePostField, uploadUserData } from "../../utils/firebase";
import Comments, {CommentsAttribute} from "../comments/comments";
import { UpdateFieldType } from "../../types/post";
import { appState, dispatch } from "../../store/store";

import '../hashtags/hashtags'
import Field from "../professionalField/professionalField";
import { navigateUser } from "../../store/actions";
import { Screens } from "../../types/store";

export enum AttributePostCard  { 
    'userid' = 'userid',
    'postid' = 'postid',
    'imguser' = 'imguser',
    'name' = 'name',
    'username' = 'username',
    'category' = 'category',
    'description' = 'description',
    'image' = 'image',
    'timeposted' = 'timeposted',
    'hashtags' = 'hashtags',
    'state' = 'state',
    'likes' =  'likes',
    'comments' = 'comments',
    'favorites' = 'favorites',
    'send' = 'send',
    'commentsElements' = 'commentsElements'

}
interface UserData {
    username: string;
	category: string,
	imgUser: string,
    placeresidence: string,
	currenttraining: string,
	currentjob: string,
	academy: string,
	moreworksurl: string,
	followers: [],
	following: []
}
class PostCard extends HTMLElement  {
    userid?:string;
    postid?: string; 
    imguser?: string;
    name?: string;
    username?: string;
    category?: string;
    description?: string;
    image?: string;
    timeposted?: string;
    hashtags?: string ;
    state?: boolean;
    likes? : number;
    commentsN?: number;
    favorites?: number;
    send?: number;
    showComent?: boolean;
    commentsElements?: any[] = [];
    commentsAll?: any[] = []
    
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
        this.showComent = false;
    }

    static get observedAttributes() {
        return Object.values(AttributePostCard);
    }

    attributeChangedCallback(propName : AttributePostCard, oldValue: string | undefined, newValue: string | undefined) {
        switch (propName) {
            case AttributePostCard.state:
                this.state = newValue? Boolean(newValue) : undefined;  
            break;
            case AttributePostCard.likes:
                this.likes = newValue ? Number(newValue) : undefined;
                break;
            case AttributePostCard.comments:
                this.commentsN = newValue ? Number(newValue) : undefined;
                break;
            case AttributePostCard.favorites:
                this.favorites = newValue ? Number(newValue) : undefined;
                break;
            case AttributePostCard.send:
            this.send = newValue ? Number(newValue) : undefined;
                break;
            case AttributePostCard.commentsElements:
                this.commentsElements = newValue ? JSON.parse(newValue) : undefined;
                    break;
            default:
                this[propName] = newValue;
                break;
        }
        this.render();
    }
    connectedCallback() { 
       
        this.render();

        // Cambiar state de follow a following, de following a follow
        const state = this.shadowRoot?.querySelector('.state') as HTMLElement;
        if (state) {
            state.addEventListener('click', async () => {
                const currentUser = appState.user;  // Usuario actual

                console.log(currentUser);
                
                if (!currentUser) {
                    alert('Debes iniciar sesión para seguir a otros usuarios.');
                    return;
                }
        
                const targetUserId = this.userid;  // Usuario objetivo
                if (!targetUserId) {
                    console.error('No se encontró el usuario objetivo.');
                    return;
                }
        
                const isFollowing = state.textContent === 'Following';
                console.log(targetUserId);
                
                try {
                    // Obtén los datos actuales de los usuarios
                    const targetUser = await new Promise<UserData | null>((resolve) =>
                        getUserData(targetUserId, resolve)
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
                        ? currentUserInfo.following.filter((id: string) => id !== targetUserId) // Elimina si está siguiendo
                        : [...currentUserInfo.following, targetUserId]; // Agrega al array si no lo está
        
                    // Actualiza los datos en Firebase solo si hubo un cambio
                    if (isFollowing) {
                        console.log(updatedFollowing);
                        
                        // Eliminar del array si es "Unfollow"
                        await uploadUserData(targetUserId, {
                            ...targetUser,
                            followers: updatedFollowers,
                        } as UserData);
        
                        await uploadUserData(currentUser, {
                            ...currentUserInfo,
                            following: updatedFollowing,
                        } as UserData);
                    } else {
                        console.log('else');
                        
                        console.log(updatedFollowing);

                        // Agregar al array si es "Follow"
                        await uploadUserData(targetUserId, {
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


        let counterFavorites = [0];
        let counterFavoritesboolean = true;
        counterFavorites[0] = this.favorites ? this.favorites : 0;
        const favoritesButton = this.shadowRoot?.querySelector('#favorite') as HTMLElement;
        const pFavorites = this.shadowRoot?.querySelector('#favoriteCount') as HTMLElement;
        const svgFavorites = this.shadowRoot?.querySelector('.icon3') as HTMLElement;
        
        favoritesButton.addEventListener('click', () => { 
            if(appState.user){
                if (counterFavoritesboolean) {
                    counterFavorites[0] += 1;
                    svgFavorites.style.color = '#FFFFFF';
                    this.favorites = counterFavorites[0]
                } else {
                    counterFavorites[0] -= 1;
                    svgFavorites.style.color = ''; 
                    this.favorites = counterFavorites[0]
                }
                counterFavoritesboolean = !counterFavoritesboolean
                pFavorites.textContent = `${counterFavorites[0]}`;
                this.updatePost('favourites', counterFavorites[0])
            }else {
                alert('No puedes dar like si no tienes una cuenta')
            }
        });

        const userImage = this.shadowRoot?.querySelector('.circle-img') as HTMLElement;
            userImage.addEventListener('click', () => {
                const userUid = this.userid;
                if (userUid) {
                    dispatch(navigateUser(Screens.ACCOUNTUSER, userUid));  
                } else {
                    console.warn('No user ID available');
                }
            });
        

    }
    updatePost(field: UpdateFieldType, count: number){
        if (this.postid) {
            if(count < 0 ){
                updatePostField(this.postid, field, 0)
            }else{
                updatePostField(this.postid, field, count)
            }
        }
    }

   
    formatTimeAgo(dateadded:any) {
        if (!dateadded) return "Fecha no disponible";
    
        const now = new Date();
        const date = new Date(dateadded); 
    
        const secondsElapsed = Math.floor((now.getTime() - date.getTime()) / 1000);
    
        if (secondsElapsed < 60) return `hace ${secondsElapsed}   s`;
        if (secondsElapsed < 3600) return `hace ${Math.floor(secondsElapsed / 60)}  m`;
        if (secondsElapsed < 86400) return `hace ${Math.floor(secondsElapsed / 3600)}   h`;
        const daysElapsed = Math.floor(secondsElapsed / 86400);
        return `hace ${daysElapsed}d`;
    }
    render() {
        let countComment = 0; 
        if (this.shadowRoot) {
            const initialLetter = this.name ? this.name.charAt(0).toUpperCase() : ''; 
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/postCard/postCard.css">
           
                <div class= "card">
                    <div class="part-user">
                        <div class="circle-img">${this.imguser? `<img id="img-user" src="${this.imguser}" alt="User Image">` : `<span id="initial">${initialLetter}</span>`}</div>
                        
                        <div class="nacate">
                            <h4 class="name">${this.name ? this.name : 'Not found'}</h4>
                            <p class="category">${this.category ? this.category : 'Not found'}</p>
                        </div>
                        <div class="nacate1">
                            <div class="nacate2">
                                <h4 class="name">${this.name ? this.name : 'Not found'}</h4>
                                <h4 class="username2">${this.username ? this.username : '@user'}</h4>
                            </div>
                            <div class="nacate3">
                                  <p class="status2">${this.state ? this.state : 'Follow'}</p>
                            </div>
                        </div>
                        <div class="stateUser">
                            <h4 class="username">${this.username ? this.username : '@user'}</h4>
                            <p class="state">${this.state ? this.state : 'Follow'}</p>
                            <p class="time-post"> ${this.formatTimeAgo(this.timeposted)} </p>
                        </div>
                    </div>
                    <p class="description">${this.description ? this.description : ''}</p>
                    <hashtags-component hashtags='${this.hashtags ? this.hashtags : ''}'></hashtags-component>
                    <img class="img-post" src="${this.image ? this.image : ''}">
                    <div class="post-icons">
                        <div class="counter" id="like">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                            </svg>
                            <p id="likeCount">${this.likes || this.likes==0 ? this.likes : 0}</p>
                        </div>
                        <div class="counter" id="comment">
                            <svg class="icon2" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-chat-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                            </svg>
                            <p id="commentCount">${this.commentsN || this.commentsN==0 ? this.commentsN : 0}</p>
                        </div>
                        <div class="counter" id="favorite">
                            <svg class="icon3" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bookmark-fill" viewBox="0 0 16 16">
                                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
                            </svg>
                            <p id="favoriteCount">${this.favorites || this.favorites==0 ? this.favorites : 0}</p>
                        </div>
                    </div>
                    <div id="comment-post" class"hide">
                        
                    </div>
                </div>
               
            `;
            
            const commentpost = this.shadowRoot?.querySelector('#comment-post') as HTMLElement
            commentpost.className = "hide"
            
                const comment = this.shadowRoot?.querySelector('#comment') as HTMLElement
        
                comment.addEventListener('click', ()=>{
                    const commentShow = this.commentsElements?.pop()
                    
                    if (commentShow) {
                        if (countComment > 0) {
                            
                            commentShow.setAttribute(CommentsAttribute.showinput, 'true');
                        }else{
                            commentpost.appendChild(commentShow)
                            if (!this.showComent) {
                                commentpost.className = "show"
                                this.showComent = true
                                
                            } else {
                                commentShow.setAttribute(CommentsAttribute.showinput, 'false');
                            }
            
                        }
                        this.commentsElements?.push(commentShow)
                    }   
                    countComment++
                })  
        }
    }
};

customElements.define('card-post',PostCard);
export default PostCard;