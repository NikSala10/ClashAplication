import  {firebaseConfig} from '../utils/firebaseConfig'
let db: any;
let auth: any;
 
export const getFirebaseInstance = async () =>  {
   if (!db) {
       const  {getFirestore} = await import('firebase/firestore')
       const  {initializeApp} = await import('firebase/app');
       const  {getAuth } = await import('firebase/auth');

       const app = initializeApp(firebaseConfig);
       db = getFirestore(app);
       auth = getAuth(app);
   }
   return  {db, auth};
};


// export const addSong = async (song: any) =>  {
//    try {
//        const {db} = await getFirebaseInstance();
//        const  { collection, addDoc} = await import('firebase/firestore');
//        const songWithTimestamp = {
//            ...song,
//            dateadded: new Date().toISOString()
//        };
       
//        const where = collection(db, 'songs');
//        await addDoc(where, songWithTimestamp);
//        console.log('Se añadió con éxito');
       
//    } catch (error) {
//    console.error('Error adding document', error);		
//    }
// }

// export const getSongs = async () =>  {
//    try {
//        const  {db} = await getFirebaseInstance();
//        const  { collection, getDocs} = await import('firebase/firestore');
//        const where = collection(db, 'songs');
//        const querySnapshot = await getDocs(where);
//        const data: any[] =[];

//        querySnapshot.forEach((doc) => {
//            data.push(doc.data());
//        });
//        return data;
//    } catch (error) {
//    console.error('Error getting documents', error)
//    }
// }; 

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