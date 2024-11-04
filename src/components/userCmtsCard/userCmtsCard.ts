export enum imgProfileAttribute  {
    'imgprofile' = 'imgprofile',
    'username' = 'username',
    'timeaddcomment' = 'timeaddcomment',
    'description' = 'description',
}

class UserCommentsCard extends HTMLElement  {
    imgprofile?: string;
    username?: String;
    timeaddcomment?: String;
    description?: String
   
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
    }

    static get observedAttributes() {
        return Object.values(imgProfileAttribute);
    }

    attributeChangedCallback(propName : imgProfileAttribute, oldValue: string | undefined, newValue: string | undefined) {
        
        if (oldValue !== newValue) {
            this[propName] = newValue;
        }
        this.render();
    }
    connectedCallback() { 
        this.render();
    }
    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/userCmtsCard/userCmtsCard.css">
               
            `;
        }
    }
};

customElements.define('img-comments',UserCommentsCard);
export default UserCommentsCard;