import * as components from './components/indexPadre'
import  {imageArray} from './data-banner1/data'
import './components/post1/post1'
import './components/footer/footer'
import './components/banner1/banner1'
import Banner1, {Attribute} from './components/banner1/banner1';

class AppContainer extends HTMLElement  {
    imagesBanner: Banner1[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        imageArray.forEach(img => {
            const imageArrayBanner1 = this.ownerDocument.createElement("component-container") as Banner1;
            imageArrayBanner1.setAttribute(Attribute.image, img.img);
            this.imagesBanner.push(imageArrayBanner1);
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/Components/index.css">
            <link rel="stylesheet" href="../src/Components/banner1/index.css">

                <post-1></post-1>
                <div class="container"></div>
                <foo-ter></foo-ter>
            `;
        }

        const container = this.shadowRoot?.querySelector('.container');
        this.imagesBanner.forEach(img => {
            container?.appendChild(img);
        });
    }
}

customElements.define('app-container', AppContainer);
export default AppContainer;
