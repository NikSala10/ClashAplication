import Hashtags, {AttributeHashtags} from '../hashtags/hashtags';
import PostIcons, {AttributePostIcons} from '../postIcons/postIcons';

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
   
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
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
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/cardAccount/cardAccount.css">
            <div class= "card">
                    <hashtags-component hashtags='${this.hashtags ? this.hashtags : '[]'}'></hashtags-component>
                    <img class="img-post" src="${this.image ? this.image : 'Not found'}">
                    <posticons-component likes="3" comments="5" favorites="8" send="10"></posticons-component>
                    
                </div>	
            `;
        }
    }
};

customElements.define('cardaccount-component',CardAccount);
export default CardAccount;