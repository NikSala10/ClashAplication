export enum AttributeHashtags {
    'hashtags' = 'hashtags',
}

class Hashtags extends HTMLElement {
	hashtags?: String[];

    constructor() {
		super();
		this.attachShadow({ mode: 'open' })
	}

	static get observedAttributes() {
        return Object.values(AttributeHashtags);
    }

	connectedCallback() {
		this.render();
	}
	convertHashtagsStringToArray(hashtagsString: string) {
		return hashtagsString ? hashtagsString.split(',') : [];
	}


	attributeChangedCallback(propName : AttributeHashtags, oldValue: string | undefined, newValue: string | undefined) {
        
		switch (propName) {
            case AttributeHashtags.hashtags:
				if (newValue) {
					this.hashtags = this.convertHashtagsStringToArray(newValue);
				}
            break;
            
        }
        this.render();
    }

	async render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = `
			    <link rel="stylesheet" href="../src/components/hashtags/hashtags.css">
				<div class="hashtags">
                </div>
			`;
            const container = this.shadowRoot.querySelector('.hashtags')
			this.hashtags?.forEach((hashtag)=>{
                const hashtagHtml = this.ownerDocument.createElement("p");
                hashtagHtml.innerHTML = `${hashtag}`
                console.log();
                
                container?.appendChild(hashtagHtml)
            })
		}
	}
}

customElements.define('hashtags-component', Hashtags);
export default Hashtags;