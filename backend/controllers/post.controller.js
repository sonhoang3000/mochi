import axios from 'axios';
import FormData from "form-data";
import multer from "multer";
import { Comment } from "../models/comment.model.js";
import { Notification } from '../models/notification.model.js';
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import cloudinary from "../utils/cloudinary.js";

export const addNewPost = async (req, res) => {
	try {
		const { caption } = req.body;
		const file = req.file;
		const authorId = req.id;

		if (!file) return res.status(400).json({ message: 'file required' });

		let typeContent;

		if (!file || !file.buffer) {
			return res.status(400).json({
				message: "No file provided",
				success: false
			});
		}

		if (file.mimetype.startsWith("image/")) {
			typeContent = "image";
		} else if (file.mimetype.startsWith("video/")) {
			typeContent = "video";
		} else {
			return res.status(400).json({ message: "Invalid file type" });
		}

		// buffer to data uri
		const fileUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

		const cloudResponse = await cloudinary.uploader.upload(fileUri, {
			resource_type: "auto",
		});

		// 3. Gửi dữ liệu file tới Flask API để phân loại nội dung
		let predictedClass;

		try {
			const formData = new FormData();
			formData.append("file", file.buffer, file.originalname);

			const flaskResponse = await axios.post(
				`${process.env.PYTHON_URL}/predict`,
				formData,
				{
					headers: formData.getHeaders(),
				}
			);

			predictedClass = flaskResponse.data?.class;

			// 4. Từ chối nội dung nếu là 'porn'
			if (predictedClass === "porn") {
				return res.status(403).json({
					message: "Content is not allowed",
					content: "porn",
					success: false,
				});
			}
		} catch (error) {
			console.error("Flask API error:", error);
			return res.status(500).json({
				message: "Failed to connect to classification service",
				success: false,
			});
		}

		const post = await Post.create({
			caption,
			src: cloudResponse.secure_url,
			typeContent,
			author: authorId
		});

		const user = await User.findById(authorId);
		if (user) {
			user.posts.push(post._id);
			await user.save();
		}

		await post.populate({ path: 'author', select: '-password' });

		return res.status(201).json({
			message: 'New post added',
			post,
			success: true,
		})

	} catch (error) {
		console.error("Unexpected error:", error);
		return res.status(500).json({
			message: "Internal server error",
			success: false,
		});
	}
};

// Cấu hình multer để lưu trữ trong bộ nhớ tạm
const uploadImage = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type"), false);
		}
	},
});

