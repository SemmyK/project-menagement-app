import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
//style
import './styles/SignUp.css'
//hooks
import { useSignup } from '../hooks/useSignup'
import { useAuthContext } from '../hooks/useAuthContext'

function SignUp() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [displayName, setDisplayName] = useState('')
	const [thumbnail, setThumbnail] = useState(null)
	const [thumbnailError, setThumbnailError] = useState(null)
	const { signup, isPending, error } = useSignup()
	const { user } = useAuthContext()

	const handleFileChange = e => {
		let selected = e.target.files[0]
		//make sure that selected is not undefines and that user added image file and that file is not too big
		console.log(selected)
		if (!selected) {
			setThumbnailError('File not selected')
			return
		} else if (!selected.type.includes('image')) {
			setThumbnailError('Selected file must be image.')
			return
		} else if (selected.size > 100000) {
			setThumbnailError('Image file size must be less than 100kb')
			return
		}

		setThumbnailError(null)
		setThumbnail(selected)
	}

	const handleSubmit = async e => {
		e.preventDefault()
		console.log(thumbnail)
		if (password < 7) {
			console.log('Password must be at least 8 characters long!')
		}
		await signup(email, password, displayName, thumbnail)
		setTimeout(() => user && navigate('/'), 100)
	}

	return (
		<form onSubmit={handleSubmit} className='auth-form'>
			<h2>sign up</h2>
			<label>
				<span>email:</span>
				<input
					required
					type='email'
					onChange={e => setEmail(e.target.value)}
					value={email}
				/>
			</label>
			<label>
				<span>password:</span>
				<input
					required
					type='password'
					onChange={e => setPassword(e.target.value)}
					value={password}
				/>
			</label>
			<label>
				<span>display name:</span>
				<input
					required
					type='text'
					onChange={e => setDisplayName(e.target.value)}
					value={displayName}
				/>
			</label>
			<label>
				<span>Profile thumbnail:</span>
				<input required type='file' onChange={handleFileChange} />
				{thumbnailError && <div className='error'>{thumbnailError}</div>}
			</label>
			{!isPending && <button className='btn'>Sign up</button>}
			{isPending && (
				<button className='btn' disabled>
					loading
				</button>
			)}
			{error && <div className='error'>{error}</div>}
		</form>
	)
}
export default SignUp
