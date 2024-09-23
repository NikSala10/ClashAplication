// import  {workers} from './data/data'
import './components/nav/nav'
import * as components from './components/indexPadre' ;
// import Filter, {Attribute} from './components/Mycomponent/component';
class AppContainer extends HTMLElement  {
    // workersList: Filter[] = []
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'});
        // workers.forEach(worker=>  {
        //     const workerFilter = this.ownerDocument.createElement("component-container") as Filter;
        //     workerFilter.setAttribute(Attribute.image, worker.image);
        //     workerFilter.setAttribute(Attribute.name, worker.name);
        //     workerFilter.setAttribute(Attribute.uid, String(worker.id));
        //     workerFilter.setAttribute(Attribute.age, String(worker.age));
        //     workerFilter.setAttribute(Attribute.gender, worker.gender);
        //     workerFilter.setAttribute(Attribute.area, worker.jobDetails.area);
        //     workerFilter.setAttribute(Attribute.position, worker.jobDetails.position);
        //     workerFilter.setAttribute(Attribute.timeincompany, String(worker.jobDetails.timeInCompany));
        //     workerFilter.setAttribute(Attribute.experience, String(worker.jobDetails.experience));
        //     this.workersList.push(workerFilter);
        // })
    }

    connectedCallback() {
       
        this.render();
        
    }

    render()  {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
           
            <nav-component></nav-component>
            `;

        };
        
        
       
    }

}

customElements.define('app-container',AppContainer);