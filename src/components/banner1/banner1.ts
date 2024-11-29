export enum Attribute  {
    'image' = 'image',
    'uid' = 'uid',
    
}

class Banner1 extends HTMLElement  {
    image?: string;
    uid?: number;
   
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
    }

    static get observedAttributes() {
        return Object.values(Attribute);
    }

    attributeChangedCallback(propName : Attribute, oldValue: string | undefined, newValue: string | undefined) {
        
        switch (propName) {
            case Attribute.image:
                this.image = newValue; 
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
            <link rel="stylesheet" href="../../src/components/banner1/index.css">
      
                    <div class= "cardWorker">
                        <div id="image">
                            <img id="img" src="${this.image ? this.image : 'Not found'}">
                        </div>
                    
                    </div>
               
            `;
        }
    }
};

customElements.define('component-container',Banner1);
export default Banner1;