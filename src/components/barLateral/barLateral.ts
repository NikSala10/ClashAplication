
import  {dataCategories} from '../../data/dataCategories'
import { getHashtags } from '../../utils/firebase';
export enum Attribute2  { 
    'titleitem' = 'titleitem',
    'dataitem' = 'dataitem',
}

class BarLateral extends HTMLElement  {
    titleitem?: string;
    dataitem?: string;
    userList : String[] = []
    

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
    async connectedCallback() {
        if (this.dataitem === 'hashtags') {
            try {
                const hashtagsFromFirebase = await getHashtags(); 

                const filterList = hashtagsFromFirebase.filter((hashtag) => hashtag != null && hashtag != '' && hashtag != '#');
                this.userList = filterList.slice(0, 3);
                console.log(hashtagsFromFirebase);
                
            } catch (error) {
                console.error('Error obteniendo hashtags:', error);
            }
        } 
    
        if (this.dataitem === 'categories') {
            this.userList = dataCategories.slice(0, 3);
        }
    
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/src/components/barLateral/barLateral.css">
                <div class= "barLateral">
                    <h4>${this.titleitem ? this.titleitem : 'Not found'}</h4>
                    <p>${this.userList[0] ? this.userList[0] : 'Not found'}</p>
                    <p>${this.userList[1] ? this.userList[1] : 'Not found'}</p>
                    <p>${this.userList[2] ? this.userList[2] : 'Not found'}</p>
                </div>
          
            `;
        }
    }
};

customElements.define('bar-lateral',BarLateral);
export default BarLateral;