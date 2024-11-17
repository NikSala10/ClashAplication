export enum AttributeBtnAccount  {
    'color' = 'color',
    'label' = 'label',
    
}

class ButtonAccount extends HTMLElement  {
    color?: string;
    label?: String;
   
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
    }

    static get observedAttributes() {
        return Object.values(AttributeBtnAccount);
    }

    attributeChangedCallback(propName : AttributeBtnAccount, oldValue: string | undefined, newValue: string | undefined) {
        
        if (oldValue !== newValue) {
            this[propName] = newValue;
        }
        this.render();
    }
    connectedCallback() { 
        this.render();
        this.updateStyle();
        this.updateLabel();
    }
    updateStyle() {
        const button = this.shadowRoot?.querySelector("button") as HTMLButtonElement;
        const color = this.getAttribute("color") || "gray"; // Color por defecto
        if (button) {
            button.style.backgroundColor = color; // Establece el color de fondo
        }
    }

    updateLabel() {
        const button = this.shadowRoot?.querySelector("button") as HTMLButtonElement;
        const label = this.getAttribute("label") || "Botón"; // Texto por defecto
        if (button) {
            button.textContent = label; // Establece el texto del botón
        }
    }
    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/buttonAddPostAccount/buttonAccount.css">
                <button id="btn">${this.getAttribute("label") || "Botón"}</button>	
            `;
        }
    }
};

customElements.define('btn-account',ButtonAccount);
export default ButtonAccount;