//style
import './Avatar.css'

function Avatar({ src, user }) {
	return (
		user && (
			<div className='avatar'>
				<img src={src} alt='user avatar' />
			</div>
		)
	)
}
export default Avatar
