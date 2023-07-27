import { BrowserRouter, Route, Routes } from 'react-router-dom'
//style
import './App.css'
//hooks
import { useAuthContext } from './hooks/useAuthContext'
//pages
import Create from './pages/Create'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ProjectDetails from './pages/ProjectDetails'
import Dashboard from './pages/Dashboard'
//components
import PrivateRoute from './components/PrivateRoute'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar/Navbar'
import UsersStatus from './components/usersStatus/UsersStatus'

function App() {
	const { user, authIsReady } = useAuthContext()
	return (
		<>
			{authIsReady && (
				<BrowserRouter>
					<div className='App'>
						<div
							className='content'
							style={{ width: `${user ? '80%' : '100%'}` }}
						>
							<Navbar />
							<div className='container'>
								<Routes>
									{/* private routes */}
									<Route path='/' element={<PrivateRoute />}>
										<Route path='/' element={<Dashboard />} />
									</Route>
									<Route path='/create' element={<PrivateRoute />}>
										<Route path='/create' element={<Create />} />
									</Route>
									<Route path='/projects/:id' element={<PrivateRoute />}>
										<Route path='/projects/:id' element={<ProjectDetails />} />
									</Route>
									{/* protected routes */}
									<Route path='/signup' element={<ProtectedRoute />}>
										<Route path='/signup' element={<SignUp />} />
									</Route>
									<Route path='/login' element={<ProtectedRoute />}>
										<Route path='/login' element={<Login />} />
									</Route>
								</Routes>
							</div>
						</div>
						{user && (
							<div className='users'>
								<UsersStatus />
							</div>
						)}
					</div>
				</BrowserRouter>
			)}
		</>
	)
}

export default App
