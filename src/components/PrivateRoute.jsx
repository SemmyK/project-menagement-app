import { Navigate, Outlet } from 'react-router-dom'
//hooks
import { useAuthContext } from '../hooks/useAuthContext'

function PrivateRoute() {
	const { user } = useAuthContext()
	return !user ? <Navigate to='/signup' /> : <Outlet />
}
export default PrivateRoute
