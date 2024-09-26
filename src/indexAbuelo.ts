import  {postsUsers} from './data/dataPost'
import  {hashtags} from './data/dataHashtags'
import  './components/barLateral/barLateral'
import './components/nav/nav'
import * as components from './components/indexPadre' ;
import PostCard, {Attribute} from './components/postCard/postCard';
import BarLateral, {Attribute2} from './components/barLateral/barLateral';
class AppContainer extends HTMLElement  {
    userPostList: PostCard[] = []
    userHashtagsList : BarLateral[] = []
    
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
        // hashtags.forEach(hashtag=>  {
        //     const hashtagsCard = this.ownerDocument.createElement("bar-lateral") as BarLateral;
        //     hashtagsCard.setAttribute(Attribute2.titleitem, hashtag);
        //     hashtagsCard.setAttribute(Attribute2.itemone, hashtag);
        //     hashtagsCard.setAttribute(Attribute2.itemtwo, hashtag);
        //     hashtagsCard.setAttribute(Attribute2.itemthree, hashtag);
        //     this.userHashtagsList.push(hashtagsCard);
        // })
    }

    connectedCallback() {
       
        this.render();
        
    }

    render()  {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
             <link rel="stylesheet" href="/src/components/postCard/postCard.css">
             <link rel="stylesheet" href="/src/index.css">
           
            <nav-component></nav-component>
            <section class="containers">
                <div class="container-postcards"></div>
                <div class="container-barLaterals">
                    <bar-lateral></bar-lateral>
                    <bar-lateral></bar-lateral>
                </div>
            </section>
            
            `;
          
            //POST
            const containerPost = this.shadowRoot?.querySelector('.container-postcards')
            this.userPostList.forEach((post) =>  {
                containerPost?.appendChild(post);
            });

            //BARRA LATERAL
            // const containerBar = this.shadowRoot?.querySelector('.container-barLaterals')
            // for (let i = 0; i < 3; i++) {
            //     containerBar?.appendChild(this.userHashtagsList[i]); 
            // }
            
           
       
        }
       
    }

}

customElements.define('app-container',AppContainer);