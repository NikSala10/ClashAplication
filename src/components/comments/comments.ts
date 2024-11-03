import UserCommentsCard,  {imgProfileAttribute} from "../userCmtsCard/userCmtsCard";


class Comments extends HTMLElement  {
 
   
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
        const cardImgProfile = this.ownerDocument.createElement("img-comments") as UserCommentsCard;
        cardImgProfile.setAttribute(imgProfileAttribute.imgprofile, '');
        cardImgProfile.setAttribute(imgProfileAttribute.username, 'hola');
        cardImgProfile.setAttribute(imgProfileAttribute.timeaddcomment, 'holis');
        cardImgProfile.setAttribute(imgProfileAttribute.description, 'c3');
    }


    connectedCallback() { 
        this.render();
    }
    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/comments/comments.css">
            <div> 
                <img-comments></img-comments>
                <hr>
                <div>
                    <input type="text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M3.291 3.309a.75.75 0 0 0-.976.996l3.093 6.945H13a.75.75 0 0 1 0 1.5H5.408l-3.093 6.945a.75.75 0 0 0 .976.996l19-8a.75.75 0 0 0 0-1.382z" clip-rule="evenodd"/></svg>
                </div>
            </div> 
            `;
        }
    }
};

customElements.define('comment-component',Comments);
export default Comments;