import { useEffect, useState, useRef } from 'react'
//firebase
import { db } from '../firebase/config'
import {
	collection,
	onSnapshot,
	orderBy,
	query,
	where,
} from 'firebase/firestore'

export const useCollection = (collectionName, _query, _orderBy) => {
	const [documents, setDocuments] = useState(null)
	const [error, setError] = useState(null)
	const [isPending, setIsPending] = useState(false)

	// if we don't use a ref --> infinite loop in useEffect
	// _query is an array and is "different" on every function call
	const dataQuery = useRef(_query).current
	const dataOrderBy = useRef(_orderBy).current

	useEffect(() => {
		setIsPending(true)
		let ref = collection(db, collectionName)

		if (dataQuery) {
			ref = query(ref, where(...dataQuery))
		}
		if (dataOrderBy) {
			ref = query(ref, orderBy(...dataOrderBy))
		}

		const unsubscribe = onSnapshot(
			ref,
			snapshot => {
				let results = []
				snapshot.docs.forEach(doc => {
					results.push({ ...doc.data(), id: doc.id })
				})

				// update state
				setDocuments(results)
				setIsPending(false)
				setError(null)
			},
			error => {
				console.log(error)
				setError('could not fetch the data')
			}
		)

		// unsubscribe on unmount
		return () => unsubscribe()
	}, [collectionName, dataQuery, dataOrderBy])

	return { documents, error, isPending }
}
