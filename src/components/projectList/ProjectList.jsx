import { Link } from 'react-router-dom'
//style
import './ProjectList.css'
//components
import Avatar from '../avatar/Avatar'
import { SyncLoader } from 'react-spinners'

export default function ProjectList({ projects, isPending }) {
	if (isPending) {
		return (
			<div
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<SyncLoader size='30px' margin='1em' />
			</div>
		)
	}

	return (
		<div className='project-list'>
			{projects.length === 0 && <p>No projects yet!</p>}
			{projects.map(project => (
				<Link to={`/projects/${project.id}`} key={project.id}>
					<h4>{project.name}</h4>
					<p>Due by {project.dueDate.toDate().toDateString()}</p>
					<div className='assigned-to'>
						<p>
							<strong>Assigned to:</strong>
						</p>
						<ul>
							{project.assignedUsersList.map(user => (
								<li key={user.id}>
									<Avatar user={user} src={user.photoURL} />
								</li>
							))}
						</ul>
					</div>
				</Link>
			))}
		</div>
	)
}
