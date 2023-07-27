import { useParams } from 'react-router-dom'
//style
import './styles/ProjectDetails.css'
//hooks
import useDocument from '../hooks/useDocument'
//components
import { SyncLoader } from 'react-spinners'
import ProjectSummary from '../components/projectSummary/ProjectSummary'
import ProjectComments from '../components/projectComments/ProjectComments'

function ProjectDetails() {
	const { id } = useParams()
	const { documentData, error, loading } = useDocument('projects', id)

	if (loading) {
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

	if (error) {
		return <div className='error'>{error}</div>
	}

	return (
		documentData && (
			<div className='project-details'>
				<ProjectSummary project={documentData} />
				<ProjectComments project={documentData} />
			</div>
		)
	)
}
export default ProjectDetails
