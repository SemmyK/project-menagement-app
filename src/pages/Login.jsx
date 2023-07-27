import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
//style
import './styles/Login.css'
//hooks
import { useLogin } from '../hooks/useLogin'

function Login() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { login, error, isPending } = useLogin()

	const handleSubmit = async e => {
		e.preventDefault()
		await login(email, password)
		setTimeout(() => navigate('/'), 100)
	}

	return (
		<form onSubmit={handleSubmit} className='auth-form'>
			<h2>login</h2>
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
			{!isPending && <button className='btn'>Log in</button>}
			{isPending && (
				<button className='btn' disabled>
					loading
				</button>
			)}
			{error && <div className='error'>{error}</div>}
		</form>
	)
}
export default Login
