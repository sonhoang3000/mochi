import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Conversation } from "../models/conversation.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
export const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(401).json({
				message: "Something is missing, please check!",
				success: false,
			});
		}
		const user = await User.findOne({ email });
		if (user) {
			return res.status(401).json({
				message: "Try different email",
				success: false,
			});
		};
		const hashedPassword = await bcrypt.hash(password, 10);
		await User.create({
			username,
			email,
			password: hashedPassword
		});
		return res.status(201).json({
			message: "Account created successfully.",
			success: true,
		});
	} catch (error) {
		console.log(error);
	}
}
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(401).json({
				message: "Something is missing, please check!",
				success: false,
			});
		}
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				message: "Incorrect email or password",
				success: false,
			});
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(401).json({
				message: "Incorrect email or password",
				success: false,
			});
		};

		const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

		// populate each post if in the posts array
		const populatedPosts = await Promise.all(
			user.posts.map(async (postId) => {
				const post = await Post.findById(postId);
				if (post?.author.equals(user._id)) {
					return post;
				}
				return null;
			})
		)
		user = {
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePicture: user.profilePicture,
			bio: user.bio,
			followers: user.followers,
			following: user.following,
			posts: populatedPosts,
			bookmarks: user.bookmarks,
		}
		return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
			message: `Welcome back ${user.username}`,
			success: true,
			user
		});

	} catch (error) {
		console.log(error);
	}
};
export const logout = async (_, res) => {
	try {
		return res.cookie("token", "", { maxAge: 0 }).json({
			message: 'Logged out successfully.',
			success: true
		});
	} catch (error) {
		console.log(error);
	}
};
export const getProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		let user = await User.findById(userId)
			.populate({
				path: 'posts',
				options: { sort: { createdAt: -1 } } // Sắp xếp posts theo createdAt giảm dần
			})
			.populate('following')
			.populate('bookmarks');
		return res.status(200).json({
			user,
			success: true
		});
	} catch (error) {
		console.log(error);
	}
};

