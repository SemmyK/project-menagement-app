import { useState } from 'react'
//hooks
import { useCollection } from '../hooks/useCollection'
import { useAuthContext } from '../hooks/useAuthContext'
//style
import './styles/Dashboard.css'
//components
import ProjectList from '../components/projectList/ProjectList'
import ProjectFilter from '../components/projectFilter/ProjectFilter'

function Dashboard() {
	const { user } = useAuthContext()
	const { documents, error, isPending } = useCollection('projects')
	const [filter, setFilter] = useState('all')

	const changeFilter = newFilter => {
		setFilter(newFilter)
	}

	const projects = documents
		? documents.filter(document => {
				switch (filter) {
					case 'all':
						return true
					case 'mine':
						let assignedToMe = false
						document.assignedUsersList.forEach(u => {
							if (u.id === user.uid) {
								assignedToMe = true
							}
						})
						return assignedToMe
					case 'development':
					case 'design':
					case 'sales':
					case 'marketing':
						console.log(document.category, filter)
						return document.category === filter
					default:
						return true
				}
		  })
		: null

	return (
		<div>
			<h2 className='page-title'>Dashboard</h2>
			{error && <p className='error'>{error}</p>}
			{documents && (
				<ProjectFilter changeFilter={changeFilter} currentFilter={filter} />
			)}
			{projects && <ProjectList projects={projects} isPending={isPending} />}
		</div>
	)
}
export default Dashboard
