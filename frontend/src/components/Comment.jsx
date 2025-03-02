import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import PropTypes from 'prop-types';

const Comment = ({ comment }) => {
	return (
		<div className='my-2'>
			<div className='flex gap-3 items-center'>
				<Avatar>
					<AvatarImage src={comment?.author?.profilePicture} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				<h1 className='font-bold text-sm' >{comment?.author?.username} <span className='font-normal pl-1'>{comment?.text}</span> </h1>
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
