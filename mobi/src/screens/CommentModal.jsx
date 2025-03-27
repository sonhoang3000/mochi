import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image } from 'react-native';
import { getStoryComments, commentOnStory } from '../api/serviceStory';

const CommentModal = ({ visible, onClose, selectedStoryId }) => {
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);

	useEffect(() => {
		const fetchComments = async () => {
			const res = await getStoryComments(selectedStoryId)
			setComments(res.data.comments)
		}
		fetchComments()
	}, [comments])

	const handleAddComment = async () => {
		if (!comment?.trim()) return;
		try {
			const response = await commentOnStory(selectedStoryId, comment);

			setComments((prevComments) => [
				...prevComments,
				response.data.comment, // Thêm comment mới vào danh sách
			]);

			setComment("");
		} catch (error) {
			console.error('Lỗi khi gửi comment:', error);
		}
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalBackground}>
				<View style={styles.modalComment}>
					{/* Header */}
					<View style={styles.modalHeader}>
						<Text style={styles.headerText}>Bình luận</Text>
						<TouchableOpacity onPress={onClose}>
							<Text style={styles.closeButton}>Đóng</Text>
						</TouchableOpacity>
					</View>

					{/* Danh sách comment */}
					<FlatList
						data={comments}
						keyExtractor={item => item._id}
						extraData={comments}
						renderItem={({ item }) => (
							<View style={styles.commentItem}>
								<Image
									style={styles.storyImage}
									source={item.author.profilePicture ? { uri: item.author.profilePicture } : require('../assets/R.jpg')}
								/>
								<Text style={styles.commentText}>{item.author.username}: </Text>
								<Text style={styles.commentText}>{item.text}</Text>
							</View>
						)}
					/>

					{/* Ô nhập bình luận */}
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							placeholder="Nhập bình luận..."
							value={comment}
							onChangeText={setComment}
						/>
						<TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
							<Text style={styles.sendButtonText}>Gửi</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20, },
	modalComment: { width: '100%', height: 500, backgroundColor: '#fff', padding: 30, borderRadius: 10, maxHeight: '70%', alignSelf: 'center', },
	modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, },
	headerText: { fontSize: 18, fontWeight: 'bold', },
	closeButton: { fontSize: 16, color: '#2196F3', },
	commentItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', },
	commentText: { fontSize: 16, },
	inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, },
	input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, fontSize: 16, },
	sendButton: { backgroundColor: '#2196F3', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, marginLeft: 10, },
	sendButtonText: { color: '#fff', fontSize: 16, },
	storyImage: { width: 30, height: 30, borderRadius: 30, borderWidth: 2, borderColor: '#FF4500', },

});

export default CommentModal;
