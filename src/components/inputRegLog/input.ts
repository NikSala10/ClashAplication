// export enum AttributeInput  { 
//     'titleitem' = 'titleitem',
//     'dataitem' = 'dataitem',
// }

// class InputComponent extends HTMLElement  {
//     constructor()  {
//         super();
//         this.attachShadow( {mode: 'open'})

//     }

//     static get observedAttributes() {
//         return Object.values(Attribute2);
//     }

//     attributeChangedCallback(propName : Attribute2, oldValue: string | undefined, newValue: string | undefined) {
//        if (oldValue !== newValue) {
//         this[propName] = newValue;
//        }
//         this.render();
//     }
//     connectedCallback() { 
//         if (this.dataitem == "hashtags") {
//             for (let i = 0; i < 3; i++) {
//                 this.userList[i] = hashtags[i]
//             }
//         }
//         if (this.dataitem == "categories") {
//             for (let i = 0; i < 3; i++) {
//                 this.userList[i] = dataCategories[i]
//             }
//         }
        
//         this.render();
       
//     }

//     render() {
//         if (this.shadowRoot) {
//             this.shadowRoot.innerHTML = `
//             <link rel="stylesheet" href="../src/components/barLateral/barLateral.css">
//                 <div class= "barLateral">
//                     <h4>${this.titleitem ? this.titleitem : 'Not found'}</h4>
//                     <p>${this.userList[0] ? this.userList[0] : 'Not found'}</p>
//                     <p>${this.userList[1] ? this.userList[1] : 'Not found'}</p>
//                     <p>${this.userList[2] ? this.userList[2] : 'Not found'}</p>
//                 </div>
          
//             `;
//         }
//     }
// };

// customElements.define('input-component',InputComponent);
// export default InputComponent;