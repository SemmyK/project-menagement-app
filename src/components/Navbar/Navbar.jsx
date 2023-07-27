import { NavLink, useNavigate } from 'react-router-dom'
//hooks
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'
//style
import './Navbar.css'
//assets
import temple from '../../assets/temple.svg'
import dash from '../../assets/dashboard_icon.svg'
import add from '../../assets/add_icon.svg'
//components
import Avatar from '../avatar/Avatar'

function Navbar() {
	const navigate = useNavigate()
	const { user } = useAuthContext()
	const { logout } = useLogout()

	const handleClick = async e => {
		try {
			logout()
		} catch (error) {
			console.log(error)
		}
		navigate('/login')
	}
	return (
		<nav className='navbar'>
			<ul>
				<li className='logo'>
					<img src={temple} alt='temple' />
					<span>The Dojo</span>
				</li>
				<div className='links'>
					{!user && (
						<li style={{ marginLeft: '1em' }}>
							<NavLink to='/signup'>Sign up</NavLink>
						</li>
					)}
					{!user && (
						<li>
							<NavLink to='/login'>Login</NavLink>
						</li>
					)}

					{user && (
						<li className='side-links'>
							<NavLink to='/'>
								<img src={dash} alt='dashbord icon' />
								<span>Dashboard</span>
							</NavLink>
						</li>
					)}

					{user && (
						<li className='side-links'>
							<NavLink to='/create'>
								<img src={add} alt='add icon' />
								<span>New project</span>
							</NavLink>
						</li>
					)}

					{user && (
						<li>
							<button
								className='btn'
								onClick={handleClick}
								style={{ margin: '0 1em' }}
							>
								Logout
							</button>
						</li>
					)}

					{user && (
						<li>
							<Avatar user={user} src={user.photoURL} />
						</li>
					)}
				</div>
			</ul>
		</nav>
	)
}
export default Navbar
