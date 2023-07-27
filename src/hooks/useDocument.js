import { useEffect, useState } from 'react'
//firebase
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

function useDocument(collectionName, id) {
	const [documentData, setDocumentData] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)
		const unsub = onSnapshot(
			doc(db, collectionName, id),
			document => {
				console.log('Current data: ', document.data())
				if (document.data()) {
					setDocumentData({ ...document.data(), id: document.id })
					setLoading(false)
					setError(null)
				} else {
					setError('Document does not exist.')
					setLoading(false)
				}
			},
			error => {
				console.log(error)
				setError(error)
				setLoading(false)
			}
		)
		return () => unsub()
	}, [collectionName, id])

	return { documentData, error, loading }
}
export default useDocument
