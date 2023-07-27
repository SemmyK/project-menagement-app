import { useState, useEffect } from 'react'
//firebase
import { auth, db } from '../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
//hooks
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
	const [isCancelled, setIsCancelled] = useState(false)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)
	const { dispatch } = useAuthContext()

	const login = async (email, password) => {
		setError(null)
		setIsPending(true)

		try {
			// login
			const res = await signInWithEmailAndPassword(auth, email, password)

			//get user document
			const docRef = doc(db, 'users', res.user.uid)
			await updateDoc(docRef, {
				online: true,
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

	return { login, isPending, error }
}
