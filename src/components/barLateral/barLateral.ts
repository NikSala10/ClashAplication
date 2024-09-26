import  {hashtags} from '../../data/dataHashtags'
export enum Attribute2  { 
    'titleitem' = 'titleitem',
    'itemone' = 'itemone',
    'itemtwo' = 'itemtwo',
    'itemthree' = 'itemthree', 
}

class BarLateral extends HTMLElement  {
    titleitem?: string;
    itemone?: string;
    itemtwo?: string;
    itemthree?: string;
    userHashtagsList : String[] = []
    

    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})

    }

    static get observedAttributes() {
        return Object.values(Attribute2);
    }

    attributeChangedCallback(propName : Attribute2, oldValue: string | undefined, newValue: string | undefined) {
       if (oldValue !== newValue) {
        this[propName] = newValue;
       }
        this.render();
    }
    connectedCallback() { 
        console.log(this);
        
        this.render();
        const lateral = this.ownerDocument.querySelector('.barLateral')
        for (let i = 0; i < hashtags.length; i++) {
            const hashtag = this.ownerDocument.createElement("p")
            lateral?.appendChild(hashtag)
        }
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/barLateral/barLateral.css">
           
                <div class= "barLateral">
                    <h4>${this.titleitem ? this.titleitem : 'Not found'}</h4>
                </div>
          
            `;
        }
    }
};

customElements.define('bar-lateral',BarLateral);
export default BarLateral;