export const editProfile = async (req, res) => {
	try {
		console.log('check')
		const userId = req.id;
		const { bio, gender } = req.body;
		const profilePicture = req.file;

		let cloudResponse;
		if (profilePicture) {
			const fileUri = getDataUri(profilePicture);
			cloudResponse = await cloudinary.uploader.upload(fileUri);
		}

		const user = await User.findById(userId).select('-password');
		if (!user) {
			return res.status(404).json({
				message: 'User not found.',
				success: false,
			});
		}

		// Cập nhật thông tin nếu có
		if (bio !== undefined) user.bio = bio;
		if (gender !== undefined && gender !== '') user.gender = gender;
		if (profilePicture) user.profilePicture = cloudResponse.secure_url;

		await user.save();

		return res.status(200).json({
			message: 'Profile updated.',
			success: true,
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Something went wrong.',
			success: false,
		});
	}
};
export const getSuggestedUsers = async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const skip = (page - 1) * limit;

		// Áp dụng phân trang với skip + limit
		const suggestedUsers = await User.find({ _id: { $ne: req.id } })
			.select("-password")
			.skip(parseInt(skip))
			.limit(parseInt(limit));

		// Tổng số user để tính tổng số trang
		const totalUsers = await User.countDocuments({ _id: { $ne: req.id } });

		if (!suggestedUsers || suggestedUsers.length === 0) {
			return res.status(200).json({
				success: true,
				users: [],
				message: 'No more users available',
			});
		}

		return res.status(200).json({
			success: true,
			users: suggestedUsers,
			totalPages: Math.ceil(totalUsers / limit),
			currentPage: parseInt(page),
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

export const followOrUnfollow = async (req, res) => {
	try {
		const currentUserId = req.id;
		const targetUserId = req.params.id;
		if (currentUserId === targetUserId) {
			return res.status(400).json({
				message: 'You cannot follow/unfollow yourself',
				success: false
			});
		}

		const user = await User.findById(currentUserId);
		const targetUser = await User.findById(targetUserId);

		if (!user || !targetUser) {
			return res.status(400).json({
				message: 'User not found',
				success: false
			});
		}
		// kiểm tra folo hay là unfolo và ngược lại
		const isFollowing = user.following.includes(targetUserId);
		if (isFollowing) {
			// unfollow logic nếu dang folo
			await Promise.all([
				User.updateOne({ _id: currentUserId }, { $pull: { following: targetUserId } }),
				User.updateOne({ _id: targetUserId }, { $pull: { followers: currentUserId } }),
			])
			return res.status(200).json({ message: 'Unfollowed successfully', success: true });
		} else {
			await Promise.all([
				User.updateOne({ _id: currentUserId }, { $push: { following: targetUserId } }),
				User.updateOne({ _id: targetUserId }, { $push: { followers: currentUserId } }),
			])
			return res.status(200).json({ message: 'followed successfully', success: true });
		}
	} catch (error) {
		console.log(error);
	}
}

export const searchUser = async (req, res) => {
	try {
		const { limit = 10, lastId } = req.query;
		const { username } = req.params;

		if (!username) {
			return res.status(400).json({ message: "Username is required" });
		}

		// Tạo bộ lọc tìm kiếm
		let filter = { username: { $regex: username, $options: "i" } };
		if (lastId) {
			filter._id = { $gt: lastId }; // Chỉ lấy user có ID lớn hơn lastId
		}

		// Truy vấn danh sách user
		const users = await User.find(filter)
			.limit(parseInt(limit))
			.sort({ _id: 1 })
			.select("-password"); // Sắp xếp theo ID tăng dần

		// Lấy ID cuối cùng trong danh sách
		const nextLastId = users.length > 0 ? users[users.length - 1]._id : null;

		res.status(200).json({
			users,
			nextLastId, // Gửi lastId để request tiếp theo sử dụng
			hasMore: users.length === parseInt(limit), // Nếu đủ limit thì vẫn còn dữ liệu
			message: 'search okie ',
			success: true
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getConversation = async (req, res) => {
	try {
		const currentUserId = req.id; // Lấy ID user hiện tại từ request

		const conversations = await Conversation.find({
			participants: currentUserId // Lọc các cuộc trò chuyện có user này
		})
			.populate("participants") // Lấy thông tin người tham gia
			.sort({ updatedAt: -1 }) // Sắp xếp theo updatedAt giảm dần
			.select("-messages"); // Không lấy danh sách tin nhắn

		// Lọc để loại bỏ currentUserId khỏi participants
		const filteredConversations = conversations.map(conv => ({
			...conv.toObject(),
			participants: conv.participants.filter(p => p._id.toString() !== currentUserId)
		}));

		return res.status(200).json({
			message: 'Lấy danh sách cuộc trò chuyện thành công',
			success: true,
			conversations: filteredConversations
		});

	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const createConversation = async (req, res) => {
	const senderId = req.id;
	const receiverId = req.params.id;

	let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] }
	});

	if (!conversation) {
		conversation = await Conversation.create({
			participants: [senderId, receiverId]
		})
	} else {
		conversation.updatedAt = new Date();
		await conversation.save(); // Lưu thay đổi vào database
	}

	return res.status(200).json({
		success: true,
		message: 'Create Chat succeed.',
		conversation
	})
}

export const getFollowing = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId).populate("following", "username email profilePicture");

		if (!user) {
			return res.status(404).json({ message: "User not found", success: false });
		}

		res.status(200).json({ success: true, following: user.following });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", success: false });
	}
};

export const getFollowers = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId).populate("followers", "username email profilePicture");

		if (!user) {
			return res.status(404).json({ message: "User not found", success: false });
		}

		res.status(200).json({ success: true, followers: user.followers });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", success: false });
	}
};
