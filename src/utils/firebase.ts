import { hashtags } from '../data/dataHashtags';
import { appState } from '../store/store';
import  {firebaseConfig} from '../utils/firebaseConfig'
import { UpdateFieldType } from '../types/post';
import { doc, deleteDoc } from 'firebase/firestore';
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
       const { db } = await getFirebaseInstance();
       const { collection, addDoc } = await import('firebase/firestore');

       const where = collection(db, 'posts');
	   const registerPost =  {
		description: post.description,
		hashtags: post.hashtags,
		image: post.image,
		category: post.category,
		state: post.state,
		username: post.username,
		imgUser: post.imgUser,
		name: post.name,
		likes: post.likes,
		comments: post.comments,
		favourites: post.favourites,
		dateadded: new Date().toISOString(),
		userUid: appState.user
	   };

       // Añadir el post y obtener la referencia del documento creado
       const docRef = await addDoc(where, registerPost);

       console.log('Se añadió con éxito el post con ID:', docRef.id);
       
       // Retorna el ID del documento creado
       return docRef.id;
	  
	   
       
   } catch (error) {
       console.error('Error al añadir el documento:', error);		
       throw error; // Lanzar el error para manejarlo en la llamada
   }
};

export const getPosts = async (callback: (posts: any[]) => void, userUid?: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { collection, query, where, orderBy, onSnapshot } = await import('firebase/firestore');
        const postsCollection = collection(db, 'posts');
        const postsQuery = userUid
            ? query(
                postsCollection,
                where('userUid', '==', userUid), 
                orderBy('dateadded', 'desc') 
            )
            : query(
                postsCollection,
                orderBy('dateadded', 'desc') 
            );

        const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
            const data: any[] = [];

            querySnapshot.forEach((doc) => {
                const postData = doc.data();
                postData.id = doc.id; 

                data.push(postData);
            });

            callback(data);
        });
        return unsubscribe;

    } catch (error) {
        console.error('Error obteniendo los documentos en tiempo real:', error);
    }
};

export const addComment = async (comment: any) =>  {
	try {
		const {db} = await getFirebaseInstance();
		const  { collection, addDoc} = await import('firebase/firestore');
 
		const where = collection(db, 'comments');
		const registerComment =  {
		 description: comment.description,
		 imgprofile: comment.imgprofile,
		 username: comment.username,
		 dateadded: new Date().toISOString(),
		 userUid: appState.user,
		 postid: comment.postid,
		}
		await addDoc(where, registerComment);
		console.log('Se añadió con éxito');
		
	} catch (error) {
	console.error('Error adding document', error);		
	}
 }
 
 export const getComment = async () =>  {
	try {
		const  {db} = await getFirebaseInstance();
		const  { collection, getDocs} = await import('firebase/firestore');
		const where = collection(db, 'comments');
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
 export const getCommentsByPost = async (pid: string) => {
    try {
        const { db } = await getFirebaseInstance();
        const { collection, getDocs, query, where } = await import('firebase/firestore');

        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, where('postid', '==', String(pid))); 
        const postSnap = await getDocs(q);

        const data: any[] = [];
        postSnap.forEach((doc) => {
            data.push(doc.data());
        });

        return data;
    } catch (error) {
        console.error('Error getting comments:', error);
        return null;
    }
};
export const addHashtags = async (hashtag: any) =>  {
	try {
		const {db} = await getFirebaseInstance();
		const  { collection, addDoc} = await import('firebase/firestore');
 
		const where = collection(db, 'hashtags');
		const registeHhashtag =  {
		 hashtags: hashtag.hashtags,
		 userUid: appState.user,
		 dateadded: new Date().toISOString(),
		}
		await addDoc(where, registeHhashtag);
		console.log('Se añadió el hashtags con éxito');
		
	} catch (error) {
	console.error('Error adding document', error);		
	}
 }
 export const getHashtags = async (): Promise<string[]> => {
    try {
        const { db } = await getFirebaseInstance();
        const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
        
        const hashtagsCollection = collection(db, 'hashtags');
        const recentHashtagsQuery = query(
            hashtagsCollection,
            orderBy('dateadded', 'desc'),  // Orden descendente por la fecha
        );
        const querySnapshot = await getDocs(recentHashtagsQuery);
        const data: string[] = [];
        
        querySnapshot.forEach((doc) => {
            const hashtags = doc.data().hashtags;
            if (typeof hashtags === 'string') {
                data.push(...hashtags.split(',').map(tag => tag.trim()));  // Convierte el string a array de hashtags
            }
        });
        return data;
    } catch (error) {
        console.error('Error obteniendo hashtags:', error);
        return [];
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
            email: credentials.email
		};

		await setDoc(where, data);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};
export const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { auth } = await getFirebaseInstance();
      const { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } = await import('firebase/auth');
  
      await setPersistence(auth, browserLocalPersistence);
  
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      return !!userCredential.user; 
  
    } catch (error) {
      console.error('Error de autenticación:', error);
      return false; 
    }
  };
