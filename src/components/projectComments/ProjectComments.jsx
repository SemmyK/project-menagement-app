import { useState } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import uuid4 from 'uuid4'
//hooks
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
//firebase
import { Timestamp } from 'firebase/firestore'
//components
import Avatar from '../avatar/Avatar'

export default function ProjectComments({ project }) {
	const { user } = useAuthContext()
	const [newComment, setNewComment] = useState('')
	const { updateDocument } = useFirestore('projects')

	const handleSubmit = async e => {
		e.preventDefault()

		const commentToAdd = {
			displayName: user.displayName,
			photoURL: user.photoURL,
			content: newComment,
			createdAt: Timestamp.fromDate(new Date()),
			id: uuid4(),
		}
		try {
			await updateDocument(project.id, {
				comments: [...project.comments, commentToAdd],
			})
		} catch (error) {
			console.log(error)
		}

		setNewComment('')
	}

	return (
		<div className='project-comments'>
			<h4>Project Comments</h4>

			<ul>
				{project.comments.length > 0 &&
					project.comments.map(comment => (
						<li key={comment.id}>
							<div className='comment-author'>
								<Avatar user={user} src={comment.photoURL} />
								<p>{comment.displayName}</p>
							</div>
							<div className='comment-date'>
								<p>
									{formatDistanceToNow(comment.createdAt.toDate(), {
										addSuffix: true,
									})}
								</p>
							</div>
							<div className='comment-content'>
								<p>{comment.content}</p>
							</div>
						</li>
					))}
			</ul>

			<form className='add-comment' onSubmit={handleSubmit}>
				<label>
					<span>Add new comment:</span>
					<textarea
						required
						onChange={e => setNewComment(e.target.value)}
						value={newComment}
					></textarea>
				</label>
				<button className='btn'>Add Comment</button>
			</form>
		</div>
	)
}
