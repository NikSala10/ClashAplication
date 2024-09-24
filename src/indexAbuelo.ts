import  {postsUsers} from './data/dataPost'
import './components/nav/nav'
import * as components from './components/indexPadre' ;
import PostCard, {Attribute} from './components/postCard/postCard';
class AppContainer extends HTMLElement  {
    userPostList: PostCard[] = []
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'});
        postsUsers.forEach(user=>  {
            const userPostCards = this.ownerDocument.createElement("card-post") as PostCard;
            userPostCards.setAttribute(Attribute.imguser, String( user.imgUser));
            userPostCards.setAttribute(Attribute.name, user.name);
            userPostCards.setAttribute(Attribute.username, user.username);
            userPostCards.setAttribute(Attribute.category, user.category);
            userPostCards.setAttribute(Attribute.state, user.state);
            userPostCards.setAttribute(Attribute.description, user.description);
            userPostCards.setAttribute(Attribute.image, user.image);
            userPostCards.setAttribute(Attribute.timeposted, String( user.timePosted));
            userPostCards.setAttribute(Attribute.hashtags, user.hashtags.join(", "));
            this.userPostList.push(userPostCards);
        })
    }

    connectedCallback() {
       
        this.render();
        
    }

    render()  {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
             <link rel="stylesheet" href="/src/components/postCard/postCard.css">
           
            <nav-component></nav-component>
            <section class="containers">
                <div class="container-postcards"></div>
            </section>
            
            `;
          
            const containerPost = this.shadowRoot?.querySelector('.container-postcards')
            
            this.userPostList.forEach((post) =>  {
                containerPost?.appendChild(post);
            });
           
       
        }
       
    }

}

customElements.define('app-container',AppContainer);