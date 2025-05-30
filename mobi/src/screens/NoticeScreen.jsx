import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAllNotificationsService } from '../api/notificationService';
import { AuthContext } from '../context/AuthContext';

const NoticeScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await getAllNotificationsService();
                setNotifications(response.data.notifications);    
                console.log('check',response.data.notifications)
            } catch (error) {
                console.error('Lỗi khi lấy thông báo:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user]);

    const renderItem = ({ item }) => {
        const formattedDate = new Date(item.createdAt).toLocaleDateString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        console.log('check',item)

        return (
            <TouchableOpacity 
                style={styles.notificationItem} 
                onPress={() => handleNotificationPress(item)}
            >
                <Image 
                    source={{ uri: item.postId?.src }} 
                    style={styles.postImage}
                    resizeMode="cover"
                />
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <Text style={styles.notificationTime}>{formattedDate}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const handleNotificationPress = (item) => {
        console.log('Notification pressed:', item);
        navigation.navigate('PostDetail', { 
            post: item.postId  // Truyền thông tin bài post vào màn hình PostDetail
        });
    };

    return (
        <View style={styles.container}>

        <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Thông báo</Text>
        </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text>Đang tải...</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5'},
    // Header
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, },
    title: { fontSize: 20, fontWeight: 'bold', color: '#000', },
    placeholder: { width: 40, },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center'},
    listContainer: { padding: 10},
    notificationItem: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'white', borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOffset: {     width: 0,     height: 2, }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3},
    postImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: '#f0f0f0',},
    notificationContent: { flex: 1},
    notificationMessage: { fontSize: 14, color: '#333', marginBottom: 5},
    notificationTime: { fontSize: 12, color: '#666' }
});

export default NoticeScreen;