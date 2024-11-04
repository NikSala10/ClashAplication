export enum CommentsAttribute  {
    'imgprofile' = 'imgprofile',
    'username' = 'username',
    'timeaddcomment' = 'timeaddcomment',
    'description' = 'description',
    'showinput' = 'showinput'
}

class Comments extends HTMLElement  {
 
    imgprofile?: string;
    username?: String;
    timeaddcomment?: String;
    description?: String
    showinput?: boolean

    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
 
    }
    static get observedAttributes() {
        return Object.values(CommentsAttribute);
    }
    attributeChangedCallback(propName : CommentsAttribute, oldValue: string | undefined, newValue: string | undefined) {
        switch (propName) {
            case CommentsAttribute.showinput:
                this.showinput = newValue ? Boolean(newValue) : true;
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
            let texthtml = "" 
            if (this.username) {
                texthtml = `<div class="user">
                    <img src="${this.imgprofile}" alt="">
                    <p id="username">${this.username}</p>
                    <p id="timeadd">${this.timeaddcomment}</p>
                    <p id="description">${this.description}</p>
                </div>`
                
            }
            
            console.log(texthtml);
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/comments/comments.css">
            <div class="all"> 
                ${texthtml}
                <hr>
                <div class="add-comment">
                    <input id="comment-input" type="text">
                    <div class="save-comment">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M3.291 3.309a.75.75 0 0 0-.976.996l3.093 6.945H13a.75.75 0 0 1 0 1.5H5.408l-3.093 6.945a.75.75 0 0 0 .976.996l19-8a.75.75 0 0 0 0-1.382z" clip-rule="evenodd"/></svg>
                    </div>
                   
                </div>
            </div> 
            `;

            const saveComment = this.shadowRoot.querySelector('.save-comment') as HTMLElement
            const addComentHTML = this.shadowRoot.querySelector('.add-comment') as HTMLElement
            const usernameHTML = this.shadowRoot.querySelector('#description') as HTMLElement
            const timeadd = this.shadowRoot.querySelector('#timeadd') as HTMLElement
            const descriptionhtml = this.shadowRoot.querySelector('#description') as HTMLElement
            const comment = this.shadowRoot.querySelector('#comment-input') as HTMLInputElement
            saveComment.addEventListener('click', (e)=>{
                addComentHTML.className = 'add-comment hide'
                usernameHTML.innerHTML = "username"
                timeadd.innerHTML = "now"
                descriptionhtml.innerHTML = comment.value
            })
            
            if(!this.showinput){
                addComentHTML.className = 'add-comment hide'
            }
        }
    }
};

customElements.define('comment-component',Comments);
export default Comments;