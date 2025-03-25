import React, { useEffect, useState, useContext } from 'react';
import {
	View,
	Text,
	Image,
	FlatList,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Alert,
	RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import {
	getAllPosts,
	likePost,
	dislikePost,
	bookmarkPost,
	addComment,
	deletePost
} from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import HomeStory from '../screens/HomeStory'

const HomeScreen = ({ navigation }) => {
	const [commentText, setCommentText] = useState('');
	const [commentingPostId, setCommentingPostId] = useState(null);
	const [refreshing, setRefreshing] = useState(false);

	const { userId, token } = useContext(AuthContext);
	const { posts, setPosts } = useContext(PostContext);

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			const response = await getAllPosts();
			setPosts(response.data.posts);
		} catch (error) {
			console.error('Lỗi tải bài viết:', error);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchPosts();
		setRefreshing(false);
	};

	const updatePostState = (postId, updateFunc) => {
		setPosts(prevPosts =>
			prevPosts.map(post => (post._id === postId ? updateFunc(post) : post))
		);
	};

	const handleLike = async (postId, isLiked) => {
		try {
			if (isLiked) {
				await dislikePost(postId);
			} else {
				await likePost(postId);
			}
			updatePostState(postId, (post) => ({
				...post,
				likes: isLiked
					? (post.likes || []).filter(id => id !== userId)
					: [...(post.likes || []), userId]
			}));
		} catch (error) {
			console.error('Lỗi khi thích bài viết:', error);
		}
	};

	const handleBookmark = async (postId, isBookmarked) => {
		try {
			await bookmarkPost(postId);
			await fetchPosts(); // reload lại dữ liệu bookmark
		} catch (error) {
			console.error('Lỗi khi bookmark:', error);
		}
	};

	const handleAddComment = async (postId) => {
		if (!commentText.trim()) return;
		try {
			const response = await addComment(postId, commentText);
			setCommentText('');
			setCommentingPostId(null);
			updatePostState(postId, (post) => ({
				...post,
				comments: [response.data.comment, ...(post.comments || [])]
			}));
		} catch (error) {
			console.error('Lỗi khi bình luận:', error);
		}
	};

	const handleDeletePost = (postId) => {
		Alert.alert(
			'Xóa bài viết',
			'Bạn có chắc chắn muốn xóa bài viết này?',
			[
				{ text: 'Hủy', style: 'cancel' },
				{
					text: 'Xóa',
					onPress: async () => {
						try {
							await deletePost(postId, token);
							setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
							Alert.alert('Thành công', 'Bài viết đã được xóa');
						} catch (error) {
							console.error('Lỗi xóa bài viết:', error);
							Alert.alert('Lỗi', 'Không thể xóa bài viết');
						}
					}
				}
			]
		);
	};

	const renderItem = ({ item }) => {
		const isLiked = item.likes?.includes(userId);
		const isBookmarked = item.bookmarks?.includes(userId);
		const displayedComments = item.comments ? item.comments.slice(0, 2) : [];

		return (
			<View style={styles.postContainer}>
				<View style={styles.userInfo}>
					<Image
						source={{ uri: item.author?.profilePicture || 'https://via.placeholder.com/50' }}
						style={styles.avatar}
					/>
					<View style={styles.usernameContainer}>
						<Text style={styles.username}>{item.author?.username}</Text>
						{item.author?._id === userId && (
							<View style={styles.authorBadge}>
								<Text style={styles.authorBadgeText}>Author</Text>
							</View>
						)}
					</View>
					{item.author?._id === userId && (
						<TouchableOpacity onPress={() => handleDeletePost(item._id)} style={styles.deleteButton}>
							<Icon name="trash" size={20} color="#fff" />
						</TouchableOpacity>
					)}
				</View>

				<Image source={{ uri: item.src }} style={styles.postImage} />

				<View style={styles.actions}>
					<TouchableOpacity onPress={() => handleLike(item._id, isLiked)}>
						<Icon name={isLiked ? 'heart' : 'heart-o'} size={24} style={[styles.icon, isLiked && styles.liked]} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setCommentingPostId(item._id)}>
						<Icon name="comment-o" size={24} style={styles.icon} />
					</TouchableOpacity>
					<TouchableOpacity>
						<Icon name="paper-plane-o" size={24} style={styles.icon} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleBookmark(item._id, isBookmarked)}>
						<Icon
							name={isBookmarked ? 'bookmark' : 'bookmark-o'}
							size={24}
							style={[styles.icon, isBookmarked && styles.bookmarked]}
						/>
					</TouchableOpacity>
				</View>

				<Text style={styles.likeText}>{item.likes?.length || 0} lượt thích</Text>
				<TouchableOpacity onPress={() => setCommentingPostId(item._id)}>
					<Text style={styles.commentText}>{item.comments?.length || 0} bình luận</Text>
				</TouchableOpacity>

				<Text style={styles.caption}>
					<Text style={styles.username}>{item.author?.username}: </Text>
					{item.caption}
				</Text>

				{displayedComments.map((comment, index) => (
					<View key={comment._id || `${item._id}-${index}`} style={styles.commentItem}>
						<Text style={styles.commentText}>
							<Text style={styles.commentUsername}>{comment?.author?.username}</Text>: {comment.text}
						</Text>
					</View>
				))}

				{item.comments?.length > 2 && (
					<TouchableOpacity onPress={() => navigation.navigate('AllCommentsScreen', { post: item })}>
						<Text style={styles.viewAllCommentsText}>Xem tất cả {item.comments.length} bình luận</Text>
					</TouchableOpacity>
				)}

				{commentingPostId === item._id && (
					<View style={styles.commentInputContainer}>
						<TextInput
							style={styles.commentInput}
							placeholder="Viết bình luận..."
							value={commentText}
							onChangeText={setCommentText}
						/>
						<TouchableOpacity onPress={() => handleAddComment(item._id)}>
							<Icon name="send" size={20} color="#000" />
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.headerHome}>
				<Text style={styles.title}>MOCHI</Text>
				<View style={styles.headerIcon}>
					<TouchableOpacity
						style={styles.profileFab}
						onPress={() => navigation.navigate('NoticeScreen')}
					>
						<Ionicons name="heart" size={28} color="red" />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.profileFab}
						onPress={() => navigation.navigate('Messageslist', { userId })}
					>
						<Ionicons name="chatbubble-outline" size={24} color="#fff" />
					</TouchableOpacity>
				</View>
			</View>

			<HomeStory />

			<FlatList
				data={posts}
				keyExtractor={(item) => item._id}
				renderItem={renderItem}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				showsVerticalScrollIndicator={false}
			/>

			<TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Upload')}>
				<Icon name="plus" size={24} color="#fff" />
			</TouchableOpacity>
		</View >
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffe4e1',
	},
	headerHome: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		backgroundColor: 'black',
	},
	headerIcon: {
		flexDirection: 'row',
	},
	title: {
		fontSize: 25,
		color: "red"
	},
	postContainer: {
		marginBottom: 20,
		backgroundColor: '#fff',
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		backgroundColor: '#ffe4e1',
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		position: 'relative'
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10
	},
	usernameContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	username: {
		fontWeight: 'bold',
		fontSize: 16
	},
	authorBadge: {
		backgroundColor: '#000',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
		marginLeft: 5
	},
	authorBadgeText: {
		color: '#fff',
		fontSize: 10
	},
	deleteButton: {
		backgroundColor: 'red',
		padding: 5,
		borderRadius: 5,
		position: 'absolute',
		right: 10
	},
	postImage: {
		width: '100%',
		height: 400,
		resizeMode: 'contain',
	},
	actions: {
		flexDirection: 'row',
		padding: 10
	},
	icon: {
		marginRight: 15
	},
	liked: {
		color: 'red'
	},
	bookmarked: {
		color: 'orange'
	},
	likeText: {
		paddingHorizontal: 10,
		fontWeight: 'bold'
	},
	commentText: {
		paddingHorizontal: 10,
		color: '#555'
	},
	caption: {
		paddingHorizontal: 10,
		marginTop: 5
	},
	commentItem: {
		paddingHorizontal: 10,
		marginTop: 4
	},
	commentUsername: {
		fontWeight: 'bold'
	},
	viewAllCommentsText: {
		color: '#007bff',
		paddingHorizontal: 10,
		marginTop: 4
	},
	commentInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderTopWidth: 1,
		borderTopColor: '#ccc',
		paddingHorizontal: 10,
		paddingVertical: 6,
		marginTop: 8
	},
	commentInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 6,
		marginRight: 10
	},
	fab: {
		position: 'absolute',
		bottom: 20,
		right: 20,
		backgroundColor: '#000',
		padding: 14,
		borderRadius: 30,
		elevation: 5,
		zIndex: 10
	},
	profileFab: {
		backgroundColor: '#000',
		padding: 6,
		borderRadius: 20,
	}
});


export default HomeScreen;