export const getUsers = async () =>  {
	try {
		const  {db} = await getFirebaseInstance();
		const  { collection, getDocs} = await import('firebase/firestore');
		const where = collection(db, 'users');
		const querySnapshot = await getDocs(where);
		const data: any[] =[];
 
		querySnapshot.forEach((doc) => {
            const user = doc.data()
            user.id = doc.id
			data.push(user);
		});
		return data;
	} catch (error) {
	console.error('Error getting documents', error)
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
export const getFiles = async (id: string): Promise<string[]> => {
    const { storage } = await getFirebaseInstance();
    const { ref, listAll, getDownloadURL } = await import('firebase/storage');

    const storageRef = ref(storage, 'imagesPosts/' + id);
    
    try {
        // Obtener una lista de archivos en el directorio
        const result = await listAll(storageRef);

        // Obtener las URLs de los archivos
        const urls = await Promise.all(result.items.map(item => getDownloadURL(item)));
        
        return urls; // Devolvemos un array de URLs
    } catch (error) {
        console.error(error);
        return []; // Si hay error, devolvemos un array vacío
    }
};
export const uploadFileProfileByUser = async (file: File, id: string) => {
	const { storage } = await getFirebaseInstance();
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const storageRef = ref(storage, 'imagesProfile/' + id);
    const snapshot = await uploadBytes(storageRef, file);
    console.log('File uploaded:', snapshot);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
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

export const updatePostField = async (postId: string, field: UpdateFieldType, count: number) => {
    try {
		const { db } = await getFirebaseInstance();
        const { doc, updateDoc } = await import('firebase/firestore');
        
        const postRef = doc(db, 'posts', postId);
        
        await updateDoc(postRef, {
            [field]: count
        });

    } catch (error) {
        console.error(`Error al añadir ${field} al documento:`, error);
        throw error; 
    }
};

export const getPostsByUser = async (callback: (posts: any[]) => void) => { // Recibe una función de callback para pasar los datos actualizados
    try {
        const { db } = await getFirebaseInstance();
        const { collection, query, where, orderBy, onSnapshot } = await import('firebase/firestore');
        
        const ref = collection(db, 'posts');
        
        // Crea la consulta para obtener los posts del usuario ordenados por fecha
        const q = query(
            ref,
            where('userUid', '==', appState.user), // Filtra por el UID del usuario
            orderBy('dateadded', 'desc') // Ordena por la fecha en orden descendente
        );
        
        // Usamos `onSnapshot` para escuchar cambios en tiempo real
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data: any[] = [];

            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() }); // Incluye también el ID del documento
            });

            // Llama al callback con los datos actualizados
            callback(data);
        });

        // Retorna una función para dejar de escuchar los cambios cuando ya no sea necesario
        return unsubscribe;

    } catch (error) {
        console.error('Error getting documents in real-time', error);
    }
};
export const getPostsByUserAccount = async (userId: string, callback: (posts: any[]) => void) => {
    try {
        const { db } = await getFirebaseInstance();
        const { collection, query, where, orderBy, onSnapshot } = await import('firebase/firestore');
        
        const ref = collection(db, 'posts');
        
        // Crea la consulta para obtener los posts del usuario ordenados por fecha
        const q = query(
            ref,
            where('userUid', '==', userId), // Filtra por el UID del usuario recibido como parámetro
            orderBy('dateadded', 'desc') // Ordena por la fecha en orden descendente
        );
        
        // Usamos `onSnapshot` para escuchar cambios en tiempo real
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data: any[] = [];

            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() }); // Incluye también el ID del documento
            });

            // Llama al callback con los datos actualizados
            callback(data);
        });

        // Retorna una función para dejar de escuchar los cambios cuando ya no sea necesario
        return unsubscribe;

    } catch (error) {
        console.error('Error getting documents in real-time', error);
    }
};

export const uploadUserData = async (uid: string, userinfo: { 
    username: string, 
    category: string, 
    imgUser: string, 
    placeresidence: string, 
    currenttraining: string, 
    currentjob: string, 
    academy: string, 
    moreworksurl: string,
    followers: [],
    following:[],
    likes:[]
}) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, updateDoc } = await import('firebase/firestore');

        const userRef = doc(db, 'users', uid);

        // Solo actualiza los campos que se pasan como parámetros
        const userInformation = {
            likes: userinfo.likes,
            followers: userinfo.followers,
            following: userinfo.following,
            username: userinfo.username, 
            category: userinfo.category,
            imgUser: userinfo.imgUser,
            placeresidence: userinfo.placeresidence,
            currenttraining: userinfo.currenttraining,
            currentjob: userinfo.currentjob,
            academy: userinfo.academy,
            moreworksurl: userinfo.moreworksurl,
        };

        await updateDoc(userRef, userInformation); // Utiliza updateDoc para evitar sobrescribir todo el documento
    } catch (error) {
        console.error('Error uploading user data:', error);
    }
};
export const getUserData = async (userId: string, callback: (userData: any | null) => void) => {
    try {
        const { db } = await getFirebaseInstance();
        const { doc, onSnapshot } = await import('firebase/firestore');

        const userRef = doc(db, 'users', userId); 
        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                callback({ id: docSnapshot.id, ...docSnapshot.data() }); 
            } else {
                console.warn('El documento no existe.');
                callback(null); 
            }
        });
        return unsubscribe;
        
    } catch (error) {
        console.error('Error listening to user data in real-time:', error);
        callback(null);
    }
};

export const deletePost= async (id: string) => {
    try {
      const { db } = await getFirebaseInstance();
      const { doc, deleteDoc } = await import('firebase/firestore');

      const docRef = doc(db, 'posts', id);
  
      await deleteDoc(docRef);
  
      console.log(`El post con ID ${id} ha sido eliminado correctamente.`);
    } catch (error) {
      console.error('Error al eliminar el post de Firebase:', error);
      throw error; 
    }
  };

//   export const getUserDataAsync = async (userId: string): Promise<any | null> => {
//     return new Promise((resolve, reject) => {
//         getUserData(userId, (userData) => {
//             if (userData) {
//                 resolve(userData);
//             } else {
//                 reject('No se pudo obtener los datos del usuario');
//             }
//         });
//     });
// };