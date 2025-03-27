import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import {
	View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, TouchableWithoutFeedback, SafeAreaView,
} from 'react-native';
import { Animated } from 'react-native';
import dayjs from 'dayjs';

import Swiper from 'react-native-swiper';
import { deleteStory, getUserStory, likeOrDislikeStory, commentOnStory } from '../api/serviceStory';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import CommentModal from './CommentModal';

const StoryProfile = () => {
	const [storyUser, setStoryUser] = useState([]);
	const [comment, setComment] = useState("123");
	const swiperRef = useRef(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation();
	const inputRefs = useRef(new Map());
	const { userId } = useContext(AuthContext);

	const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

	const scale = useRef(new Animated.Value(1)).current;

	const animateLike = useCallback(() => {
		Animated.sequence([
			Animated.timing(scale, {
				toValue: 1.5,
				duration: 150,
				useNativeDriver: true,
			}),
			Animated.timing(scale, {
				toValue: 1,
				duration: 150,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	useEffect(() => {
		const fetchStory = async () => {
			try {
				const res = await getUserStory();
				setStoryUser(res.data.stories);
			} catch (error) {
				console.log(error);
			}
		};
		fetchStory();
	}, []);

	// Chuyển sang story trước
	const handlePrev = () => {
		if (currentIndex > 0) {
			swiperRef.current?.scrollBy(-1);
			setCurrentIndex(prevIndex => prevIndex - 1);
		}
	};

	// Chuyển sang story kế tiếp
	const handleNext = () => {
		if (currentIndex < storyUser.length - 1) {
			swiperRef.current?.scrollBy(1);
			setCurrentIndex(prevIndex => prevIndex + 1);
		}
	};

	const handleDeleteStory = (id) => {
		Alert.alert("Xác nhận xoá", "Bạn có chắc chắn muốn xoá story này không?", [
			{ text: "Hủy", style: "cancel" },
			{
				text: "Xoá", onPress: async () => {
					setLoading(true);
					try {
						await deleteStory(id);
						setStoryUser((prevStories) =>
							prevStories.filter((story) => story._id !== id)
						);
					}
					catch (error) { console.error("Failed to delete story:", error); }
					finally { setLoading(false); }
				},
				style: "destructive"
			}
		]
		);
	};

	const likeOrDislikeHandler = async (id) => {
		const res = await likeOrDislikeStory(id);
		if (res.data.success) {
			setStoryUser((prevStories) =>
				prevStories.map((story) =>
					story._id === id
						? {
							...story,
							likes: story.likes.includes(userId)
								? story.likes.filter((currentUser) => currentUser !== userId) // Xóa nếu đã like
								: [...story.likes, userId], // Thêm nếu chưa like
						}
						: story
				)
			);
			animateLike(); // Thêm hiệu ứng khi like
		}
	}

	const handleCommentSubmit = async (id) => {
		if (!comment?.trim()) return;
		try {
			const response = await commentOnStory(id, comment);
			setStoryUser((prevStories) =>
				prevStories.map((story) =>
					story._id === id
						? {
							...story,
							comments: [...story.comments, response.data.comment]
						}
						: story
				)
			);

			setComment("456");
		} catch (error) {
			console.error('Lỗi khi gửi comment:', error);
		}
	};

	const focusInput = (storyId) => {
		const input = inputRefs.current.get(storyId);
		if (input) input.focus();
	};

	const lastTap = useRef(null);

	// Xử lý sự kiện double tap
	const handleDoubleTap = (id) => {
		const now = Date.now();
		if (lastTap.current && now - lastTap.current < 300) {
			// Nếu trong khoảng thời gian 300ms => Xác định là double tap
			likeOrDislikeHandler(id);
		}
		lastTap.current = now;
	};


	return (
		<View style={styles.container}>
			{storyUser.length > 0 ? (
				<Swiper
					ref={swiperRef}
					loop={false}
					showsPagination={false}
					onIndexChanged={(index) => setCurrentIndex(index)}
				>
					{storyUser.map((story, index) => {
						const isLiked = story.likes.includes(userId);
						const displayedComments = story.comments;

						const createdAt = dayjs(story.createdAt);
						const now = dayjs();
						const diffInSeconds = now.diff(createdAt, 'second');
						const diffInMinutes = now.diff(createdAt, 'minute');
						const diffInHours = now.diff(createdAt, 'hour');

						let timeLabel = '';
						if (diffInSeconds < 60) {
							timeLabel = `${diffInSeconds}s`; // Dưới 1 phút -> giây
						} else if (diffInMinutes < 60) {
							timeLabel = `${diffInMinutes}m`; // Dưới 1 giờ -> phút
						} else if (diffInHours < 24) {
							timeLabel = `${diffInHours}h`; // Dưới 24 giờ -> giờ
						} else {
							timeLabel = createdAt.format('DD/MM/YYYY'); // Quá 24 giờ -> hiển thị ngày
						}

						return (
							<View key={index} style={styles.storyWrapper} >
								{/* Avatar + Tên người dùng */}
								<View View style={styles.headerContainer}>
									{/* Nút Back */}
									<TouchableOpacity onPress={() => navigation.goBack()}>
										<Ionicons name="chevron-back" size={30} color="#fff" />
									</TouchableOpacity>

									{/* Nút Delete */}
									<TouchableOpacity onPress={() => handleDeleteStory(story._id)}>
										{loading ? (
											<ActivityIndicator color="#fff" />
										) : (
											<Ionicons name="trash-bin" size={30} color="red" />
										)}
									</TouchableOpacity>
								</View>

								{loading && (<ActivityIndicator color="#fff" />)}

								<View style={styles.header}>
									<Image
										source={{ uri: story.author.profilePicture || 'https://via.placeholder.com/40' }}
										style={styles.avatar}
									/>
									<Text style={styles.username}>{story.author.username}</Text>
									<Text style={styles.timeLabel}>{timeLabel}</Text>
								</View>
								<TouchableWithoutFeedback onPress={() => handleDoubleTap(story._id)}>
									<Image source={{ uri: story.src }} style={styles.storyImage} />
								</TouchableWithoutFeedback>

								<View style={styles.actionContainer}>
									{/* Nút Like */}
									<TouchableOpacity onPress={() => likeOrDislikeHandler(story._id)}>
										<Animated.View style={{ transform: [{ scale }] }}>
											<Ionicons
												name={isLiked ? "heart" : "heart-outline"}
												size={30}
												color={isLiked ? "red" : "#fff"}
											/>
										</Animated.View>
									</TouchableOpacity>

									{/* Số lượng Like */}
									<Text style={styles.likeCount}>{story.likes.length || 0}</Text>

									{/* Nút Comment */}
									<TouchableOpacity onPress={() => setIsCommentModalVisible(true)}>
										<Ionicons name="chatbubble-outline" size={30} color="#fff" />
									</TouchableOpacity>

									<CommentModal
										visible={isCommentModalVisible}
										onClose={() => setIsCommentModalVisible(false)}
										selectedStoryId={story._id}
									/>

									{/* Số lượng Comment */}
									<Text style={styles.commentCount}>{story.comments.length || 0}</Text>
								</View>

								{
									currentIndex === index && (
										<SafeAreaView style={styles.safeAreaInput}>
											<View style={styles.commentInputContainer}>
												<TextInput
													ref={(ref) => inputRefs.current.set(story._id, ref)}
													placeholder="Viết bình luận..."
													placeholderTextColor="#aaa"
													value={comment}
													style={styles.commentInput}
													onChangeText={(text) => setComment(text)}
													onSubmitEditing={() => handleCommentSubmit(story._id)}
												/>
												<TouchableOpacity onPress={() => handleCommentSubmit(story._id)}>
													<Ionicons name="send" size={24} color="#1e90ff" />
												</TouchableOpacity>
											</View>
										</SafeAreaView>
									)
								}


								{/* Nút điều hướng */}
								{
									currentIndex > 0 && ( // Ẩn nút nếu là trang đầu tiên
										<TouchableOpacity style={styles.leftButton} onPress={handlePrev}>
											<Text style={styles.buttonText}>{'<'}</Text>
										</TouchableOpacity>
									)
								}
								{
									currentIndex < storyUser.length - 1 && ( // Ẩn nút nếu là trang cuối cùng
										<TouchableOpacity style={styles.rightButton} onPress={handleNext}>
											<Text style={styles.buttonText}>{'>'}</Text>
										</TouchableOpacity>
									)
								}
							</View>
						)
					})}
				</Swiper>
			) : (
				<View >
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons name="chevron-back" size={30} color="red" />
					</TouchableOpacity>

					<View style={styles.noStory}>
						<Text style={styles.textNoStory}>No stories available, be right back</Text>
					</View>
				</View>
			)
			}
		</View >
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	headerContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 5 },
	storyWrapper: { width: '100%', height: '100%', backgroundColor: 'pink' },
	storyImage: { width: '100%', height: '75%', resizeMode: 'contain' },
	header: { top: 20, left: 10, flexDirection: 'row', alignItems: 'center', zIndex: 10 },
	avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
	username: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
	timeLabel: { fontSize: 16, color: '#aaa', fontWeight: 'bold', },
	leftButton: { position: 'absolute', left: 10, top: '50%', transform: [{ translateY: -20 }], padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 20 },
	rightButton: { position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -20 }], padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 20 },
	buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
	noStory: { justifyContent: "center", alignItems: "center" },
	textNoStory: { fontSize: 25 },
	actionContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 10
	},
	likeCount: {
		color: '#fff',
		fontSize: 16,
		marginLeft: 5,
		marginRight: 15
	},
	commentCount: {
		color: '#fff',
		fontSize: 16,
		marginLeft: 5
	},
	commentInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		borderRadius: 20,
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginHorizontal: 10,
		marginBottom: 10
	},
	commentInput: {
		flex: 1,
		color: '#fff',
		fontSize: 16,
		paddingVertical: 5,
		paddingHorizontal: 10
	},

});


export default StoryProfile;
