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
    'commentsElements' = 'commentsElements',
    'likeStatus' = 'likeStatus'
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
	following: [],
    likes: [],
    favourites:[],
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
    likeStatus?: Boolean;
    commentsElements?: any[] = [];
    commentsAll?: any[] = [];
    
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
            case AttributePostCard.likeStatus:
                this.likeStatus = newValue ? Boolean(newValue) : undefined;  
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
        
        const statustwo = this.shadowRoot?.querySelector('.status2') as HTMLElement;
        if (statustwo) {
            statustwo.addEventListener('click', async () => {
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
        
                const isFollowing = statustwo.textContent === 'Following';
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
                    statustwo.textContent = isFollowing ? 'Follow' : 'Following';
        
                } catch (error) {
                    console.error('Error al actualizar la información de seguimiento:', error);
                }
            });
        }

        let counterLikes = [0];
        counterLikes[0] = this.likes ? this.likes : 0;
        const likesButton = this.shadowRoot?.querySelector('#like') as HTMLElement;
        const p = this.shadowRoot?.querySelector('#likeCount') as HTMLElement;
        const svg = this.shadowRoot?.querySelector('.icon') as HTMLElement;
        const userLog = appState.users.find(user => user.id === appState.user);
        let likeStatus1 = false;
        if (userLog) {
            const like = userLog.likes.find((like:any) => like === this.postid);
            if(like) likeStatus1 = true
        }
        if (this.likeStatus) {
            svg.style.color = '#FFFFFF';
        } else {
            svg.style.color = ''; // Asegúrate de limpiar el color cuando no tenga like
        }

        if (likesButton) {
            likesButton.addEventListener('click', async () => {
                const currentUser = appState.user;
                if (!currentUser) {
                    alert('Debes iniciar sesión para seguir a otros usuarios.');
                    return;
                }
                try {
                    const currentUserInfo = await new Promise<UserData | null>((resolve) =>
                        getUserData(currentUser, resolve)
                    );
            
                    let likesList: any[] = [];
                    let likeStatus2 = false;
                    if (currentUserInfo) {
                        const like = currentUserInfo.likes.find((like:any) => like === this.postid);
                        if(like) likeStatus2 = true
                    }
                    if (currentUserInfo) {
                        if (likeStatus2) {
                            likesList = currentUserInfo.likes.filter((id: string) => id !== this.postid);
                            counterLikes[0] -= 1;
                            this.likes = this.likes ? this.likes - 1 : 0;
                            this.likeStatus = false; // Actualiza el estado
                        } else {
                            likesList = [...currentUserInfo.likes, this.postid];
                            counterLikes[0] += 1;
                            this.likes = this.likes ? this.likes + 1 : 1;
                            this.likeStatus = true; // Actualiza el estado
                        }
                    }
                    svg.style.color = !likeStatus2 ? '#FFFFFF' : '';
                    p.textContent = `${this.likes}`;
                    await uploadUserData(currentUser, {
                        ...currentUserInfo,
                        likes: likesList,
                    } as UserData);
                    this.updatePost('likes', this.likes || 0);
                } catch (error) {
                    console.error('Error al actualizar la información de like:', error);
                }
            });            
        }

        let counterComments = [0];
        const commentsButton = this.shadowRoot?.querySelector('#comment') as HTMLElement;
        const pComments = this.shadowRoot?.querySelector('#commentCount')as HTMLElement;
        commentsButton.addEventListener('click', () => { 
            counterComments[0] += 1;
            pComments.textContent = `${counterComments[0]}`;
        });

        let counterFavorites = [0];
        counterFavorites[0] = this.favorites ? this.favorites : 0;
        const favoritesButton = this.shadowRoot?.querySelector('#favorite') as HTMLElement;
        const pFavorites = this.shadowRoot?.querySelector('#favoriteCount') as HTMLElement;
        const svgFavorites = this.shadowRoot?.querySelector('.icon3') as HTMLElement;

        // Verificar si el usuario ya marcó como favorito el post
        const userLogFavorites = appState.users.find(user => user.id === appState.user);
        let favoriteStatus = false;

        if (userLogFavorites) {
            const favorite = userLogFavorites.favourites.find((fav: any) => fav === this.postid);
            if (favorite) favoriteStatus = true;
        }

        // Cambiar el color inicial basado en el estado de favoritos
        svgFavorites.style.color = favoriteStatus ? '#FFFFFF' : '';

        // Añadir evento de click
        favoritesButton.addEventListener('click', async () => {
            const currentUser = appState.user; // Usuario actual
            if (!currentUser) {
                alert('Debes iniciar sesión para marcar como favorito.');
                return;
            }

            try {
                const currentUserInfo = await new Promise<UserData | null>((resolve) =>
                    getUserData(currentUser, resolve)
                );

                if (!currentUserInfo) {
                    console.error('No se pudo obtener la información del usuario actual.');
                    return;
                }

                let favoritesList: any[] = [];
                let favoritesStatus2 = false;
                if (currentUserInfo) {
                    const favorites = currentUserInfo.favourites.find((fav:any) => fav === this.postid);
                    if(favorites) favoritesStatus2 = true
                }
                if (favoritesStatus2) {
                    // Si ya está marcado como favorito, eliminarlo
                    favoritesList = currentUserInfo.favourites.filter((id: string) => id !== this.postid);
                    counterFavorites[0] -= 1;
                    this.favorites = this.favorites ? this.favorites - 1 : 0;
                } else {
                    // Si no está marcado como favorito, agregarlo
                    favoritesList = [...currentUserInfo.favourites, this.postid];
                    counterFavorites[0] += 1;
                    this.favorites = this.favorites ? this.favorites + 1 : 1;
                }

                // Cambiar el estado local
                favoritesStatus2 = !favoritesStatus2
                svgFavorites.style.color = favoritesStatus2 ? '#FFFFFF' : '';
                pFavorites.textContent = `${this.favorites}`;

                // Actualizar Firebase
                await uploadUserData(currentUser, {
                    ...currentUserInfo,
                    favourites: favoritesList,
                } as UserData);

                // Actualizar el post con la nueva cantidad de favoritos
                this.updatePost('favourites',  this.favorites || 0);
            } catch (error) {
                console.error('Error al actualizar la información de favoritos:', error);
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
    async loadComments() {
        if (!this.postid) return;
    
        // Escuchar cambios en los comentarios en tiempo real
        await getCommentsByPost(this.postid, async (comments) => {
            this.commentsElements = []; // Limpiar elementos previos
    
            const pComments = this.shadowRoot?.querySelector('#commentCount') as HTMLElement;

            this.commentsN = comments.length;
            if (pComments) {
                pComments.textContent = `${this.commentsN}`;
            }
    
            // Crear elementos para los comentarios
            for (const commentData of comments) {
                const commentsElement = this.ownerDocument.createElement("comment-component") as Comments;
    
                commentsElement.setAttribute(CommentsAttribute.imgprofile, commentData.imgprofile || '');
                commentsElement.setAttribute(CommentsAttribute.postid, this.postid || '');
                commentsElement.setAttribute(CommentsAttribute.timeaddcomment, commentData.dateadded || '');
                commentsElement.setAttribute(CommentsAttribute.description, commentData.description || '');
                commentsElement.setAttribute(CommentsAttribute.showinput, 'true');
    
                // Manejar datos del usuario con callback
                if (commentData.userUid) {
                    const userId = commentData.userUid;
                    getUserData(userId, (userData) => {
                        const name = userData?.username || 'Usuario no encontrado';
                        commentsElement.setAttribute(CommentsAttribute.username, name);
                        this.commentsElements?.push(commentsElement);
                    });
                } else {
                    commentsElement.setAttribute(CommentsAttribute.username, 'Usuario desconocido');
                    this.commentsElements?.push(commentsElement);
                }
            }
            if (this.commentsElements) {
                // Agregar un comentario vacío al final
                const emptyCommentElement = this.ownerDocument.createElement("comment-component") as Comments;
                emptyCommentElement.setAttribute(CommentsAttribute.showinput, 'true');
                emptyCommentElement.setAttribute(CommentsAttribute.postid, this.postid || 'not found');
                emptyCommentElement.setAttribute(CommentsAttribute.username, '');
                this.commentsElements?.push(emptyCommentElement);
            }
        });
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
                                  <p class="status2">${this.state ? 'Following' : 'Follow'}</p>
                            </div>
                        </div>
                        <div class="stateUser">
                            <h4 class="username">${this.username ? this.username : '@user'}</h4>
                            <p class="state">${this.state ? 'Following' : 'Follow'}</p>
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
            
            this.loadComments()
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
        } }
};

customElements.define('card-post',PostCard);
export default PostCard;