import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDK_wJlR2pxI7r5Xggb6gwG-zA8Cgrs630',
	authDomain: 'thedojoapp-85c43.firebaseapp.com',
	projectId: 'thedojoapp-85c43',
	storageBucket: 'thedojoapp-85c43.appspot.com',
	messagingSenderId: '459021262468',
	appId: '1:459021262468:web:e889cb052449f4ff902cd1',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//initialize services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }

export default app
