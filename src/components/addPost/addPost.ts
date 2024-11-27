import "../button/button";
import '../buttonClose/buttonClose'
import { Post } from "../../types/post";
import { dispatch } from "../../store/store";
import { setOpenCloseScreen } from "../../store/actions";
import { addObserver, appState } from '../../store/store';
import { addPost, getPosts, getUserData } from '../../utils/firebase';
import { addHashtags, getHashtags} from '../../utils/firebase'
import { uploadFile, getFile } from '../../utils/firebase';
const post: Post = { 
    description:'',
    hashtags:'',
    image:'',
    category: '',
	state: false,
	username: '',
	imgUser: '',
	name: '',
	likes: 0,
	comments: 0,
	favourites: 0
}

const hashtag =  {
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
    selectedFile?: File;
    constructor()  {
        super();
        this.attachShadow( {mode: 'open'})
        addObserver(this)
    }

    async connectedCallback() {
        // const userId = appState.user; 
        // const userData = await getUserData(userId);
        // if (userData) {
        //     this.name = userData.name;
        //     this.imguser = userData.imgUser; 

        //     post.username = `@${this.name?.replace(/\s+/g, '').toLowerCase()}`;
        // }

        this.render();
    }
    changeDescription(e: any)  {
        post.description = e.target.value
    }
   changeHashtags(e: any) {
        post.hashtags = e.target.value;
        hashtag.hashtags = e.target.value
    }
   
    async submitForm() {
        post.category = 'Creative';
        const img = this.shadowRoot?.querySelector('#imgs-Post') as HTMLInputElement;
        const file = img?.files?.[0]; 
   
        if (file) {
            const uniqueFileName = await uploadFile(file, appState.user); 
            const imageUrl: string | null = await getFile(uniqueFileName); 
            
            if (imageUrl) {
                post.image = imageUrl; 
            } else {
                console.error("No se pudo obtener la URL de la imagen.");
                alert("Error al obtener la URL de la imagen. Por favor intenta de nuevo.");
                return; 
            }
        }
        await addHashtags(hashtag);
        await addPost(post);
        
    
        alert('Post creado');
        this.clearInputs();
    }

    clearInputs() {
        const descriptionInput = this.shadowRoot?.querySelector('#description') as HTMLInputElement;
        const hashtagsInput = this.shadowRoot?.querySelector('#hashtags') as HTMLInputElement;
        const imgInput = this.shadowRoot?.querySelector('#imgs-Post') as HTMLInputElement;

        if (descriptionInput) descriptionInput.value = ''; 
        if (hashtagsInput) hashtagsInput.value = ''; 
        if (imgInput) imgInput.value = ''; 
    }

    async render() {
        if (this.shadowRoot) {
            const initialLetter = this.name ? this.name.charAt(0).toUpperCase() : ''; 
            this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../src/components/addPost/addPost.css">
            
             <div class="container-modal">
                 <btn-close color="#9A81C2" label="X" id="close-modal"></btn-close>
                <div class="post">
                    <div class="fn">
                        <div class="user">
                            <div class="circle-img">${this.imguser? `<img id="img-user" src="${this.imguser}" alt="User Image">` : `<span id="initial">${initialLetter}</span>`}</div>
                            <h4 class="name">${this.name ? this.name : 'Not found'}</h4>
                        </div>
                        <div class="write">
                            <input id="description" type="text" placeholder="Write the description of the post">
                            <input id="hashtags" type="text" placeholder="Write your hashtags">
                        </div>
                    </div>
                    <hr>
                    <div class="img-post">
                        <input id="imgs-Post" type="file">
                        <svg id="galery" xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="#FFFFFF" class="bi bi-image-fill" viewBox="0 0 16 16">
                        <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                        </svg>
                        <p>Select an image</p>
                    </div>
                </div>
                <p id="text">Your followers will be able to see the reel in their feed and on your profile.</p>
                <btn-component id="save" color="#361656" label="Add Post"></btn-component>
             </div>
            
            	
            `;
            
        }
        const btn = this.shadowRoot?.querySelector('#close-modal')
        btn?.addEventListener('click', ()=>{
            dispatch(setOpenCloseScreen(0))
        });

        const description = this.shadowRoot?.querySelector('#description') as HTMLInputElement;
        description?.addEventListener('change', this.changeDescription);
        

        const hashtags = this.shadowRoot?.querySelector('#hashtags') as HTMLInputElement;
        hashtags?.addEventListener('change', this.changeHashtags);

        const imgInput = this.shadowRoot?.querySelector('#imgs-Post') as HTMLInputElement;
        imgInput?.addEventListener('change', () => {
            this.selectedFile = imgInput.files?.[0] || undefined; 
            alert('Imagen seleccionada');
        });

        const save = this.shadowRoot?.querySelector('#save');
        save?.addEventListener('click', () => {
            const descriptionValue = description.value.trim();
            const hashtagsValue = hashtags.value.trim();
            const imageValue = imgInput.value.trim();
        
            if (!descriptionValue) {
                alert('Por favor, escribe una descripción del post.');
                return; 
            }
            if (!imageValue) {
                alert('Por favor, selecciona una imagen.');
                return; 
            }
            if (!hashtagsValue) {
                alert('Por favor, escribe al menos un hashtag.');
                return; 
            }
            this.submitForm.bind(this)();
        });
    }
};

customElements.define('addpost-component',AddPost);
export default AddPost;