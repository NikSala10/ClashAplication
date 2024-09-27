import * as components from './components/indexPadre'
import  {imageArray} from './data/dataBanner'
import './components/post1/post1'
import './components/footer/footer'
import './components/banner1/banner1'
import Banner1, {Attribute} from './components/banner1/banner1';
import  {postsUsers} from './data/dataPost'
import  {hashtags} from './data/dataHashtags'
import  './components/barLateral/barLateral'
import './components/nav/nav'
import PostCard, {AttributePostCard} from './components/postCard/postCard';
import BarLateral, {Attribute2} from './components/barLateral/barLateral';

class AppContainer extends HTMLElement  {
    imagesBanner: Banner1[] = [];
    userPostList: PostCard[] = []
    userHashtagsList : BarLateral[] = []
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        imageArray.forEach(img => {
            const imageArrayBanner1 = this.ownerDocument.createElement("component-container") as Banner1;
            imageArrayBanner1.setAttribute(Attribute.image, img.img);
            this.imagesBanner.push(imageArrayBanner1);
        });
        postsUsers.forEach(user=>  {
            const userPostCards = this.ownerDocument.createElement("card-post") as PostCard;
            userPostCards.setAttribute(AttributePostCard.imguser, String( user.imgUser));
            userPostCards.setAttribute(AttributePostCard.name, user.name);
            userPostCards.setAttribute(AttributePostCard.username, user.username);
            userPostCards.setAttribute(AttributePostCard.category, user.category);
            userPostCards.setAttribute(AttributePostCard.state, user.state);
            userPostCards.setAttribute(AttributePostCard.description, user.description);
            userPostCards.setAttribute(AttributePostCard.image, user.image);
            userPostCards.setAttribute(AttributePostCard.timeposted, String( user.timePosted));
            userPostCards.setAttribute(AttributePostCard.hashtags, user.hashtags.join(", "));
            userPostCards.setAttribute(AttributePostCard.likes, String(user.likes));
            userPostCards.setAttribute(AttributePostCard.comments, String(user.comments));
            userPostCards.setAttribute(AttributePostCard.favorites, String(user.favorites));
            userPostCards.setAttribute(AttributePostCard.send, String(user.send));
            this.userPostList.push(userPostCards);
        })
    }

    connectedCallback() {
        this.render();
    }

    render()  {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/Components/banner1/index.css">
             <link rel="stylesheet" href="/src/components/postCard/postCard.css">
             <link rel="stylesheet" href="/src/index.css">
             
           
            <nav-component></nav-component>
           <post-1></post-1>
           <div class="container"></div>
            <section class="containers">
                <div class="container-postcards"></div>
                <div class="container-barLaterals">
                    <bar-lateral titleitem="Lastest" dataitem="hashtags"></bar-lateral>
                    <bar-lateral titleitem="Categories" dataitem="categories"></bar-lateral>
                </div>
                <div class="addPost">
                <p>+</p>
            </div>
            </section>
            <foo-ter></foo-ter>
            `;
          
            //POST
            const containerPost = this.shadowRoot?.querySelector('.container-postcards')
            this.userPostList.forEach((post) =>  {
                containerPost?.appendChild(post);
            });
            const container = this.shadowRoot?.querySelector('.container');
            this.imagesBanner.forEach(img => {
                container?.appendChild(img);
            });
        }
       
    }
}

customElements.define('app-container', AppContainer);
export default AppContainer;
