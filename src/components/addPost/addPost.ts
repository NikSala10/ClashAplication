import "../button/button";
import { Post } from "../../types/post";
import { dispatch } from "../../store/store";
import { setOpenCloseScreen } from "../../store/actions";
import { addObserver, appState } from '../../store/store';
import { addPost, getPosts } from '../../utils/firebase'
import { hashtags } from "../../data/dataHashtags";

const post: Post = { 
    description:'',
    hashtags:'',
}

export enum AttributeAddPost  { 
    'imguser' = 'imguser',
    'name' = 'name',
    'description' = 'description',
    'image' = 'image',
    'hashtags' = 'hashtags',
}
class AddPost extends HTMLElement  {
    imguser?: string;
    name?: string;
    description?: string;
    image?: string;
    hashtags?: string ;

    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
        addObserver(this)
    }

    connectedCallback() { 
        this.render();
    }

    changeDescription(e: any)  {
        post.description = e.target.value
    }
   changeHashtags(e: any) {
        post.hashtags = e.target.value
}
   submitForm() {
        addPost(post);
        alert('Post creado')
   }

    async render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/addPost/addPost.css">
            
             <div class="container-modal">
                 <btn-component color="red" label="X" id="close-modal"></btn-component>
                <div class="post">
                    <div class="user">
                        <div  circle-img>
                                <img id="img-user" src="${this.imguser ? this.imguser : 'Not found'}">
                        </div>
                        <h4 class="name">${this.name ? this.name : 'Not found'}</h4>
                    </div>
                    <div class="write">
                        <input id="description" type="text" placeholder="Write the description of the post">
                        <input id="hashtags" type="text" placeholder="Write your hashtags">
                    </div>
                    <div class="img-post">
                        <svg id="galery" xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-image-fill" viewBox="0 0 16 16">
                        <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                        </svg>
                        <input id="imgs-Post" type="file">
                    </div>
                    <hr>
                    <p>Your followers will be able to see the reel in their feed and on your profile.</p>
                </div>
                <btn-component id="save" color="#361656" label="Add Post"></btn-component>
             </div>
            
            	
            `;
            
        }
        const btn = this.shadowRoot?.querySelector('#close-modal')
        btn?.addEventListener('click', ()=>{
            dispatch(setOpenCloseScreen(0))
        });

        const description = this.shadowRoot?.querySelector('#description');
        description?.addEventListener('change', this.changeDescription);

        const hashtags = this.shadowRoot?.querySelector('#hashtags');
        hashtags?.addEventListener('change', this.changeHashtags);

        const save = this.shadowRoot?.querySelector('#save');
        save?.addEventListener('click', this.submitForm);

        // const posts = await getPosts()
        // post?.forEach((post) => {
            
        // });
    }
};

customElements.define('addpost-component',AddPost);
export default AddPost;