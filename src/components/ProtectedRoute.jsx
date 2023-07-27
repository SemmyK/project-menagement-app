import { Navigate, Outlet } from 'react-router-dom'
//hooks
import { useAuthContext } from '../hooks/useAuthContext'

function ProtectedRoute() {
	const { user } = useAuthContext()
	return user ? <Navigate to='/' /> : <Outlet />
}
export default ProtectedRoute
