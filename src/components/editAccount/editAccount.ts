import "../button/button";

import { dispatch } from "../../store/store";
import { setOpenCloseScreen } from "../../store/actions";
import { addObserver, appState } from '../../store/store';

export enum AttributeEditPost  { 
    'imguser' = 'imguser',
    'name' = 'name',
    'gmail' = 'gmail'
}
class EditAccount extends HTMLElement  {
    imguser?: string;
    name?: string;
    gmail?: string;
   
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
        addObserver(this)
    }

    async connectedCallback() { 
        
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/editAccount/editAccount.css">
            
             <div class="container-modal">
                  <btn-close color="#9A81C2" label="X" id="close-modal"></btn-close>
                 <div class="user-profile">
                    <div class="circle-img">
                        <img id="img-user" src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="">
                        <div class="icon">
                            <input type="file" id="fileInput">
                            <label for="fileInput">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24">
                                    <path fill="#8258BD" d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m8 3a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m0 2a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3"/>
                                </svg>
                            </label>
                        </div>
                    </div>
                    
                    <div id="user">
                        <p id="name">${this.name}</p>
                        <input type="text" placeholder="Add Username">
                        <div id="create">
                            <p id="creative">Creative</p>
                            <input type="text" placeholder="Write your creative category">
                        </div>
                    </div>
                </div>
                <div class="info">
                    <h3>Contact Information</h3>
                    <p id="email">${this.gmail}</p>
                     <div class="icons-profesional">
                        <div class="profesional-work">
                            <input type="text" placeholder="Place Residence">
                            <input type="text" placeholder="Current Job">
                        </div>
                        <div class="profesional-work">
                            <input type="text" placeholder="Current Training">
                            <input type="text" placeholder="Academy">
                        </div>
                    </div>
                    <p id="Works">More Works</p>
                    <input id="work-Inpt" type="url" placeholder="Ex: https://www.behance.net">
                    <div class="btn-edi"><btn-component color="#361656" label="Save"></btn-component></div>
                </div>
            
             </div>
            	
            `;
            
        }
        const btn = this.shadowRoot?.querySelector('#close-modal')
        btn?.addEventListener('click', ()=>{
            dispatch(setOpenCloseScreen(1))
        })
    }
};

customElements.define('editaccount-component',EditAccount);
export default EditAccount;