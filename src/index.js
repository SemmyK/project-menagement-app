import React from 'react'
import ReactDOM from 'react-dom'
//style
import './index.css'
//components
import App from './App'
//context
import { AuthContextProvider } from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<AuthContextProvider>
			<App />
		</AuthContextProvider>
	</React.StrictMode>
)
