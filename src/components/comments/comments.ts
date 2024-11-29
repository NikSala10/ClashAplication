import { addObserver, appState } from '../../store/store';
import { addComment, addPost, getPosts, getUserData } from '../../utils/firebase';
import { dispatch } from "../../store/store";
import { navigate } from "../../store/actions";
import { Screens } from "../../types/store";
import { Comment } from '../../types/comment';

const comment: Comment = { 
    imgprofile: '',
    username: '',
    timeaddcomment: '',
    description: '', 
    postid: ''
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

export enum CommentsAttribute  {
    'imgprofile' = 'imgprofile',
    'username' = 'username',
    'userid' = 'userid',
    'timeaddcomment' = 'timeaddcomment',
    'description' = 'description',
    'showinput' = 'showinput',
    'postid' = 'postid'
}

class Comments extends HTMLElement  {
    userid?: String;
    imgprofile?: string;
    username?: String;
    timeaddcomment?: String;
    description?: String
    showinput?: boolean
    postid?: string; 

    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
        addObserver(this);
    }
    static get observedAttributes() {
        return Object.values(CommentsAttribute);
    }
    attributeChangedCallback(propName : CommentsAttribute, oldValue: string | undefined, newValue: string | undefined) {
        switch (propName) {
            case CommentsAttribute.postid:
                this.postid = newValue ;
                if (newValue) {
                    comment.postid = newValue
                }
                break;

            case CommentsAttribute.showinput:
                this.showinput = newValue ? Boolean(newValue) : true;
                break;
            default:
                this[propName] = newValue;
                break;
        }
        this.render();
    }
    changeDescription(e: any)  {
        comment.description = e.target.value
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
    async connectedCallback() {
        this.render();
    }
    async submitForm() {
        if (this.postid) {
            comment.postid = this.postid
            const commentCont = this.shadowRoot?.querySelector('.all')
            if (commentCont) {
                const currentUserInfo = await new Promise<UserData | null>((resolve) =>
                    getUserData(appState.user, resolve)
                );
                const initialLetter = currentUserInfo?.username ? currentUserInfo?.username.charAt(1).toUpperCase() : ''; 
                commentCont.innerHTML = `
                <div class="user">
                    <div class="circle-img">${currentUserInfo?.imgUser ? `<img id="img-user" src="${currentUserInfo?.imgUser}" alt="User Image">` : `<span id="initial">${initialLetter}</span>`}</div>
                    <div class="two">
                        <p id="username">${currentUserInfo? currentUserInfo.username: ''}</p>
                        <p id="description">${comment.description}</p>
                    </div>
                    <p id="timeadd">now</p>
                </div>`    
            }
            await addComment(comment); 
            this.clearInputs();

        }else{
            alert('algo pasa con el id del post')
        }
    }
    clearInputs() {
        const descriptionInput = this.shadowRoot?.querySelector('#comment-input') as HTMLInputElement;
        if (descriptionInput) descriptionInput.value = ''; 
    }
    render() {
        if (this.shadowRoot) {
            const initialLetter = this.username ? this.username.charAt(0).toUpperCase() : ''; 
            let texthtml = "" 
            if (this.username) {
                texthtml = `
                <div class="user">
                    <div class="circle-img">${this.imgprofile? `<img id="img-user" src="${this.imgprofile}" alt="User Image">` : `<span id="initial">${initialLetter}</span>`}</div>
                    <div class="two">
                        <p id="username">${this.username}</p>
                        <p id="description">${this.description}</p>
                    </div>
                    <p id="timeadd">${this.formatTimeAgo(this.timeaddcomment)}</p>
                </div>
                
                `
                
            }
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/comments/comments.css">
            <div class="all"> 
                ${texthtml}
                <hr>
                <div class="add-comment">
                    <input id="comment-input" placeholder="Write a reply" type="text">
                    <div class="save-comment">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#CAC1E4" fill-rule="evenodd" d="M3.291 3.309a.75.75 0 0 0-.976.996l3.093 6.945H13a.75.75 0 0 1 0 1.5H5.408l-3.093 6.945a.75.75 0 0 0 .976.996l19-8a.75.75 0 0 0 0-1.382z" clip-rule="evenodd"/></svg>
                    </div>
                   
                </div>
            </div> 
            `;

            const saveComment = this.shadowRoot.querySelector('.save-comment') as HTMLElement
            const addComentHTML = this.shadowRoot.querySelector('.add-comment') as HTMLElement
            const usernameHTML = this.shadowRoot.querySelector('#username') as HTMLElement
            const timeadd = this.shadowRoot.querySelector('#timeadd') as HTMLElement
            const descriptionhtml = this.shadowRoot.querySelector('#description') as HTMLElement
            const descriptionInputValue = this.shadowRoot.querySelector('#comment-input') as HTMLInputElement
            descriptionInputValue?.addEventListener('change', this.changeDescription);
            if (comment.postid) {
                saveComment.addEventListener('click', async () => {
                    
                    if (appState.user) {
                            if (!descriptionInputValue.value.trim()) {
                                alert('Por favor, escribe un comentario antes de enviarlo.');
                                return; 
                            }
                       
                            addComentHTML.className = 'add-comment hide'

                            await this.submitForm()
                        
                    }else{
                        alert('No puedes crear un comentario porque no tienes una cuenta de usuario')
                        dispatch(navigate(Screens.LOGIN))
                    }
                })
                
            }
            
            if(!this.showinput){
                addComentHTML.className = 'add-comment hide'
            }
    }}
};

customElements.define('comment-component',Comments);
export default Comments;