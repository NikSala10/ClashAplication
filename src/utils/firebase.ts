import { hashtags } from '../data/dataHashtags';
import { appState } from '../store/store';
import  {firebaseConfig} from '../utils/firebaseConfig'
let db: any;
let auth: any;
let storage: any;
 
export const getFirebaseInstance = async () =>  {
   if (!db) {
       const  {getFirestore} = await import('firebase/firestore')
       const  {initializeApp} = await import('firebase/app');
       const  {getAuth } = await import('firebase/auth');
	   const { getStorage } = await import('firebase/storage');

       const app = initializeApp(firebaseConfig);
       db = getFirestore(app);
       auth = getAuth(app);
	   storage = getStorage();
   }
   return  {db, auth, storage};
};


export const addPost = async (post: any) =>  {
   try {
       const {db} = await getFirebaseInstance();
       const  { collection, addDoc} = await import('firebase/firestore');

       const where = collection(db, 'posts');
	   const registerPost =  {
		description: post.description,
		hashtags: post.hashtags,
		image: post.image,
		dateadded: new Date().toISOString(),
		userUid: appState.user
	   }
       await addDoc(where, registerPost);
       console.log('Se añadió con éxito');
       
   } catch (error) {
   console.error('Error adding document', error);		
   }
}

export const getPosts = async () =>  {
   try {
       const  {db} = await getFirebaseInstance();
       const  { collection, getDocs} = await import('firebase/firestore');
       const where = collection(db, 'posts');
       const querySnapshot = await getDocs(where);
       const data: any[] =[];

       querySnapshot.forEach((doc) => {
           data.push(doc.data());
       });
       return data;
   } catch (error) {
   console.error('Error getting documents', error)
   }
}; 

export const addHashtags = async (hashtag: any) =>  {
	try {
		const {db} = await getFirebaseInstance();
		const  { collection, addDoc} = await import('firebase/firestore');
 
		const where = collection(db, 'hashtags');
		const registeHhashtag =  {
		 hashtags: hashtag.hashtags,
		 userUid: appState.user
		}
		await addDoc(where, registeHhashtag);
		console.log('Se añadió el hashtags con éxito');
		
	} catch (error) {
	console.error('Error adding document', error);		
	}
 }
 
 export const getHashtags = async () =>  {
	try {
		const  {db} = await getFirebaseInstance();
		const  { collection, getDocs} = await import('firebase/firestore');
		const where = collection(db, 'hashtags');
		const querySnapshot = await getDocs(where);
		const data: any[] =[];
 
		querySnapshot.forEach((doc) => {
			data.push(doc.data());
		});
		return data;
	} catch (error) {
	console.error('Error getting documents', error)
	}
 }; 

export const registerUser = async (credentials: any) => {
	try {
		const { auth, db } = await getFirebaseInstance();
		const { createUserWithEmailAndPassword } = await import('firebase/auth');
		const { doc, setDoc } = await import('firebase/firestore');

		const userCredential = await createUserWithEmailAndPassword(auth,credentials.email, credentials.password);

		const where = doc(db, 'users', userCredential.user.uid);
		const data = {
			name: credentials.name,
			confirmPassword: credentials.confirmPassword,
		};

		await setDoc(where, data);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};
export const loginUser = async (email: string, password: string) => {
	try {
		const { auth } = await getFirebaseInstance();
		const { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } = await import('firebase/auth');

		setPersistence(auth, browserLocalPersistence)
			.then(() => {
				return signInWithEmailAndPassword(auth, email, password);
			})
			.catch((error: any) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
			});
	} catch (error) {
		console.error(error);
	}
};

export const getUserData = async (uid: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, getDoc } = await import('firebase/firestore');

        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data(); // Retornar los datos del usuario
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

export const uploadFile = async (file: File, id: string) => {
    const { storage } = await getFirebaseInstance();
    const { ref, uploadBytes } = await import('firebase/storage');

    // Genera un nombre único para la imagen usando un timestamp
    const uniqueFileName = `${id}_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, 'imagesPosts/' + uniqueFileName);

    await uploadBytes(storageRef, file).then((snapshot) => {
        console.log('File uploaded');
    });

    // Devuelve el nombre único del archivo subido, si lo necesitas para futuras referencias
    return uniqueFileName; // Opcional, si necesitas el nombre para obtener la URL
};

export const getFile = async (id: string): Promise<string | null> => {
    const { storage } = await getFirebaseInstance();
    const { ref, getDownloadURL } = await import('firebase/storage');

    const storageRef = ref(storage, 'imagesPosts/' + id);
    
    try {
        const url = await getDownloadURL(storageRef);
        return url; // Devuelve la URL si tiene éxito
    } catch (error) {
        console.error(error);
        return null; // Devuelve null si ocurre un error
    }
};

export const uploadFileProfile = async (file: File, id: string) => {
	const { storage } = await getFirebaseInstance();
	const { ref, uploadBytes } = await import('firebase/storage');

	const storageRef = ref(storage, 'imagesProfile/' + id);
	uploadBytes(storageRef, file).then((snapshot) => {
		console.log('File uploaded');
	});
};

export const getFileProfile = async (id: string) => {
	const { storage } = await getFirebaseInstance();
	const { ref, getDownloadURL } = await import('firebase/storage');

	const storageRef = ref(storage, 'imagesProfile/' + id);
	const urlImg = await getDownloadURL(ref(storageRef))
		.then((url) => {
			return url;
		})
		.catch((error) => {
			console.error(error);
		});

	return urlImg;
};
