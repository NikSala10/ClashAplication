import Hashtags, {AttributeHashtags} from '../hashtags/hashtags';
import PostIcons, {AttributePostIcons} from '../postIcons/postIcons';
import Comments, {CommentsAttribute} from '../comments/comments';
export enum AttributeCardAccount {
    'image' = 'image',
    'likes' =  'likes',
    'comments' = 'comments',
    'favorites' = 'favorites',
    'send' = 'send',
    'hashtags' = 'hashtags'
}



class CardAccount extends HTMLElement  {
    image?: string;
    likes?: Number;
    comments?: Number;
    favorites?: Number;
    send?: Number;
    hashtags?: String;
    showComent?: boolean
   
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
        this.showComent = false
        const hashtags = this.ownerDocument.createElement("hashtags") as Hashtags;
            hashtags.setAttribute(AttributeHashtags.hashtags, '');
            
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
            case AttributeCardAccount.send:
				this.send = newValue ? Number(newValue) : undefined;
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

        let counterSend = [0];
        const sendButton = this.shadowRoot?.querySelector('#send') as HTMLElement;
        const pSend = this.shadowRoot?.querySelector('#sendCount')as HTMLElement;
        sendButton.addEventListener('click', () => { 
            counterSend[0] += 1;
            pSend.textContent = `${counterSend[0]}`;
        });

    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/cardAccount/cardAccount.css">
            <div class= "card">
                    <hashtags-component hashtags='${this.hashtags ? this.hashtags : '[]'}'></hashtags-component>
                    <img class="img-post" src="${this.image ? this.image : 'Not found'}">
                    <div class="post-icons">
                        <div class="counter" id="like">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                            </svg>
                            <p id="likeCount">${this.likes || this.likes==0 ? this.likes : 'Not found'}</p>
                        </div>
                        <div class="counter" id="comment">
                            <svg class="icon2" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-chat-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                            </svg>
                            <p id="commentCount">${this.comments || this.comments==0 ? this.comments : 'Not found'}</p>
                        </div>
                        <div class="counter" id="favorite">
                            <svg class="icon3" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bookmark-fill" viewBox="0 0 16 16">
                                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
                            </svg>
                            <p id="favoriteCount">${this.favorites || this.favorites==0 ? this.favorites : 'Not found'}</p>
                        </div>
                        <div class="counter" id="send">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                            </svg>
                            <p id="sendCount">${this.send || this.send==0 ? this.send : 'Not found'}</p>
                        </div>
                    </div>
                    <div id="comment-post" class"hide">
                        
                    </div>
                    
                </div>	
            `;
            const commentpost = this.shadowRoot?.querySelector('#comment-post') as HTMLElement
            commentpost.className = "hide"
            const comments = this.ownerDocument.createElement("comment-component") as Comments;
            comments.setAttribute(CommentsAttribute.imgprofile, '');
            comments.setAttribute(CommentsAttribute.username, 'user');
            comments.setAttribute(CommentsAttribute.timeaddcomment, 'h');
            comments.setAttribute(CommentsAttribute.description, '');
            comments.setAttribute(CommentsAttribute.showinput, 'true');
            commentpost.appendChild(comments)
            const comment = this.shadowRoot?.querySelector('#comment') as HTMLElement
    
            comment.addEventListener('click', ()=>{
                if (!this.showComent) {
                    commentpost.className = "show"
                    this.showComent = true
                    
                } else {
                    comments.setAttribute(CommentsAttribute.showinput, 'false');
                    comments.render()
                }
                    
            })
        }
        
    }
};

customElements.define('cardaccount-component',CardAccount);
export default CardAccount;