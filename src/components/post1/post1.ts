import "../button/button";
import { dispatch, appState } from "../../store/store";
import { setOpenCloseScreen } from "../../store/actions";
import { navigate } from "../../store/actions";
import { Screens } from "../../types/store";
import { getUserData } from "../../utils/firebase";
interface UserData {
    name: string;
    imgUser:string;
}
class Post1 extends HTMLElement  {
    name?:string;
    imguser?:string;

    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
    }

    static get observedAttributes() {
        return ['section'];
    }

    attributeChangedCallback(propName : string, oldValue: string | undefined, newValue: string | undefined) {
        if (propName === 'section') {
            this.render(); 
          }
    }
    connectedCallback() { 
        const containerUserInformation = this.shadowRoot?.querySelector('.circle');  
        const userId = appState.user
            getUserData(userId, (userInfo: UserData | null) => {
                if (!userInfo) {
                    console.warn('No se recibió información de usuario.');
                    return;
                }

                while (containerUserInformation?.firstChild) {
                    containerUserInformation.removeChild(containerUserInformation.firstChild);
                }
                this.name = userInfo.name || ''; 
                this.imguser = userInfo.imgUser || '';
                this.render();
            });
        this.render();
        
        
    }
     

    render() {
        if (this.shadowRoot) {
            const initialLetter = this.name ? this.name.charAt(0).toUpperCase() : ''; 
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/post1/index.css">
             
            <section class="post">
                <div class="social-post">
                        <div class="circle">
                             <div class="circle-img">${this.imguser? `<img id="img-user" src="${this.imguser}" alt="User Image">` : `<span id="initial">${initialLetter}</span>`}</div>
                        </div>
                </div>
              
                <div class="part2">
                    <h2 id=>What's happening?</h2>
                    <input id="writer" type="text" placeholder="Write your new post" </input>
                    <div class="icon">
                        <svg id="galery" xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-image-fill" viewBox="0 0 16 16">
                        <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                        </svg>
                        
                        <svg class="icon2" xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                        <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                        <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
                        </svg>
                        <div class="button">
                            <btn-component id="addPost1" color="#361656" label="+ Post"></btn-component>
                         </div>
                    </div>
                </div>
            </section>
            <hr>
        `;
        const btnAddPost = this.shadowRoot.querySelector('#addPost1')

        btnAddPost?.addEventListener('click', ()=>{
            if (appState.user) {
                dispatch(setOpenCloseScreen(0))
            }else{
                alert('Para crear un post necesitas una cuenta')
                dispatch(navigate(Screens.LOGIN))
            }
        })
        const writer = this.shadowRoot.querySelector('#writer')
        writer?.addEventListener('click', ()=>{
            if (appState.user) {
                dispatch(setOpenCloseScreen(0))
            }else{
                alert('Para crear un post necesitas una cuenta')
                dispatch(navigate(Screens.LOGIN))
            }
        })
    }
}
}

customElements.define('post-1', Post1);

export default Post1;
