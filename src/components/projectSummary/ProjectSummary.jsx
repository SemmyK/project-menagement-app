import { useNavigate } from 'react-router-dom'
//hooks
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
//components
import Avatar from '../avatar/Avatar'

function ProjectSummary({ project }) {
	const navigate = useNavigate()
	const { deleteDocument } = useFirestore('projects')
	const { user } = useAuthContext()

	const handleClick = () => {
		deleteDocument(project.id)
		navigate('/')
	}
	return (
		<div>
			<div className='project-summary'>
				<h2 className='page-title'>{project.name}</h2>
				<p className='due-date'>
					Project due by {project.dueDate.toDate().toDateString()}
				</p>
				<p className='details'>{project.details}</p>
				<h4>Project assigned to:</h4>
				<div className='assigned-users'>
					{project.assignedUsersList.map(user => (
						<div key={user.id}>
							<Avatar user={user} src={user.photoURL} />
						</div>
					))}
				</div>
			</div>

			{user.uid === project.createdBy.id && (
				<button className='btn' onClick={handleClick}>
					Mark as Complete
				</button>
			)}
		</div>
	)
}
export default ProjectSummary
