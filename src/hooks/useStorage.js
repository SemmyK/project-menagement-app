import { useEffect, useState } from 'react'
//firebase
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage, auth } from '../firebase/config'

export const useStorage = file => {
	const [url, setUrl] = useState('')

	useEffect(() => {
		const getFileURL = async file => {
			// Points to 'images'
			const imagesRef = ref(
				storage,
				`thumbnails/${auth.currentUser.uid}/${file.name}`
			)
			const uploadTask = await uploadBytesResumable(imagesRef, file)

			// Register three observers:
			// 1. 'state_changed' observer, called any time the state changes
			// 2. Error observer, called on failure
			// 3. Completion observer, called on successful completion
			const something = uploadTask.on(
				'state_changed',
				snapshot => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					console.log('Upload is ' + progress + '% done')
					switch (snapshot.state) {
						case 'paused':
							console.log('Upload is paused')
							break
						case 'running':
							console.log('Upload is running')
							break
					}
				},
				error => {
					// Handle unsuccessful uploads
					console.log(error)
				},
				async () => {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					await getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						console.log('File available at', downloadURL)
						setUrl(downloadURL)
						return downloadURL
					})
				}
			)
			console.log(something)
		}

		if (file) {
			getFileURL(file)
		}
	}, [file])

	return { url }
}
