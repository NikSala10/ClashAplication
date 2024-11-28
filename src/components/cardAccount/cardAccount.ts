import Hashtags, {AttributeHashtags} from '../hashtags/hashtags';
import PostIcons, {AttributePostIcons} from '../postIcons/postIcons';
import Comments, {CommentsAttribute} from '../comments/comments';
import '../hashtags/hashtags'
import { dispatch } from '../../store/store';
import { deletePost, getPostsByUser} from '../../utils/firebase';

export enum AttributeCardAccount {
    'image' = 'image',
    'likes' =  'likes',
    'comments' = 'comments',
    'favorites' = 'favorites',
    'commentsElements' = 'commentsElements',
    'hashtags' = 'hashtags',
    'postid' = 'postid'
}



class CardAccount extends HTMLElement  {
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
        return Object.values(AttributeCardAccount);
    }

    attributeChangedCallback(propName : AttributeCardAccount, oldValue: string | undefined, newValue: string | undefined) {
        
        switch (propName) {
            case AttributeCardAccount.likes:
				this.likes = newValue ? Number(newValue) : undefined;
            break;
            case AttributeCardAccount.comments:
				this.comments = newValue ? Number(newValue) : undefined;
            break;
            case AttributeCardAccount.favorites:
				this.favorites = newValue ? Number(newValue) : undefined;
            break;
            case AttributeCardAccount.commentsElements:
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
            <link rel="stylesheet" href="../src/components/cardAccount/cardAccount.css">
            <div class= "card">
                    <svg id="delete" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20"><path fill="#CAC1E4" d="M8.5 4h3a1.5 1.5 0 0 0-3 0m-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-1.194 10.344A3 3 0 0 1 12.272 18H7.728a3 3 0 0 1-2.98-2.656L3.554 5H2.5a.5.5 0 0 1 0-1zM9 8a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0zm2.5-.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 1 0V8a.5.5 0 0 0-.5-.5"/></svg>
                    <hashtags-component hashtags='${this.hashtags ? this.hashtags : ''}'></hashtags-component>
                    <img class="img-post" src="${this.image ? this.image : 'Not found'}">
                    
                </div>	
            `;
            const deleteButton = this.shadowRoot.querySelector('#delete');
            deleteButton?.addEventListener('click', () => {
                this.deletePostFunction(this.postid);
                alert('Post borrado')
            });


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
    async deletePostFunction(postId: string | undefined) {
        if (!postId) {
            console.error('ID del producto no proporcionado para eliminar.');
            return; 
        }
        try {
            await deletePost(postId);
            const action = getPostsByUser((posts) => {
                dispatch({
                    type: 'UPDATE_USER_POSTS',
                    payload: posts
                });
            });
        } catch (error) {
            console.error('Error al eliminar el post:', error); 
        }
    }
};

customElements.define('cardaccount-component',CardAccount);
export default CardAccount;