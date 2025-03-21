import React, { useState, useEffect, useContext, useRef } from 'react';
import { FlatList, Image, View, TextInput, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Modal, TouchableWithoutFeedback } from "react-native";
import { AuthContext } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { addStory, getFollowStories, likeOrDislikeStory, commentOnStory, getStoryComments } from '../api/serviceStory';
import { Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HomeStory = () => {
	const { user, userId } = useContext(AuthContext);
	const [caption, setCaption] = useState('ahihi');
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [followStory, setFollowStory] = useState([]);
	const [selectedStory, setSelectedStory] = useState(null);
	const navigation = useNavigation();
	const [liked, setLiked] = useState(false);
	const [comment, setComment] = useState("");
	const [isModalVisible, setIsModalVisible] = useState(false);

	// Hàm mở/đóng modal
	const toggleModal = () => {
		setIsModalVisible(!isModalVisible);
	};

	const scale = useRef(new Animated.Value(1)).current;

	const animateLike = () => {
		Animated.sequence([
			Animated.timing(scale, { toValue: 1.5, duration: 150, useNativeDriver: true }),
			Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }),
		]).start();
	};

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền truy cập thư viện ảnh!');
			return;
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled && result.assets && result.assets.length > 0) {
			setImage(result.assets[0].uri);
		}
	};

	const uploadStory = async () => {
		if (!image) {
			Alert.alert('Chọn ảnh', 'Vui lòng chọn ảnh trước khi upload');
			return;
		}

		const localUri = image;
		const filename = localUri.split('/').pop();
		const match = /\.(\w+)$/.exec(filename);
		const type = match ? `image/${match[1]}` : `image`;

		const fileToUpload = {
			uri: localUri,
			name: filename,
			type: type, // Ví dụ: image/jpeg
		};

		try {
			setLoading(true);
			const response = await addStory(fileToUpload, caption);
			if (response.data.success) {
				Toast.show({ type: 'success', text1: response.data.message });
			}
			setImage(null);
			setCaption('');
		} catch (error) {
			console.error('Lỗi upload bài viết:', error);
			Alert.alert('Lỗi', 'Không thể upload ảnh, vui lòng thử lại.');
		} finally {
			setLoading(false);
		}

	}

	useEffect(() => {
		const fetchFollowStory = async () => {
			const res = await getFollowStories()

			setFollowStory(res.data.stories)
		}
		fetchFollowStory()
	}, [user])

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

	const likeOrDislikeHandler = async (id) => {
		if (!selectedStory) return;

		// Cập nhật liked ngay lập tức để giao diện phản hồi nhanh
		setLiked((prev) => !prev); // UI cập nhật ngay lập tức

		// Cập nhật likes trực tiếp trong selectedStory
		setSelectedStory((prevStory) =>
			prevStory
				? {
					...prevStory,
					likes: prevStory.likes.includes(userId)
						? prevStory.likes.filter((currentUser) => currentUser !== userId) // Xóa nếu đã like
						: [...prevStory.likes, userId], // Thêm nếu chưa like
				}
				: prevStory
		);

		// Gửi request đến server sau khi cập nhật UI
		const res = await likeOrDislikeStory(id);
		if (!res.data.success) {
			// Nếu không thành công, rollback lại trạng thái
			setLiked((prev) => !prev); // Đảo lại state
			setSelectedStory((prevStory) =>
				prevStory
					? {
						...prevStory,
						likes: prevStory.likes.includes(userId)
							? [...prevStory.likes, userId] // Quay lại trạng thái ban đầu
							: prevStory.likes.filter((currentUser) => currentUser !== userId),
					}
					: prevStory
			);
		} else {
			animateLike(); // Thêm hiệu ứng khi like thành công
		}
	};

	useEffect(() => {
		if (selectedStory) {
			setLiked(selectedStory.likes?.includes(userId) || false);
		}
	}, [selectedStory]);

	const handleCommentSubmit = async (id) => {
		if (!comment?.trim()) return;
		try {
			const response = await commentOnStory(id, comment);
			setSelectedStory((prevStory) =>
				prevStory
					? {
						...prevStory,
						comments: [...prevStory.comments, response.data.comment], // Thêm comment mới vào selectedStory
					}
					: prevStory
			);
			setComment("");
		} catch (error) {
			console.error('Lỗi khi gửi comment:', error);
		}
	};

	useEffect(() => {
		if (selectedStory) {
			// Lấy các bình luận cho selectedStory
			const fetchCommentsForStory = async () => {
				const response = await getStoryComments(selectedStory._id); // Giả sử có API để lấy comment
				setSelectedStory((prevStory) =>
					prevStory
						? {
							...prevStory,
							comments: response.data.comments, // Cập nhật lại danh sách comment cho selectedStory
						}
						: prevStory
				);
			};
			fetchCommentsForStory();
		}
	}, []);


	return (
		<View style={styles.container}>
			{!image ? (
				<View>
					<View style={styles.headerStory}>
						<View style={styles.userInfo}>
							<TouchableOpacity >
								<TouchableOpacity onPress={() => navigation.navigate("StoryScreen")}>
									<Image
										style={styles.storyImage}
										source={user.profilePicture ? { uri: user.profilePicture } : require('../assets/R.jpg')}
									/>
								</TouchableOpacity>

								<Icon style={styles.headerIcon} onPress={pickImage} name="plus" size={25} color="#300" />

							</TouchableOpacity>

							<Text style={styles.storyText}>{user.username}</Text>
						</View>

						<View>
							<FlatList
								data={followStory}
								keyExtractor={(item) => item._id}
								horizontal
								showsHorizontalScrollIndicator={false}
								snapToAlignment="start"
								decelerationRate="fast"
								nestedScrollEnabled={true}
								renderItem={({ item }) => {

									return (
										<TouchableOpacity style={styles.storyContainer} onPress={() => setSelectedStory(item)} >
											<Image
												source={item.author?.profilePicture ? { uri: item.author.profilePicture } : require('../assets/R.jpg')}
												style={styles.storyImage}
											/>
											<Text style={styles.storyText}>{item.author?.username}</Text>
										</TouchableOpacity>
									)
								}}
							/>

							{/* Modal hiển thị story */}
							<Modal
								visible={!!selectedStory}
								transparent={true}
								animationType="slide"
								onRequestClose={() => setSelectedStory(null)}
							>
								{selectedStory && (
									<TouchableWithoutFeedback onPress={() => setSelectedStory(null)}>
										<View style={styles.modalContainer}>
											{/* <TouchableOpacity onPress={() => setSelectedStory(null)}> */}
											<Ionicons
												style={styles.iconBackModal}
												name="chevron-back"
												size={30}
												color="#fff"
											/>
											{/* </TouchableOpacity> */}


											<TouchableWithoutFeedback>
												<View style={styles.headerModal}>
													<Image
														source={selectedStory.author?.profilePicture ? { uri: selectedStory.author?.profilePicture } : require("../assets/R.jpg")}
														style={styles.avatarModal}
													/>
													<Text style={styles.usernameModal}>{selectedStory.author?.username}</Text>
												</View>
											</TouchableWithoutFeedback>

											{/* Ngăn việc bắt sự kiện khi bấm vào ảnh */}
											<TouchableWithoutFeedback onPress={() => handleDoubleTap(selectedStory._id)} >
												<Image
													source={{ uri: selectedStory.src }}
													style={styles.fullScreenImage}
												/>
											</TouchableWithoutFeedback>


											<View style={styles.commentModalContainer}>

												<View style={styles.commentInputContainer}>
													<TextInput
														placeholder="Viết bình luận..."
														placeholderTextColor="#aaa"
														value={comment}
														style={styles.commentInput}
														onChangeText={(text) => setComment(text)}
														onSubmitEditing={() => handleCommentSubmit(selectedStory._id)}
													/>
												</View>

												{/* Nút Like */}
												<TouchableOpacity onPress={() => likeOrDislikeHandler(selectedStory._id)}>
													<Animated.View style={{ transform: [{ scale }] }}>
														<Ionicons
															style={styles.iconHeart}
															name={liked ? "heart" : "heart-outline"}
															size={35}
															color={liked ? "red" : "#fff"}
														/>
													</Animated.View>
												</TouchableOpacity>

												{/* Nút Comment */}
												<TouchableOpacity >
													<Ionicons name="chatbubble-outline" size={35} color="#fff" />
												</TouchableOpacity>

											</View>

										</View>
									</TouchableWithoutFeedback>
								)}
							</Modal>
						</View>
					</View>
				</View>
			)
				:
				(
					<View>
						<Icon onPress={() => setImage(null)} name="home" size={30} color="#900" />
						<Image source={{ uri: image }} style={styles.selectedImage} />
						<TouchableOpacity
							style={styles.uploadButton}
							onPress={uploadStory}
							disabled={loading}
						>
							{loading
								? (<ActivityIndicator color="#fff" />)
								: (<Text style={styles.uploadText}>Up Story</Text>)
							}
						</TouchableOpacity>
					</View>
				)
			}
		</View>
	)
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: { paddingHorizontal: 10, },
	headerStory: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 1, },
	userInfo: { alignItems: 'center' },
	headerIcon: { position: "absolute", top: 40, left: 45 },
	storyImage: { width: 60, height: 60, borderRadius: 40, borderWidth: 2, borderColor: '#FF4500', },
	storyContainer: { width: 80, height: 100, alignItems: "center" },
	selectedImage: { width: width, height: height * 1, borderRadius: 10, resizeMode: 'contain' },
	uploadButton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#FF4500', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20, },
	uploadText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
	storyText: { marginTop: 4, fontSize: 12, color: '#333', },
	modalContainer: { flex: 1, backgroundColor: 'pink', justifyContent: 'center', alignItems: 'center', },
	fullScreenImage: { width: '90%', height: '90%', resizeMode: 'contain', },
	// Modal
	iconBackModal: { position: 'absolute', top: 10, left: 10 },
	headerModal: { position: 'absolute', top: 50, left: 20, flexDirection: 'row', alignItems: 'center' },
	avatarModal: { width: 50, height: 50, borderRadius: 30, marginRight: 10, fontSize: 40 },
	usernameModal: { alignItems: "center", color: '#fff', fontSize: 20, fontWeight: 'bold' },
	commentModalContainer: { flexDirection: 'row', alignItems: 'center', width: "100%", },
	likeCount: { color: '#fff', fontSize: 16, marginLeft: 5, marginRight: 15 },
	iconHeart: { marginHorizontal: '4' },
	commentInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 20, paddingHorizontal: 5, paddingVertical: 5, marginHorizontal: 5 },
	commentInput: { width: "77%", color: '#fff', fontSize: 16, paddingVertical: 5, paddingHorizontal: 8 },
});

export default HomeStory
