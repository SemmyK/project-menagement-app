import { useReducer, useEffect, useState } from 'react'
//firebase
import { db } from '../firebase/config'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore'

let initialState = {
	document: null,
	isPending: false,
	error: null,
	success: null,
}

const firestoreReducer = (state, action) => {
	switch (action.type) {
		case 'IS_PENDING':
			return { isPending: true, document: null, success: false, error: null }
		case 'ADDED_DOCUMENT':
			return {
				isPending: false,
				document: action.payload,
				success: true,
				error: null,
			}
		case 'DELETED_DOCUMENT':
			return { isPending: false, document: null, success: true, error: null }
		case 'ERROR':
			return {
				isPending: false,
				document: null,
				success: false,
				error: action.payload,
			}
		case 'UPDATED_DOCUMENT':
			return {
				isPending: false,
				document: action.payload,
				success: true,
				error: null,
			}
		default:
			return state
	}
}

export const useFirestore = collectionName => {
	const [response, dispatch] = useReducer(firestoreReducer, initialState)
	const [isCancelled, setIsCancelled] = useState(false)

	// only dispatch is not cancelled
	const dispatchIfNotCancelled = action => {
		if (!isCancelled) {
			dispatch(action)
		}
	}

	// get a document
	const getDocument = async id => {
		//document reference
		const documentRef = doc(db, collectionName, id)

		const docSnap = await getDoc(documentRef)
		let newDocument = {}
		if (docSnap.exists()) {
			console.log('Document data:', docSnap.data())
			newDocument = docSnap.data()
			return newDocument
		} else {
			// docSnap.data() will be undefined in this case
			console.log('No such document!')
		}
	}

	// add a document
	const addDocument = async dataDoc => {
		dispatch({ type: 'IS_PENDING' })

		try {
			const addedDocument = await addDoc(collection(db, collectionName), {
				...dataDoc,
				createdAt: serverTimestamp(),
			})
			console.log(addedDocument)
			//document reference
			const documentRef = doc(db, collectionName, addedDocument.id)
			console.log(documentRef)
			await updateDoc(documentRef, {
				id: addedDocument.id,
			})

			const docSnap = await getDoc(documentRef)
			let newDocument = {}
			if (docSnap.exists()) {
				console.log('Document data:', docSnap.data())
				newDocument = docSnap.data()
			} else {
				// docSnap.data() will be undefined in this case
				console.log('No such document!')
			}
			console.log(newDocument)
			newDocument && dispatch({ type: 'ADDED_DOCUMENT', payload: newDocument })
			// dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: newDocument })
		} catch (err) {
			dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
		}
		console.log(response)
	}

	// delete a document
	const deleteDocument = async id => {
		dispatch({ type: 'IS_PENDING' })

		try {
			await deleteDoc(doc(db, collectionName, id))
			dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
		} catch (err) {
			dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })
		}
	}

	const updateDocument = async (id, newData) => {
		dispatch({ type: 'IS_PENDING' })

		try {
			await updateDoc(doc(db, collectionName, id), {
				...newData,
			})

			const docSnap = await getDoc(doc(db, collectionName, id))
			let newDocument = {}
			if (docSnap.exists()) {
				console.log('Document data:', docSnap.data())
				newDocument = docSnap.data()
				dispatchIfNotCancelled({
					type: 'UPDATED_DOCUMENT',
					payload: newDocument,
				})
			} else {
				// docSnap.data() will be undefined in this case
				console.log('No such document!')
			}
		} catch (err) {
			dispatchIfNotCancelled({ type: 'ERROR', payload: err })
		}
	}

	useEffect(() => {
		return () => setIsCancelled(true)
	}, [])

	return { getDocument, addDocument, deleteDocument, updateDocument, response }
}
