import Hashtags, {AttributeHashtags} from '../hashtags/hashtags';
import PostIcons, {AttributePostIcons} from '../postIcons/postIcons';
import Comments, {CommentsAttribute} from '../comments/comments';
import '../hashtags/hashtags'
import { dispatch } from '../../store/store';
import { getPostsByUser} from '../../utils/firebase';

export enum AttributeCardUser {
    'image' = 'image',
    'likes' =  'likes',
    'comments' = 'comments',
    'favorites' = 'favorites',
    'commentsElements' = 'commentsElements',
    'hashtags' = 'hashtags',
    'postid' = 'postid'
}



class PostUserCard extends HTMLElement  {
    image?: string;
    likes?: Number;
    comments?: Number;
    favorites?: Number;
    send?: Number;
    hashtags?: String;
    commentsN?: number;
    showComent?: boolean;
    commentsElements?: any[] = [];
    postid?: string
   
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
        this.showComent = false    
			const post = this.ownerDocument.createElement("posticons-component") as PostIcons;
            post.setAttribute(AttributePostIcons.likes, '');
            post.setAttribute(AttributePostIcons.comments, '');
            post.setAttribute(AttributePostIcons.favorites, '');
            post.setAttribute(AttributePostIcons.send, '');
    }

    static get observedAttributes() {
        return Object.values(AttributeCardUser);
    }

    attributeChangedCallback(propName : AttributeCardUser, oldValue: string | undefined, newValue: string | undefined) {
        
        switch (propName) {
            case AttributeCardUser.likes:
				this.likes = newValue ? Number(newValue) : undefined;
            break;
            case AttributeCardUser.comments:
				this.comments = newValue ? Number(newValue) : undefined;
            break;
            case AttributeCardUser.favorites:
				this.favorites = newValue ? Number(newValue) : undefined;
            break;
            case AttributeCardUser.commentsElements:
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
        let counterLikes = [0];
        const likesButton = this.shadowRoot?.querySelector('#like') as HTMLElement;
        const p = this.shadowRoot?.querySelector('#likeCount') as HTMLElement;
        const svg = this.shadowRoot?.querySelector('.icon') as HTMLElement;
        
        likesButton.addEventListener('click', () => { 
                if (counterLikes[0] === 0) {
                    counterLikes[0] = 1;
                    svg.style.color = '#FFFFFF';
                } else {
                    counterLikes[0] = 0;
                    svg.style.color = ''; 
                }
                p.textContent = `${counterLikes[0]}`;
            
        });

        let counterComments = [0];
        const commentsButton = this.shadowRoot?.querySelector('#comment') as HTMLElement;
        const pComments = this.shadowRoot?.querySelector('#commentCount')as HTMLElement;
        commentsButton.addEventListener('click', () => { 
            counterComments[0] += 1;
            pComments.textContent = `${counterComments[0]}`;
        });
        let counterFavorites = [0];
        const favoritesButton = this.shadowRoot?.querySelector('#favorite') as HTMLElement;
        const pFavorites = this.shadowRoot?.querySelector('#favoriteCount') as HTMLElement;
        const svgFavorites = this.shadowRoot?.querySelector('.icon3') as HTMLElement;
        
        favoritesButton.addEventListener('click', () => { 
        
                if (counterFavorites[0] === 0) {
                    counterFavorites[0] = 1;
                    svgFavorites.style.color = '#FFFFFF';
                } else {
                    counterFavorites[0] = 0;
                    svgFavorites.style.color = ''; 
                }
                pFavorites.textContent = `${counterFavorites[0]}`;
            
        });
    }

    render() {
        let countComment = 0; 

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/postAccountUser/postUserby.css">
            <div class= "card">
                    <hashtags-component hashtags='${this.hashtags ? this.hashtags : ''}'></hashtags-component>
                    <img class="img-post" src="${this.image ? this.image : 'Not found'}">
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

customElements.define('cardaccount-component',PostUserCard);
export default PostUserCard;