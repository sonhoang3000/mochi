import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import PropTypes from 'prop-types';

const Comment = ({ comment }) => {
<<<<<<< HEAD
=======
	const getTimeAgo = (createdAt) => {
		const now = new Date();
		const commentDate = new Date(createdAt);
		const diffInSeconds = Math.floor((now - commentDate) / 1000);

		if (diffInSeconds < 60) {
			return `${diffInSeconds}s`;
		}
		
		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes}'`;
		}

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return `${diffInHours}h`;
		}

		const diffInDays = Math.floor(diffInHours / 24);
		return `${diffInDays}d`;
	};

>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
	return (
		<div className='my-2'>
			<div className='flex gap-3 items-center'>
				<Avatar>
					<AvatarImage src={comment?.author?.profilePicture} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
<<<<<<< HEAD
				<h1 className='font-bold text-sm' >{comment?.author?.username} <span className='font-normal pl-1'>{comment?.text}</span> </h1>
=======
				<div>
					<h1 className='font-bold text-sm'>
						{comment?.author?.username} 
						<span className='font-normal pl-1'>{comment?.text}</span>
					</h1>
					<span className='text-xs text-gray-500'>{getTimeAgo(comment?.createdAt)}</span>
				</div>
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
			</div>
		</div>
	)
}

Comment.propTypes = {
	comment: PropTypes.shape({
		author: PropTypes.shape({
			profilePicture: PropTypes.string,
			username: PropTypes.string,
		}),
		text: PropTypes.string,
	}).isRequired,
};

export default Comment
