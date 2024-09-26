export enum Attribute  { 
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
    'favorites' = 'favorites'
}

class PostCard extends HTMLElement  {
    imguser?: string;
    name?: string;
    username?: string;
    category?: string;
    description?: string;
    image?: string;
    timeposted?: string;
    hashtags?: string ;
    state?: string;
    likes? : number;
    comments?: number;
    favorites?: number;

    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
    }

    static get observedAttributes() {
        return Object.values(Attribute);
    }

    attributeChangedCallback(propName : Attribute, oldValue: string | undefined, newValue: string | undefined) {
        switch (propName) {
            case Attribute.state:
                this.state = newValue;  
            break;
            case Attribute.likes:
                this.likes = newValue ? Number(newValue) : undefined;
                break;
            case Attribute.comments:
                this.comments = newValue ? Number(newValue) : undefined;
                break;
            case Attribute.favorites:
                this.favorites = newValue ? Number(newValue) : undefined;
                break;
            default:
                this[propName] = newValue;
                break;
        }
        this.render();
    }
    connectedCallback() { 
        
        
        this.render();

    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/postCard/postCard.css">
           
                <div class= "card">
                    <div class="part-user">
                        <div  circle-img>
                            <img id="img-user" src="${this.imguser ? this.imguser : 'Not found'}">
                        </div>
                        
                        <div class="nacate">
                            <h4 class="name">${this.name ? this.name : 'Not found'}</h4>
                            <p class="category">${this.category ? this.category : 'Not found'}</p>
                        </div>
                        <div class="nacate1">
                            <div class="nacate2">
                                <h4 class="name">${this.name ? this.name : 'Not found'}</h4>
                                <h4 class="username2">${this.username ? this.username : 'Not found'}</h4>
                            </div>
                            <div class="nacate3">
                                  <p class="state2">${this.state ? this.state : 'Not found'}</p>
                            </div>
                        </div>
                        
                        <h4 class="username">${this.username ? this.username : 'Not found'}</h4>
                        <p class="state">${this.state ? this.state : 'Not found'}</p>
                        <p class="time-post"> ${this.timeposted ? this.timeposted : 'Not found'}</p>
                    </div>
                    <p class="description">${this.description ? this.description : 'Not found'}</p>
                    <p class="hashtags">${this.hashtags ? this.hashtags : 'Not found'}</p>
                    <img class="img-post" src="${this.image ? this.image : 'Not found'}">
                    <div class="post-icons">
                        <div class="counter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                            </svg>
                            <p>10</p>
                        </div>
                        <div class="counter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-chat-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                            </svg>
                            <p>10</p>
                        </div>
                        <div class="counter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-bookmark-fill" viewBox="0 0 16 16">
                                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
                            </svg>
                            <p>10</p>
                        </div>
                        <div class="counter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                            </svg>
                            <p>10</p>
                        </div>
                    </div>
                </div>
          
            `;
        }
    }
};

customElements.define('card-post',PostCard);
export default PostCard;