export const getAllPost = async (req, res) => {
	try {
		const posts = await Post.find().sort({ createdAt: -1 })
			.populate({ path: 'author', select: 'username profilePicture' })
			.populate({
				path: 'comments',
				sort: { createdAt: -1 },
				populate: {
					path: 'author',
					select: 'username profilePicture'
				}
			});
		return res.status(200).json({
			posts,
			success: true
		})
	} catch (error) {
		console.log(error);
	}
};
export const getUserPost = async (req, res) => {
	try {
		const authorId = req.id;
		const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
			path: 'author',
			select: 'username, profilePicture'
		}).populate({
			path: 'comments',
			sort: { createdAt: -1 },
			populate: {
				path: 'author',
				select: 'username, profilePicture'
			}
		});
		return res.status(200).json({
			posts,
			success: true
		})
	} catch (error) {
		console.log(error);
	}
}
export const likePost = async (req, res) => {
	try {
		const currentID = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ message: 'Post not found', success: false });

		// like logic started
		await post.updateOne({ $addToSet: { likes: currentID } });
		await post.save();

		// implement socket io for real time notification
		const user = await User.findById(currentID).select('username profilePicture');
		const postOwnerId = post.author.toString();
		if (postOwnerId !== currentID) {

			const notification = await Notification.create({
                type: 'like',
                senderId: currentID,
                receiverId: postOwnerId,
                postId,
                message: `${user.username} đã thích bài viết của bạn.`
            });

			const userAuthor = await User.findById(postOwnerId);
			if (userAuthor) {
				userAuthor.notifications.push(notification._id);
				await userAuthor.save();
			}
            // Emit socket event
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', {
                type: 'like',
                senderId: currentID,
                userDetails: user,
                postId,
                message: `${user.username} đã thích bài viết của bạn.`
            });

		}

		return res.status(200).json({ message: 'Post liked', success: true });
	} catch (error) {
		return res.status(500).json({ message: error.message, success: false });
	}
}
export const dislikePost = async (req, res) => {
	try {
		const currentID = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ message: 'Post not found', success: false });

		// like logic started
		await post.updateOne({ $pull: { likes: currentID } });
		await post.save();

		await Notification.deleteOne({ 
            type: 'like', 
            senderId: currentID, 
            postId, 
            receiverId: post.author 
        });

        const postOwnerId = post.author.toString();
        if (postOwnerId !== currentID) {
            // Emit socket event để xoá thông báo
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification_removed', {
                type: 'like',
                senderId: currentID,
                postId
            });
        }

		return res.status(200).json({ message: 'Post disliked', success: true });
	} catch (error) {
		return res.status(500).json({ message: error.message, success: false });
	}
}
export const addComment = async (req, res) => {
	try {
		const postId = req.params.id;
		const senderId = req.id; // Người bình luận
		const { text } = req.body;
		const post = await Post.findById(postId);

		if (!text) return res.status(400).json({ message: 'text is required', success: false });

		const comment = await Comment.create({
			text,
			author: senderId,
			post: postId
		});

		await comment.populate({
			path: 'author',
			select: "username profilePicture"
		});

		post.comments.push(comment._id);
		await post.save();

		const receiverId = post.author.toString();
		if (receiverId !== senderId) {
			// Lưu thông báo vào database
			const notification = await Notification.create({
				type: 'comment',
				senderId,
				postId,
				receiverId,
				message: `${comment.author.username} đã bình luận vào bài viết của bạn.`
			});

			const userAuthor = await User.findById(receiverId);
			if (userAuthor) {
				userAuthor.notifications.push(notification._id);
				await userAuthor.save();
			}

			// Emit socket để thông báo real-time
			const postOwnerSocketId = getReceiverSocketId(receiverId);
			if (postOwnerSocketId) {
				io.to(postOwnerSocketId).emit('notification', {
					type: 'comment',
					senderId,
					postId,
					message: `${comment.author.username} đã bình luận vào bài viết của bạn.`,
					createdAt: notification.createdAt
				});
			}
		}

		return res.status(201).json({
			message: 'Comment Added',
			comment,
			success: true
		})

	} catch (error) {
		console.log(error);
	}
};
export const getCommentsOfPost = async (req, res) => {
	try {
		const postId = req.params.id;

		const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');

		if (!comments) return res.status(404).json({ message: 'No comments found for this post', success: false });

		return res.status(200).json({ success: true, comments });

	} catch (error) {
		console.log(error);
	}
}
export const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const authorId = req.id;

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ message: 'Post not found', success: false });

		// check if the logged-in user is the owner of the post
		if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized' });

		// delete post
		await Post.findByIdAndDelete(postId);

		// remove the post id from the user's post
		let user = await User.findById(authorId);
		user.posts = user.posts.filter(id => id.toString() !== postId);
		await user.save();

		// delete associated comments
		await Comment.deleteMany({ post: postId });

		return res.status(200).json({
			success: true,
			message: 'Post deleted'
		})

	} catch (error) {
		console.log(error);
	}
}
export const bookmarkPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const authorId = req.id;
		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ message: 'Post not found', success: false });

		const user = await User.findById(authorId);
		if (user.bookmarks.includes(post._id)) {
			// already bookmarked -> remove from the bookmark
			await user.updateOne({ $pull: { bookmarks: post._id } });
			await user.save();
			return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true });

		} else {
			// bookmark krna pdega
			await user.updateOne({ $addToSet: { bookmarks: post._id } });
			await user.save();
			return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true });
		}

	} catch (error) {
		console.log(error);
	}
}