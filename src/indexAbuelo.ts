import * as components from './components/indexPadre'
import './components/post1/post1'
class AppContainer extends HTMLElement  {
    // workersList: Filter[] = []
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'});
      
    }

    connectedCallback() {
       
        this.render();
        
    }

    render()  {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <post-1></post-1>
           
           
            `;

        };
        
        
       
    }

}

customElements.define('app-container',AppContainer);
export default AppContainer ;