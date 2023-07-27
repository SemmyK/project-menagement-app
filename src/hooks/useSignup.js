import { useState, useEffect } from 'react'
//firebase
import { auth, db, storage } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc,
} from 'firebase/firestore'
//hooks
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const { dispatch } = useAuthContext()

	const signup = async (email, password, displayName, thumbnail) => {
		setError(null)
		setIsPending(true)

		try {
			// signup
			const res = await createUserWithEmailAndPassword(auth, email, password)

			if (!res) {
				throw new Error('Could not complete signup')
			}

			// Points to 'thumbnails'
			const imagesRef = ref(
				storage,
				`thumbnails/${res.user.uid}/${thumbnail.name}`
			)

			// 'file' comes from the Blob or File API
			await uploadBytes(imagesRef, thumbnail).then(async snapshot => {
				console.log('Uploaded a blob or file!')
				console.log(snapshot)
				const url = await getDownloadURL(snapshot.ref)
				console.log(url)
				res.user && updateProfile(res.user, { photoURL: url })
			})

			// add display name to user

			res.user && updateProfile(res.user, { displayName })

			// Add a new document in collection "users"
			const docRef = doc(db, 'users', res.user.uid)

			await setDoc(docRef, {
				displayName,
				email,
				photoURL: res.user.photoURL,
				profileCreated: serverTimestamp(),
				online: true,
			})

			await updateDoc(docRef, {
				photoURL: res.user.photoURL,
			})

			let userDocument = {}
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				console.log('Document data:', docSnap.data())
				userDocument = docSnap.data()
			} else {
				// docSnap.data() will be undefined in this case
				console.log('No such document!')
			}

			// dispatch login action
			dispatch({
				type: 'LOGIN',
				payload: { user: res.user, document: userDocument },
			})

			if (!isCancelled) {
				setIsPending(false)
				setError(null)
			}
		} catch (err) {
			if (!isCancelled) {
				setError(err.message)
				setIsPending(false)
			}
		}
	}

	useEffect(() => {
		return () => setIsCancelled(true)
	}, [])

	return { signup, error, isPending }
}
